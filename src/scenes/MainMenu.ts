import * as THREE from "three";
import { GraphicsPrimitiveFactory, Scene } from "../lib";
import { CustomInterfaceContext } from "../lib/customs/CustomInterfaceContext";
import { TimeS } from "../lib/w3ads/types/misc.type";
import { drawMainMenu } from "../User_interface/MainMenu/MainMenu";

export class MainMenu extends Scene {
    camera!: THREE.OrthographicCamera;
    userInterface = new CustomInterfaceContext();
    numCircles: number = 13;
    circles: THREE.Object3D[] = [];
    directions: number[] = [];
    // Add animation controls
    originalZ: number[] = [];
    menuMusic: HTMLAudioElement;

    private readonly ANIMATION_CONFIG = {
        MIN_SCALE: 0.5,
        MAX_SCALE: 2.0,
        SPEED: 0.5,
        MAX_Z: 8.0,
        MIN_Z: 5.0,
        VIEW_SIZE: 20
    };

    constructor(AmmoLib: any) {
        super("main-menu", AmmoLib);
        // Initialize audio here to ensure proper setup
        this.menuMusic = new Audio('musicSound/menuMusic.mp3');
    }

    private setupAudio(): void {
        const volume = Number(localStorage.getItem("vol"));
        this.menuMusic.loop = true;
        this.menuMusic.volume = volume;
        this.menuMusic.muted = false;

        // Add both mousemove and click handlers for better autoplay support
        const playAudio = () => {
            this.menuMusic.play().catch(error => {
                console.warn('Music autoplay failed:', error);
            });
            // Remove listeners after successful play
            document.body.removeEventListener('mousemove', playAudio);
            document.body.removeEventListener('click', playAudio);
        };

        document.body.addEventListener('mousemove', playAudio);
        document.body.addEventListener('click', playAudio);
    }

    create(): void {
        const aspect = window.innerWidth / window.innerHeight;
        const viewSize = 20;
        this.camera = new THREE.OrthographicCamera(
            -viewSize * aspect,
            viewSize * aspect,
            viewSize,
            -viewSize
        );
        this.graphics.mainCamera = this.camera;
        this.camera.position.set(20, 0, 0);
        this.camera.lookAt(0, 0, 0);

        //background colour
        this.graphics.renderer.setClearColor(0xAACCBB);

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());

        this.setupAudio();
        drawMainMenu(this.userInterface);
    }

    private handleResize(): void {
        const aspect = window.innerWidth / window.innerHeight;
        if (this.camera) {
            this.camera.left = -this.ANIMATION_CONFIG.VIEW_SIZE * aspect;
            this.camera.right = this.ANIMATION_CONFIG.VIEW_SIZE * aspect;
            this.camera.top = this.ANIMATION_CONFIG.VIEW_SIZE;
            this.camera.bottom = -this.ANIMATION_CONFIG.VIEW_SIZE;
            this.camera.updateProjectionMatrix();
        }
    }

    async load(): Promise<void> {}

    build(): void {
        const circlePositions = [
            [0, -10, 3.4],
            [0, -4.1, -8.1],
            [0, 1.8, -0.4],
            [0, 13.3, 0.8],
            [0, -9.9, -9.1],
            [0, 10.1, -4.1],
            [0, 5.2, 3.8],
            [0, -2.9, 10.7],
            [0, 9.1, -10.2],
            [0, 15.0, -9.0],
            [0, 9.2, 8.8],
            [0, -9.9, -1.9],
            [0, 15.3, 6.2],
            
        ];

        const circleColors = [
            0xe91e63, 0xf38321, 0x4c9baf, 0x27b03c, 0x9C27B0,
            0x204d72, 0x2196F3, 0xFF5722, 0x3F51B5, 0xCDDC39,
            0x673AB7, 0xFFC107, 0xFF9800
        ];

        // Create all circles (using numCircles instead of hard-coded 11)
        for (let i = 0; i < this.numCircles; i++) {
            const radius = Math.max(1, 1 + Math.random());
            const circle = GraphicsPrimitiveFactory.sphere({
                position: {
                    x: circlePositions[i][0],
                    y: circlePositions[i][1] * 1.2 - 1.5,
                    z: circlePositions[i][2] * 3
                },
                rotation: { x: 0, y: 0, z: 0 },
                radius: radius,
                colour: circleColors[i],
                shadows: false,
            });

            // Set initial random scale
            const initialScale = this.ANIMATION_CONFIG.MIN_SCALE + Math.random() * (this.ANIMATION_CONFIG.MAX_SCALE - this.ANIMATION_CONFIG.MIN_SCALE);
            circle.scale.setScalar(initialScale);

            this.circles.push(circle);
            this.graphics.add(circle);
            this.directions.push(circle.position.z > 0 ? 1 : -1);
            this.originalZ.push(circlePositions[i][2]);
        }

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0XFFFFFF, 2);
        this.graphics.add(ambientLight);

        //directional light from front view for brighter effect
        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2);  // Brighter intensity for vivid colors
        directionalLight.position.set(0, 0, 20);  // Position in front of the circles
        directionalLight.target.position.set(0, 0, 0);  // Target the center of the scene
        this.graphics.add(directionalLight);
        this.graphics.add(directionalLight.target);  // Required to make the light target effective
    
        // Directional light from the left
        const leftLight = new THREE.DirectionalLight(0xFFFFFF, 1.5);
        leftLight.position.set(-20, 0, 10); // Position on the left side
        leftLight.target.position.set(0, 0, 0);
        this.graphics.add(leftLight);
        this.graphics.add(leftLight.target);

        // Directional light from the right
        const rightLight = new THREE.DirectionalLight(0xFFFFFF, 1.5);
        rightLight.position.set(20, 0, 10); // Position on the right side
        rightLight.target.position.set(0, 0, 0);
        this.graphics.add(rightLight);
        this.graphics.add(rightLight.target);
    }

    //@ts-ignore
    update(time: TimeS, delta: number): void {
        // Animate each circle
        delta = delta / 1000;

        const { MIN_Z, MAX_Z, SPEED } = this.ANIMATION_CONFIG;
        this.circles.forEach((circle, i) => {
            circle.position.z += this.directions[i] * SPEED * delta;
        });

        const distance = Math.abs(Math.min(this.circles[0].position.z, this.originalZ[0]) - Math.max(this.circles[0].position.z, this.originalZ[0]));
        if (distance >= MAX_Z || distance <= MIN_Z){
            for (let i = 0; i < this.directions.length; i++){
                this.directions[i] *= -1;
                this.circles[i].position.z += this.directions[i] * 0.01;
            }
        }

        // Update menu music volume
        this.menuMusic.volume = Number(localStorage.getItem("vol"));
    }

    destroy(): void {
        this.menuMusic.pause();
        this.menuMusic.muted = true;
        this.menuMusic.currentTime = 0;
        window.removeEventListener('resize', this.handleResize.bind(this));
    }
}