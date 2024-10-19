// Import necessary modules and classes from 'three.js' and custom modules
import * as THREE from "three";
import { Construct, GraphicsContext, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../lib/w3ads/types/misc.type";
import { Shelf } from "./Shelf";
import { PickupSpot } from "./PickupSpot";
import { Box } from "./Box";

// Define the Section class, which extends the Construct class
export class Section extends Construct {
    // Define properties for the section:  items (Shelves or Boxes), and pickup spots
    items: Array<Shelf> | Array<Box> = []; // Array of items (either shelves or boxes) in the section
    pickupSpots: Array<PickupSpot> = []; // Array of pickup spots for placing objects

    // Constructor method for Section to initialize the player and necessary contexts
    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        // Call the superclass constructor
        super(graphics, physics, interactions, userInterface);
        // Assign the player object
    }

    // Method to create shelves and boxes in the section and position them correctly
    create(): void {}

    // Asynchronous load method (currently a placeholder, used for loading assets)
    async load(): Promise<void> {}

    // Build method (currently a placeholder, used for constructing the section)
    build(): void {}

    // Update method (currently a placeholder, used for updating the section)
    update(time?: TimeS, delta?: TimeMS): void {}

    // Destroy method (currently a placeholder, used for cleanup)
    destroy(): void {}


    getItems() : Array<Box> | Array<Shelf> {
        return this.items;
    }

    getPickupSpots() : Array<PickupSpot> {
        return this.pickupSpots;
    }
}
