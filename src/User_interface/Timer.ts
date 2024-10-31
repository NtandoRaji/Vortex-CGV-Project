import { showGameOverMenu } from './gameOverMenu';

let timerInterval: ReturnType<typeof setInterval> | null = null;
let timeRemaining: number;
let timerElement: HTMLDivElement;
let pulsateInterval: ReturnType<typeof setInterval> | null = null; // For pulsating effect

// Load the sound file
const clickSound = new Audio('musicSound/emergencyAlarm.mp3');

// Function to play sound
function playWarningSound() {
    clickSound.play();
}


export function setUpTimer(minutes: number, containerId: string): void {
    // Clear any existing timer
    const existingTimer = document.querySelector(`#${containerId}`);
    if (existingTimer) {
        existingTimer.remove();
        // if (timerInterval) {
        //     clearInterval(timerInterval); // Clear the existing timer
        // }
        stopTimer();
    }

    // Set up the new timer
    timeRemaining = minutes; // Convert minutes to seconds
    timerElement = document.createElement('div');
    timerElement.id = containerId;
    applyStylesToTimer(timerElement);
    document.body.appendChild(timerElement);

    // Start the timer
    // updateTimer();
    //startTimer();
}

function applyStylesToTimer(timer: HTMLDivElement): void {
    timer.style.position = 'absolute';
    timer.style.top = '10px';
    timer.style.left = '10px';
    timer.style.fontSize = '24px';
    timer.style.fontWeight = 'bold';
    timer.style.color = '#000000';
    timer.style.background = 'linear-gradient(135deg, #4CAF50, #81C784)';
    timer.style.border = '2px solid #2E7D32';
    timer.style.borderRadius = '20px';
    timer.style.padding = '10px 20px';
    timer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    timer.style.textAlign = 'center';
    timer.style.fontFamily = 'Arial, sans-serif';
    timer.style.zIndex='2';
}

function formatTime(): string {
    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining % 60;
    return `Timer: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function updateTimer(): void {
    timerElement.textContent = formatTime();

    //from 10 seconds counting down timer pulsates & changes colour to red
    if (timeRemaining <= 10 && timeRemaining >= 0) {
        // Change background color to red
        timerElement.style.background = 'red'; // Change background color
        timerElement.style.border = '3px solid black'; //emphasise border when red
        playWarningSound()        
        // Apply pulsating effect
        timerElement.style.transform = `scale(${1 + 0.1 * Math.sin(Date.now() / 500)})`; // Pulsate every second
    } else {
        // Reset styles when time is greater than 10 seconds
        timerElement.style.background = 'linear-gradient(135deg, #4CAF50, #81C784)'; // Reset to original background
        timerElement.style.transform = 'scale(1)'; // Reset size
    }

    if (timeRemaining > 0) {
        timeRemaining--;
    } else {
        // if (timerInterval) {
        //     clearInterval(timerInterval); // Clear the existing timer
        // }
        stopTimer();
        timerElement.textContent = "Timer: Time's up!";
        showGameOverMenu();
        // Trigger end-of-timer actions (e.g. game over)
    }
}

export function startTimer(): void {
    if (!timerInterval) { // Prevent multiple intervals
        timerInterval = setInterval(updateTimer, 1000); // Call updateTimer every second
    }
}
export function stopTimer(): void {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null; // Optionally reset the interval variable
    }
    // Optionally, update the UI or perform any other actions when stopping the timer
    timerElement.textContent = "Timer stopped!";
}

//for timer when 10s or less
export function startPulsating(): void {
    // Stop any existing pulsating interval
    stopPulsating(); 

    // Start pulsating effect every 500ms
    pulsateInterval = setInterval(() => {
        // Apply pulsating effect
        timerElement.style.transform = `scale(${1 + 0.2 * Math.sin(Date.now() / 100)})`; //pulsate every specified second
    }, 50); // Update every 50ms for smoother effect
}

export function stopPulsating(): void {
    if (pulsateInterval) {
        clearInterval(pulsateInterval);
        pulsateInterval = null; // Reset pulsate interval
    }
    // Reset to original styles when pulsating stops
    timerElement.style.transform = 'scale(1)'; // Reset size
}
// Add pulsate animation styles
const style = document.createElement('style');
style.textContent = `
@keyframes pulsate {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(2);
    }
    100% {
        transform: scale(1);
    }
}

.pulsate {
    animation: pulsate 0.2s infinite; /* Adjust duration for smoother effect */
}
`;
document.head.appendChild(style);