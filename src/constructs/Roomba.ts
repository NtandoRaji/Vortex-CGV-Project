import * as THREE from "three";
import { GraphicsContext, PhysicsContext, PhysicsColliderFactory } from "../lib";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { InteractManager } from "../lib/w3ads/InteractManager";

import { Agent } from "./Agent";


export class Roomba extends Agent {
    mesh!: THREE.Mesh;

    constructor(
        graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, 
        userInterface: InterfaceContext, scale: number | undefined, checkpoints: Array<number []>){
        
        super(graphics, physics, interactions, userInterface, scale, checkpoints);
    }

    async load(): Promise<void> {
        try {
            const gltfData: any = await this.graphics.loadModel("assets/domestic_roomba/domestic_roomba.gltf");
            this.mesh = gltfData.scene;
        }
        catch (error) {
            console.error(`[!] Error: ${error}`);
        }
    }

    build(): void {
        this.mesh.scale.set(this.scale, this.scale, this.scale);
        // Enable shadow casting and receiving for self and children
        this.mesh.traverse((node: any) => {
            if (node.isMesh){
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        this.add(this.mesh);

        this.physics.addStatic(this.mesh, PhysicsColliderFactory.box(this.scale , this.scale, this.scale));
    }
}