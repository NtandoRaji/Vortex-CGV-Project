import * as THREE from "three";
import { Construct, GraphicsContext, PhysicsContext } from "../../lib";
import { InteractManager } from "../../lib/w3ads/InteractManager";
import { InterfaceContext } from "../../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../../lib/w3ads/types/misc.type";
import { ParkingLot } from "./ParkingLot";
import { Mountains } from "./Mountains";

export class SkyBox extends Construct {
    parkingLot!: ParkingLot;
    mountains!: Mountains;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface)
        
        this.parkingLot = new ParkingLot(graphics, physics, interactions, userInterface);
        this.addConstruct(this.parkingLot);

        this.mountains = new Mountains(graphics, physics, interactions, userInterface);
        this.addConstruct(this.mountains);
    }

    create(): void {
        // --- Parking Lot Placement ---
        this.parkingLot.root.position.set(0, 0, 0);
        // -----------------------------

        // --- Mountains Lot Placement ---
        this.mountains.root.position.set(0, 0, 0);
        // -----------------------------
    }

    async load(): Promise<void> {
        
    }

    build(): void {
        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2.0);
        directionalLight.position.set(0, 100, 0);
        directionalLight.target.lookAt(0, 0, 0);

        this.add(directionalLight);
    }

    //@ts-ignore
    update(time?: TimeS, delta?: TimeMS): void {
        
    }

    destroy(): void {
        
    }
}