// gameOverMenu.ts

export function showGamePausedMenu(): void {
    // Release the pointer lock
    if (document.pointerLockElement) {
        document.exitPointerLock();
    }

    // Create a semi-transparent overlay behind the message
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Create the mission failed message and buttons
    const missionPausedContainer = document.createElement('div');
    missionPausedContainer.className = 'mission-paused-container';

    const message = document.createElement('h1');
    message.textContent = "Mission Paused! Press 'P' to resume game :)";
    message.id = 'mission-text';
    missionPausedContainer.appendChild(message);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    // Back to menu button
    const backToMenuButton = document.createElement('button');
    backToMenuButton.textContent = 'Back to Menu';
    backToMenuButton.className = 'menu-btn';
    backToMenuButton.id = 'back-to-btn';
    backToMenuButton.onclick = () => {
        window.location.href = '../Vortex-CGV-Project/index.html'; // Navigate back to menu
    };

    // Restart level button
    const restartLevelButton = document.createElement('button');
    restartLevelButton.textContent = 'Restart Level';
    restartLevelButton.className = 'menu-btn';
    restartLevelButton.id = 'restart-btn';
    restartLevelButton.onclick = () => {
        window.location.href = '../Vortex-CGV-Project/indexGame.html'; // Restart the game
    };

    // Append buttons to button container
    buttonContainer.appendChild(backToMenuButton);
    buttonContainer.appendChild(restartLevelButton);

    // Append button container to mission failed container
    missionPausedContainer.appendChild(buttonContainer);

    // Append the mission failed container to the body
    document.body.appendChild(missionPausedContainer);

    // Style the overlay and the message
    const style = document.createElement('style');
    style.textContent = `
        /* Add your styles here for the overlay and mission failed message */
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
            z-index: 999; /* Ensure the overlay is on top */
        }
        .mission-paused-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            z-index: 1000; /* Ensure the mission failed message is above the overlay */
            outline: 10px solid #AABBCC;
            outline-offset: 5px;
        }
        .mission-paused-container h1 {
            font-size: 4rem;
            margin-bottom: 20px;
            color: #333;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        .button-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .menu-btn {
            padding: 15px 30px;
            font-size: 1.5rem;
            font-weight:bold;
            color: #fff;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            color:#313131;
        }
        .menu-btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            box-shadow: 0 0 20px 10px rgba(0, 0, 0, 0.7);
            outline: 5px solid #313131;
            outline-offset: 5px;
        }
        .menu-btn:active {
            transform: translateY(2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        #mission-text {
            color:#313131;            
        }           
        #back-to-btn {
            background-color: #568fc4;
        }
        #restart-btn {
            background-color: rgba(60, 126, 54, 0.888);
        }
    `;
    
    // Append the stylesheet to the document head
    document.head.appendChild(style);
}

export function hideGamePauseMenu():void{
    const overlay = document.querySelector('.overlay');
    const missionPausedContainer = document.querySelector('.mission-paused-container');
    
    if (overlay) overlay.remove(); // Remove overlay
    if (missionPausedContainer) missionPausedContainer.remove(); // Remove the paused menu
}
