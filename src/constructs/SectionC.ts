// Import necessary modules and classes from 'three.js' and custom modules
import * as THREE from "three";
import { Construct, GraphicsContext, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../lib/w3ads/types/misc.type";
import { Shelf } from "./Shelf";
import { PickupSpot } from "./PickupSpot";
import { Player } from "./Player";
import { Box } from "./Box";
import { Section } from "./Section";

// Define the SectionC class, which extends the Section class
export class SectionC extends Section {
    // Constructor method for SectionC to initialize necessary contexts
    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        // Call the superclass constructor
        super(graphics, physics, interactions, userInterface);
    }

    // Method to create shelves and boxes in the section and position them correctly
    create(): void {
        // --- Create and Position Shelves ---

        // Array of shelf names representing the items
        const shelfNames = ["cola", "lemon_twist", "ginger_ale", "cream_soda", "carrot_cans", "corn_cans", "beans_cans", "beets_cans", "peanut_butter"];

        // Predefined positions and rotations for each shelf
        const shelfPositions = [
            [0, 5, 17], [0, 5, 8.5], [0, 5, 0], [0, 5, -8.5], 
            [-4, 5, 17], [-4, 5, 8.5], [-4, 5, 0], [-4, 5, -8.5], 
            [-2, 5, -14.5]
        ];
        const shelfRotations = [
            [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], 
            [0, Math.PI, 0], [0, Math.PI, 0], [0, Math.PI, 0], [0, Math.PI, 0], 
            [0, Math.PI / 2, 0]
        ];

        // Loop to create and position shelves with associated pickup spots
        for (let i = 0; i < shelfNames.length; i++) {
            // Create a new PickupSpot object for each shelf
            const pickupSpot = new PickupSpot(
                this.graphics, 
                this.physics, 
                this.interactions, 
                this.userInterface, 
                [0, 0, 0], // Initial position
                [3, 0.1, 8] // Scale (width, height, depth)
            );

            // Set the position and rotation for the pickup spot
            pickupSpot.root.position.set(shelfPositions[i][0], 0, shelfPositions[i][2]);
            pickupSpot.root.rotation.set(shelfRotations[i][0], shelfRotations[i][1], shelfRotations[i][2]);

            // Add interaction logic for placing objects in the pickup spot
            pickupSpot.interactions.addPickupSpot(pickupSpot.root, 10, (placeObject: THREE.Object3D) => {
                pickupSpot.root.add(placeObject); // Add the placed object to the spot
                placeObject.position.set(0, 5, 0); // Reset position of the placed object
                placeObject.rotation.set(0, 0, 0); // Reset rotation of the placed object
                placeObject.scale.setScalar(1);    // Reset scale of the placed object
            });

            // Add the PickupSpot to the pickupSpots array and register it in the construct system
            this.pickupSpots.push(pickupSpot);
            this.addConstruct(pickupSpot);

            // Create a new Shelf object for each item, with a specific name and scale
            const shelf = new Shelf(
                this.graphics, 
                this.physics, 
                this.interactions, 
                this.userInterface, 
                shelfNames[i], 
                [1, 1, 1] // Scale (x, y, z)
            );

            // Set the position and rotation for each shelf
            shelf.root.position.set(shelfPositions[i][0], shelfPositions[i][1], shelfPositions[i][2]);
            shelf.root.rotation.set(shelfRotations[i][0], shelfRotations[i][1], shelfRotations[i][2]);

            // Add interaction logic for picking up the shelf
            shelf.interactions.addPickupObject(shelf.root, 8, 0.1, () => {
                pickupSpot.root.add(shelf.root); // Add the shelf to the PickupSpot when picked up
            });

            // Add the shelf to the items array and register it as a construct
            this.items.push(shelf);
            this.addConstruct(shelf);
        }
        // -----------------------------
    }

    // Asynchronous load method (currently a placeholder, used for loading assets)
    async load(): Promise<void> {}

    // Build method (currently a placeholder, used for constructing the section)
    build(): void {}

    // Update method (currently a placeholder, used for updating the section)
    update(time?: TimeS, delta?: TimeMS): void {}

    // Destroy method (currently a placeholder, used for cleanup)
    destroy(): void {}
}
