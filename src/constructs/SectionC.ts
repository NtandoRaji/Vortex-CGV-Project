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

// Define the SectionC class, extending the Construct class
export class SectionC extends Construct {
    // Define properties: a player instance, an array of items (Shelf or Box), and pickup spots
    player!: Player; // Reference to the player object for interaction logic
    items: Array<Shelf> | Array<Box> = []; // Array of items in the section (either Shelves or Boxes)
    pickupSpots: Array<PickupSpot> = []; // Array of PickupSpots for placing items

    // Constructor initializes the SectionC with necessary contexts and the player object
    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, player: Player) {
        // Call the superclass (Construct) constructor
        super(graphics, physics, interactions, userInterface);
        // Initialize the player object
        this.player = player;
    }

    // Method to create and position shelves and boxes in the section
    create(): void {
        // --- Create & Place Shelves ---
        // Array of shelf names
        const shelfNames = ["cola", "green_twist"];
        const shelfPositions = []; // Empty array for future use (for dynamic positions)

        // Loop to create two shelves and their associated pickup spots
        for (let i = 0; i < shelfNames.length; i++) {
            // Create a new PickupSpot object for each shelf
            const pickupSpot = new PickupSpot(this.graphics, this.physics, this.interactions, 
                this.userInterface, [0, 0, 0], [4, 0.1, 8] // Position and scale of the pickup spot
            );
            // Set the position of the PickupSpot
            pickupSpot.root.position.set(0, 0, 10 + 8.5 * i);

            // Add interaction logic for placing objects in the PickupSpot
            pickupSpot.interactions.addPickupSpot(pickupSpot.root, 10, (placeObject: THREE.Object3D) => {
                pickupSpot.root.add(placeObject); // Place the object at the spot
                placeObject.position.set(0, 0, 0); // Reset object position
                placeObject.rotation.set(0, 0, 0); // Reset object rotation
                placeObject.scale.setScalar(1);    // Reset object scale
            });

            // Add the PickupSpot to the pickupSpots array and add it as a construct
            this.pickupSpots.push(pickupSpot);
            this.addConstruct(pickupSpot);

            // Create a new Shelf object with the current name and scale
            const shelf = new Shelf(this.graphics, this.physics, this.interactions, this.userInterface, shelfNames[i], [1, 1, 1]);
            // Set the position of the shelf
            shelf.root.position.set(0, 0, 10 + 8.5 * i);

            // Add interaction logic for picking up the shelf
            shelf.interactions.addPickupObject(shelf.root, 10, 0.1, () => {
                pickupSpot.root.add(shelf.root); // Move the shelf to the PickupSpot
            });

            // Add the shelf to the items array and as a construct
            this.items.push(shelf);
            this.addConstruct(shelf);
        }
        // -----------------------------

        // --- Create & Place Boxes ---
        // Array of box names (only one box in this example)
        const boxesNames = ["banana"];
        // Loop to create boxes and their associated pickup spots
        for (let i = 0; i < boxesNames.length; i++) {
            // Create a new PickupSpot object for each box
            const pickupSpot = new PickupSpot(this.graphics, this.physics, this.interactions, 
                this.userInterface, [0, 0, 0], [9, 0.1, 4]); // Position and scale of the pickup spot
            // Set the position of the PickupSpot
            pickupSpot.root.position.set(0, 0, 0);

            // Add interaction logic for placing objects in the PickupSpot
            pickupSpot.interactions.addPickupSpot(pickupSpot.root, 10, (placeObject: THREE.Object3D) => {
                pickupSpot.root.add(placeObject); // Place the object at the spot
                placeObject.position.set(0, 0, 0); // Reset object position
                placeObject.rotation.set(0, 0, 0); // Reset object rotation
                placeObject.scale.setScalar(1);    // Reset object scale
            });

            // Add the PickupSpot to the pickupSpots array and add it as a construct
            this.pickupSpots.push(pickupSpot);
            this.addConstruct(pickupSpot);

            // Create a new Box object with the current name and default scale
            const box = new Box(this.graphics, this.physics, this.interactions, this.userInterface, boxesNames[i]);
            // Set the position of the box
            box.root.position.set(0, 0, 0);

            // Add interaction logic for picking up the box (currently commented out)
            box.interactions.addPickupObject(box.root, 8, 0.1, () => {
                // pickupSpot.root.add(box.root); // Commented out action for placing the box
            });

            // Add the box to the items array and as a construct
            this.items.push(box);
            this.addConstruct(box);
        }
        // ----------------------------
    }

    // Asynchronous load method (currently a placeholder)
    async load(): Promise<void> {}

    // Build method (currently a placeholder)
    build(): void {}

    // Update method to check player interactions with shop items and pickup spots
    update(time?: TimeS, delta?: TimeMS): void {
        // Check if the player is looking at any of the shop items (Shelves or Boxes)
        this.player.checkLookingAtShopItems(this.items);
        // Check if the player is looking at any of the pickup spots
        this.player.checkLookingAtPickupSpot(this.pickupSpots);
    }

    // Destroy method (currently a placeholder)
    destroy(): void {}
}
