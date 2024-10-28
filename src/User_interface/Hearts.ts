export function setUpLives(containerId: string, lives: number): void {
    // Check if the lives display already exists
    let livesDisplay = document.getElementById(containerId);
    
    if (!livesDisplay) {
        // Create the lives element only if it doesn't already exist
        livesDisplay = document.createElement("div");
        livesDisplay.id = containerId;
        livesDisplay.style.display = 'flex';
        livesDisplay.style.flexDirection = 'row';
        livesDisplay.style.position = 'absolute';
        livesDisplay.style.top = '75px'; // Position it below the timer
        livesDisplay.style.left = '10px';
        livesDisplay.style.color = '#000000'; // Text color
        livesDisplay.style.background = '#36454F';
        livesDisplay.style.border = '2px solid #C62828'; // Border
        livesDisplay.style.borderRadius = '20px'; // Rounded corners
        livesDisplay.style.padding = '10px 20px';
        livesDisplay.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Shadow for depth
        livesDisplay.style.textAlign = 'center';
        livesDisplay.style.fontFamily = 'Arial, sans-serif';
        livesDisplay.style.zIndex='2';
        
        // Append the lives display to the body
        document.body.appendChild(livesDisplay);
    }
    
    // Initialize with the given number of lives
    updateLivesDisplay(livesDisplay.id, lives);
}

export function updateLivesDisplay(containerId: string, lives: number): void {
    // Get the container element
    const livesDisplay = document.getElementById(containerId);

    if (livesDisplay) {
        if (lives <= 0) {
            // If lives are zero or less, remove the lives display
            document.body.removeChild(livesDisplay);
        } else {
            // Clear the existing lives display
            livesDisplay.innerHTML = ''; // Clear existing hearts

            // Create heart images for each life
            for (let i = 0; i < lives; i++) {
                const heartImage = document.createElement('img');
                heartImage.src = 'icons/heart.png';
                heartImage.alt = 'Lives';
                heartImage.style.width = '30px';
                heartImage.style.height = '30px';
                heartImage.style.marginRight = '5px'; // Space between hearts

                // Append the heart image to the lives display
                livesDisplay.appendChild(heartImage);
            }
        }
    }
}
