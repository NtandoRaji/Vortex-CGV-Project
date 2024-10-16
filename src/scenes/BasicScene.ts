import * as THREE from "three";
import { Scene } from "../lib";
import { TimeS } from "../lib/w3ads/types/misc.type";
import { Player } from "../constructs/Player";
import { Room } from "../constructs/Room";
import { Box } from "../constructs/Box";
import { GroceryItem } from "../constructs/GroceryItem";
import { CustomInteractManager } from "../lib/customs/CustomInteractManager";

const getRandomColor = () : number => {
    const r = Math.floor(Math.random() * 128) + 128; // Red component (128–255)
    const g = Math.floor(Math.random() * 128) + 128; // Green component (128–255)
    const b = Math.floor(Math.random() * 128) + 128; // Blue component (128–255)

    // Combine the RGB components into a single number
    return (r << 16) + (g << 8) + b;
}

export class BasicScene extends Scene {
    player!: Player;
    room!: Room;
    boxes: Box[] = [];
    groceryItems: GroceryItem[] = [];

    constructor(AmmoLib: any){
        super(
            "basic-scene",
            AmmoLib
        );
        this.interactions = new CustomInteractManager();

        this.player = new Player(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.player);

        this.room = new Room(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.room);

        const nBoxes = 8;
        for (let i = 0; i < nBoxes; i++){
            const box = new Box(
                this.graphics,
                this.physics,
                this.interactions,
                this.userInterface,
                [0, 0, 0],
                2,
                getRandomColor()
            );

            this.boxes.push(box);
            this.addConstruct(box);
        }

        const nGroceryItems = nBoxes - 1;
        const itemNames = ["peanut_butter", "red_wine", "sundae"];
        for (let i = 0; i < nGroceryItems; i++){
            const item = new GroceryItem(
                this.graphics,
                this.physics,
                this.interactions,
                this.userInterface,
                itemNames[i % itemNames.length],
                i,
                2
            );
            this.groceryItems.push(item);
            this.addConstruct(item);
        }
    }

    create(): void {
        for (let i = 0; i < this.boxes.length; i++){
            this.boxes[i].root.position.set(-20, 2, 2 - 2 * i);
            this.boxes[i].interactions.addPickupSpot(this.boxes[i].root, 5, (placeObject: THREE.Object3D) => {
                this.boxes[i].root.add(placeObject); // Add the object to the placement spot
                placeObject.position.set(0, 1, 0); // Set the position of the placed object
                placeObject.scale.setScalar(1); // Reset the scale of the placed object
            });
        }

        for (let i = 0; i < this.groceryItems.length; i++){
            this.boxes[i].addConstruct(this.groceryItems[i]);
            this.groceryItems[i].root.position.set(0, 1, 0);

            this.groceryItems[i].interactions.addPickupObject(this.groceryItems[i].root, 5, 1, () => {});
        }
    }

    async load(): Promise<void> {}

    build(): void {
        const light = new THREE.PointLight(0xffffff, 1, 100, 0);
        light.position.set(0, 20, 5);

        this.graphics.add(light);
    }

    update(time?: TimeS, delta?: TimeS): void {
        this.player.checkLookingAtGroceryItem(this.groceryItems);
        this.player.checkLookingAtPickupSpot(this.boxes);
    }

    destroy(): void {}
};
