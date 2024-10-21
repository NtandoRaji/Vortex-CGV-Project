import * as THREE from "three"; 
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../lib/w3ads/types/misc.type";

export class CashierRegister extends Construct {
    mesh!: THREE.Mesh;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface);
    }

    create(): void {}

    async load(): Promise<void> {
        try {
            const gltfData: any = await this.graphics.loadModel("/assets/cash_register/cash_register.gltf");
            this.mesh = gltfData.scene;
        }
        catch (error) {
            console.error(`[!] Error: ${error}`);
        }
    }

    build(): void {
        // Enable shadow casting and receiving for self and children
        this.mesh.traverse((node: any) => {
            if (node.isMesh){
                node.castShadow = true;
            }
        });
        this.add(this.mesh);
        this.physics.addStatic(this.mesh, PhysicsColliderFactory.box(1, 1, 1));

    }

    update(time?: TimeS, delta?: TimeMS): void {}

    destroy(): void {}
}