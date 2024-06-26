import { GameObject } from './gameObject.js';

class Block extends GameObject {
    constructor(x, y, width, height, color = "skyblue") {
        super(x, y, width, height, color);
        this.break = false;
    }
}


export class BlockFactory {
    createBlocks(blockColumns, blockRows, blockX, blockY, blockWidth, blockHeight) {
        const blocks = [];
        for (let c = 0; c < blockColumns; c++) {
            for (let r = 0; r < blockRows; r++) {
                const block = new Block(blockX + c * blockWidth + c * 10, blockY + r * blockHeight + r * 10, blockWidth, blockHeight);
                blocks.push(block);
            }
        }
        return blocks;
    }
}
