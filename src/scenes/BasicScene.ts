import * as THREE from "three";
import { Scene } from "../lib";
import { TimeS } from "../lib/w3ads/types/misc.type";

export class BasicScene extends Scene {
    camera!: THREE.PerspectiveCamera;

    constructor(AmmoLib: any){
        super(
            "basic-scene",
            AmmoLib
        );
    }

    create(): void {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(90, aspect);
        this.graphics.mainCamera = this.camera;
    }

    async load(): Promise<void> {}

    build(): void {
    }

    // @ts-ignore
    update(time?: TimeS, delta?: TimeS): void {
    }

    destroy(): void {}
};
