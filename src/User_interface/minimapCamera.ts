import * as THREE from 'three';

export function miniMapCamera(
    scene: THREE.Scene,
    miniMapContainer: string,
    mainCamera: THREE.Camera // Use main camera
): { updateMiniMap: (playerPosition: THREE.Vector3) => void } | null {
    const miniMapSize = 200; // Size of the mini-map

    // Create or get the mini-map container
    let containerElement = document.querySelector(miniMapContainer);
    if (!containerElement) {
        console.warn(`Mini-map container "${miniMapContainer}" not found. Creating a new container.`);
        
        // Create a new container if it does not exist
        containerElement = document.createElement('div');
        (containerElement as HTMLDivElement).style.position = 'absolute';
        (containerElement as HTMLDivElement).style.top = '140px'; // Positioning on the screen
        (containerElement as HTMLDivElement).style.left = '10px';
        (containerElement as HTMLDivElement).style.background = 'aqua';
        document.body.appendChild(containerElement); // Append to the body or desired parent
        console.log('Created new mini-map container and appended to the body.');
    } else {
        containerElement = containerElement as HTMLDivElement; // Assert type if container exists
        console.log('Found existing mini-map container.');
    }

    // Create an orthographic camera for the mini-map
    const camera = new THREE.OrthographicCamera(
        miniMapSize / -2,
        miniMapSize / 2,
        miniMapSize / 2,
        miniMapSize / -2,
        1,
        1000
    );

    // Set the initial camera position above the scene
    camera.position.set(mainCamera.position.x, 18, mainCamera.position.z); // Adjust height as needed
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    console.log(`Initialized mini-map camera at position: ${camera.position.toArray()}`);

    // Create a DOM element for the mini-map
    const miniMapDOM = document.createElement('canvas'); // Change to a canvas element
    miniMapDOM.width = miniMapSize; // Set canvas dimensions
    miniMapDOM.height = miniMapSize;
    containerElement.appendChild(miniMapDOM); // Append to the existing container
    console.log('Mini-map canvas created and added to the container.');

    // Create a render target for the mini-map
    const renderTarget = new THREE.WebGLRenderTarget(miniMapSize, miniMapSize);
    
    // Create a mini-map renderer
    const miniMapRenderer = new THREE.WebGLRenderer({ alpha: true, canvas: miniMapDOM });
    miniMapRenderer.setSize(miniMapSize, miniMapSize);
    miniMapRenderer.setClearColor(0x000000, 0); // Transparent background
    console.log('Mini-map renderer initialized.');

    // Function to render the mini-map
    const render = () => {
        miniMapRenderer.setRenderTarget(renderTarget);
        miniMapRenderer.clear(); // Clear previous frame
        miniMapRenderer.render(scene, camera); // Render the main scene from the mini-map camera
        miniMapRenderer.setRenderTarget(null); // Render to default framebuffer
    
        requestAnimationFrame(render);
    };

    render(); // Start rendering the mini-map
    console.log('Mini-map rendering started.');

    return {
        updateMiniMap: (playerPosition: THREE.Vector3) => {
            // Update camera position based on player's position
            camera.position.set(playerPosition.x, 18, playerPosition.z); // Keep the height constant
            camera.lookAt(playerPosition); // Ensure the camera looks at the player

            // Log updated player position
            console.log(`Updated mini-map camera position to: ${camera.position.toArray()} and looking at: ${playerPosition.toArray()}`);
        }
    };
}
