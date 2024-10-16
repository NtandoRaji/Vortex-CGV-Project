// Import necessary modules and classes from the library
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../lib/w3ads/types/misc.type";

export class GroceryItem extends Construct {
    mesh!: any;
    scale!: number;
    filename!: string;
    id!: number;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, filename:string, id:number, scale: number = 1) {
        super(graphics, physics, interactions, userInterface);

        this.filename = filename;
        this.id = id;
        this.scale = scale;
    }

    create(): void {
        this.setBeingLookedAt(false);
    }

    async load(): Promise<void> {
        try {
            const gltfData: any = await this.graphics.loadModel(`/assets/${this.filename}/${this.filename}.gltf`);
            this.mesh = gltfData.scene;
        }
        catch (error) {
            console.log(error);
        }
    }

    build(): void {
        this.mesh.scale.set(this.scale, this.scale, this.scale);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        this.physics.addStatic(this.mesh, PhysicsColliderFactory.box(this.scale / 6, this.scale / 3, this.scale / 6));
    }

    update(time?: TimeS, delta?: TimeMS): void {}

    destroy(): void {}

    setBeingLookedAt(value: boolean): void{
        this.root.userData.beingLookedAt = value;
    }
}
