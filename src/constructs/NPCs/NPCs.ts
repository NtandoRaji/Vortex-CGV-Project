import { Construct, GraphicsContext, PhysicsContext } from "../../lib";
import { InterfaceContext } from "../../lib/w3ads/InterfaceContext";
import { InteractManager } from "../../lib/w3ads/InteractManager";

import { InteractNPC } from "./InteractNPC";
import { WalkingNPC } from "./WalkingNPC";


export class NPCs extends Construct {
    NPCScale: number = 3.5;
    interactNPCs: InteractNPC [] = [];
    WalkingNPCs: WalkingNPC [] = [];
    walkingNPCsFilename: string[] = ["punk_character"];
    interactNPCsFilename = ["casual_women", "hoodie_character"];

    constructor(
        graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, 
        userInterface: InterfaceContext){
        super(graphics, physics, interactions, userInterface);
        
        const actions = ["Interact", "Wave"];
        for (let i = 0; i < this.interactNPCsFilename.length; i++){
            const filename = this.interactNPCsFilename[i];

            let interactNPC = new InteractNPC(
                graphics, physics, interactions, userInterface, this.NPCScale, filename, actions[i]
            );
            this.interactNPCs.push(interactNPC);
            this.addConstruct(interactNPC);
        }

        const walkingNPC = new WalkingNPC(
            graphics, physics, interactions, userInterface, this.NPCScale, "punk_character", [[5, 30], [5, -30]], Math.PI
        );
        this.WalkingNPCs.push(walkingNPC);
        this.addConstruct(walkingNPC);
    }

    create(): void {
        // --- Place Interacting NPCs ---
        const interactingNPCsPositions = [[20, 73], [50, 43]];
        const interactingNPCsRotations = [0, Math.PI];
        for (let i = 0; i < this.interactNPCs.length; i++){
            const position = interactingNPCsPositions[i];
            const angle = interactingNPCsRotations[i];

            this.interactNPCs[i].root.position.set(position[0], 0, position[1]);
            this.interactNPCs[i].root.rotateY(angle);
        }
        // ------------------------------

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