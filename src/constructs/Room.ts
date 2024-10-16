import * as THREE from "three";
import { Construct, GraphicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../lib/w3ads/types/misc.type";

export class Room extends Construct {
    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext){
        super(graphics, physics, interactions, userInterface);
    }

    create(): void {}

    async load(): Promise<void> {}

    build(): void {
        const floorScale = [50, 1, 50];
        const floor = GraphicsPrimitiveFactory.box({
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: floorScale[0], y: floorScale[1], z: floorScale[2]},
            colour: 0xffffff,
            shadows: true, // Enable shadows for the cube
        });

        const ambientLight = new THREE.AmbientLight(
            0xffffff, // colour
            0.5 //intensity
        );

        this.add(floor);
        this.graphics.add(ambientLight);

        this.physics.addStatic(
            floor,
            PhysicsColliderFactory.box(floorScale[0] / 2, floorScale[1] / 2, floorScale[2] / 2)
        );
    }

    update(time?: TimeS, delta?: TimeMS): void {}

    destroy(): void {}
}
