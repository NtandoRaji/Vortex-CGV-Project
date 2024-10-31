import * as THREE from "three";
import { Construct, GraphicsContext, PhysicsContext } from "../../lib";
import { InterfaceContext } from "../../lib/w3ads/InterfaceContext";
import { InteractManager } from "../../lib/w3ads/InteractManager";


export class InteractNPC extends Construct {
    private scale!: number;
    private mesh!: THREE.Mesh;
    mixer!: THREE.AnimationMixer;
    animationMap: Map<string, THREE.AnimationAction> = new Map();
    action!: string;
    filename!:string;

    constructor(
        graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, 
        userInterface: InterfaceContext, scale: number | undefined = 4, filename:string, action: string){
        super(graphics, physics, interactions, userInterface);

        this.scale = scale;
        this.filename = filename;
        this.action = action;
    }

    create(): void {
    }

    async load(): Promise<void> {
        try {
            const gltfData: any = await this.graphics.loadModel(`assets/${this.filename}/${this.filename}.gltf`);
            this.mesh = gltfData.scene;

            const gltfAnimations: THREE.AnimationClip[] = gltfData.animations;
            this.mixer = new THREE.AnimationMixer(this.mesh);

            gltfAnimations.forEach((animation: THREE.AnimationClip) => {
                this.animationMap.set(animation.name, this.mixer.clipAction(animation));
            });
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
                node.material.opacity = 1;
            }
        });
        this.add(this.mesh);
    }

    // @ts-ignore
    update(time: number, delta: number): void {
        delta = delta / 200;
        this.mixer.update(delta / 4.5);


        this.animationMap.forEach((value, key) => {
            if (key === this.action){
                if (!value.isRunning){
                    value.play();
                }
            }
        });
    }

    destroy(): void {
        
    }
}