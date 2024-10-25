import { Scene } from "../lib";
import { TimeS } from "../lib/w3ads/types/misc.type";
import { Player } from "../constructs/Player";
import { Store } from "../constructs/Store";
import { CustomInteractManager } from "../lib/customs/CustomInteractManager";
import { CustomInterfaceContext } from "../lib/customs/CustomInterfaceContext";


export class Level1 extends Scene {
    player!: Player;
    store!: Store;
    interactions: CustomInteractManager = new CustomInteractManager();
    userInterface: CustomInterfaceContext = new CustomInterfaceContext();

    constructor(AmmoLib: any){
        super(
            "level-1",
            AmmoLib
        );

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

    //@ts-ignore
    update(time?: TimeS, delta?: TimeS): void {}

    destroy(): void {}
};
