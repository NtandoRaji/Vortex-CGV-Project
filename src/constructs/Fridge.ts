// Import necessary modules and classes from 'three.js' and custom modules
import * as THREE from "three"; 
import {
  GraphicsContext,
  PhysicsColliderFactory,
  PhysicsContext,
} from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { GroceryItem } from "./GroceryItem";
import { Reflector } from "../lib/CustomReflector";

// Define the Shelf class, which extends from the abstract Construct class
export class Fridge extends GroceryItem {
  private mixer: THREE.AnimationMixer | null = null;
  private action: THREE.AnimationAction | null = null;
  // Constructor initializes the Shelf with contexts (graphics, physics, etc.), a filename, and scale
  constructor(
    graphics: GraphicsContext,
    physics: PhysicsContext,
    interactions: InteractManager,
    userInterface: InterfaceContext,
    filename: string,
    scale: number[] = [1, 1, 1]
  ) {
    // Call the parent class (Construct) constructor with the provided contexts
    super(graphics, physics, interactions, userInterface, filename, scale);
  }

  // Method to asynchronously load the 3D model of the shelf from an external GLTF file
  async load(): Promise<void> {
    try {
      // Load the model using the filename, constructing the path based on the provided filename
      const gltfData: any = await this.graphics.loadModel(
        `assets/${this.filename}_fridge/${this.filename}_fridge.gltf`
      );

      // Store the loaded 3D mesh into the 'mesh' property
      this.mesh = gltfData.scene;
       // Initialize the mixer for animations
       if (gltfData.animations && gltfData.animations.length > 0) {
        this.mixer = new THREE.AnimationMixer(this.mesh);
        this.mixer.timeScale = 4.5;
        this.action = this.mixer.clipAction(gltfData.animations[1]);
        this.action.clampWhenFinished = true; 
        this.action.loop = THREE.LoopOnce;
         // const action = this.mixer.clipAction(gltfData.animations[1]);
        // action.play()
        //console.log(`Animation loaded for item: ${this.filename}`);
       }
    } catch (error) {
      // Log any error that occurs during the model loading process
      console.log(`[!] Error loading ${this.filename}_shelf model`);
      console.log(error);
    }
  }

  update(deltaTime: number): void {
    if (this.mixer) {
        // Smooth the delta time to avoid jumps
        const smoothedDelta = Math.min(deltaTime, 0.016); // Clamps delta to about 60 FPS
        this.mixer.update(smoothedDelta);
    }
}

  // Method to build the Shelf, setting its scale, shadows, and adding it to the scene and physics world
  build(): void {
    // Set the scale of the mesh based on the provided scale array
    this.mesh.scale.set(this.scale[0], this.scale[1], this.scale[2]);
    // Enable the Shelf mesh to cast shadows
    //this.logMeshNames(this.mesh);
    this.mesh.traverse((node: any) => {
      if (node.isMesh) {
        if (node.name == "fridgedoorstatic_3") {
              // Create and set up the Reflector for the fridge door mesh
          const reflectorGeometry = new THREE.PlaneGeometry(3, 9.5); // Adjust dimensions as needed
          const reflector = new Reflector(reflectorGeometry, {
            color: 0x0077ff, // You can adjust the color
            textureWidth: 512,
            textureHeight: 512,
  
          });

          // Position the Reflector correctly relative to the fridgedoormesh
          reflector.position.copy(node.position);
          reflector.position.x = 2.5; // Ensure it's horizontal
          reflector.position.y += 5.4; // Adjust to sit just above the door
          reflector.rotation.y = Math.PI/2;
          reflector.position.z =1.68;

          // Add the overlay to the scene
          this.add(reflector);
          }
        node.castShadow = true;
      }
    });

    // Add the mesh to the Shelf's root (inherited from Construct), making it part of the 3D scene
    this.add(this.mesh);

    // Add static physics properties to the shelf, using a box collider sized relative to the scale
    this.physics.addStatic(
      this.mesh,
      PhysicsColliderFactory.box(
        this.scale[0] * 4,
        this.scale[1] * 8,
        this.scale[2] * 6
      )
    );
  }

  logMeshNames(object: any): void {
    object.traverse((node: any) => {
      if (node.isMesh) {
        console.log(node.name); // Log the name of the mesh
      }
    });
  }
  interact() {
    if (this.action) {
      this.action.reset(); // Reset animation to start from the beginning
      this.action.play();
      //console.log(`Animation played for fridge: ${this.filename}`);
    }
  }

}
