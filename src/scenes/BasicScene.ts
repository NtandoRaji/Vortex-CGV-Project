import * as THREE from "three";
import { Scene } from "../lib";
import { TimeS } from "../lib/w3ads/types/misc.type";
import { Player } from "../constructs/Player";
import { Room } from "../constructs/Room";

export class BasicScene extends Scene {
    player!: Player;
    room!: Room;

    constructor(AmmoLib: any){
        super(
            "basic-scene",
            AmmoLib
        );

        this.player = new Player(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.player);

        this.room = new Room(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.room);
    }

    create(): void {}

    async load(): Promise<void> {}

    build(): void {
        const light = new THREE.PointLight(0xffffff, 1, 100, 0);
        light.position.set(0, 20, 5);

        this.graphics.add(light);
    }

    update(time?: TimeS, delta?: TimeS): void {}

    destroy(): void {}
};