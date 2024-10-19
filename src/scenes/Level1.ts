import * as THREE from "three";
import { Scene } from "../lib";
import { TimeS } from "../lib/w3ads/types/misc.type";
import { Player } from "../constructs/Player";
import { Store } from "../constructs/Store";
import { GroceryItem } from "../constructs/GroceryItem";
import { CustomInteractManager } from "../lib/customs/CustomInteractManager";


export class Level1 extends Scene {
    player!: Player;
    store!: Store;

    constructor(AmmoLib: any){
        super(
            "level_1",
            AmmoLib
        );
        this.interactions = new CustomInteractManager();

        this.player = new Player(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.player);

        this.store = new Store(this.graphics, this.physics, this.interactions, this.userInterface, this.player);
        this.addConstruct(this.store);
    }

    create(): void {
        this.store.root.position.set(0, 0, 0);
    }

    async load(): Promise<void> {}

    build(): void {}

    update(time?: TimeS, delta?: TimeS): void {}

    destroy(): void {}
};
