import * as THREE from "three";
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../lib/w3ads/types/misc.type";


export class Shelf extends Construct {
    mesh!: THREE.Mesh;
    filename!:string;
    id!: string;
    scale!: number[];

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, 
        filename: string, scale: number[] = [1, 1, 1]) {
        super(graphics, physics, interactions, userInterface);

        this.id = this.filename = filename;
        this.scale = scale;
    }

    create(): void {
        this.setBeingLookedAt(false);
    }

    async load(): Promise<void> {
        try {
            const gltfData: any = await this.graphics.loadModel(`/assets/${this.filename}_shelf/${this.filename}_shelf.gltf`);
            this.mesh = gltfData.scene;
        }
        catch (error) {
            console.log("[!] Error loading shelf model");
            console.log(error);
        }
    }

    build(): void {
        this.mesh.position.set(0, 0, 0);
        this.mesh.scale.set(this.scale[0], this.scale[1], this.scale[2]);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        this.physics.addStatic(this.mesh, PhysicsColliderFactory.box(this.scale[0] / 6, this.scale[1] / 3, this.scale[2] / 6));
    }

    update(time?: TimeS, delta?: TimeMS): void {
        
    }

    destroy(): void {
        
    }

    setBeingLookedAt(value: boolean): void{
        this.root.userData.beingLookedAt = value;
    }

    getID(): string {
        return this.id;
    }
}