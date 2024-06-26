import { Player } from './components/player.js';
import { Ball } from './components/ball.js';
import { EventManager } from './managers/eventManager.js';
import { CollisionManager } from './managers/collisionManager.js';
import { ScoreManager } from './managers/scoreManager.js';
import { BlockFactory } from './components/block.js';

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

        this.scoreManager = new ScoreManager();
        this.collisionManager = new CollisionManager();
        this.blockFactory = new BlockFactory();
        this.eventManager = new EventManager();

        this.gameOver = false;

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
        this.eventManager.addEventListener("keydown", (e) => this.movePlayer(e));
        this.eventManager.addEventListener("keyup", (e) => this.movePlayer(e));
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

        this.scoreManager.draw(this.context);
    }

    handlePlayerMovement() {
        if (this.eventManager.leftPressed && !this.outOfBounds(this.player.x - this.player.velocityX)) {
            this.player.moveLeft();
        }
        if (this.eventManager.rightPressed && !this.outOfBounds(this.player.x + this.player.velocityX)) {
            this.player.moveRight();
        }
    }

    checkCollisions() {
        if (this.collisionManager.topCollision(this.ball, this.player) || this.collisionManager.bottomCollision(this.ball, this.player)) {
            this.ball.velocityY *= -1;
        } else if (this.collisionManager.leftCollision(this.ball, this.player) || this.collisionManager.rightCollision(this.ball, this.player)) {
            this.ball.velocityX *= -1;
        }

        if (this.ball.y <= 0) {
            this.ball.velocityY *= -1;
        } else if (this.ball.x <= 0 || this.ball.x + this.ball.width >= this.boardWidth) {
            this.ball.velocityX *= -1;
        } else if (this.ball.y + this.ball.height >= this.boardHeight) {
            // this.context.font = "20px sans-serif";
            // this.context.fillText("Game Over: Press 'Space' to Restart", 80, 400);
            this.showGameOverScreen();
            this.gameOver = true;
        }

        for (const block of this.blocks) {
            if (!block.break && (this.collisionManager.topCollision(this.ball, block) || this.collisionManager.bottomCollision(this.ball, block) || this.collisionManager.leftCollision(this.ball, block) || this.collisionManager.rightCollision(this.ball, block))) {
                block.break = true;
                this.ball.velocityY *= -1;
                this.scoreManager.increment(100);
                this.blockCount -= 1;
            }
        }

        if (this.blockCount === 0) {
            this.scoreManager.increment(100 * this.blockRows * this.blockColumns);
            this.blockRows = Math.min(this.blockRows + 1, this.blockMaxRows);
            this.createBlocks();
        }
    }

    showGameOverScreen() {
        const img = new Image();
        img.src = 'https://pr2tik1.github.io/breakkkout/assets/game-over.png';
        img.onload = () => {
            this.context.clearRect(0, 0, this.boardWidth, this.boardHeight);
            this.context.drawImage(img, (this.boardWidth - img.width) / 2, (this.boardHeight - img.height) / 2);
        };
    }   

    drawBlocks() {
        for (const block of this.blocks) {
            if (!block.break) {
                block.draw(this.context);
            }
        }
    }

    createBlocks() {
        this.blocks = this.blockFactory.createBlocks(this.blockColumns, this.blockRows, this.blockX, this.blockY, this.blockWidth, this.blockHeight);
        this.blockCount = this.blocks.length;
    }

    movePlayer(e) {
        if (this.gameOver && e.code === "Space") {
            this.resetGame();
            return;
        }
        if (e.type === "keydown") {
            this.eventManager.handleKeyDown(e);
        } else if (e.type === "keyup") {
            this.eventManager.handleKeyUp(e);
        }
    }

    resetGame() {
        this.gameOver = false;
        this.player = new Player(this.boardWidth / 2 - 40, this.boardHeight - 15, 80, 10, 10);
        this.ball = new Ball(this.boardWidth / 2, this.boardHeight / 2, 10, 10, 6, 3, 1);
        this.blockRows = 3;
        this.scoreManager.reset();
        this.createBlocks();
        this.update();
    }

    outOfBounds(xPosition) {
        return xPosition < 0 || xPosition + this.player.width > this.boardWidth;
    }
}
