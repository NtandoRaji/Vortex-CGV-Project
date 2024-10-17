// Import necessary modules and classes from the library
import * as THREE from 'three';
import { Construct, GraphicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';
// Import PointerLockControls for handling first-person controls
//@ts-ignore
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GroceryItem } from './GroceryItem';
import { Box } from './Box';

// Constants for movement speeds and jump physics
const walkSpeed = 10;
const sprintSpeed = 10;
const jumpHeight = 1;
const jumpSpeed = 2.7;
const jumpGravity = 1.1;

// A variable to hold the current scope of the Player instance, useful for event listeners
let scope: any;

export class Player extends Construct {
    face!: THREE.Mesh;
    body!: THREE.Mesh;
    camera!: THREE.PerspectiveCamera;
    controls!: PointerLockControls;
    holdingObject: THREE.Mesh | undefined = undefined;
    lookingAtGroceryItem: boolean = false;
    lookingAtPickupSpot: boolean = false;

    raycaster!: THREE.Raycaster;

    // Movement direction state
    direction!: { forward: number, backward: number, left: number, right: number };
    speed: number = walkSpeed;

    // UI prompt IDs
    interactPrompt!: number;
    placePrompt!: number;
    crosshair!: any;
    timer!:any;
    timeRemaining: number = 15; // 2 minutes in seconds
    timerInterval!: any;

    pauseButton!:HTMLButtonElement; //pause button
    isPaused: boolean = false;
    popup!: HTMLDivElement; //popup for list when pause clicked

