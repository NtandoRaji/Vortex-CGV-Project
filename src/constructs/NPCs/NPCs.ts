import * as THREE from "three";
import { Construct, GraphicsContext, PhysicsContext } from "../../lib";
import { InterfaceContext } from "../../lib/w3ads/InterfaceContext";
import { InteractManager } from "../../lib/w3ads/InteractManager";

import { InteractNPC } from "./InteractNPC";
import { WalkingNPC } from "./WalkingNPC";


export class NPCs extends Construct {
    NPCScale: number = 3.5;
    InteractNPCs: InteractNPC [] = [];
    WalkingNPCs: WalkingNPC [] = [];
    filename: string[] = ["punk_character", "causal_women"];

    constructor(
        graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, 
        userInterface: InterfaceContext){
        super(graphics, physics, interactions, userInterface);
        
        const interactNPC = new InteractNPC(
            graphics, physics, interactions, userInterface, this.NPCScale, "casual_women", "Interact"
        );
        this.InteractNPCs.push(interactNPC);
        this.addConstruct(interactNPC);

        const walkingNPC = new WalkingNPC(
            graphics, physics, interactions, userInterface, this.NPCScale, "punk_character", [[5, 30], [5, -30]], Math.PI
        );
        this.WalkingNPCs.push(walkingNPC);
        this.addConstruct(walkingNPC);
    }

    create(): void {
        this.InteractNPCs[0].root.position.set(5, 0, 30);

        this.WalkingNPCs[0].root.position.set(5, 0, -30);
        this.WalkingNPCs[0].root.rotateY(Math.PI);
    }

    async load(): Promise<void> {}

    build(): void {
    }

    // @ts-ignore
    update(time: number, delta: number): void {
    }

    destroy(): void {
        
    }
}