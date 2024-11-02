import * as THREE from "three";
import { Construct, GraphicsContext, PhysicsContext } from "../../lib";
import { InteractManager } from "../../lib/w3ads/InteractManager";
import { InterfaceContext } from "../../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../../lib/w3ads/types/misc.type";


export class ParkingLot extends Construct {
    mesh!: THREE.Mesh;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface)
    }

    create(): void {
    }

    async load(): Promise<void> {
        try {
            const gltfData: any = await this.graphics.loadModel("assets/parking_lot/parking_lot.gltf");
            this.mesh = gltfData.scene;
        }
        catch (error) {
            console.error("[!] Error: Failed To Load Parking Lot Model");
        }
    }

    build(): void {
        this.mesh.scale.setScalar(23);
        this.add(this.mesh);
    }

    //@ts-ignore
    update(time?: TimeS, delta?: TimeMS): void {
        
    }

    destroy(): void {
        
    }
}