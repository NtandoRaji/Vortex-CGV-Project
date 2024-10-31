import * as THREE from "three";
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../../lib";
import { InterfaceContext } from "../../lib/w3ads/InterfaceContext";
import { InteractManager } from "../../lib/w3ads/InteractManager";


export class InteractNPC extends Construct {
    scale!: number;
    mesh!: THREE.Mesh;
    mixer!: THREE.AnimationMixer;
    animationMap: Map<string, THREE.AnimationAction> = new Map();
    action!: string;
    filename!:string;
    lastAnimationTime: number = 0;
    currentAction: string = "Idle";

    constructor(
        graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, 
        userInterface: InterfaceContext, scale: number = 4, filename:string, action: string){
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

        this.physics.addStatic(this.mesh, PhysicsColliderFactory.box(1, 2, 1));

        this.animationMap.forEach((value, key) => {
            if (key === "Idle") {
                value.play();
            }
        });
    }

    // @ts-ignore
    update(time: number, delta: number): void {
        delta = delta / 200;
        this.mixer.update(delta / 5);

        // Check if 2 seconds have passed since the last animation change
        if (time - this.lastAnimationTime >= 3.2) { // 2 seconds in 'time' units
            this.lastAnimationTime = time; // Reset the timer

            // Toggle between "Idle" and the specified action
            this.currentAction = this.currentAction === "Idle" ? this.action : "Idle";

            // Loop through the animation map to set the active action
            this.animationMap.forEach((value, key) => {
                if (key === this.currentAction) {
                    if (!value.isRunning()) {
                        value.reset().play();
                        }
                    }   
                    else {
                        value.stop();
                    }
                }
            );
        }
    }

    destroy(): void {
        
    }
}