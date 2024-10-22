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


// Define the VegSection class, extending the Construct class
export class IceCreamSection extends Section {
    // Constructor initializes the VegSection with necessary contexts
    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        // Call the superclass (Construct) constructor
        super(graphics, physics, interactions, userInterface);
    }

    // Method to create and position boxes in the section
    create(): void {
        // --- Create & Place Boxes ---
        // Array of box names representing vegetables
        const boxesNames = ["vanilla_ice_cream", "chocolate_ice_cream", "strawberry_ice_cream", "mint_ice_cream"];
        // Predefined positions and rotations for each vegetable box
        const boxPositions = [[0, 1.5, 19], [-9.5, 1.5, 19], [9.5, 1.5, 19], [-19, 1.5, 19]];
        const boxRotations = [[0, Math.PI , 0], [0, Math.PI , 0], [0, Math.PI , 0], [0, Math.PI , 0]];

        // Loop to create boxes and their associated pickup spots
        for (let i = 0; i < boxesNames.length; i++) {
            // Create a new PickupSpot object for each box
            const pickupSpot = new PickupSpot(this.graphics, this.physics, this.interactions, 
                this.userInterface, [0, 0, 0], [9, 0.1, 4]); // Position and scale of the pickup spot

            // Set the position and rotation of the PickupSpot
            pickupSpot.root.position.set(boxPositions[i][0], 0, boxPositions[i][2]);
            pickupSpot.root.rotation.set(boxRotations[i][0], boxRotations[i][1], boxRotations[i][2]);

            // Add interaction logic for placing objects in the PickupSpot
            pickupSpot.interactions.addPickupSpot(pickupSpot.root, 10, (placeObject: THREE.Object3D) => {});

            // Add the PickupSpot to the pickupSpots array and register it in the construct system
            this.pickupSpots.push(pickupSpot);
            this.addConstruct(pickupSpot);

            // Create a new Box object for each vegetable
            const box = new Box(this.graphics, this.physics, this.interactions, this.userInterface, boxesNames[i], [1, 0.7, 1]);
            // Set the position and rotation of the box
            box.root.position.set(boxPositions[i][0], boxPositions[i][1], boxPositions[i][2]);
            box.root.rotation.set(boxRotations[i][0], boxRotations[i][1], boxRotations[i][2]);

            // Add interaction logic for picking up the box (moving to the PickupSpot)
            box.interactions.addPickupObject(box.root, 8, 0.1, () => {});

            // Add the box to the items array and register it as a construct
            this.items.push(box);
            this.addConstruct(box);
        }
        // ----------------------------
    }
}
