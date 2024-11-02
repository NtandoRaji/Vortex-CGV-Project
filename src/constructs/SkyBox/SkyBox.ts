import * as THREE from "three";
import { Sky } from 'three/addons/objects/Sky.js';

import { Construct, GraphicsContext, PhysicsContext } from "../../lib";
import { InteractManager } from "../../lib/w3ads/InteractManager";
import { InterfaceContext } from "../../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../../lib/w3ads/types/misc.type";
import { ParkingLot } from "./ParkingLot";
import { Mountains } from "./Mountains";


export class SkyBox extends Construct {
    parkingLot!: ParkingLot;
    mountains!: Mountains;

    sky!: Sky;
    sun!: THREE.Vector3;
    effectController!: any;
    levelConfig!: {
        level: string,
        nextLevel: string,
        levelTime: number,
        memorizationTime: number,
        amountOfItemsToFind: number,
        lives: number
    }    

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext,
        levelConfig: { level: string, nextLevel: string, levelTime: number, memorizationTime: number, amountOfItemsToFind: number, lives: number}
    ) {
        super(graphics, physics, interactions, userInterface)
        
        this.levelConfig = levelConfig;

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
        this.mountains.root.position.set(0, -5, 0);
        // -----------------------------
    }

    initializeSky(): void {
        const uniforms = this.sky.material.uniforms;

        uniforms[ 'turbidity' ].value = this.effectController.turbidity;
        uniforms[ 'rayleigh' ].value = this.effectController.rayleigh;
        uniforms[ 'mieCoefficient' ].value = this.effectController.mieCoefficient;
        uniforms[ 'mieDirectionalG' ].value = this.effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad( 90 - this.effectController.elevation );
        const theta = THREE.MathUtils.degToRad( this.effectController.azimuth );

        this.sun.setFromSphericalCoords( 1, phi, theta );

        uniforms[ 'sunPosition' ].value.copy( this.sun );

        this.graphics.renderer.toneMappingExposure = this.effectController.exposure;
        
    }

    async load(): Promise<void> {
        
    }

    build(): void {
        // --- Build Sky Box ---
        // --- Build Sky ---
        this.sky = new Sky();
        this.sky.scale.setScalar( 4500 );
        this.add( this.sky );

        // --- Build Sun ---
        this.sun = new THREE.Vector3();

        // --- Initials effectController  ---
        this.effectController = {
            turbidity: this.levelConfig.level != "level-2" ? 5 : 0,
            rayleigh: this.levelConfig.level != "level-2" ? 3 : 0.017,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.7,
            elevation: this.levelConfig.level != "level-2" ? 10 : 0,
            azimuth: 180,
            exposure: this.graphics.renderer.toneMappingExposure
        };

        // --- Initialize Sky ---
        this.initializeSky();
        // ------------------------------------------
    }

    //@ts-ignore
    update(time: TimeS, delta?: TimeMS): void {
        // Updates the sun's position
        this.effectController.elevation = (time / 15) % 10;
        const phi = THREE.MathUtils.degToRad( 90 - this.effectController.elevation );
        const theta = THREE.MathUtils.degToRad( 10 * time );
        this.sun.setFromSphericalCoords( 1, phi, theta );
        
        // Update the sun position of the sky shader
        this.sky.material.uniforms[ 'sunPosition' ].value.copy( this.sun );
    }

    destroy(): void {
        
    }
}