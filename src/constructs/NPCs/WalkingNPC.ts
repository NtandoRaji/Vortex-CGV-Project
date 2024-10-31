import * as THREE from "three";
import { GraphicsContext, PhysicsContext } from "../../lib";
import { InterfaceContext } from "../../lib/w3ads/InterfaceContext";
import { InteractManager } from "../../lib/w3ads/InteractManager";

import { Agent } from "../Agent";
import { AStarAlgorithm } from "../../lib/algorithms/AStarAlgorithm";
import { DefaultHeuristic } from "../../lib/algorithms/Heuristic";


export class WalkingNPC extends Agent {
    private mesh!: THREE.Mesh;
    mixer!: THREE.AnimationMixer;
    animationMap: Map<string, THREE.AnimationAction> = new Map();
    
    filename!:string;
    rotationAngle!: number;

    constructor(
        graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, 
        scale: number, filename: string, checkpoints: Array<number []>, rotationAngle: number){
        super(graphics, physics, interactions, userInterface, scale, checkpoints);
        
        this.filename = filename;
        this.rotationAngle = rotationAngle;
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

        if (this.goalReached) {
            const grid = Array.from({ length: 160 }, () => Array(160).fill(0));
            
            const worldPosition = new THREE.Vector3();
            this.root.getWorldPosition(worldPosition);
        
            const start: [number, number] = [
                Math.floor(worldPosition.x + AStarAlgorithm.WIDTH / 2),
                Math.floor(worldPosition.z + AStarAlgorithm.HEIGHT / 2),
            ];

            const checkpoint = this.checkpoints[this.checkpointIndex % 4];
            this.checkpointIndex += 1;
            this.root.rotateOnAxis(new THREE.Vector3(0, 1, 0), this.rotationAngle);

            const end : [number, number] = [
                Math.floor(checkpoint[0] + AStarAlgorithm.WIDTH / 2),
                Math.floor(checkpoint[1] + AStarAlgorithm.HEIGHT / 2),
            ];

            this.path = this.algorithm.solve(start, end, grid, new DefaultHeuristic());
            this.path.reverse();
            this.goalReached = false;

            this.animationMap.forEach((value, key) => {
                if (key === "Walk"){
                    value.play();
                }
            });

            // Set the first position and target
            this.currentPosition.set(this.root.position.x, this.root.position.z);
            this.nextPosition = this.path.pop();
        }

        if (!this.goalReached && this.nextPosition) {
            // Interpolate between current and next positions
            const targetX = this.nextPosition.getX() - AStarAlgorithm.WIDTH / 2;
            const targetY = this.nextPosition.getY() - AStarAlgorithm.HEIGHT / 2;

            const stiffness = 1;
            const damping = 2;

            const velocity = new THREE.Vector2();

            velocity.x += (targetX - this.currentPosition.x) * stiffness;
            velocity.y += (targetY - this.currentPosition.y) * stiffness;

            velocity.multiplyScalar(damping);

            this.currentPosition.add(velocity.multiplyScalar(delta));

            // Update root position
            this.root.position.set(this.currentPosition.x, 0, this.currentPosition.y);

            // Check if agent is close enough to the target position
            if (Math.abs(this.currentPosition.x - targetX) < 0.001 && Math.abs(this.currentPosition.y - targetY) < 0.001) {
                this.currentPosition.set(targetX, targetY);
                this.nextPosition = this.path.pop();

                // If no more positions, goal is reached
                if (!this.nextPosition) {
                    this.goalReached = true;
                }
            }
        }
    }
}