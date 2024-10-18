// Import necessary modules and classes from 'three.js' and custom modules
import * as THREE from "three";
import { Construct, GraphicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../lib/w3ads/types/misc.type";

// Define the Box class, which extends from the abstract Construct class
export class Box extends Construct {
    // Properties to store the 3D mesh, filename, id, and scale of the Box
    mesh!: THREE.Mesh;      // Mesh object to hold the 3D model of the box
    filename!: string;      // String representing the box model's filename
    id!: string;            // String to store the box's ID, same as filename
    scale!: number[];       // Array representing the 3D scale of the box [x, y, z]

    // Constructor initializes the Box with contexts (graphics, physics, etc.), a filename, and scale
    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, 
        filename: string, scale: number[] = [1, 1, 1]) {
        // Call the parent class (Construct) constructor with the provided contexts
        super(graphics, physics, interactions, userInterface);

        // Initialize the ID and filename to the same value, and set the scale
        this.id = this.filename = filename;
        this.scale = scale;
    }

    // Method to perform any setup actions when the Box is created (if needed)
    create(): void {
        // Set the "beingLookedAt" status to false initially (for interaction logic)
        this.setBeingLookedAt(false);
    }

    // Method to asynchronously load the 3D model of the Box from an external GLTF file
    async load(): Promise<void> {
        try {
            // Load the model using the filename, constructing the path based on the provided filename
            const gltfData: any = await this.graphics.loadModel(`/assets/${this.filename}_box/${this.filename}_box.gltf`);
            // Store the loaded 3D mesh into the 'mesh' property
            this.mesh = gltfData.scene;
        } catch (error) {
            // Log any error that occurs during the model loading process
            console.log("[!] Error loading box model");
            console.log(error);
        }
    }

    // Method to build the Box, setting its scale, shadows, and adding it to the scene and physics world
    build(): void {
        // Set the scale of the mesh based on the provided scale array
        this.mesh.scale.set(this.scale[0], this.scale[1], this.scale[2]);

        // Enable the box mesh to cast and receive shadows
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        // Add the mesh to the Box's root (inherited from Construct), making it part of the 3D scene
        this.add(this.mesh);

        // Add static physics properties to the box, using a box collider sized relative to the scale
        this.physics.addStatic(this.mesh, PhysicsColliderFactory.box(this.scale[0] * 4, this.scale[1] * 8, this.scale[2] * 2));
    }

    // Method to update the Box over time (used for dynamic updates, if any)
    update(time?: TimeS, delta?: TimeMS): void {
        // Currently empty, placeholder for any future dynamic updates
    }

    // Method to handle destruction or cleanup of the Box (currently empty, placeholder)
    destroy(): void {
        // Can be filled in to handle cleanup tasks when the Box is removed
    }

    // Method to update the status of whether the Box is being "looked at" (for interaction logic)
    setBeingLookedAt(value: boolean): void {
        // Update the "beingLookedAt" user data property of the root element
        this.root.userData.beingLookedAt = value;
    }

    // Method to get the unique ID of the Box, which is based on the filename
    getID(): string {
        return this.id;
    }
}
