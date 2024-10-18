import * as THREE from "three"; 
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../lib/w3ads/types/misc.type";
import { CashierRegister } from "./CashRegister";

export class CashierCounter extends Construct {
    mesh!: any;
    scale: number = 1;
    cashRegister!: CashierRegister

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface);

        this.cashRegister = new CashierRegister(graphics, physics, interactions, userInterface);
        this.addConstruct(this.cashRegister);
    }

    create(): void {}

    async load(): Promise<void> {
        try {
            const gltfData: any = await this.graphics.loadModel("/assets/cashier_counter/cashier_counter.gltf");
            this.mesh = gltfData.scene;
        }
        catch (error) {
            console.error(`[!] Error: ${error}`);
        }
    }

    build(): void {
        this.mesh.scale.set(this.scale, this.scale, this.scale);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        this.physics.addStatic(this.mesh, PhysicsColliderFactory.box(this.scale * 3.5, this.scale, 1));

        this.cashRegister.root.position.set(-0.5, 1, 0);
        this.cashRegister.root.scale.set(0.5, 0.5, 0.5);
    }

    update(time?: TimeS, delta?: TimeMS): void {}

    destroy(): void {}
}