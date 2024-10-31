import * as THREE from "three"
import { Construct, GraphicsContext, PhysicsContext } from "../lib";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { InteractManager } from "../lib/w3ads/InteractManager";

//@ts-ignore
import vertexShader from  '../shaders/vertex.glsl';
//@ts-ignore
import fragmentShader from '../shaders/fragment.glsl';


export class ShaderFancyCube extends Construct {
    cubeMaterial!: THREE.ShaderMaterial;
    cube!: THREE.Mesh;
    scale!: number;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, scale: number = 1){
        super(graphics, physics, interactions, userInterface);
        
        this.scale = scale;
    }

    create(): void {
        this.root.castShadow = true;
    }

    async load(): Promise<void> {
        
    }

    build(): void {
        const cubeGeometry = new THREE.SphereGeometry(1);
        
        this.cubeMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });
        this.cubeMaterial.uniforms.u_time = {value: 0.0}; 

        this.cube = new THREE.Mesh(cubeGeometry, this.cubeMaterial);
        this.cube.scale.setScalar(this.scale);
        this.cube.castShadow = true;
        this.add(this.cube);

   
    }

    update(time: number, delta: number): void {
        delta = delta / 10;

        this.cubeMaterial.uniforms.u_time.value = time / 5;

        // this.cube.rotation.x += 0.02 * delta;
        // this.cube.rotation.z += 0.02 * delta;
        

    }

    destroy(): void {
        
    }
}