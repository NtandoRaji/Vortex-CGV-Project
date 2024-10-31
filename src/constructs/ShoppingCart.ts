import * as THREE from "three"; 
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";



export class ShoppingCart extends Construct {
    mesh!: THREE.Mesh;
    scale: number = 4;


    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface);

    }

    create(): void {
      

    }

    async load(): Promise<void> {
        try {
            const gltfData: any = await this.graphics.loadModel("assets/shopping_cart/shopping_cart.gltf");
            this.mesh = gltfData.scene;
        } catch (error) {
            console.error(`[!] Error: ${error}`);
        }
    }

    build(): void {

        this.mesh.scale.set(this.scale, this.scale, this.scale);
        this.mesh.traverse((node: any) => {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });

        this.add(this.mesh);
        this.physics.addStatic(this.mesh, PhysicsColliderFactory.box(this.scale * 2, this.scale, 1));
    }

    //@ts-ignore
    update(time?: TimeS, delta?: TimeMS): void {}

    destroy(): void {}
}
