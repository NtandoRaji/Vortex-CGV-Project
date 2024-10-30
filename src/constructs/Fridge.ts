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
              // Create and set up the Reflector for the fridge door mesh
          const reflectorGeometry = new THREE.PlaneGeometry(6.5, 9.5); // Adjust dimensions as needed
          const reflector = new Reflector(reflectorGeometry, {
            color: 0x0077ff, // You can adjust the color
            textureWidth: 512,
            textureHeight: 512,
  
          });

          // Position the Reflector correctly relative to the fridgedoormesh
          reflector.position.copy(node.position);
          reflector.position.x = 2.75; // Ensure it's horizontal
          reflector.position.y += 5.4; // Adjust to sit just above the door
          reflector.rotation.y = Math.PI/2;
          reflector.rotation.z =0;

          // Add the Reflector to the scene
          this.add(reflector); // Assuming this class extends a Three.js Object3D
          const transparentOverlayGeometry = new THREE.PlaneGeometry(6.75, 9.5);
          const transparentOverlayMaterial = new THREE.MeshStandardMaterial({
            color: 0xa0a9b0, // Adjust to your preference
            transparent: true,
            opacity: 0.95, // Adjust opacity as desired
            roughness: 0.8, // To make it less reflective than the Reflector
          });
          const transparentOverlay = new THREE.Mesh(
            transparentOverlayGeometry,
            transparentOverlayMaterial
          );

          // Position the overlay slightly in front of the Reflector
          transparentOverlay.position.copy(reflector.position);
          transparentOverlay.position.x += 0.02; // Offset to avoid z-fighting
          transparentOverlay.rotation.copy(reflector.rotation);

          // Add the overlay to the scene
          this.add(transparentOverlay);
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
