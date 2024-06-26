import { GameObject } from './gameObject.js';

export class Player {
    constructor(x, y, width, height, velocityX) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = velocityX;
    }

    moveLeft() {
        this.x -= this.velocityX;
    }

    moveRight() {
        this.x += this.velocityX;
    }

    draw(context) {
        context.fillStyle = "lightgreen";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