    // Initialize the player instance with graphics, physics, interactions, and UI contexts
    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface);

        // Capture the current instance scope for event listeners
        scope = this;
    }

    // Method to initialize player components like camera and controls
    create = (): void => {
        // Create and set up the camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 500);
        this.graphics.mainCamera = this.camera;

        // Set up PointerLockControls to lock mouse movement to the camera
        this.controls = new PointerLockControls(this.camera, this.graphics.renderer.domElement);

        // Initialize direction movement state
        this.direction = { forward: 0, backward: 0, left: 0, right: 0 };
        this.root.userData.canInteract = false;

        // Initialize raycaster
        this.raycaster = new THREE.Raycaster();

        // Interaction setup: allows you to pickup and place an object
        this.interactions.addInteracting(this.root, (object: THREE.Mesh) => {
            const inHandScale = object.userData.inHandScale;
            object.removeFromParent();
            object.position.set(2, -1.5, -2);
            object.scale.setScalar(inHandScale);
            this.holdingObject = object;
            this.camera.add(object);
        });

        // Setup UI prompts for interaction
        this.interactPrompt = this.userInterface.addPrompt('Press E to interact');
        this.placePrompt = this.userInterface.addPrompt('Press Q to place');

        // Event listeners for movement and pointer lock
        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("keyup", this.onKeyUp);
        document.addEventListener("keypress", this.onKeyPress);
        document.addEventListener('click', () => this.graphics.renderer.domElement.requestPointerLock());

        // Pointer lock change event handling
        document.addEventListener('pointerlockchange', this.onPointerLockChange);

        // Automatically lock pointer on click
        this.graphics.renderer.domElement.addEventListener('click', () => {
            this.controls.lock();
        });

        // **Check and remove any existing timer before creating a new one**
        const existingTimer = document.querySelector('#game-timer');
        if (existingTimer) {
            existingTimer.remove(); // Remove the existing timer from the DOM
            clearInterval(this.timerInterval); // Clear any existing interval
        }
        
        // Create the timer element with an ID
        this.timer = document.createElement('div');
        this.timer.id = 'game-timer'; // Set an ID to easily find and remove it
        this.timer.style.position = 'absolute';
        this.timer.style.top = '10px';
        this.timer.style.left = '10px';
        this.timer.style.fontSize = '24px';
        this.timer.style.fontWeight = 'bold';
        this.timer.style.color = '#0000000';
        this.timer.style.background = 'linear-gradient(135deg, #4CAF50, #81C784)'; // Gradient background
        this.timer.style.border = '5px solid #2E7D32'; // Border
        this.timer.style.borderRadius = '15px'; // Rounded corners
        this.timer.style.padding = '10px 20px';
        this.timer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)'; // Shadow for depth
        this.timer.style.textAlign = 'center';
        this.timer.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(this.timer);

        this.startTimer();

        //create the pause button
        this.pauseButton = document.createElement('button');
        this.pauseButton.textContent = 'Pause';
        this.pauseButton.style.position = 'fixed'; // Use fixed positioning
        this.pauseButton.style.top = '35px'; // Align vertically with the timer
        this.pauseButton.style.left = '75%'; // Align horizontally as required
        this.pauseButton.style.transform = 'translate(-50%, -50%)'; // Adjust to truly center the button
        
        // Apply the same styles as the timer
        this.pauseButton.style.fontSize = '24px';
        this.pauseButton.style.fontWeight = 'bold';
        this.pauseButton.style.background = 'linear-gradient(135deg, #4CAF50, #81C784)'; // Gradient background
        this.pauseButton.style.border = '5px solid #2E7D32'; // Border
        this.pauseButton.style.borderRadius = '15px'; // Rounded corners
        this.pauseButton.style.padding = '10px 20px';
        this.pauseButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)'; // Shadow for depth
        this.pauseButton.style.textAlign = 'center';
        this.pauseButton.style.fontFamily = 'Arial, sans-serif';
        this.pauseButton.style.color = '#FFFFFF'; // Text color
        this.pauseButton.style.cursor = 'pointer'; // Pointer cursor on hover
        
        document.body.appendChild(this.pauseButton);
    
        // Add click event listener for the pause button
        this.pauseButton.addEventListener('click', () => this.togglePause());
    
        // Create the popup
        this.createPopup();
    }

    //for pause button
    private togglePause(): void {
        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            clearInterval(this.timerInterval); // Stop the timer
            this.updatePopupContent(); // Update the popup content
            this.popup.style.display = 'block'; // Show the popup
            this.pauseButton.textContent = 'Resume'; // Change button text to Resume
        } else {
            this.startTimer(); // Restart the timer
            this.popup.style.display = 'none'; // Hide the popup
            this.pauseButton.textContent = 'Pause'; // Change button text back to Pause
        }
    }

    // Enhance the createPopup method
    private createPopup(): void {
        // Create the popup element
        this.popup = document.createElement('div');
        this.popup.textContent = 'Game Paused';
        this.popup.style.position = 'fixed';
        this.popup.style.top = '50%';
        this.popup.style.left = '50%';
        this.popup.style.transform = 'translate(-50%, -50%)'; // Center the popup
        this.popup.style.padding = '20px';
        this.popup.style.background = 'rgba(0, 0, 0, 0.8)'; // Dark background
        this.popup.style.color = '#FFFFFF'; // White text
        this.popup.style.borderRadius = '10px'; // Rounded corners
        this.popup.style.display = 'none'; // Hide initially
        this.popup.style.zIndex = '1000'; // Ensure it appears above other elements

        // Create a list element to hold the items
        const itemList = document.createElement('ul');
        itemList.style.listStyleType = 'none'; // Remove bullet points
        itemList.style.padding = '0'; // Remove padding

        // Add items to the list
        this.itemsList.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            listItem.style.color = '#FFFFFF'; // Set text color
            itemList.appendChild(listItem);
        });

        // Append the list to the popup
        this.popup.appendChild(itemList);
    
        document.body.appendChild(this.popup);
    }

    // Sample list of items to display in the popup
    private itemsList: string[] = [
        "Item 1: Apples",
        "Item 2: Bananas",
        "Item 3: Oranges",
        "Item 4: Bread",
        "Item 5: Milk"
    ];
    // Optional: Method to update popup content when paused
    private updatePopupContent(): void {
        // Clear existing items
        const itemList = this.popup.querySelector('ul');
        if (itemList) {
            itemList.innerHTML = ''; // Clear existing items

            // Add items to the list
            this.itemsList.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = item;
                listItem.style.color = '#FFFFFF'; // Set text color
                itemList.appendChild(listItem);
            });
        }
    }

    // Function to format the time as "Timer: MM:SS"
    private formatTime(): string {
        let minutes = Math.floor(this.timeRemaining / 60);
        let seconds = this.timeRemaining % 60;

        // Add leading zero if seconds are less than 10
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

        return `Timer: ${minutes}:${formattedSeconds}`;
    }


    private updateTimer(): void {
        // Exit if the game is paused
        if (this.isPaused) return;
    
        // Update the displayed time
        this.timer.textContent = this.formatTime();
    
        // Stop the timer when it reaches 0
        if (this.timeRemaining > 0) {
            this.timeRemaining--;
        } else {
            // Timer ends, clear the interval and display the mission failed menu
            clearInterval(this.timerInterval);
            this.timer.textContent = "Timer: Time's up!";
            this.showMissionFailedMenu();
        }
    }
    
    // Pause the game and the timer
    private pauseGame(): void {
        this.isPaused = true;
    
        // Clear the interval to stop updating the timer
        clearInterval(this.timerInterval);
    }
    
    // Resume the game and the timer
    private resumeGame(): void {
        this.isPaused = false;
    
        // Restart the interval to continue updating the timer
        this.timerInterval = setInterval(() => this.updateTimer(), 1000); // Adjust interval time as needed
    }
    
    // Function to show the mission failed menu when the timer ends
    private showMissionFailedMenu(): void {
        // Release the pointer lock
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
    
        // Create a semi-transparent overlay behind the message
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
    
        // Create the mission failed message and buttons
        const missionFailedContainer = document.createElement('div');
        missionFailedContainer.className = 'mission-failed-container';
    
        const message = document.createElement('h1');
        message.textContent = "Mission Failed! We'll get 'em next time";
        missionFailedContainer.appendChild(message);
    
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
    
        // Back to menu button
        const backToMenuButton = document.createElement('button');
        backToMenuButton.textContent = 'Back to Menu';
        backToMenuButton.className = 'menu-btn';
        backToMenuButton.onclick = () => {
            window.location.href = '../index.html'; // Navigate back to menu
        };
    
        // Restart level button
        const restartLevelButton = document.createElement('button');
        restartLevelButton.textContent = 'Restart Level';
        restartLevelButton.className = 'menu-btn';
        restartLevelButton.onclick = () => {
            window.location.href = '../indexGame.html'; // Restart the game
        };
    
        // Append buttons to button container
        buttonContainer.appendChild(backToMenuButton);
        buttonContainer.appendChild(restartLevelButton);
    
        // Append button container to mission failed container
        missionFailedContainer.appendChild(buttonContainer);
    
        // Append the mission failed container to the body
        document.body.appendChild(missionFailedContainer);
    
        // Append the style for the overlay and the mission failed container
        const style = document.createElement('style');
        style.textContent = `
            /* Add your styles here for the overlay and mission failed message */
            .overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
                z-index: 999; /* Ensure the overlay is on top */
            }
            .mission-failed-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                z-index: 1000; /* Ensure the mission failed message is above the overlay */
            }
            .mission-failed-container h1 {
                font-size: 4rem;
                margin-bottom: 20px;
                color: #333;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            }
            .button-container {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .menu-btn {
                padding: 15px 30px;
                font-size: 1.5rem;
                color: #fff;
                background: linear-gradient(45deg, #6a1b9a, #4a148c, #2196F3, #4CAF50, #D81B60);
                border: none;
                border-radius: 25px;
                cursor: pointer;
                transition: transform 0.3s, box-shadow 0.3s;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }
            .menu-btn:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            }
            .menu-btn:active {
                transform: translateY(2px);
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            }
        `;
        document.head.appendChild(style);
    }
    

    // Function to start the timer
    private startTimer(): void {
        // Set the interval to update the timer every second
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    // Placeholder load method for any asynchronous asset loading
    load = async (): Promise<void> => {}

    // Method to set up player visuals, like body and face, and configure physics
    build = (): void => {
        // Create the face sphere and add shadows
        this.face = GraphicsPrimitiveFactory.sphere({
            position: { x: 0, y: 3, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            radius: 0.8,
            colour: 0x0000FF,
            shadows: true,
        });

        // Set up the camera's rotation and visibility layers
        this.camera.rotation.set(0, Math.PI / 2, 0);
        this.camera.layers.enable(0);
        this.camera.layers.set(0);

        // Create the body capsule and add shadows
        const bodyGeometry = new THREE.CapsuleGeometry(1, 3);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x0000FF });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);

        // Attach the camera to the face, and the face to the body
        this.face.add(this.camera);
        this.body.add(this.face);
        this.add(this.body);
        this.body.layers.set(1); //Makes body invisible to camera

        // Add physics properties to the player for jumping & movement
        this.physics.addCharacter(this.root, PhysicsColliderFactory.box(1, 1, 1), {
            jump: true,
            jumpHeight: jumpHeight,
            jumpSpeed: jumpSpeed,
            gravity: jumpGravity,
        });

        // Request pointer lock on the renderer's DOM element
        this.graphics.renderer.domElement.requestPointerLock();

        this.crosshair = document.createElement('div');
        this.crosshair.style.position = 'absolute';
        this.crosshair.style.top = '50%';
        this.crosshair.style.left = '50%';
        this.crosshair.style.transform = 'translate(-50%, -50%)';
        this.crosshair.style.width = '20px';
        this.crosshair.style.height = '20px';
        this.crosshair.style.border = '2px solid white';
        this.crosshair.style.borderRadius = '50%';
        document.body.appendChild(this.crosshair);
    }

    
    // Update player state every frame, including movement and interaction prompts
    //@ts-ignore ignoring the time variable
    update = (time: number, delta: number): void => {
        delta = delta / 1000;

        // Get the camera direction (forward vector)
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);

        // Calculate movement vectors based on camera direction and input state
        const forward = direction.clone().normalize();
        const right = new THREE.Vector3().crossVectors(this.camera.up, forward).normalize();

        const xLocal = this.direction.backward - this.direction.forward;
        const zLocal = this.direction.right - this.direction.left;

        // Determine the final movement direction and apply it
        const moveVector = forward.multiplyScalar(xLocal).add(right.multiplyScalar(zLocal));
        this.physics.moveCharacter(this.root, -moveVector.x, 0, -moveVector.z, delta);

        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);

        if (this.lookingAtGroceryItem){
            this.crosshair.style.borderColor = 'red';
        } else if (this.lookingAtPickupSpot) {
            this.crosshair.style.borderColor = 'green';
        }
        else {
            this.crosshair.style.borderColor = 'white';
        }

        // Show or hide UI prompts based on interaction possibilities
        if (this.root.userData.canInteract && this.holdingObject === undefined) {
            this.userInterface.showPrompt(this.interactPrompt);
        } else {
            this.userInterface.hidePrompt(this.interactPrompt);
        }

        if (this.root.userData.canPlace && this.holdingObject !== undefined) {
            this.userInterface.showPrompt(this.placePrompt);
        } else {
            this.userInterface.hidePrompt(this.placePrompt);
        }
    }

    // Cleanup event listeners when the player object is destroyed
    destroy = (): void => {
    }

    checkLookingAtGroceryItem(groceryItems: GroceryItem[]) : void {
        this.lookingAtGroceryItem = false;
        for (let i = 0; i < groceryItems.length; i++){
            const intersects = this.raycaster.intersectObject(groceryItems[i].root);
            groceryItems[i].setBeingLookedAt(false);

            if (intersects.length > 0 && !this.lookingAtGroceryItem){
                this.lookingAtGroceryItem = true;
                groceryItems[i].setBeingLookedAt(true);
            }
        }
    }

    checkLookingAtPickupSpot = (pickupSpots: Box[]) : void => {
        this.lookingAtPickupSpot = false;

        for (let i = 0; i < pickupSpots.length; i++){
            const intersects = this.raycaster.intersectObject(pickupSpots[i].root);
            pickupSpots[i].setBeingLookedAt(false);

            if (intersects.length > 0 && !this.lookingAtPickupSpot){
                this.lookingAtPickupSpot = true;
                pickupSpots[i].setBeingLookedAt(true);
            }
        }
    }

    // Event handler for when pointer lock state changes
    onPointerLockChange() {
        if (document.pointerLockElement !== scope.graphics.renderer.domElement) {
            console.log("Pointer lock lost, pausing game.");
        }
    }

    // Keyboard event handlers for movement keys and speed adjustment
    onKeyDown(event: KeyboardEvent) {
        if (event.key == 'w' || event.key == 'W') { scope.direction.forward = 1; }
        if (event.key == 's' || event.key == 'S') { scope.direction.backward = 1; }
        if (event.key == 'a' || event.key == 'A') { scope.direction.left = 1; }
        if (event.key == 'd' || event.key == 'D') { scope.direction.right = 1; }
        if (event.key == 'Shift') { scope.speed = sprintSpeed; }
    }

    onKeyUp(event: KeyboardEvent) {
        if (event.key == 'w' || event.key == 'W') { scope.direction.forward = 0; }
        if (event.key == 's' || event.key == 'S') { scope.direction.backward = 0; }
        if (event.key == 'a' || event.key == 'A') { scope.direction.left = 0; }
        if (event.key == 'd' || event.key == 'D') { scope.direction.right = 0; }
        if (event.key == 'Shift') { scope.speed = walkSpeed; }
    }

    // Handles keypresses for jumping, interaction, and debugging world position
    onKeyPress(event: KeyboardEvent) {
        const worldPos = new THREE.Vector3();
        scope.root.getWorldPosition(worldPos);

        if (event.key == ' ') { scope.physics.jumpCharacter(scope.root); }
        if (event.key == 'b' || event.key == 'B') {
            console.log(worldPos);
        }
        // Pick up an item
        if (scope.root.userData.canInteract && scope.lookingAtGroceryItem && scope.holdingObject === undefined && !scope.paused) {
            if (event.key == 'e' || event.key == 'E') {
                scope.root.userData.onInteract();
            }
        }
        // Place an item
        if (scope.root.userData.canPlace && scope.lookingAtPickupSpot && scope.holdingObject !== undefined && !scope.paused) {
            if (event.key == 'q' || event.key == 'Q') {
                scope.root.userData.onPlace(scope.holdingObject);
                scope.holdingObject = undefined;
            }
        }
    }
}
