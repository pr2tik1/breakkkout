import { Player } from './player.js';
import { Ball } from './ball.js';
import { Block } from './block.js';

export class Game {
    constructor(boardWidth, boardHeight) {
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.context = null;

        this.player = new Player(boardWidth / 2 - 40, boardHeight - 15, 80, 10, 10);
        this.ball = new Ball(boardWidth / 2, boardHeight / 2, 10, 10, 6, 3, 1);

        this.blocks = [];
        this.blockWidth = 46;
        this.blockHeight = 10;
        this.blockColumns = 12;
        this.blockRows = 3;
        this.blockMaxRows = 10;
        this.blockX = 15;
        this.blockY = 45;
        this.blockCount = 0;

        this.score = 0;
        this.gameOver = false;

        this.leftPressed = false;
        this.rightPressed = false;

        this.playerDefaultColor = "lightgreen";
        this.temporaryColorTimer = null;
        this.temporaryColorDuration = 250;

        this.initializeBoard();
        this.createBlocks();
        this.update();
        this.addEventListeners();
    }

    initializeBoard() {
        const board = document.getElementById("board");
        board.height = this.boardHeight;
        board.width = this.boardWidth;
        this.context = board.getContext("2d");
    }

    addEventListeners() {
        document.addEventListener("keydown", (e) => this.movePlayer(e));
        document.addEventListener("keyup", (e) => this.movePlayer(e));
    }

    update() {
        if (this.gameOver) return;
        requestAnimationFrame(() => this.update());

        this.context.clearRect(0, 0, this.boardWidth, this.boardHeight);

        this.handlePlayerMovement();
        this.player.draw(this.context);

        this.ball.move();
        this.ball.draw(this.context);

        this.checkCollisions();
        this.drawBlocks();

        this.drawScore();
    }

    handlePlayerMovement() {
        if (this.leftPressed && !this.outOfBounds(this.player.x - this.player.velocityX)) {
            this.player.x -= this.player.velocityX;
        }
        if (this.rightPressed && !this.outOfBounds(this.player.x + this.player.velocityX)) {
            this.player.x += this.player.velocityX;
        }
    }

    checkCollisions() {
        if (this.topCollision(this.ball, this.player) || this.bottomCollision(this.ball, this.player)) {
            this.changePlayerColor("#FFD580");
            this.ball.velocityY *= -1;
        } else if (this.leftCollision(this.ball, this.player) || this.rightCollision(this.ball, this.player)) {
            this.changePlayerColor("#FFD580");
            this.ball.velocityX *= -1;
        }

        if (this.ball.y <= 0) {
            this.ball.velocityY *= -1;
        } else if (this.ball.x <= 0 || this.ball.x + this.ball.width >= this.boardWidth) {
            this.ball.velocityX *= -1;
        } else if (this.ball.y + this.ball.height >= this.boardHeight) {
            this.context.font = "20px sans-serif";
            this.context.fillText("Game Over: Press 'Space' to Restart", 80, 400);
            this.gameOver = true;
        }

        for (const block of this.blocks) {
            if (!block.break && (this.topCollision(this.ball, block) || this.bottomCollision(this.ball, block) || this.leftCollision(this.ball, block) || this.rightCollision(this.ball, block))) {
                block.break = true;
                this.ball.velocityY *= -1;
                this.score += 100;
                this.blockCount -= 1;
            }
        }

        if (this.blockCount === 0) {
            this.score += 100 * this.blockRows * this.blockColumns;
            this.blockRows = Math.min(this.blockRows + 1, this.blockMaxRows);
            this.createBlocks();
        }
    }

    drawBlocks() {
        for (const block of this.blocks) {
            if (!block.break) {
                block.draw(this.context);
            }
        }
    }

    drawScore() {
        this.context.font = "20px sans-serif";
        this.context.fillText(this.score, 10, 25);
    }

    createBlocks() {
        this.blocks = [];
        for (let c = 0; c < this.blockColumns; c++) {
            for (let r = 0; r < this.blockRows; r++) {
                const block = new Block(this.blockX + c * this.blockWidth + c * 10, this.blockY + r * this.blockHeight + r * 10, this.blockWidth, this.blockHeight);
                this.blocks.push(block);
            }
        }
        this.blockCount = this.blocks.length;
    }

    movePlayer(e) {
        if (this.gameOver && e.code === "Space") {
            this.resetGame();
            return;
        }
        if (e.type === "keydown") {
            if (e.code === "ArrowLeft") {
                this.leftPressed = true;
            } else if (e.code === "ArrowRight") {
                this.rightPressed = true;
            }
        } else if (e.type === "keyup") {
            if (e.code === "ArrowLeft") {
                this.leftPressed = false;
            } else if (e.code === "ArrowRight") {
                this.rightPressed = false;
            }
        }
    }

    resetGame() {
        this.gameOver = false;
        this.player = new Player(this.boardWidth / 2 - 40, this.boardHeight - 15, 80, 10, 10);
        this.ball = new Ball(this.boardWidth / 2, this.boardHeight / 2, 10, 10, 6, 3, 1);
        this.blockRows = 3;
        this.score = 0;
        this.createBlocks();

        clearTimeout(this.temporaryColorTimer);
        this.player.color = this.playerDefaultColor;
        this.update();
    }

    changePlayerColor(color) {
        this.player.color = color;
        clearTimeout(this.temporaryColorTimer);
        this.temporaryColorTimer = setTimeout(() => {
            this.player.color = this.playerDefaultColor;
        }, this.temporaryColorDuration);
    }

    outOfBounds(xPosition) {
        return xPosition < 0 || xPosition + this.player.width > this.boardWidth;
    }

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
