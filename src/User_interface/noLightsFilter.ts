export function createFlashlight(): void {
    // Create the black overlay
    const overlay = document.createElement('div');
    overlay.className = 'flashlight-overlay';
    document.body.appendChild(overlay);

    // Style the flashlight effect
    const style = document.createElement('style');
    style.textContent = `
        /* Fullscreen black overlay */
        .flashlight-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, 
                rgba(0, 0, 0, 0) 5%,  /* Transparent in the center (smaller radius) */
                rgba(0, 0, 0, 0.8) 20%, /* Faster darkening transition */
                rgba(0, 0, 0, 1) 40%   /* Fully black around the edges */
            );
            pointer-events: none; /* Non-interactive overlay */
            z-index: 1; /* Keep above other elements */
            transition: background-position 0.1s ease-out;
        }
    `;
    
    // Append the stylesheet to the head
    document.head.appendChild(style);
}
