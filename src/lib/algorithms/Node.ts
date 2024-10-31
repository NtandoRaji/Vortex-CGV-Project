
export class Node {
    private x!:number;
    private y!:number;
    private fScore!: number;

    constructor(x: number, y: number, fScore: number) {
        this.x = x;
        this.y = y;
        this.fScore = fScore;
    }

    public setFScore(fScore: number): void {
        this.fScore = fScore;
    }

    public getFScore(): number{
        return this.fScore;
    }

    public getY(): number {
        return this.y;
    }

    public setY(y: number): void {
        this.y = y;
    }

    public getX(): number {
        return this.x;
    }

    public setX(x : number): void {
        this.x = x;
    }

    public toString(): string{
        return `(${this.y}, ${this.x}): ${this.fScore}`
    }

    public equals(other: Node): boolean {
        return this.x == other.x && this.y == other.y;
    }
}
