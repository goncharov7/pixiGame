export class Score {
    private points: number;

    constructor() {
        this.points = 0;
    }

    public increment() {
        this.points++;
    }

    public getPoints(): number {
        return this.points;
    }
}
