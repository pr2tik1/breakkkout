export class ScoreManager {
    constructor() {
        this.score = 0;
    }

    increment(points) {
        this.score += points;
    }

    reset() {
        this.score = 0;
    }

    draw(context) {
        context.font = "20px sans-serif";
        context.fillText(this.score, 10, 25);
    }
}
