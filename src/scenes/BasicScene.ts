import * as THREE from "three";
import { Scene } from "../lib";
import { TimeS } from "../lib/w3ads/types/misc.type";
import { Player } from "../constructs/Player";
import { Room } from "../constructs/Room";
import { PickupSpot } from "../constructs/PickupSpot";
import { GroceryItem } from "../constructs/GroceryItem";
import { CustomInteractManager } from "../lib/customs/CustomInteractManager";
import { CashierCounter } from "../constructs/CashierCounter";
import { Shelf } from "../constructs/Shelf";

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
    pickupSpots: PickupSpot[] = [];
    groceryItems: GroceryItem[] = [];
    cashierCounter!:CashierCounter;
    colaShelf!: Shelf;

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

        this.cashierCounter = new CashierCounter(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.cashierCounter);

        this.colaShelf = new Shelf(this.graphics, this.physics, this.interactions, this.userInterface, "cola", [1, 1, 1]);
        this.addConstruct(this.colaShelf);

        const npickupSpots = 4;
        for (let i = 0; i < npickupSpots; i++){
            const pickupSpot = new PickupSpot(
                this.graphics,
                this.physics,
                this.interactions,
                this.userInterface,
                [0, 0, 0],
                [2, 2, 2],
                getRandomColor()
            );

            this.pickupSpots.push(pickupSpot);
            this.addConstruct(pickupSpot);
        }

        const nGroceryItems = npickupSpots - 1;
        const itemNames = ["peanut_butter", "red_wine", "sundae"];
        for (let i = 0; i < nGroceryItems; i++){
            const item = new GroceryItem(
                this.graphics,
                this.physics,
                this.interactions,
                this.userInterface,
                itemNames[i % itemNames.length],
                [2, 2, 2]
            );
            this.groceryItems.push(item);
            this.addConstruct(item);
        }
    }

    create(): void {
        for (let i = 0; i < this.pickupSpots.length; i++){
            this.pickupSpots[i].root.position.set(-20, 1, 2 - 2 * i);
            this.pickupSpots[i].interactions.addPickupSpot(this.pickupSpots[i].root, 5, (placeObject: THREE.Object3D) => {
                this.pickupSpots[i].root.add(placeObject); // Add the object to the placement spot
                placeObject.position.set(0, 1, 0); // Set the position of the placed object
                placeObject.scale.setScalar(1); // Reset the scale of the placed object
            });
        }

        for (let i = 0; i < this.groceryItems.length; i++){
            this.pickupSpots[i].addConstruct(this.groceryItems[i]);
            this.groceryItems[i].root.position.set(0, 1, 0);

            this.groceryItems[i].interactions.addPickupObject(this.groceryItems[i].root, 5, 1, () => {});
        }

        this.cashierCounter.root.position.set(0, 3, -10);
        this.colaShelf.root.position.set(-5, 8.5, 0);;
    }

    async load(): Promise<void> {}

    build(): void {
        const light = new THREE.PointLight(0xffffff, 1, 100, 0);
        light.position.set(0, 20, 5);
        light.castShadow = true;

        this.graphics.add(light);
        
        this.graphics.root.traverse((object: any) => {
            if (object.isMesh){
                object.castShadow = true;
                object.receiveShadow = true;
            }
        })
    }

    //@ts-ignore
    update(time?: TimeS, delta?: TimeS): void {
        this.player.checkLookingAtGroceryItem(this.groceryItems);
        this.player.checkLookingAtPickupSpot(this.pickupSpots);
    }

    destroy(): void {}
};
