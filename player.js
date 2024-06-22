import { GameObject } from './gameObject.js';

export class Player extends GameObject {
    constructor(x, y, width, height, velocityX, color = "lightgreen") {
        super(x, y, width, height, color);
        this.velocityX = velocityX;
    }
}
