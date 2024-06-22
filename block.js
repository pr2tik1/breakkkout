import { GameObject } from './gameObject.js';

export class Block extends GameObject {
    constructor(x, y, width, height, color = "skyblue") {
        super(x, y, width, height, color);
        this.break = false;
    }
}
