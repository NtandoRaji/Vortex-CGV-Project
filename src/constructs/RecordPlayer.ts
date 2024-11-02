import * as THREE from "three"; 
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../lib/w3ads/types/misc.type";


export class RecordPlayer extends Construct {
    mesh!: THREE.Mesh;
    scale: number = 1;
    private mixer: THREE.AnimationMixer | null = null;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface);
        
    }

    create(): void {
    }

    async load(): Promise<void> {
        try {
            const gltfData: any = await this.graphics.loadModel("assets/record_player/record_player.gltf");
            this.mesh = gltfData.scene;
            if (gltfData.animations && gltfData.animations.length > 0) {
                //console.log(gltfData.animations)
                this.mixer = new THREE.AnimationMixer(this.mesh);
                this.mixer.timeScale = 1;
                const action = this.mixer.clipAction(gltfData.animations[0]);
                action.play()
                //console.log(`Animation loaded for item: ${this.filename}`);
               }
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
            }
        });
        this.add(this.mesh);

        this.physics.addStatic(this.mesh, PhysicsColliderFactory.box(this.scale * 1.4, this.scale, 1));
    }

    //@ts-ignore
    update(time?: TimeS, delta?: TimeMS): void { 
        if (this.mixer) {
        // Update the animation mixer with the delta time
        const deltaTime = delta ? delta / 1000 : 0; // Convert milliseconds to seconds
        this.mixer.update(deltaTime);
    }}

    destroy(): void {}
}