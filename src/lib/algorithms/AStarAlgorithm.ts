import { Node } from "./Node";
import { Heuristic } from "./Heuristic";

type NodeMap = Map<Node, Node>;


export class AStarAlgorithm {
    static WIDTH: number;
    static HEIGHT: number;

    constructor(width: number, height: number) {
        AStarAlgorithm.WIDTH = width;
        AStarAlgorithm.HEIGHT = height;
    }

    static generatePath(start: Node, end: Node, cameFrom: NodeMap): Node[] {
        const path: Node[] = [end];

        while (!start.equals(end)) {
            end = cameFrom.get(end)!;
            path.push(end);
        }

        return path.reverse();
    }

    static isValid(y: number, x: number, grid: number[][]): boolean {
        return y >= 0 && y < AStarAlgorithm.HEIGHT && x >= 0 && x < AStarAlgorithm.WIDTH && grid[y][x] <= 0;
    }

    solve(start: [number, number], end: [number, number], grid: number[][], heuristic: Heuristic): Node[] {
        const openSet = new PriorityQueue<Node>((a, b) => a.getFScore() - b.getFScore());
        const closedSet = new Set<Node>();
        const cameFrom: NodeMap = new Map();
        const moves = [[-1, 0], [1, 0], [0, -1],  [0, 1]];
        const gScore: number[][] = Array.from({ length: AStarAlgorithm.HEIGHT }, () => Array(AStarAlgorithm.WIDTH).fill(Infinity));

        const startNode = new Node(start[0], start[1], heuristic.getHeuristic(start, end));
        const endNode = new Node(end[0], end[1], heuristic.getHeuristic(end, end));

        openSet.add(startNode);
        gScore[start[1]][start[0]] = 0;

        while (!openSet.isEmpty()) {
            const current = openSet.poll();

            if (current.equals(endNode)) {
                return AStarAlgorithm.generatePath(startNode, current, cameFrom);
            }

            closedSet.add(current);

            for (const move of moves) {
                const y = current.getY() + move[0];
                const x = current.getX() + move[1];

                if (!AStarAlgorithm.isValid(y, x, grid) || closedSet.has(new Node(x, y, 0))) continue;

                const tempG = gScore[current.getY()][current.getX()] + 1;

                if (tempG < gScore[y][x]) {
                    gScore[y][x] = tempG;
                    const fScore = tempG + heuristic.getHeuristic([x, y], end);

                    const newNode = new Node(x, y, fScore);
                    cameFrom.set(newNode, current);

                    if (!openSet.contains(newNode)) {
                        openSet.add(newNode);
                    }
                }
            }
        }
        return [];
    }
}


class PriorityQueue<T> {
    private items: T[] = [];
    private comparator: (a: T, b: T) => number;

    constructor(comparator: (a: T, b: T) => number) {
        this.comparator = comparator;
    }

    add(item: T): void {
        this.items.push(item);
        this.items.sort(this.comparator);
    }

    poll(): T {
        return this.items.shift()!;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    contains(item: T): boolean {
        return this.items.includes(item);
    }
}
