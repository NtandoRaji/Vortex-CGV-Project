// Import necessary modules and classes from the library
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../lib/w3ads/types/misc.type";

export class GroceryItem extends Construct {
    mesh!: any;
    scale!: number[];
    filename!: string; 
    productName!:string; //String to store the shelf's product name

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, filename:string, scale: number[] = [1, 1, 1]) {
        super(graphics, physics, interactions, userInterface);

        this.filename = filename;
        this.scale = scale;
        this.productName = this.formatProductName(this.filename);
        this.root.userData.productName = this.formatProductName(this.filename); // Save my product name to userData
    }

    create(): void {
        this.setBeingLookedAt(false);
    }
    private formatProductName(filename: string): string {
        return filename
            .replace(/_/g, ' ') // Replace underscores with spaces
            .split(' ') // Split into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
            .join(' '); // Join the words back into a single string
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
        this.mesh.scale.set(this.scale[0], this.scale[1], this.scale[2]);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        this.physics.addStatic(this.mesh, PhysicsColliderFactory.box(this.scale[0] / 6, this.scale[1] / 3, this.scale[2] / 6));
    }

    update(time?: TimeS, delta?: TimeMS): void {}

    destroy(): void {}

    setBeingLookedAt(value: boolean): void{
        this.root.userData.beingLookedAt = value;
    }

    getProductName(): string {
        return this.productName; // Return the name of the item
    }
}
