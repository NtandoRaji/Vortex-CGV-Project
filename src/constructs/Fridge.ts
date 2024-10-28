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

// Define the Shelf class, which extends from the abstract Construct class
export class Fridge extends GroceryItem {
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
        `assets/${this.filename}_shelf/${this.filename}_shelf.gltf`
      );

      // Store the loaded 3D mesh into the 'mesh' property
      this.mesh = gltfData.scene;
    } catch (error) {
      // Log any error that occurs during the model loading process
      console.log(`[!] Error loading ${this.filename}_shelf model`);
      console.log(error);
    }
  }

  // Method to build the Shelf, setting its scale, shadows, and adding it to the scene and physics world
  build(): void {
    // Set the scale of the mesh based on the provided scale array
    this.mesh.scale.set(this.scale[0], this.scale[1], this.scale[2]);
    // Enable the Shelf mesh to cast shadows
    this.mesh.traverse((node: any) => {
      if (node.isMesh) {
        if (node.name == "fridgedoormesh") {
            node.material = new THREE.MeshStandardMaterial({
                color: 0xffffff, // or adjust to a suitable color
                metalness: 0.1, // Slightly reflective
                roughness: 0.1, // Smooth surface for sharper reflections
                transparent: true, // Make it transparent
                opacity: 0.8, // Adjust opacity as needed
            });
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

}
