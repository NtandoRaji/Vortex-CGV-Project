// Import necessary modules and classes from the library
import * as THREE from 'three';
import { Construct, GraphicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';
// Import PointerLockControls for handling first-person controls
//@ts-ignore
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// Constants for movement speeds and jump physics
const walkSpeed = 15;
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

    // Movement direction state
    direction!: { forward: number, backward: number, left: number, right: number };
    speed: number = walkSpeed;

    // UI prompt IDs
    interactPrompt!: number;
    placePrompt!: number;

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

        // Interaction setup: allows you to pickup and place an object
        this.interactions.addInteracting(this.root, (object: THREE.Mesh) => {
            const inHandScale = object.userData.inHandScale;
            object.removeFromParent();
            object.position.set(2, -1.5, -2);
            object.scale.setScalar(inHandScale);
            this.holdingObject = object;
            this.face.add(object);
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
        // document.removeEventListener("keydown", this.onKeyDown);
        // document.removeEventListener("keyup", this.onKeyUp);
        // document.removeEventListener("keypress", this.onKeyPress);
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
        if (scope.root.userData.canInteract && scope.holdingObject === undefined && !scope.paused) {
            if (event.key == 'e' || event.key == 'E') {
                scope.root.userData.onInteract();
            }
        }
        if (scope.root.userData.canPlace && scope.holdingObject !== undefined && !scope.paused) {
            if (event.key == 'q' || event.key == 'Q') {
                scope.root.userData.onPlace(scope.holdingObject);
                scope.holdingObject = undefined;
            }
        }
    }
}
