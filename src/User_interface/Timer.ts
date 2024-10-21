import { showGameOverMenu } from './gameOverMenu';

let timerInterval: ReturnType<typeof setInterval> | null = null;
let timeRemaining: number;
let timerElement: HTMLDivElement;

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
    startTimer();
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
}

function formatTime(): string {
    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining % 60;
    return `Timer: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function updateTimer(): void {
    timerElement.textContent = formatTime();
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