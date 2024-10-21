import * as THREE from "three";
import { InteractManager } from "../w3ads/InteractManager";


export class CustomInteractManager extends InteractManager {
    constructor() {
        super();
    }

    update(): void {
        for (let interacting of this.interactingObjects) {
            let worldInteractPos: THREE.Vector3 = new THREE.Vector3();
            interacting.object.getWorldPosition(worldInteractPos);

            // Interact Search to the object the player is looking at
            let objectDistanceSquared = Number.MAX_VALUE;
            let chosenObject = 0;

            for (let i = 0; i < this.interactableObjects.length; ++i) {
               if (this.interactableObjects[i].object.userData.beingLookedAt){
                    let worldPos = new THREE.Vector3();
                    this.interactableObjects[i].object.getWorldPosition(worldPos);
                    const vals = {
                        x2: (
                            worldPos.x - worldInteractPos.x
                        )**2,
                        y2: (
                            worldPos.y - worldInteractPos.y
                        )**2,
                        z2: (
                            worldPos.z - worldInteractPos.z
                        )**2,
                    };
                    // Gets squared distance from interacting object to choosen object
                    const distance = vals.x2 + vals.y2 + vals.z2;

                    // Choose the object that's closest to interacting object
                    if (distance < objectDistanceSquared){
                        objectDistanceSquared = distance;
                        chosenObject = i;
                    }
               }
            }

            if (this.interactableObjects.length > 0) {
                // Only interact with object if it is close enough
                if (objectDistanceSquared <= this.interactableObjects[chosenObject].radius**2){
                    if (!this.interactableObjects[chosenObject].canPickup) {
                        interacting.object.userData.canInteract = true;
                        interacting.object.userData.onInteract = this.interactableObjects[chosenObject].onInteract;
                    } else {
                        interacting.object.userData.canInteract = true;
                        interacting.object.userData.onInteract = () => {
                            this.interactableObjects[chosenObject].onInteract();
                            interacting.onPickup(this.interactableObjects[chosenObject].object);
                        }
                    }
                }
                else {
                    interacting.object.userData.canInteract = false;
                }
            }


            // Place object search
            let chosenSpot = -1;
            let spotDistanceSquared = Number.MAX_VALUE;
            for (let i = 0; i < this.pickupSpots.length; ++i) {
                if (this.pickupSpots[i].spot.userData.beingLookedAt){
                    let spotPos = new THREE.Vector3();
                    this.pickupSpots[i].spot.getWorldPosition(spotPos);
                    const vals = {
                        x2: (
                            spotPos.x - worldInteractPos.x
                        )**2,
                        y2: (
                            spotPos.y - worldInteractPos.y
                        )**2,
                        z2: (
                            spotPos.z - worldInteractPos.z
                        )**2,
                    };
                    // Gets squared distance from interacting object to choosen spot
                    const distance = vals.x2 + vals.y2 + vals.z2;

                    // Choose the pickup spot that's closest to interacting object
                    if (distance < spotDistanceSquared){
                        spotDistanceSquared = spotDistanceSquared;
                        chosenSpot = i;
                    }
                }
            }

            if (this.pickupSpots.length > 0 && chosenSpot >= 0) {
                // Only choose pickup spot if it's close to use and has no objects on it
                if (spotDistanceSquared <= this.pickupSpots[chosenSpot].radius**2 && this.pickupSpots[chosenSpot].spot.children.length <= 1) {
                    interacting.object.userData.canPlace = true;
                    interacting.object.userData.onPlace = this.pickupSpots[chosenSpot].onPlace;
                } else {
                    interacting.object.userData.canPlace = false;
                }
            }
        }
    }
}
