import * as THREE from "three";
import { Construct, GraphicsContext, PhysicsContext } from "../lib";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { InteractManager } from "../lib/w3ads/InteractManager";

import { DefaultHeuristic } from "../lib/algorithms/Heuristic";
import { AStarAlgorithm } from "../lib/algorithms/AStarAlgorithm";
import { Node } from "../lib/algorithms/Node.js";

export class Agent extends Construct {
    scale!: number;

    algorithm!: AStarAlgorithm;
    goalReached: boolean = true;
    path: Node[] = [];
    currentPosition: THREE.Vector2 = new THREE.Vector2(0, 0);
    nextPosition: Node | undefined = undefined;
    checkpoints!: Array<number []>;
    checkpointIndex = 0;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext,
        scale: number = 1, checkpoints: Array<number []>) {
        super(graphics, physics, interactions, userInterface);
        
        this.scale = scale;
        this.checkpoints = checkpoints;
    }

    create(): void {
        this.algorithm = new AStarAlgorithm(160, 160);
    }

    async load(): Promise<void> {
    }

    build(): void {
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshStandardMaterial( { color: 0xff0051, flatShading: false, metalness: 0, roughness: 1 })
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.scale.setScalar(this.scale);
        cube.castShadow = true;
    
        this.add(cube);
    }

    // @ts-ignore
    update(time: number, delta: number): void {
        delta = delta / 100;

        if (this.goalReached) {
            const grid = Array.from({ length: 160 }, () => Array(160).fill(0));
            
            const worldPosition = new THREE.Vector3();
            this.root.getWorldPosition(worldPosition);
        
            const start: [number, number] = [
                Math.floor(worldPosition.x + AStarAlgorithm.WIDTH / 2),
                Math.floor(worldPosition.z + AStarAlgorithm.HEIGHT / 2),
            ];

            const checkpoint = this.checkpoints[this.checkpointIndex % this.checkpoints.length];
            this.checkpointIndex += 1;
            this.root.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);

            const end : [number, number] = [
                Math.floor(checkpoint[0] + AStarAlgorithm.WIDTH / 2),
                Math.floor(checkpoint[1] + AStarAlgorithm.HEIGHT / 2),
            ];

            this.path = this.algorithm.solve(start, end, grid, new DefaultHeuristic());
            this.path.reverse();
            this.goalReached = false;

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
            this.root.position.set(this.currentPosition.x, 0.5, this.currentPosition.y);

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

    destroy(): void {}
}
