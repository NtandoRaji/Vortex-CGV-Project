// Import necessary modules and classes from 'three.js' and custom modules
import { GraphicsContext, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { Fridge } from "./Fridge";
import { PickupSpot } from "./PickupSpot";
import { Section } from "./Section";

// Define the SectionC class, which extends the Section class
export class fridgeSection extends Section {
    // Constructor method for SectionC to initialize necessary contexts
    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        // Call the superclass constructor
        super(graphics, physics, interactions, userInterface);
    }

    // Method to create shelves and boxes in the section and position them correctly
    create(): void {
        // --- Create and Position Shelves ---

        // Array of shelf names representing the items
        const shelfNames = ["lasagna","spaghetti","beef_burger"];

        // Predefined positions and rotations for each shelf
        const shelfPositions = [
            [0,0,8],[0, 0, 17],[0, 0, 26]
        ];
        const shelfRotations = [
            [0, 0, 0],[0,0, 0],[0,0,0]
        ];

        // Loop to create and position shelves with associated pickup spots
        for (let i = 0; i < shelfNames.length; i++) {
            console.log("creating", shelfNames[i]);
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
            pickupSpot.interactions.addPickupSpot(pickupSpot.root, 10, () => {});

            // Add the PickupSpot to the pickupSpots array and register it in the construct system
            this.pickupSpots.push(pickupSpot);
            this.addConstruct(pickupSpot);

            // Create a new Shelf object for each item, with a specific name and scale
            const fridge = new Fridge(
                this.graphics, 
                this.physics, 
                this.interactions, 
                this.userInterface, 
                shelfNames[i], 
                [1, 1, 1] // Scale (x, y, z)
            );

            // Set the position and rotation for each shelf
            fridge.root.position.set(shelfPositions[i][0], shelfPositions[i][1], shelfPositions[i][2]);
            fridge.root.rotation.set(shelfRotations[i][0], shelfRotations[i][1], shelfRotations[i][2]);

            // Add interaction logic for picking up the shelf
            fridge.interactions.addPickupObject(fridge.root, 8, 0.1, () => {});

            // Add the shelf to the items array and register it as a construct
            this.items.push(fridge);
            this.addConstruct(fridge);
        }
        // -----------------------------
    }
}
