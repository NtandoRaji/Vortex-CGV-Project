import { Scene } from "../lib";
import { TimeS } from "../lib/w3ads/types/misc.type";
import { Player } from "../constructs/Player";
import { Store } from "../constructs/Store";
import { CustomInteractManager } from "../lib/customs/CustomInteractManager";
import { CustomInterfaceContext } from "../lib/customs/CustomInterfaceContext";


export class Level2 extends Scene {
    player!: Player;
    store!: Store;
    interactions: CustomInteractManager = new CustomInteractManager();
    userInterface: CustomInterfaceContext = new CustomInterfaceContext();
    levelMusic!: HTMLAudioElement;

    constructor(AmmoLib: any){
        super(
            "level-2",
            AmmoLib
        );

        const levelConfig = {
            level: "level-2",
            nextLevel: "level-3",
            levelTime: 120, // seconds
            memorizationTime: 122, // +2 seconds (Level Timer has 2 second delay)
            amountOfItemsToFind: 8,
            lives: 2
        }

        this.player = new Player(this.graphics, this.physics, this.interactions, this.userInterface, levelConfig);
        this.addConstruct(this.player);

        this.store = new Store(this.graphics, this.physics, this.interactions, this.userInterface, this.player);
        this.addConstruct(this.store);

        this.levelMusic = new Audio('musicSound/gameMusic.mp3');
    }

    create(): void {
        this.store.root.position.set(0, 0, 0);

        this.levelMusic.loop = true; // Make the music loop
        this.levelMusic.volume = Number(localStorage.getItem("vol")); // Set initial volume
    }

    async load(): Promise<void> {}

    build(): void {
        // Play Level Music
        this.levelMusic.play().catch(error => console.error('Music playback failed:', error));
    }

    //@ts-ignore
    update(time?: TimeS, delta?: TimeS): void {}

    destroy(): void {}
};
