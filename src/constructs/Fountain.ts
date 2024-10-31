import * as THREE from "three"; 
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../lib/w3ads/types/misc.type";
import { ShaderFancyCube } from "./ShaderFancyCube";


export class Fountain extends Construct {
    mesh!: THREE.Mesh;
    scale: number = 2;
    water!: ShaderFancyCube;
    water2!: ShaderFancyCube;
    water3!: ShaderFancyCube;
  
    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface);

        // Creating three levels of water splash effects in the fountain, represented by ShaderFancyCube instances
        this.water = new ShaderFancyCube(graphics, physics, interactions, userInterface);
        this.addConstruct(this.water);

        this.water2 = new ShaderFancyCube(graphics, physics, interactions, userInterface);
        this.addConstruct(this.water2);

        this.water3 = new ShaderFancyCube(graphics, physics, interactions, userInterface);
        this.addConstruct(this.water3);
    }

    create(): void {
        // Positioning and scaling each water level to simulate the layered splash effect:
        // Top level of the fountain splash
        this.water.root.position.set(0, 5.1, 0);
        this.water.root.scale.set(0.5, 0.5, 0.5);

        // Middle level of the fountain splash
        this.water2.root.position.set(0, 3.2, 0);
        this.water2.root.scale.set(1.1, 1.1, 1.1);

        // Bottom level of the fountain splash
        this.water3.root.position.set(0, 1.1, 0);
        this.water3.root.scale.set(2, 2, 2);
    }

    async load(): Promise<void> {
        try {
            const gltfData: any = await this.graphics.loadModel("assets/fountain/fountain.gltf");
            this.mesh = gltfData.scene;
        } catch (error) {
            console.error(`[!] Error: ${error}`);
        }
    }

    build(): void {
        // Setting up the fountain's main structure
        this.mesh.scale.set(this.scale, this.scale, this.scale);
        this.mesh.traverse((node: any) => {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });

        // Adding the fountain's physical mesh to the scene and physics system
        this.add(this.mesh);
        this.physics.addStatic(this.mesh, PhysicsColliderFactory.box(this.scale * 3.5, this.scale, 1));
    }

    //@ts-ignore
    update(time?: TimeS, delta?: TimeMS): void {}

    destroy(): void {}
}
