import { GameObject } from './gameObject.js';

export class Ball extends GameObject {
    constructor(x, y, width, height, radius, velocityX, velocityY, color = "white") {
        super(x, y, width, height, color);
        this.radius = radius;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    draw(context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();
    }

    move() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
}
