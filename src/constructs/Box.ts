// Import necessary modules and classes
import * as THREE from "three";
import { Construct, GraphicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";

// Define the Box class, extending from the abstract Construct class
export class Box extends Construct {
    // Define properties for the Box's position, color, and scale
    position!: number[];
    colour!: number;
    scale!: number;

    // Constructor initializes the Box with the specified contexts, position, scale, and color
    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager,
            userInterface: InterfaceContext, position: number[] = [0, 0, 0], scale: number = 1, colour: number = 0xeeeeee) {
        // Call the superclass (Construct) constructor
        super(graphics, physics, interactions, userInterface);

        // Initialize position, color, and scale properties for the Box instance
        this.position = position;
        this.colour = colour;
        this.scale = scale;
    }

    // The create method for initializing or preparing the Box; can be expanded if needed
    create = (): void => {
        this.setBeingLookedAt(false);
    }

    // The load method for asynchronous loading of resources or assets; currently a placeholder
    load = async (): Promise<void> => {}

    // Method to build the Box; creates the 3D representation of the Box and its physical properties
    build = (): void => {
        // Create a cube with specified position, rotation, scale, and color using GraphicsPrimitiveFactory
        const cube = GraphicsPrimitiveFactory.box({
            position: { x: this.position[0], y: this.position[1], z: this.position[2]},
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: this.scale, y: this.scale, z: this.scale },
            colour: this.colour,
            shadows: true, // Enable shadows for the cube
        });

        // Add the cube object to the Box's root (inherited from Construct)
        this.add(cube);

        // Enable the cube to cast and receive shadows in the 3D scene
        cube.castShadow = true;
        cube.receiveShadow = true;

        // Add static physics properties to the cube, making it part of the physics simulation
        this.physics.addStatic(cube, PhysicsColliderFactory.box(this.scale / 2, this.scale / 2, this.scale / 2));
    }

    // The update method, which handles any updates needed for the Box; currently a placeholder
    // Ignored by TypeScript for unused parameters warning, as `time` and `delta` are unused here
    //@ts-ignore
    update = (time: TimeS, delta: TimeMS): void => {}

    // The destroy method, called when the Box is to be removed or cleaned up
    destroy = (): void  => {}

    setBeingLookedAt(value: boolean): void{
        this.root.userData.beingLookedAt = value;
    }
}
