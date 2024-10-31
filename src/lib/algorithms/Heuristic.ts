export interface Heuristic {
    getHeuristic(current: [number, number], end: [number, number]): number;
}

export class DefaultHeuristic implements Heuristic {
    getHeuristic(current: [number, number], end: [number, number]): number {
        return Math.abs(current[0] - end[0]) + Math.abs(current[1] - end[1]);
    }
}
