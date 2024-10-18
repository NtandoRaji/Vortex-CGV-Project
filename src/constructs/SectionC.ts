import * as THREE from "three";
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../lib/w3ads/types/misc.type";
import { Shelf } from "./Shelf";


export class SectionC extends Construct {
    shelves: Array<Shelf> = [];

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface);

        const nShelves = 9;
        const itemNames = ["cola", "green_twist", "ginger_ale", "cream_soda", "beets_cans", "pb", "corn_cans", "beans_cans"];
        for (let i = 0; i < itemNames.length; i++){
            const shelf = new Shelf(graphics, physics, interactions, userInterface, itemNames[i], [1, 1, 1]);
            this.shelves.push(shelf);
            this.addConstruct(shelf);
        }
    }

    create(): void {
        for (let i  = 0; i < this.shelves.length; i++){
            this.shelves[i].root.position.set(-20, 0, 0);
        }
    }

    async load(): Promise<void> {}

    build(): void {
    }

    update(time?: TimeS, delta?: TimeMS): void {}

    destroy(): void {}
}