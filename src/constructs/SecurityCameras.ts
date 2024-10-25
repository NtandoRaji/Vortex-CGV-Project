import * as THREE from 'three';
import { GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";

// Define the SecurityCameras class
export class SecurityCameras {
    private cameras: THREE.Group[] = [];
    private graphics: GraphicsContext;
    private physics: PhysicsContext;
    private interactions: InteractManager;
    private userInterface: InterfaceContext;
    private filename: string;
    private scale: number[];
    private scene!: THREE.Scene; // Use definite assignment assertion

    // Constructor initializes SecurityCameras with contexts and a filename
    constructor(
        graphics: GraphicsContext, 
        physics: PhysicsContext, 
        interactions: InteractManager, 
        userInterface: InterfaceContext,
        filename: string, 
        scale: number[] = [1, 1, 1]
    ) {
        this.graphics = graphics;
        this.physics = physics;
        this.interactions = interactions;
        this.userInterface = userInterface;
        this.filename = filename;
        this.scale = scale;
    }

    // Method to set the scene
    setScene(scene: THREE.Scene): void {
        this.scene = scene; // Assign the scene to the class property
    }

    // Method to asynchronously load the 3D model of the security camera from an external GLTF file
    async load(): Promise<void> {
        try {
            // Load the model using the filename, constructing the path based on the provided filename
            const gltfData: any = await this.graphics.loadModel(`assets/security_camera/security_camera.gltf`);
            const cameraModel = gltfData.scene;

            // Define positions for each camera in ceiling corners
            const positions = [
                new THREE.Vector3(-15, 20, -15), // Corner 1
                new THREE.Vector3(80, 20, -80),  // Corner 2
                new THREE.Vector3(-80, 20, 80),  // Corner 3
                new THREE.Vector3(80, 20, 80)    // Corner 4
            ];

            // Place cameras at each corner
            positions.forEach((position) => {
                const cameraInstance = cameraModel.clone();
                cameraInstance.position.copy(position);
                this.cameras.push(cameraInstance);
                this.scene.add(cameraInstance); // Use the scene from the property
            });
        } catch (error) {
            console.log(`[!] Error loading ${this.filename}_camera model`);
            console.log(error);
        }
    }

    // Method to build the SecurityCameras, setting scale, shadows, and physics for each camera
    build(): void {
        this.cameras.forEach((camera) => {
            // Set scale for each camera instance
            camera.scale.set(this.scale[0], this.scale[1], this.scale[2]);

            // Enable shadows
            camera.traverse((node: any) => {
                if (node.isMesh) {
                    node.castShadow = true;
                }
            });

            // Add physics properties to each camera instance
            this.physics.addStatic(camera, PhysicsColliderFactory.box(this.scale[0], this.scale[1], this.scale[2]));
        });
    }
}
