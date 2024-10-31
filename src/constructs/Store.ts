
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
    ceilingTexture!: THREE.ShaderMaterial;

    walls!: Array<THREE.Mesh>;
    wallTexture!: THREE.MeshStandardMaterial;

    storeLightData!: any;
    tempStoreLight!: any;
    storeLights: Array<any> = [];

    storeDimensions: Array<number> = [160, 20, 160];
    floor!: any;
    floorTexture!: THREE.MeshStandardMaterial;
    textureFloorData!:any;
    displacementTexture!:any

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
        this.player.root.position.set(50, 10, 35);

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
        
        this.recordPlayer.root.position.set(78.5, 0.3, 40);
        this.recordPlayer.root.rotation.y = -Math.PI/2;
        this.recordPlayer.root.scale.setScalar(0.81);


        // --- Place Sections ---
        // TODO: Position new sections
        const sectionsPositions = [[0, 0, -30], [30, 0, -27 , -30],[-25, 0, 30], [0, 0 ,  30], [30, 0, 27 , -30],[-78, 0, 0 , -60],[-25, 0 ,  -30],[60, 0, -27 , -30],[50, 0, -97, -30],[-10, 0, -97, -30],[-50, 0 ,  30],[-78, 0 ,-15]];
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

            // Load textures for the sky and clouds
            const skyTexture = await this.graphics.loadTexture("assets/sky_box/sky.jpg");
            const cloudTexture = await this.graphics.loadTexture("assets/sky_box/cloud3.png");

        // Create shader material for blending white ceiling and animated clouds in the center
        this.ceilingTexture = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0.0 },
                uSkyTexture: { value: skyTexture },
                uCloudTexture: { value: cloudTexture },
                uBaseColor: { value: new THREE.Color(0x909090) }, // color for the base ceiling
                uCloudSpeed: { value: 0.01 },
                uCenterSize: { value: 0.15 }, // Adjust the size of the center area % of total ceiling
                uRimWidth: { value: 0.03 }, // Width of the black rim (adjust as needed)
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform sampler2D uSkyTexture;
                uniform sampler2D uCloudTexture;
                uniform vec3 uBaseColor;
                uniform float uCloudSpeed;
                uniform float uCenterSize;
                uniform float uRimWidth; // New uniform for the black rim width
                varying vec2 vUv;

                void main() {
                    // Calculate distance from the center
                    float centerDist = distance(vUv, vec2(0.5, 0.5));

                    // Set threshold to determine where the white ceiling starts
                    float threshold = uCenterSize;

                    // Use white base color for the outer region
                    vec4 baseColor = vec4(0.0, 0.0, 0.0, 1.0);

                    // Create a black color for the rim
                    vec4 rimColor = vec4(uBaseColor, 1.0);

                    // Display skybox animation in the center region
                    if (centerDist < threshold) {
                        vec2 cloudUv = vUv + vec2(uTime * uCloudSpeed, 0.0);
                        vec4 skyColor = texture2D(uSkyTexture, vUv);
                        vec4 cloudColor = texture2D(uCloudTexture, cloudUv);

                        // Blend sky and clouds in the center region
                        gl_FragColor = mix(skyColor, cloudColor, cloudColor.a);
                    } else {
                        // Check if within the black rim region
                        float rimStart = threshold;
                        float rimEnd = threshold + uRimWidth;
                        float rimFactor = smoothstep(rimStart, rimEnd, centerDist);

                        // Blend between the base color and the rim color
                        gl_FragColor = mix(baseColor, rimColor, rimFactor);
                    }
                }
            `,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
        });

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
        // --- Load Textures --- outside of the store
        const textureLoader = new THREE.TextureLoader();
        const texture1 = textureLoader.load('assets/outdoor_area/parking9.jpg'); // Update with actual paths
        const texture2 = textureLoader.load('assets/outdoor_area/parking10.jpg');
        const texture3 = textureLoader.load('assets/outdoor_area/wall.jpg');
    
        // --- Wall Positions and Rotations ---
        const wallPositions = [
            [-this.storeDimensions[0] / 2, this.storeDimensions[1] / 2, 0], 
            [0, this.storeDimensions[1] / 2, -this.storeDimensions[2] / 2], 
            [this.storeDimensions[0] / 2, this.storeDimensions[1] / 2, 0], 
            [0, this.storeDimensions[1] / 2, this.storeDimensions[2] / 2]
        ];
        const wallRotations = [
            [0, Math.PI / 2, 0], [0, 0, 0], [0, Math.PI / 2, 0], [0, 0, 0]
        ];
    
        // --- Create Walls with Segmented Textures ---
        this.walls = [];
        const wallTextures = [texture3, texture3]; // List of textures to cycle through
        const wallTextures2 = [texture1, texture3];
        const wallTextures3 = [texture1, texture1];
        const wallTextures4 = [texture2, texture3];

        const numSegments = 2; // Number of segments per wall
        const segmentWidth = this.storeDimensions[0] / numSegments; // Divide wall width into segments

        // wall 1
        for (let j = 0; j < numSegments; j++) {
            // Create geometry for each segment
            const wallGeometry = new THREE.PlaneGeometry(segmentWidth, this.storeDimensions[1]);

            // Select texture cyclically
            const wallMaterial = new THREE.MeshStandardMaterial({
                map: wallTextures[j % wallTextures.length],
                side: THREE.DoubleSide,
            });

            const wallSegment = new THREE.Mesh(wallGeometry, wallMaterial);

            // Calculate position offsets for each wall
            if (wallRotations[0][1] === Math.PI / 2 || wallRotations[0][1] === -Math.PI / 2) {
                // For walls perpendicular to the x-axis, offset along z-axis
                wallSegment.position.set(
                    wallPositions[0][0], // x remains constant for these walls
                    wallPositions[0][1], // y position (height of the wall)
                    wallPositions[0][2] + (j - (numSegments - 1) / 2) * segmentWidth // Adjust z position based on segment width
                );
            } else {
                // For walls perpendicular to the z-axis, offset along x-axis
                wallSegment.position.set(
                    wallPositions[0][0] + (j - (numSegments - 1) / 2) * segmentWidth, // Adjust x position based on segment width
                    wallPositions[0][1], // y position (height of the wall)
                    wallPositions[0][2] // z remains constant for these walls
                );
            }

            // Set the rotation of each segment
            wallSegment.rotation.set(wallRotations[0][0], wallRotations[0][1], wallRotations[0][2]);

            // Set shadow properties and add to the store
            wallSegment.receiveShadow = true;
            this.walls.push(wallSegment);

            // Add physics collider for each wall segment
            this.physics.addStatic(wallSegment, PhysicsColliderFactory.box(segmentWidth / 2, this.storeDimensions[1], 1));

            // Add each segment to the scene
            this.add(wallSegment);
            this.graphics.add(wallSegment);
        }

        // Wall 2 with glass finish on the first segment and regular texture on others
        for (let j = 0; j < numSegments; j++) {
            // Create geometry for each segment
            const wallGeometry = new THREE.PlaneGeometry(segmentWidth, this.storeDimensions[1]);

            // Apply a different material for the first segment (glass with grid) and regular texture for others
            let wallMaterial;
            if (j === 0) {
                // Glass material with semi-transparency and grid structure for the first segment
                wallMaterial = new THREE.MeshStandardMaterial({
                    map: wallTextures2[j % wallTextures2.length], // Glass texture
                    transparent: true,
                    opacity: 0.7, // Semi-transparency for glass effect
                    side: THREE.DoubleSide,
                });
            } else {
                // Regular texture for other segments
                wallMaterial = new THREE.MeshStandardMaterial({
                    map: wallTextures2[j % wallTextures2.length],
                    side: THREE.DoubleSide,
                });
            }

            const wallSegment = new THREE.Mesh(wallGeometry, wallMaterial);

            // Calculate position offsets for each wall
            if (wallRotations[1][1] === Math.PI / 2 || wallRotations[1][1] === -Math.PI / 2) {
                // For walls perpendicular to the x-axis, offset along z-axis
                wallSegment.position.set(
                    wallPositions[1][0],
                    wallPositions[1][1],
                    wallPositions[1][2] + (j - (numSegments - 1) / 2) * segmentWidth
                );
            } else {
                // For walls perpendicular to the z-axis, offset along x-axis
                wallSegment.position.set(
                    wallPositions[1][0] + (j - (numSegments - 1) / 2) * segmentWidth,
                    wallPositions[1][1],
                    wallPositions[1][2]
                );
            }

            // Set the rotation of each segment
            wallSegment.rotation.set(wallRotations[1][0], wallRotations[1][1], wallRotations[1][2]);

            // Set shadow properties and add to the store
            wallSegment.receiveShadow = true;
            this.walls.push(wallSegment);

            // Add physics collider for each wall segment
            this.physics.addStatic(wallSegment, PhysicsColliderFactory.box(segmentWidth / 2, this.storeDimensions[1], 1));

            // Add each segment to the scene
            this.add(wallSegment);
            this.graphics.add(wallSegment);

            // --- Only add grid lines for the first segment ---
            if (j === 0) {
                const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });

                // Vertical grid lines
                const verticalOffsets = [-segmentWidth / 3, 0, segmentWidth / 3];
                for (const offset of verticalOffsets) {
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(offset, -this.storeDimensions[1] / 2, 0.01),
                        new THREE.Vector3(offset, this.storeDimensions[1] / 2, 0.01)
                    ]);
                    const frameLine = new THREE.Line(lineGeometry, lineMaterial);
                    frameLine.position.copy(wallSegment.position);
                    frameLine.rotation.copy(wallSegment.rotation);
                    this.add(frameLine);
                    this.graphics.add(frameLine);
                }

                // Horizontal grid line (middle of the segment)
                const horizontalLineGeometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-segmentWidth / 2, 0, 0.01),
                    new THREE.Vector3(segmentWidth / 2, 0, 0.01)
                ]);
                const doorLine = new THREE.Line(horizontalLineGeometry, lineMaterial);
                doorLine.position.copy(wallSegment.position);
                doorLine.rotation.copy(wallSegment.rotation);
                this.add(doorLine);
                this.graphics.add(doorLine);
            }
        }


        // Wall 3: Glass Wall with Frames and Doors
        for (let j = 0; j < numSegments; j++) {
            // Create geometry for each glass segment
            const wallGeometry = new THREE.PlaneGeometry(segmentWidth, this.storeDimensions[1]);

            // Apply a transparent glass material with the glass texture
            const wallMaterial = new THREE.MeshStandardMaterial({
                map: wallTextures3[j % wallTextures3.length], // Use glass texture here
                transparent: true,
                opacity: 0.7, // Set semi-transparency for the glass effect
                side: THREE.DoubleSide,
            });

            const wallSegment = new THREE.Mesh(wallGeometry, wallMaterial);

            // Position the wall segment
            if (wallRotations[2][1] === Math.PI / 2 || wallRotations[2][1] === -Math.PI / 2) {
                wallSegment.position.set(
                    wallPositions[2][0],
                    wallPositions[2][1],
                    wallPositions[2][2] + (j - (numSegments - 1) / 2) * segmentWidth
                );
            } else {
                wallSegment.position.set(
                    wallPositions[2][0] + (j - (numSegments - 1) / 2) * segmentWidth,
                    wallPositions[2][1],
                    wallPositions[2][2]
                );
            }

            wallSegment.rotation.set(wallRotations[2][0], wallRotations[2][1], wallRotations[2][2]);
            wallSegment.receiveShadow = true;
            this.walls.push(wallSegment);
            this.physics.addStatic(wallSegment, PhysicsColliderFactory.box(segmentWidth / 2, this.storeDimensions[1], 1));
            this.add(wallSegment);
            this.graphics.add(wallSegment);

            // --- Add Frames and Door Lines using Lines ---
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }); // Black color for frames

            // Frame Lines: Vertical Dividers
            const verticalOffsets = [-segmentWidth / 3, 0, segmentWidth / 3]; // Left, Center, Right positions

            for (const offset of verticalOffsets) {
                const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(offset, -this.storeDimensions[1] / 2, 0.01), // bottom
                    new THREE.Vector3(offset, this.storeDimensions[1] / 2, 0.01)  // top
                ]);
                const frameLine = new THREE.Line(lineGeometry, lineMaterial);
                frameLine.position.copy(wallSegment.position);
                frameLine.rotation.copy(wallSegment.rotation);
                this.add(frameLine);
                this.graphics.add(frameLine);
            }

            // Frame Lines: Horizontal Divider for Door Panel
            const horizontalLineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-segmentWidth / 2, 0, 0.01), // left
                new THREE.Vector3(segmentWidth / 2, 0, 0.01)  // right
            ]);
            const doorLine = new THREE.Line(horizontalLineGeometry, lineMaterial);
            doorLine.position.copy(wallSegment.position);
            doorLine.rotation.copy(wallSegment.rotation);
            this.add(doorLine);
            this.graphics.add(doorLine);
        }

        // Wall 4 with glass finish on the first segment and regular texture on others
        for (let j = 0; j < numSegments; j++) {
            // Create geometry for each segment
            const wallGeometry = new THREE.PlaneGeometry(segmentWidth, this.storeDimensions[1]);

            // Apply different material for the first segment (glass with grid) and regular texture for others
            let wallMaterial;
            if (j === 0) {
                // Glass material with semi-transparency and grid structure for the first segment
                wallMaterial = new THREE.MeshStandardMaterial({
                    map: wallTextures4[j % wallTextures4.length], // Glass texture
                    transparent: true,
                    opacity: 0.7, // Semi-transparency for glass effect
                    side: THREE.DoubleSide,
                });
            } else {
                // Regular texture for other segments
                wallMaterial = new THREE.MeshStandardMaterial({
                    map: wallTextures4[j % wallTextures4.length],
                    side: THREE.DoubleSide,
                });
            }

            const wallSegment = new THREE.Mesh(wallGeometry, wallMaterial);

            // Calculate position offsets for each wall segment
            if (wallRotations[3][1] === Math.PI / 2 || wallRotations[3][1] === -Math.PI / 2) {
                // For walls perpendicular to the x-axis, offset along z-axis
                wallSegment.position.set(
                    wallPositions[3][0],
                    wallPositions[3][1],
                    wallPositions[3][2] + (j - (numSegments - 1) / 2) * segmentWidth
                );
            } else {
                // For walls perpendicular to the z-axis, offset along x-axis
                wallSegment.position.set(
                    wallPositions[3][0] + (j - (numSegments - 1) / 2) * segmentWidth,
                    wallPositions[3][1],
                    wallPositions[3][2]
                );
            }

            // Set the rotation of each segment
            wallSegment.rotation.set(wallRotations[3][0], wallRotations[3][1], wallRotations[3][2]);

            // Set shadow properties and add to the store
            wallSegment.receiveShadow = true;
            this.walls.push(wallSegment);

            // Add physics collider for each wall segment
            this.physics.addStatic(wallSegment, PhysicsColliderFactory.box(segmentWidth / 2, this.storeDimensions[1], 1));

            // Add each segment to the scene
            this.add(wallSegment);
            this.graphics.add(wallSegment);

            // --- Only add grid lines for the first segment ---
            if (j === 0) {
                const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });

                // Vertical grid lines
                const verticalOffsets = [-segmentWidth / 3, 0, segmentWidth / 3];
                for (const offset of verticalOffsets) {
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(offset, -this.storeDimensions[1] / 2, 0.01),
                        new THREE.Vector3(offset, this.storeDimensions[1] / 2, 0.01)
                    ]);
                    const frameLine = new THREE.Line(lineGeometry, lineMaterial);
                    frameLine.position.copy(wallSegment.position);
                    frameLine.rotation.copy(wallSegment.rotation);
                    this.add(frameLine);
                    this.graphics.add(frameLine);
                }

                // Horizontal grid line (middle of the segment)
                const horizontalLineGeometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-segmentWidth / 2, 0, 0.01),
                    new THREE.Vector3(segmentWidth / 2, 0, 0.01)
                ]);
                const doorLine = new THREE.Line(horizontalLineGeometry, lineMaterial);
                doorLine.position.copy(wallSegment.position);
                doorLine.rotation.copy(wallSegment.rotation);
                this.add(doorLine);
                this.graphics.add(doorLine);
            }
        }


        /////////////////////////////

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
        
        this.graphics.add(floor);
        // ------------------


        // --- Build combined ceiling with dynamic skybox ---
        const ceilingGeometry = new THREE.PlaneGeometry(this.storeDimensions[0], this.storeDimensions[2]);

        // Create combined ceiling mesh with animated shader material (Skybox + Base)
        this.ceiling = new THREE.Mesh(ceilingGeometry, this.ceilingTexture);
        this.ceiling.position.set(0, this.storeDimensions[1], 0);
        this.ceiling.rotation.set(Math.PI / 2, 0, 0);
        this.ceiling.receiveShadow = true;

        this.physics.addStatic(this.ceiling, PhysicsColliderFactory.box(this.storeDimensions[0] / 2, this.storeDimensions[2] / 2, 1));
        this.add(this.ceiling);
        this.graphics.add(this.ceiling);
        // -----------------

    
        // --- Add natural light from the sky (ceiling area) ---
        const naturalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Soft white light for natural effect
        naturalLight.position.set(0, this.storeDimensions[1] - 1, 0); // Position it slightly below the ceiling
        naturalLight.target.position.set(0, 0, 0); // Aim directly at the floor center

        // Adjust the shadow properties for natural, soft lighting
        naturalLight.castShadow = true;
        naturalLight.shadow.camera.left = -this.storeDimensions[0] / 2;
        naturalLight.shadow.camera.right = this.storeDimensions[0] / 2;
        naturalLight.shadow.camera.top = this.storeDimensions[2] / 2;
        naturalLight.shadow.camera.bottom = -this.storeDimensions[2] / 2;
        naturalLight.shadow.mapSize.width = 2048;
        naturalLight.shadow.mapSize.height = 2048;
        naturalLight.shadow.camera.near = 1;
        naturalLight.shadow.camera.far = this.storeDimensions[1] + 10;

        this.graphics.add(naturalLight);
        this.graphics.add(naturalLight.target); // Ensures the light is targeted at the floor center
        // -------------------

        
        // --- Get Section Items & Pickup Spots ---
        for (let i = 0; i < this.sections.length; i++){
            this.shopItems.push(...this.sections[i].getItems());
            this.shopPickupSpots.push(...this.sections[i].getPickupSpots());
        }
        // ----------------------------------------

        // --- Setup Lighting ---
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Skip adding light in the center position (1, 1)
                if (i === 1 && j === 1) continue;

                // Clone the light model
                const storeLight = this.tempStoreLight.clone();
                storeLight.position.set(50 - 2 * 25 * i, 18, 50 - 2 * 25 * j);

                // Create a point light at this position
                const light = new THREE.PointLight(0xffffee, 5, 45, 0.05);
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

        // Increment time uniform for cloud animation
        this.ceilingTexture.uniforms.uTime.value += delta ? delta * 0.0006 : 0; // Adjust speed as needed
    }

    // Destroy method (currently a placeholder, used for cleanup)
    destroy(): void {}
}