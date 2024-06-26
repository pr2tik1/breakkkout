export class CollisionManager {
    detectCollision(a, b) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    topCollision(ball, block) {
        return this.detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
    }

    bottomCollision(ball, block) {
        return this.detectCollision(ball, block) && (block.y + block.height) >= ball.y;
    }

    leftCollision(ball, block) {
        return this.detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
    }

    rightCollision(ball, block) {
        return this.detectCollision(ball, block) && (block.x + block.width) >= ball.x;
    }
}
