// Import necessary modules and classes from the library
import * as THREE from 'three';
import { Construct, GraphicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';
// Import PointerLockControls for handling first-person controls
//@ts-ignore
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GroceryItem } from './GroceryItem';
import { PickupSpot } from './PickupSpot';
import { Shelf } from './Shelf';
import { Box } from './Box';

// Constants for movement speeds and jump physics
const walkSpeed = 5;
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
    timeRemaining: number = 10; // 2 minutes in seconds
    timerInterval!: any;
    

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
            object.rotation.set(0, Math.PI / 4, Math.PI / 2);
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
        this.timer.style.color = '#ffffff';
        this.timer.style.background = 'linear-gradient(135deg, #4CAF50, #81C784)'; // Gradient background
        this.timer.style.border = '2px solid #2E7D32'; // Border
        this.timer.style.borderRadius = '8px'; // Rounded corners
        this.timer.style.padding = '10px 20px';
        this.timer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Shadow for depth
        this.timer.style.textAlign = 'center';
        this.timer.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(this.timer);

        // [!] Uncomment to start timer
        this.startTimer(); 
    }

    // Function to format the time as "Timer: MM:SS"
    private formatTime(): string {
        let minutes = Math.floor(this.timeRemaining / 60);
        let seconds = this.timeRemaining % 60;

        // Add leading zero if seconds are less than 10
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

        return `Timer: ${minutes}:${formattedSeconds}`;
    }

    // Function to update the timer display and handle when timer ends
    private updateTimer(): void {
        // Update the displayed time
        this.timer.textContent = this.formatTime();

        // Stop the timer when it reaches 0
        if (this.timeRemaining > 0) {
            this.timeRemaining--;
        } else {
            clearInterval(this.timerInterval);
            this.timer.textContent = "Timer: Time's up!";

        //end menu
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
        message.textContent = "Mission Failed! We'll get 'em' next time";
        message.id = 'mission-text';
        missionFailedContainer.appendChild(message);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        // Back to menu button
        const backToMenuButton = document.createElement('button');
        backToMenuButton.textContent = 'Back to Menu';
        backToMenuButton.className = 'menu-btn';
        backToMenuButton.id = 'back-to-btn';
        backToMenuButton.onclick = () => {
            window.location.href = '../index.html'; // Navigate back to menu
        };

        // Restart level button
        const restartLevelButton = document.createElement('button');
        restartLevelButton.textContent = 'Restart Level';
        restartLevelButton.className = 'menu-btn';
        restartLevelButton.id = 'restart-btn';
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

        // Style the overlay and the message
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
                outline: 10px solid #FF0000;
                outline-offset: 5px;
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
                font-weight:bold;
                color: #fff;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                transition: transform 0.3s, box-shadow 0.3s;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                color:#313131;
            }
            .menu-btn:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                box-shadow: 0 0 20px 10px rgba(0, 0, 0, 0.7);
                outline: 5px solid #313131;
                outline-offset: 5px;
            }
            .menu-btn:active {
                transform: translateY(2px);
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            }
            #mission-text{
                color:#313131;            
            }           
            #back-to-btn{
                background-color: #568fc4;
            }
            #restart-btn{
                background-color: rgba(60, 126, 54, 0.888);
            }
        `;
        
        // Append the stylesheet to the document head
        document.head.appendChild(style);
        }
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
        this.physics.moveCharacter(this.root, -moveVector.x, 0, -moveVector.z, this.speed * delta);

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

    checkLookingAtShopItems(shopItems: Shelf[] | Box[]) : void {
        this.lookingAtGroceryItem = false;
        for (let i = 0; i < shopItems.length; i++){
            const intersects = this.raycaster.intersectObject(shopItems[i].root);
            shopItems[i].setBeingLookedAt(false);

            if (intersects.length > 0 && !this.lookingAtGroceryItem){
                this.lookingAtGroceryItem = true;
                shopItems[i].setBeingLookedAt(true);
            }
        }
    }
    
    checkLookingAtPickupSpot = (pickupSpots: PickupSpot[]) : void => {
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
