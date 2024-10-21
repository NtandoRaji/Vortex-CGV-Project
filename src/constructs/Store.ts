
import * as THREE from "three"; 
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { TimeS, TimeMS } from "../lib/w3ads/types/misc.type";


import { CashierCounter } from "./CashierCounter";
import { Player } from "./Player";
import { SectionB } from "./SectionB";
import { SectionC } from "./SectionC";
import { SectionD } from "./SectionD";
import { Shelf } from "./Shelf";
import { PickupSpot } from "./PickupSpot";
import { FruitsSection } from "./FruitsSection";
import { VegSection } from "./VegSection";
import { Box } from "./Box";
import { Section } from "./Section";
import { FrozenFoodSection } from "./FrozenFoodSection";
import { SectionA } from "./SectionA";



export class Store extends Construct {
    ceiling!:any;
    ceilingTexture!: THREE.MeshLambertMaterial;

    walls!: Array<THREE.Mesh>;
    wallTexture!: THREE.MeshStandardMaterial;

    storeLightData!: any;
    tempStoreLight!: any;
    storeLights: Array<any> = [];

    storeDimensions: Array<number> = [160, 20, 160];
    floor!: any;
    floorTexture!: THREE.MeshLambertMaterial;
    textureFloorData!:any;

    //Store sections
    sections: Array<Section> = [];
    shopItems: Array<Shelf> | Array<Box> = [];
    shopPickupSpots: Array<PickupSpot> = [];

    //Game loop stuff
    player!: Player;

    // Store decoration constructs
    cashierCounter!: CashierCounter

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, player: Player) {
        super(graphics, physics, interactions, userInterface);

        this.player = player;

        this.cashierCounter = new CashierCounter(graphics, physics, interactions, userInterface);
        this.addConstruct(this.cashierCounter);

        // Add Sections
        // TODO: Add more sections
        const sectionC = new SectionC(graphics, physics, interactions, userInterface);
        this.sections.push(sectionC);
        this.addConstruct(sectionC);

        const fruitSection = new FruitsSection(graphics, physics, interactions, userInterface);
        this.sections.push(fruitSection);
        this.addConstruct(fruitSection);

        const sectionD = new SectionD(graphics, physics, interactions, userInterface);
        this.sections.push(sectionD);
        this.addConstruct(sectionD);

        const sectionB = new SectionB(graphics, physics, interactions, userInterface);
        this.sections.push(sectionB);
        this.addConstruct(sectionB);

        const vegSection = new VegSection(graphics, physics, interactions, userInterface);
        this.sections.push(vegSection);
        this.addConstruct(vegSection);

        const frozenFoodSection = new FrozenFoodSection(graphics, physics, interactions, userInterface);
        this.sections.push(frozenFoodSection);
        this.addConstruct(frozenFoodSection);

        // const sectionA = new SectionA(graphics, physics, interactions, userInterface);
        // this.sections.push(sectionA);
        // this.addConstruct(sectionA);
    }

    create(): void {    
        // Place Player
        this.player.root.position.set(50, 10, 35);

        // Place Cashier Counter
        this.cashierCounter.root.position.set(50, 1.5, 40);
        this.cashierCounter.root.scale.setScalar(1.3);

        // --- Place Sections ---
        // TODO: Position new sections
        const sectionsPositions = [[0, 0, -30], [30, 0, -27 , -30],[-40, 0, 30], [0, 0 ,  30], [30, 0, 27 , -30],[-73, 0, 0 , -60]];
        for (let i = 0; i < this.sections.length; i++){
            const position = sectionsPositions[i];
            this.sections[i].root.position.set(position[0], position[1], position[2]);
        }
        // -------------------------
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

        try {
            this.storeLightData = await this.graphics.loadModel("assets/store_light/store_light.gltf");
            this.tempStoreLight = this.storeLightData.scene;
        }
        catch (error) {
            console.error(`[!] Error: ${error}`);
        }
    }

    build(): void {
        // --- Build walls ---
        const wallPositions = [
            [-this.storeDimensions[0] / 2, this.storeDimensions[1] / 2, 0], 
            [0, this.storeDimensions[1] / 2, -this.storeDimensions[2] / 2], 
            [this.storeDimensions[0] / 2, this.storeDimensions[1] / 2, 0], 
            [0, this.storeDimensions[1] / 2, this.storeDimensions[2] / 2]
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

        // --- Get Section Items & Pickup Spots ---
        for (let i = 0; i < this.sections.length; i++){
            this.shopItems.push(...this.sections[i].getItems());
            this.shopPickupSpots.push(...this.sections[i].getPickupSpots());
        }
        // ----------------------------------------

        // --- Setup Lighting ---
        for (let i = 0; i < 4; i++){
            for (let j = 0; j < 4; j++){
                const storeLight = this.tempStoreLight.clone();
                storeLight.position.set(50 - 2 * 15 * i, 18, 50 - 2 * 15 * j);

                const light = new THREE.PointLight(0xffffee, 5, 30, 0.1);
                light.position.set(50 - 2 * 15 * i, 20, 50 - 2 * 15 * j);
                light.castShadow = true;

                this.add(light);
                this.add(storeLight);
            }
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        ambientLight.position.set(0, 0, 0);
        this.add(ambientLight);
        // ---------------------
    }

    // Update method to check player interactions with shop items and pickup spots
    update(time?: TimeS, delta?: TimeMS): void {
        // Check if the player is looking at any of the shop items (shelves or boxes)
        this.player.checkLookingAtGroceryItem(this.shopItems);
        // Check if the player is looking at any of the pickup spots
        this.player.checkLookingAtPickupSpot(this.shopPickupSpots);
    }

    // Destroy method (currently a placeholder, used for cleanup)
    destroy(): void {}
}