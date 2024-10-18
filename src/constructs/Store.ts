
import * as THREE from "three"; 
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../lib/w3ads/types/misc.type";


import { CashierCounter } from "./CashierCounter";
import { Player } from "./Player";
import { SectionC } from "./sectionC";


export class Store extends Construct {
    ceiling!:any;
    ceilingTexture!: THREE.MeshLambertMaterial;

    walls!: Array<THREE.Mesh>;
    wallTexture!: THREE.MeshStandardMaterial;

    storeDimensions: Array<number> = [100, 20, 100];
    floor!: any;
    floorTexture!: THREE.MeshLambertMaterial;
    textureFloorData!:any;

    //Game loop stuff
    player!: Player;

    // Store decoration constructs
    cashierCounter!: CashierCounter

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, player: Player) {
        super(graphics, physics, interactions, userInterface);

        this.player = player;

        this.cashierCounter = new CashierCounter(graphics, physics, interactions, userInterface);
        this.addConstruct(this.cashierCounter);

        const sectionC = new SectionC(graphics, physics, interactions, userInterface);
        this.addConstruct(sectionC);
    }

    create(): void {    
        // Place Player
        this.player.root.position.set(40, 10, 35);

        // Place Cashier Counter
        this.cashierCounter.root.position.set(40, 1.5, 40);
    }

    async load(): Promise<void> {
        try {
            // Load Floor Texture Data
            this.textureFloorData = await this.graphics.loadTexture("assets/floor_image/floor_image.jpg");
            if (this.textureFloorData !== undefined) {
                this.textureFloorData.wrapS = this.textureFloorData.wrapT = THREE.RepeatWrapping;
                this.textureFloorData.repeat.set(50, 50);
                this.textureFloorData.anisotropy = 16;
            }
        }
        catch (error) {
            console.error(`[!] Error: ${error}`);
        }
    }

    build(): void {
        // --- Build walls ---
        const wallPositions = [
            [-this.storeDimensions[0] / 2, 10, 0], [0, 10, -this.storeDimensions[2] / 2], 
            [this.storeDimensions[0] / 2, 10, 0], [0, 10, this.storeDimensions[2] / 2]
        ];
        const wallRotations = [
            [0, Math.PI/2, 0], [0, 0, 0], [0, Math.PI/2, 0], [0, 0, 0]
        ];

        this.walls = [];
        for (let i = 0; i < wallPositions.length; i++){
            const wallGeometry = new THREE.PlaneGeometry(this.storeDimensions[0], this.storeDimensions[1]);
            this.wallTexture = new THREE.MeshStandardMaterial({ color:  i % 2 != 0? 0x08a4ec : 0xffffff, side: THREE.DoubleSide });
            const wall = new THREE.Mesh(wallGeometry, this.wallTexture);

            wall.position.set(wallPositions[i][0], wallPositions[i][1], wallPositions[i][2]);
            wall.rotation.set(wallRotations[i][0], wallRotations[i][1], wallRotations[i][2]);

            wall.receiveShadow = true;
            this.walls.push(wall);

            this.physics.addStatic(wall, PhysicsColliderFactory.box(this.storeDimensions[0] / 2, this.storeDimensions[1], 1));
            this.add(wall);

            this.graphics.add(wall);
        }
        // -----------------

        // --- Build floor ---
        const floorGeometry = new THREE.PlaneGeometry(this.storeDimensions[0], this.storeDimensions[2]);
        this.floorTexture = new THREE.MeshLambertMaterial( { map: this.textureFloorData, side: THREE.DoubleSide } );
        const floor = new THREE.Mesh(floorGeometry, this.floorTexture)

        floor.position.set(0, 0, 0);
        floor.rotation.set(Math.PI/2,0,0);
        floor.receiveShadow = true;
        
        this.physics.addStatic(floor, PhysicsColliderFactory.box(this.storeDimensions[0]/2, this.storeDimensions[2]/2, 1));
        this.add(floor);
        // ------------------

        // --- Build ceiling ---
        const ceilingGeometry = new THREE.PlaneGeometry(this.storeDimensions[0], this.storeDimensions[2]);
        this.ceilingTexture = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        
        const ceiling = new THREE.Mesh(ceilingGeometry, this.ceilingTexture);
        ceiling.position.set(0, this.storeDimensions[1], 0);
        ceiling.rotation.set(Math.PI/2,0,0);
        ceiling.receiveShadow = true;

        this.physics.addStatic(ceiling, PhysicsColliderFactory.box(this.storeDimensions[0]/2, this.storeDimensions[2]/2, 1));
        this.add(ceiling);
        // ---------------------

        const light = new THREE.PointLight(0xffffff, 1, 100, 0);
        light.position.set(20, 20, 5);
        this.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        ambientLight.position.set(0, 5, 0);
        this.add(ambientLight);
    }

    update(time?: TimeS, delta?: TimeMS): void {}

    destroy(): void {}
}