
import * as THREE from "three";
import { SUBTRACTION, Brush, Evaluator } from 'three-bvh-csg';

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
import { VegSection2 } from "./VegSection2";
import { VegSection3 } from "./VegSection3";
import { IceCreamSection } from "./IceCreamSection";
import { SectionE } from "./SectionE";
import { fridgeSection } from "./fridgeSection";
import { Fountain } from "./Fountain";
import { ShoppingCart } from "./ShoppingCart";
import { VendingMachine } from "./VendingMachine";
import { RecordPlayer } from "./RecordPlayer";

import { Roomba } from "./Roomba";
import { NPCs } from "./NPCs/NPCs";


export class Store extends Construct {
    ceiling!:any;

    walls!: Array<THREE.Mesh>;
    wallTexture!: THREE.MeshStandardMaterial;

    storeDimensions: Array<number> = [160, 25, 160];
    floor!: any;
    floorTexture!: THREE.MeshStandardMaterial;
    textureFloorData!:any;
    displacementTexture!:any

    // CSG Stuff
    csgEvaluator: Evaluator = new Evaluator();

    //Store sections
    sections: Array<Section> = [];
    shopItems: Array<Shelf> | Array<Box> = [];
    shopPickupSpots: Array<PickupSpot> = [];

    //Game loop stuff
    player!: Player;
    agents: Array<Roomba> = [];
    checkpoints: Array<number []> = [[65, 65], [65, -65], [-65, -65], [-65, 65]];

    npcs!: NPCs;

    // Store decoration constructs
    cashierCounter!: CashierCounter
    fountain!: Fountain
    vending1! : VendingMachine
    vending2! : VendingMachine
    cart!: ShoppingCart
    cart2!: ShoppingCart
    cart3!: ShoppingCart
    recordPlayer!:RecordPlayer

    storeLightData!: any;
    tempStoreLight!: any;
    storeLights: Array<any> = [];

    storeDoorData!: any;
    storeDoor!: THREE.Mesh;

    storeWindowData!: THREE.Mesh;
    storeWindows!: Array<THREE.Mesh>; 

