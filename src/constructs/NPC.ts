import * as THREE from "three";
import { GraphicsContext, PhysicsContext } from "../lib";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { InteractManager } from "../lib/w3ads/InteractManager";

import { Agent } from "./Agent";


export class NPC extends Agent {
    mesh!: THREE.Mesh;

    constructor(
        graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, 
        userInterface: InterfaceContext, scale: number | undefined, checkpoints: Array<number []>){
        
        super(graphics, physics, interactions, userInterface, scale, checkpoints);
    }

    async load(): Promise<void> {
    }
}