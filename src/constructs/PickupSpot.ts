// Import necessary modules and classes from the 'three.js' library and custom modules
import * as THREE from "three";
import { Construct, GraphicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";

// Define the PickupSpot class, which extends from the abstract Construct class
export class PickupSpot extends Construct {
    // Properties to hold the position, color, and scale of the PickupSpot
    position!: number[];   // Array representing the 3D position [x, y, z]
    colour!: number;       // Integer value representing the color in hexadecimal
    scale!: number[];      // Array representing the 3D scale [x, y, z]

    // Constructor that initializes the PickupSpot with necessary contexts, position, scale, and color
    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager,
            userInterface: InterfaceContext, position: number[] = [0, 0, 0], scale: number[] = [1, 1, 1], 
            colour: number = 0xeeeeee) {
        // Call the parent class (Construct) constructor with the provided contexts
        super(graphics, physics, interactions, userInterface);

        // Initialize the position, color, and scale properties with the values passed to the constructor
        this.position = position;
        this.colour = colour;
        this.scale = scale;
    }

    // Method to perform any setup actions when the PickupSpot is created (if needed)
    create = (): void => {
        // Set the "beingLookedAt" status to false initially (for interaction logic)
        this.setBeingLookedAt(false);
    }

    // Method for loading resources or assets asynchronously (currently empty, placeholder for future use)
    load = async (): Promise<void> => {}

    // Method to build the visual and physical representation of the PickupSpot in the 3D world
    build = (): void => {
        // Use the GraphicsPrimitiveFactory to create a cube with the defined position, rotation, scale, and color
        const cube = GraphicsPrimitiveFactory.box({
            position: { x: this.position[0], y: this.position[1], z: this.position[2] }, // Set cube position
            rotation: { x: 0, y: 0, z: 0 }, // Initial rotation (no rotation)
            scale: { x: this.scale[0], y: this.scale[1], z: this.scale[2] }, // Set cube scale
            colour: this.colour, // Set cube color
            shadows: true, // Enable shadows for the cube
        });

        // Add the cube to the PickupSpot's root, making it a part of the scene
        this.add(cube);

        // Enable the cube to cast and receive shadows in the 3D scene
        cube.castShadow = true;
        cube.receiveShadow = true;

        // Add static physics properties to the cube (box collider) using the PhysicsColliderFactory
        this.physics.addStatic(cube, PhysicsColliderFactory.box(this.scale[0], this.scale[1], this.scale[2]));
    }

    // Method to update the PickupSpot over time, typically used for animations or interactions
    // Currently a placeholder, doing nothing
    // The @ts-ignore is used to ignore TypeScript warnings about unused parameters (time and delta)
    //@ts-ignore
    update = (time: TimeS, delta: TimeMS): void => {}

    // Method to handle the destruction or cleanup of the PickupSpot (currently empty, placeholder)
    destroy = (): void  => {}

    // Method to update the status of whether the PickupSpot is being "looked at" (for interaction logic)
    setBeingLookedAt(value: boolean): void {
        // Update the "beingLookedAt" user data property of the root element
        this.root.userData.beingLookedAt = value;
    }
}
