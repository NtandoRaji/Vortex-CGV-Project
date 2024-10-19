export class Timer {
    private timeRemaining: number;
    private timer: HTMLDivElement;
    private timerInterval: number;

    constructor(time: number) {
        this.timeRemaining = time;
    }

    // Set up the timer
    public setUpTimer(): void {
        const existingTimer = document.querySelector('#game-timer');
        if (existingTimer) {
            existingTimer.remove();
            clearInterval(this.timerInterval);
        }

        this.timer = document.createElement('div');
        this.timer.id = 'game-timer';
        this.applyStylesToTimer();
        document.body.appendChild(this.timer);
        
        this.startTimer();
    }

    private applyStylesToTimer(): void {
        this.timer.style.position = 'absolute';
        this.timer.style.top = '10px';
        this.timer.style.left = '10px';
        this.timer.style.fontSize = '24px';
        this.timer.style.fontWeight = 'bold';
        this.timer.style.color = '#000000';
        this.timer.style.background = 'linear-gradient(135deg, #4CAF50, #81C784)';
        this.timer.style.border = '2px solid #2E7D32';
        this.timer.style.borderRadius = '20px';
        this.timer.style.padding = '10px 20px';
        this.timer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        this.timer.style.textAlign = 'center';
        this.timer.style.fontFamily = 'Arial, sans-serif';
    }

    private formatTime(): string {
        let minutes = Math.floor(this.timeRemaining / 60);
        let seconds = this.timeRemaining % 60;
        return `Timer: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    private updateTimer(): void {
        this.timer.textContent = this.formatTime();
        if (this.timeRemaining > 0) {
            this.timeRemaining--;
        } else {
            clearInterval(this.timerInterval);
            this.timer.textContent = "Timer: Time's up!";
            // Trigger end-of-timer actions (e.g. game over)
        }
    }

    private startTimer(): void {
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }
}
