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
import { generateAndDisplayGroceryItems,updateList } from '../User_interface/listGenerationUI';
import { setUpTimer, startTimer, stopTimer } from '../User_interface/Timer';
import { setUpLives,updateLivesDisplay} from '../User_interface/Hearts';
import { showGameOverMenu } from '../User_interface/gameOverMenu';
import { showGameWonMenu } from '../User_interface/gameWonMenu';
import { showGamePausedMenu, hideGamePauseMenu } from '../User_interface/gamePausedMenu';
import { createFlashlight } from '../User_interface/noLightsFilter';
import { createPlayerCrosshair } from '../User_interface/PlayerCrosshair';

// Constants for movement speeds and jump physics
const walkSpeed = 0.15;
const sprintSpeed = 0.4;
const jumpHeight = 1;
const jumpSpeed = 2.7;
const jumpGravity = 2;

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
    currentGroceryItem: GroceryItem| null=null;
    raycaster!: THREE.Raycaster;

    // Movement direction state
    direction!: { forward: number, backward: number, left: number, right: number };
    speed: number = walkSpeed;

    // UI prompt IDs
    interactPrompt!: number;
    placePrompt!: number;
    crosshair!: any;
    timer!:any;
    timeRemaining!: number; // 2 minutes in seconds
    list!:any;
    foundItems: number = 0; // Player has found nothing when game begins
    livesDisplay!: any;

    doneMemorizing = true;
    isPaused: boolean = false;
    hasWon: boolean = false;
    isTopView: boolean = false;
    securityCameraClicks: number = 0;
    FirstPersonCameraRotation!: THREE.Euler;

    level!:string;
    levelConfig!: {
        level: string,
        nextLevel: string,
        levelTime: number,
        memorizationTime: number,
        amountOfItemsToFind: number,
        lives: number
    }

    // Properties to hold the event listeners
    private keyDownHandler: any;
    private keyUpHandler: any;
    private keyPressHandler: any;

    // Initialize the player instance with graphics, physics, interactions, and UI contexts
    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, 
        levelConfig: { level: string, nextLevel: string, levelTime: number, memorizationTime: number, amountOfItemsToFind: number, lives: number}
    ) 
    {
        super(graphics, physics, interactions, userInterface);

        this.levelConfig = levelConfig;
        console.log(levelConfig.level);
        this.timeRemaining = levelConfig.levelTime;

        // Capture the current instance scope for event listeners
        scope = this;
        
        // Assigning references for event listeners
        this.keyDownHandler = this.onKeyDown.bind(this);
        this.keyUpHandler = this.onKeyUp.bind(this);
        this.keyPressHandler = this.onKeyPress.bind(this);

        // Adding event listeners
        document.addEventListener("keydown", this.keyDownHandler);
        document.addEventListener("keyup", this.keyUpHandler);
        document.addEventListener("keypress", this.keyPressHandler);
    }

    // Method to initialize player components like camera and controls
    create = (): void => {
        // Create and set up the camera - MAIN
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 500);
        this.graphics.mainCamera = this.camera;

        // Set up PointerLockControls to lock mouse movement to the camera
        this.controls = new PointerLockControls(this.camera, this.graphics.renderer.domElement);

        // Initialize direction movement state
        this.direction = { forward: 0, backward: 0, left: 0, right: 0 };
        this.root.userData.canInteract = false;

        // Initialize raycaster
        this.raycaster = new THREE.Raycaster();

        // Player Interaction setup:
        // Note: object is the CURRENT GROCERY ITEM the player has "picked up"
        this.interactions.addInteracting(this.root, (object: THREE.Mesh) => {
            // --- Player picking up a grocery item ---
            const itemName = object.userData.productName; // Get object's product name
            console.log(`DEBUG: Current Grocery Item: ${itemName}`);
            
            // check if item is on list
            const found = updateList(this.list.id, itemName);
            if (found){
                new Audio('musicSound/correctItemSelected.mp3').play();
                // count up if it is an item on the list
                this.foundItems += 1;
                if (this.foundItems === this.levelConfig.amountOfItemsToFind) {
                    stopTimer();
                    showGameWonMenu(this.levelConfig.level, this.levelConfig.nextLevel);
                }
            }
            else{
                //Enter what is supposed to happen when player selects wrong thing
                if (this.levelConfig.lives > 0) {
                    new Audio('musicSound/lifeLost.mp3').play();
                    this.levelConfig.lives--; // Decrease lives
                    updateLivesDisplay(this.livesDisplay.id, this.levelConfig.lives); // Update display
                }
                if(this.levelConfig.lives == 0 && !this.hasWon){
                    stopTimer();
                    showGameOverMenu(this.levelConfig.level);
                }
            }
        });

        // Setup UI prompts for interaction
        this.interactPrompt = this.userInterface.addPrompt('Press E to interact');
        this.placePrompt = this.userInterface.addPrompt('Press Q to place');

        // Pointer lock change event handling
        document.addEventListener('click', () => this.graphics.renderer.domElement.requestPointerLock());
        document.addEventListener('pointerlockchange', this.onPointerLockChange);

        // Automatically lock pointer on click
        this.graphics.renderer.domElement.addEventListener('click', () => {
            this.controls.lock();
        });
    }


    private setUpList(): void {
        this.list = document.createElement("div");
        this.list.id = "grocery-list";
        const levelNumber = parseInt(this.levelConfig.level.match(/\d+/)?.[0] || "", 10);
        console.log(levelNumber);
        generateAndDisplayGroceryItems(this.list.id, this.levelConfig.amountOfItemsToFind,levelNumber);
    }


    private setUpLifeDisplay(){
        this.livesDisplay = document.createElement("div");
        this.livesDisplay.id = "life-display";
        setUpLives(this.livesDisplay.id, this.levelConfig.lives);
    }

    private setUpTimer(){
        this.timer = document.createElement("div");
        this.timer.id = "timer-display";
        setUpTimer(this.timeRemaining, this.timer.id, this.levelConfig.level);
    }

    private setUpCrosshair() {
        this.crosshair = createPlayerCrosshair("player-crosshair");
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
        this.body.castShadow = true;

        // Attach the camera to the face, and the face to the body
        this.face.add(this.camera);
        this.body.add(this.face);
        this.add(this.body);

        // Add physics properties to the player for jumping & movement
        this.physics.addCharacter(this.root, PhysicsColliderFactory.box(1, 2.5, 1), {
            jump: true,
            jumpHeight: jumpHeight,
            jumpSpeed: jumpSpeed,
            gravity: jumpGravity,
        });

        // Request pointer lock on the renderer's DOM element
        this.graphics.renderer.domElement.requestPointerLock();
        // You can insert noLightsFilter here
        if(this.levelConfig.level === "level-2"){
            createFlashlight();
        }

        this.setUpTimer();
        this.setUpLifeDisplay();
        this.setUpList();
        this.setUpCrosshair();

        if (this.levelConfig.level === "level-3"){
            stopTimer();
            this.doneMemorizing = false;
        }
    }

    // Update player state every frame, including movement and interaction prompts
    //@ts-ignore ignoring the time variable
    update = (time: number, delta: number): void => {
        delta = delta / 1000;

        
        // Delete grocery list once memorization time has concluded
        if (this.levelConfig.memorizationTime < time && !this.doneMemorizing){
            const groceryList: HTMLElement | null = document.getElementById("grocery-list");
            if (groceryList !== null){
                groceryList.style.display = "none";
                startTimer(this.levelConfig.level);
                this.doneMemorizing = true;
            }
        }

        if(this.isPaused || !this.doneMemorizing) return;
        

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

        // When in security camera mode, keep camera stationary but watch player move around store
        if (this.isTopView) {
            //keeps looking at center of store while watching player move
            const cameraWorldPosition = this.getCameraWorldPosition();
            // Get the closest corner from the camera position
            const closestCorner = this.findClosestTopCorner(cameraWorldPosition);
            // Get displacement from camera to closest corner
            const displacement = closestCorner.sub(cameraWorldPosition);
            // Keep a copy of the camera's rotation
            this.FirstPersonCameraRotation = this.camera.rotation.clone();
            // Move the camera to the closest corner position
            this.camera.position.add(displacement);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0)); //comment to add swivel control when in secuirty camera
        }

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

        //check game over condition
        if (this.timeRemaining <= 0 && !this.hasWon) {
            stopTimer();
            showGameOverMenu(this.levelConfig.level);
        }
    }

    // Cleanup event listeners when the player object is destroyed
    destroy = (): void => {
        // Removing the event listeners
        document.removeEventListener("keydown", this.keyDownHandler);
        document.removeEventListener("keyup", this.keyUpHandler);
        document.removeEventListener("keypress", this.keyPressHandler);

        // Optionally clear additional UI elements if needed
        const uiIDs = [
            "grocery-list", "gameover-menu", "life-display", "timer-display", 
            "player-crosshair", "gamepaused-menu", "gamewon-menu", "flashlight"
        ];
        uiIDs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                document.body.removeChild(element);
            }
        });
    }
    
    checkLookingAtGroceryItem(groceryItems: GroceryItem[]): void{
        this.lookingAtGroceryItem = false;
    
        for (let i = 0; i < groceryItems.length; i++) {
            const intersects = this.raycaster.intersectObject(groceryItems[i].root);
            groceryItems[i].setBeingLookedAt(false);
            //Looking at something
            if (intersects.length > 0) {
                this.lookingAtGroceryItem = true;
                //Set what you're looking at
                groceryItems[i].setBeingLookedAt(true);
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
    //handing pause press
    togglePause() {
        this.isPaused = !this.isPaused; // Toggle pause state
        if (this.isPaused) { // If paused, stop the timer
            stopTimer();
            showGamePausedMenu(this.levelConfig.level);
        } else { // If not paused, resume the timer
            hideGamePauseMenu();
            startTimer(this.levelConfig.level);
        }
    }

    // Add a method to toggle the bird's-eye view
    toggleTopView(): void {
        this.isTopView = !this.isTopView;
    
        if (this.isTopView) {
            // Get the camera's world position
            const cameraWorldPosition = this.getCameraWorldPosition();
            console.log('Camera World Position:', cameraWorldPosition);
            
            // Get the closest corner from the camera position
            const closestCorner = this.findClosestTopCorner(cameraWorldPosition);
            console.log('Closest Corner Position:', closestCorner);
            
            // Get displacement from camera to closest corner
            const displacement = closestCorner.sub(cameraWorldPosition);
            console.log("Displacement", displacement);

            // Keep a copy of the camera's rotation
            this.FirstPersonCameraRotation = this.camera.rotation.clone();

            // Move the camera to the closest corner position
            this.camera.position.add(displacement);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // Adjust to look at the center of the store
    
            console.log('Camera Position after adjustment:', this.camera.position);
        } else {
            // Reset to player camera view
            this.camera.position.set(0, 0, 0); // Reset to player camera position
            this.camera.rotation.copy(this.FirstPersonCameraRotation); // Adjust rotation back to normal
        }
    }
    
    //the 4 different security camera positions
    topCorners: THREE.Vector3[] = [
        new THREE.Vector3(70, 18, 70),    // (Cashier area)
        new THREE.Vector3(-70, 18, 70),   // (Pizza corner)
        new THREE.Vector3(-70, 18, -70),  // (Diagonal to cashier)
        new THREE.Vector3(70, 18, -70)    // (Veggie corner)
    ];
    findClosestTopCorner(position: THREE.Vector3): THREE.Vector3 {
        let minDistance = Infinity;
        let closestCorner = this.topCorners[0];
    
        this.topCorners.forEach((corner: THREE.Vector3) => {
            const distance = Math.sqrt(
                Math.pow(corner.x - position.x, 2) +
                Math.pow(corner.y - position.y, 2) +
                Math.pow(corner.z - position.z, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestCorner = corner;
            }
        });
        return closestCorner.clone();
    }

    getCameraWorldPosition(): THREE.Vector3 {
        const worldPosition = new THREE.Vector3();
        this.camera.getWorldPosition(worldPosition); // Get world position from body mesh
        return worldPosition;
    }
    

    // Keyboard event handlers for movement keys and speed adjustment
    onKeyDown(event: KeyboardEvent) {
        //pause timer functionalit
        if (event.key == 'p' || event.key == 'P') {
            this.togglePause();
            return;
        }
        //if game is paused, i.e. isPaused true, ignore normal key movements
        //player can only jump & change camera view if the game is paused
        if(this.isPaused && !this.isTopView){return;}

        //top view event
        if(event.key === 'c' || event.key==='C'){
            //player can only change to security camera once
            // if(this.securityCameraClicks<2){
            //     this.securityCameraClicks++;
            //     this.toggleTopView();
            // }
            // else{
            //     console.log("C key can only pressed twice!!!");
            // }
            const cameraWorldPosition = this.getCameraWorldPosition();
            console.log('Camera World Position:', cameraWorldPosition);
            this.toggleTopView();
            return;
        }
        
        // If top view is active, ignore movement keys
        // if(this.isTopView) {
        //     scope.direction.forward = 0;
        //     scope.direction.backward = 0;
        //     scope.direction.left = 0;
        //     scope.direction.right = 0;
        //     return; 
        // }

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
        // Pick up an item
        if (scope.root.userData.canInteract && scope.lookingAtGroceryItem && scope.holdingObject === undefined && !scope.paused) {
            if (event.key === 'e' || event.key === 'E') {
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