    //Camera easier models
    cameras: THREE.Group[] = []; 

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, player: Player) {
        super(graphics, physics, interactions, userInterface);

        this.player = player;

        this.cashierCounter = new CashierCounter(graphics, physics, interactions, userInterface);
        this.addConstruct(this.cashierCounter);

        this.fountain = new Fountain(graphics, physics, interactions, userInterface);
        this.addConstruct(this.fountain);

        this.vending1 = new VendingMachine(graphics, physics, interactions, userInterface);
        this.addConstruct(this.vending1);

        this.vending2 = new VendingMachine(graphics, physics, interactions, userInterface);
        this.addConstruct(this.vending2);

        this.recordPlayer = new RecordPlayer(graphics, physics, interactions, userInterface);
        this.addConstruct(this.recordPlayer);



        this.cart = new ShoppingCart(graphics, physics, interactions, userInterface);
        this.addConstruct(this.cart);
        this.cart2 = new ShoppingCart(graphics, physics, interactions, userInterface);
        this.addConstruct(this.cart2);
        this.cart3 = new ShoppingCart(graphics, physics, interactions, userInterface);
        this.addConstruct(this.cart3);

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

        const sectionA = new SectionA(graphics, physics, interactions, userInterface);
        this.sections.push(sectionA);
        this.addConstruct(sectionA);

        const vegSection2 = new VegSection2(graphics, physics, interactions, userInterface);
        this.sections.push(vegSection2);
        this.addConstruct(vegSection2);

        const vegSection3 = new VegSection3(graphics, physics, interactions, userInterface);
        this.sections.push(vegSection3);
        this.addConstruct(vegSection3);

        const iceCreamSection = new IceCreamSection(graphics, physics, interactions, userInterface);
        this.sections.push(iceCreamSection);
        this.addConstruct(iceCreamSection);

        const sectionE = new SectionE(graphics, physics, interactions, userInterface);
        this.sections.push(sectionE);
        this.addConstruct(sectionE);

        const fridge_section1 = new fridgeSection(graphics, physics, interactions, userInterface);
        this.sections.push(fridge_section1);
        this.addConstruct(fridge_section1);
        // ------------------------------

        // --- Add Roomba ---
        for (let i = 0; i < 1; i++){
            const agentCheckpoints: Array<number []> = []
            for (let j = 0; j < this.checkpoints.length; j++){
                agentCheckpoints.push(this.checkpoints[(i + 1 + j) % this.checkpoints.length]);
            } 

            const agent = new Roomba(graphics, physics, interactions, userInterface, 1, agentCheckpoints);
            this.agents.push(agent);
            this.addConstruct(agent);
        }
        // -----------------

        // --- Add NPC ---
        this.npcs = new NPCs(graphics, physics, interactions, userInterface);
        this.addConstruct(this.npcs);
        // ---------------
    }
  

    create(): void {    
        // Place Player
        this.player.root.position.set(50, 15, 35);

        // Place Cashier Counter
        this.cashierCounter.root.position.set(50, 1.5, 40);
        this.cashierCounter.root.scale.setScalar(1.3);

        // Place Fountain
        this.fountain.root.position.set(-15, 0, 3); 

        // Place Carts
        this.cart.root.position.set(60, 0, 70); 
        this.cart.root.rotation.set(0, Math.PI/2, 0); 

        this.cart2.root.position.set(55, 0, 70); 
        this.cart2.root.rotation.set(0, Math.PI/2, 0); 

        this.cart3.root.position.set(50, 0, 70); 
        this.cart3.root.rotation.set(0, Math.PI/2, 0); 

        //Place Vending Machine
        this.vending1.root.position.set(10, 0, 77);
        this.vending2.root.position.set(20, 0, 77);  
        
        // --- Place Record Player ---
        this.recordPlayer.root.position.set(77.5, 0.3, 40);
        this.recordPlayer.root.rotation.y = -Math.PI/2;
        this.recordPlayer.root.scale.setScalar(0.65);


        // --- Place Sections ---
        const sectionsPositions = [
            [0, 0, -30], [30, 0, -27],[-25, 0, 30], [0, 0, 30], [30, 0, 27],
            [-77, 0, 0],[-25, 0, -30],[60, 0, -27],[50, 0, -96],[-10, 0, -96],
            [-50, 0, 30],[-76.5, 0, -15]];
        
        for (let i = 0; i < this.sections.length; i++){
            const position = sectionsPositions[i];
            this.sections[i].root.position.set(position[0], position[1], position[2]);
        }
        // -------------------------

        // --- Place Agents ---
        for (let i = 0; i < this.agents.length; i++){
            const startPosition = this.checkpoints[i];
            this.agents[i].root.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2 + i * (Math.PI / 2));
            this.agents[i].root.position.set(startPosition[0], 0, startPosition[1]);
        }
        // --------------------

        // --- Place NPCs ---
        this.npcs.root.position.set(0, 0, 0);
        // ------------------
         // Positions for security cameras
         const cameraPositions = [
            new THREE.Vector3(70, 20, 70),
            new THREE.Vector3(-70, 20, 70),
            new THREE.Vector3(-70, 20, -70),
            new THREE.Vector3(70, 20, -70)
        ];

        cameraPositions.forEach((position) => {
            const cameraGroup = new THREE.Group();
        
            // Camera body (cylinder) - light gray
            const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
            const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xd3d3d3 }); // Light gray
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.rotation.z = Math.PI / 2; // Rotate the body
        
            // Outline for the body (darker gray)
            const outlineBodyMaterial = new THREE.MeshBasicMaterial({ color: 0x303030 }); // Darker gray for the outline
            const outlineBody = new THREE.Mesh(bodyGeometry, outlineBodyMaterial);
            outlineBody.rotation.z = Math.PI / 2; // Rotate the outline
            outlineBody.scale.set(1.05, 1.05, 1.05); // Scale up slightly for the outline
            cameraGroup.add(outlineBody); // Add outline before the body
        
            // Camera lens (cone)
            const lensGeometry = new THREE.ConeGeometry(0.3, 0.7, 32);
            const lensMaterial = new THREE.MeshBasicMaterial({ color: 0x5f5f5f }); // Medium gray
            const lens = new THREE.Mesh(lensGeometry, lensMaterial);
            lens.position.set(1.3, 0, 0); // Position in front of the body
            lens.rotation.z = Math.PI / 2; // Rotate the lens
            lens.rotation.x = Math.PI; // Rotate the lens to face the origin if needed
        
            // Outline for the lens (darker gray)
            const outlineLensMaterial = new THREE.MeshBasicMaterial({ color: 0x4f4f4f }); // Slightly darker gray for the outline
            const outlineLens = new THREE.Mesh(lensGeometry, outlineLensMaterial);
            outlineLens.position.set(1.3, 0, 0);
            outlineLens.rotation.z = Math.PI / 2; // Rotate the outline
            outlineLens.rotation.x = Math.PI; // Rotate to match lens
            outlineLens.scale.set(1.05, 1.05, 1.05); // Scale up slightly for the outline
            cameraGroup.add(outlineLens); // Add outline before the lens
        
            // Assemble camera
            cameraGroup.add(body);
            cameraGroup.add(lens);
        
            // Position and orient camera towards the origin
            cameraGroup.position.copy(position);
            cameraGroup.lookAt(new THREE.Vector3(0, 0, 0));  // Makes the camera face the origin
        
            // Add to scene and cameras array
            this.cameras.push(cameraGroup);
            this.add(cameraGroup);  // or this.graphics.add(cameraGroup);
        });
    }

    async load(): Promise<void> {
        try {
            // Load textures
            const baseColorTexture = await this.graphics.loadTexture("assets/wall_interior/base_color.jpg") as THREE.Texture;
            const aoTexture = await this.graphics.loadTexture("assets/wall_interior/ambient_occlusion.jpg") as THREE.Texture;
            const heightTexture = await this.graphics.loadTexture("assets/wall_interior/height.png") as THREE.Texture;
            const normalTexture = await this.graphics.loadTexture("assets/wall_interior/normal.jpg") as THREE.Texture;
            const roughnessTexture = await this.graphics.loadTexture("assets/wall_interior/roughness.jpg") as THREE.Texture;

            // Set texture properties (e.g., wrapping, repeat)
            const textureRepeat = 8; // Adjust repeat value based on wall dimensions and texture appearance
            
            // Base color texture properties
            baseColorTexture.wrapS = baseColorTexture.wrapT = THREE.RepeatWrapping;
            baseColorTexture.repeat.set(textureRepeat, 2);
            baseColorTexture.anisotropy = 16;

            // Ambient occlusion texture properties
            aoTexture.wrapS = aoTexture.wrapT = THREE.RepeatWrapping;
            aoTexture.repeat.set(textureRepeat, 2);

            // Height map properties
            heightTexture.wrapS = heightTexture.wrapT = THREE.RepeatWrapping;
            heightTexture.repeat.set(textureRepeat, 2);

            // Normal map properties
            normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
            normalTexture.repeat.set(textureRepeat, 2);

            // Roughness map properties
            roughnessTexture.wrapS = roughnessTexture.wrapT = THREE.RepeatWrapping;
            roughnessTexture.repeat.set(textureRepeat, 2);

            // Create wall material
            this.wallTexture = new THREE.MeshStandardMaterial({
                map: baseColorTexture,
                aoMap: aoTexture,
                displacementMap: heightTexture,
                normalMap: normalTexture,
                roughnessMap: roughnessTexture,
                side: THREE.DoubleSide,
                displacementScale: 0.3 // Adjust for desired height effect
            });

        } catch (error) {
            console.error("[!] Error: Failed to load wall textures", error);
        }

        try {
            // Load Diffuse Texture
            this.textureFloorData = await this.graphics.loadTexture("assets/floor_image/floor_tiles_06_diff_2k.jpg") as THREE.Texture;
        
            // Load Displacement Texture
            this.displacementTexture = await this.graphics.loadTexture("assets/floor_image/floor_tiles_06_disp_2k.png") as THREE.Texture;
        
            // Create Normal Map
            const normalMapTexture = new THREE.Texture(); // Initialize an empty normal map
        
            // If the diffuse texture is loaded properly
            if (this.textureFloorData !== undefined) {
                // Set texture properties for diffuse
                this.textureFloorData.wrapS = this.textureFloorData.wrapT = THREE.RepeatWrapping;
                this.textureFloorData.repeat.set(50, 50);
                this.textureFloorData.anisotropy = 16;
        
                // Set displacement map properties
                this.displacementTexture.wrapS = this.displacementTexture.wrapT = THREE.RepeatWrapping;
                this.displacementTexture.repeat.set(50, 50);
                
                // Optional: Define your own normal map manually here
                // You can generate it procedurally, load from a file, or use a default map.
                normalMapTexture.wrapS = normalMapTexture.wrapT = THREE.RepeatWrapping;
                normalMapTexture.repeat.set(50, 50);
        
                
            }
        }
        catch (error) {
            console.error("[!] Error: Failed To Load Floor Texture");
        }

        // Load Store Window Model
        try {
            const gltfData: any = await this.graphics.loadModel("assets/store_window/store_window.gltf");
            this.storeWindowData = gltfData.scene;
        }
        catch (error) {
            console.error("[!] Error: Failed To Load Store Window Model");
        }

        // Load Store Door Model
        try {
            const gltfData: any = await this.graphics.loadModel("assets/store_door/store_door.gltf");
            this.storeDoorData = gltfData.scene;
        }
        catch (error) {
            console.error("[!] Error: Failed To Load Store Door Model");
        }

        // Load Store Light Model
        try {
            this.storeLightData = await this.graphics.loadModel("assets/store_light/store_light.gltf");
            this.tempStoreLight = this.storeLightData.scene;
        }
        catch (error) {
            console.error(`[!] Error: ${error}`);
        }
    }

    build(): void {
        // --- Build Store Door ---
        this.storeDoor = this.storeDoorData.clone();
        this.storeDoor.scale.setScalar(2.7);
        this.storeDoor.position.set(this.storeDimensions[0] / 2, 9.5, 0);
        this.storeDoor.rotateY(Math.PI);
        this.add(this.storeDoor);

        const storeDoorBrush = new Brush(new THREE.BoxGeometry(42, 22, 1));
        storeDoorBrush.position.set(0, -2, 0);
        storeDoorBrush.updateMatrixWorld();

        // ------------------------

        // --- Build Store Window ---
        const storeWindowsData: Array<any> = [];
        for (let i = 0; i < 8; i++){
            const storeWindow = this.storeWindowData.clone();
            storeWindow.scale.setScalar(2.5);

            const storeWindowBrush = new Brush(new THREE.BoxGeometry(12, 15, 1));
            storeWindowsData.push([storeWindow, storeWindowBrush]);
        }

        ///////////////////////////
        /////// Build Walls ///////
        ///////////////////////////
        // --- Front Wall ---
        const frontWallGeometry = new THREE.BoxGeometry(this.storeDimensions[0], this.storeDimensions[1], 1);
        let frontWall = new Brush(frontWallGeometry, this.wallTexture);
        frontWall.updateMatrixWorld();
        
        frontWall = this.csgEvaluator.evaluate( frontWall, storeDoorBrush, SUBTRACTION );

        for (let i = 0; i < 2; i++){
            const [_, storeWindowBrush] = storeWindowsData[i];
            
            storeWindowBrush.position.set(-50 * (2 * i - 1), -4, 0);
            storeWindowBrush.updateMatrixWorld();

            frontWall = this.csgEvaluator.evaluate(frontWall, storeWindowBrush, SUBTRACTION); 
        }
        
        for (let i = 0; i < 2; i++){
            const [storeWindow, _] = storeWindowsData[i];
            storeWindow.position.set(-50 * (2 * i - 1), -4.6, 0);
            frontWall.add(storeWindow);
        }

        frontWall.rotation.set(0, Math.PI / 2, 0);
        frontWall.position.set(this.storeDimensions[0] / 2, this.storeDimensions[1] / 2, 0);
        this.physics.addStatic(frontWall, PhysicsColliderFactory.box(this.storeDimensions[0] / 2, this.storeDimensions[1], 1));
        this.add(frontWall);
        // ------------------

        // --- Back Wall ---
        const backWallGeometry = new THREE.BoxGeometry(this.storeDimensions[0], this.storeDimensions[1], 1);
        let backWall = new Brush(backWallGeometry, this.wallTexture);
        backWall.updateMatrixWorld();
    
        for (let i = 0; i < 2; i++){
            const [_, storeWindowBrush] = storeWindowsData[i + 2];
            
            storeWindowBrush.position.set(-50 * (2 * i - 1), -4, 0);
            storeWindowBrush.updateMatrixWorld();

            backWall = this.csgEvaluator.evaluate(backWall, storeWindowBrush, SUBTRACTION); 
        }
        
        for (let i = 0; i < 2; i++){
            const [storeWindow, _] = storeWindowsData[i + 2];
            storeWindow.position.set(-50 * (2 * i - 1), -4.5, 0);
            backWall.add(storeWindow);
        }

        backWall.rotation.set(0, Math.PI / 2, 0);
        backWall.position.set(-this.storeDimensions[0] / 2, this.storeDimensions[1] / 2, 0);
        this.physics.addStatic(backWall, PhysicsColliderFactory.box(this.storeDimensions[0] / 2, this.storeDimensions[1], 1));
        this.add(backWall);
        // ------------------

        // --- Left Wall ---
        const leftWallGeometry = new THREE.BoxGeometry(this.storeDimensions[0], this.storeDimensions[1], 1);
        let leftWall = new Brush(leftWallGeometry, this.wallTexture);
        leftWall.updateMatrixWorld();
    
        for (let i = 0; i < 2; i++){
            const [_, storeWindowBrush] = storeWindowsData[i + 2];
            
            storeWindowBrush.position.set(-50 * (2 * i - 1), -4, 0);
            storeWindowBrush.updateMatrixWorld();

            leftWall = this.csgEvaluator.evaluate(leftWall, storeWindowBrush, SUBTRACTION); 
        }
        
        for (let i = 0; i < 2; i++){
            const [storeWindow, _] = storeWindowsData[i + 4];
            storeWindow.position.set(-50 * (2 * i - 1), -4.5, 0);
            leftWall.add(storeWindow);
        }

        leftWall.rotation.set(0, 0, 0);
        leftWall.position.set(0, this.storeDimensions[1] / 2, this.storeDimensions[0] / 2);
        this.physics.addStatic(leftWall, PhysicsColliderFactory.box(this.storeDimensions[0] / 2, this.storeDimensions[1], 1));
        this.add(leftWall);
        // -----------------

        // --- Right Wall ---
        const rightWallGeometry = new THREE.BoxGeometry(this.storeDimensions[0], this.storeDimensions[1], 1);
        let rightWall = new Brush(rightWallGeometry, this.wallTexture);
        rightWall.updateMatrixWorld();
    
        for (let i = 0; i < 2; i++){
            const [_, storeWindowBrush] = storeWindowsData[i + 2];
            
            storeWindowBrush.position.set(-50 * (2 * i - 1), -4, 0);
            storeWindowBrush.updateMatrixWorld();

            rightWall = this.csgEvaluator.evaluate(rightWall, storeWindowBrush, SUBTRACTION); 
        }
        
        for (let i = 0; i < 2; i++){
            const [storeWindow, _] = storeWindowsData[i + 6];
            storeWindow.position.set(-50 * (2 * i - 1), -4.5, 0);
            rightWall.add(storeWindow);
        }

        rightWall.rotation.set(0, 0, 0);
        rightWall.position.set(0, this.storeDimensions[1] / 2, -this.storeDimensions[0] / 2);
        this.physics.addStatic(rightWall, PhysicsColliderFactory.box(this.storeDimensions[0] / 2, this.storeDimensions[1], 1));
        this.add(rightWall);
        // ------------------

        // --- Build floor ---
        const floorGeometry = new THREE.PlaneGeometry(this.storeDimensions[0], this.storeDimensions[2]);

        // Create material using both displacement and diffuse textures
        this.floorTexture = new THREE.MeshStandardMaterial({
            map: this.textureFloorData,                // Diffuse map
            displacementMap: this.displacementTexture, // Displacement map
            displacementScale: 0.1,                    // Adjust based on desired effect
            side: THREE.DoubleSide,
            roughness: 0.2,                            // Control material roughness
            metalness: 0.1,                            // Slight metallic sheen
        });

        const floor = new THREE.Mesh(floorGeometry, this.floorTexture);

        floor.position.set(0, 0, 0);
        floor.rotation.set(Math.PI/2,0,0);
        floor.receiveShadow = true;

        this.physics.addStatic(floor, PhysicsColliderFactory.box(this.storeDimensions[0]/2, this.storeDimensions[2]/2, 1));
        this.add(floor);
        // ------------------


        // --- Build ceiling ---
        const ceilingGeometry = new THREE.PlaneGeometry(this.storeDimensions[0], this.storeDimensions[2]);
        const ceilingTexture = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingTexture);
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
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                
                // Clone the light model
                const storeLight = this.tempStoreLight.clone();
                storeLight.position.set(50 - 2 * 25 * i, 22, 50 - 2 * 25 * j);

                // Create a point light at this position
                const light = new THREE.PointLight(0xffffee, 3, 45, 0.05);
                light.position.set(50 - 2 * 25 * i, 20, 50 - 2 * 25 * j);
                light.castShadow = true;

                // Add the light and store light model to the scene
                this.add(light);
                this.add(storeLight);
            }
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        ambientLight.position.set(0, 0, 0);
        this.add(ambientLight);
        // ---------------------

    }


    // Update method to check player interactions with shop items and pickup spots
    //@ts-ignore
    update(time?: TimeS, delta?: TimeMS): void {
        // Check if the player is looking at any of the shop items (shelves or boxes)
        this.player.checkLookingAtGroceryItem(this.shopItems);
        // Check if the player is looking at any of the pickup spots
        this.player.checkLookingAtPickupSpot(this.shopPickupSpots);
    }

    // Destroy method (currently a placeholder, used for cleanup)
    destroy(): void {}
}