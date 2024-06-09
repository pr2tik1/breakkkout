//Board
let board;
let boardWidth = 700;
let boardHeight = 500;
let context; 

//Players
let playerWidth = 80; 
let playerHeight = 10;
let playerVelocityX = 10;

let player = {
    x : boardWidth/2 - playerWidth/2,
    y : boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX : playerVelocityX
}

//Ball
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 1;

let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    width: ballWidth,
    height: ballHeight,
    radius: 6,
    velocityX : ballVelocityX,
    velocityY : ballVelocityY
}

//Blocks
let blockArray = [];
let blockWidth = 46;
let blockHeight = 10;
let blockColumns = 12; 
let blockRows = 3; //add more as game goes on
let blockMaxRows = 10; //limit how many rows
let blockCount = 0;

//Starting block corners top left 
let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw initial player
    context.fillStyle="white";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup", movePlayer);
    
    //create blocks
    createBlocks();
}

let playerDefaultColor = "lightgreen";
let playerColor = playerDefaultColor;
let temporaryColorTimer = null;
const temporaryColorDuration = 250; 

function update() {
    requestAnimationFrame(update);
    //stop drawing
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    
    if (leftPressed && !outOfBounds(player.x - player.velocityX)) {
        player.x -= player.velocityX;
    }
    if (rightPressed && !outOfBounds(player.x + player.velocityX)) {
        player.x += player.velocityX;
    }

    // player
    context.fillStyle = playerColor;
    context.fillRect(player.x, player.y, player.width, player.height);

    // ball
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();

    //bounce the ball off player paddle
    if (topCollision(ball, player) || bottomCollision(ball, player)) {
        playerColor = "#FFD580";
        clearTimeout(temporaryColorTimer);
        temporaryColorTimer = setTimeout(() => {
            playerColor = playerDefaultColor;
        }, temporaryColorDuration);
        
        ball.velocityY *= -1;   // flip y direction up or down
    }
    else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        playerColor = "#FFD580";
        clearTimeout(temporaryColorTimer);
        temporaryColorTimer = setTimeout(() => {
            playerColor = playerDefaultColor;
        }, temporaryColorDuration);
        
        ball.velocityX *= -1;   // flip x direction left or right
    }

    if (ball.y <= 0) { 
        // if ball touches top of canvas
        ball.velocityY *= -1; //reverse direction
    }
    else if (ball.x <= 0 || (ball.x + ball.width >= boardWidth)) {
        // if ball touches left or right of canvas
        ball.velocityX *= -1; //reverse direction
    }
    else if (ball.y + ball.height >= boardHeight) {
        // if ball touches bottom of canvas
        context.font = "20px sans-serif";
        context.fillText("Game Over: Press 'Space' to Restart", 80, 400);
        gameOver = true;
    }

    //blocks
    context.fillStyle = "white";
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                block.break = true;     // block is broken
                ball.velocityY *= -1;   // flip y direction up or down
                score += 100;
                blockCount -= 1;
            }
            else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                block.break = true;     // block is broken
                ball.velocityX *= -1;   // flip x direction left or right
                score += 100;
                blockCount -= 1;
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    //next level
    if (blockCount == 0) {
        score += 100*blockRows*blockColumns; //bonus points :)
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        createBlocks();
    }

    //score
    context.font = "20px sans-serif";
    context.fillText(score, 10, 25);
}

function outOfBounds(xPosition) {
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}

let leftPressed = false;
let rightPressed = false;

function movePlayer(e) {
    if (gameOver) {
        if (e.code == "Space") {
            resetGame();
            console.log("RESET");
        }
        return;
    }
    if (e.type === "keydown") {
        if (e.code == "ArrowLeft") {
            leftPressed = true;
        }
        else if (e.code == "ArrowRight") {
            rightPressed = true;
        }
    }
    else if (e.type === "keyup") {
        if (e.code == "ArrowLeft") {
            leftPressed = false;
        }
        else if (e.code == "ArrowRight") {
            rightPressed = false;
        }
    }
}


function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function topCollision(ball, block) { //a is above b (ball is above block)
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(ball, block) { //a is above b (ball is below block)
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftCollision(ball, block) { //a is left of b (ball is left of block)
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) { //a is right of b (ball is right of block)
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

function createBlocks() {
    blockArray = []; //clear blockArray
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x : blockX + c*blockWidth + c*10, //c*10 space 10 pixels apart columns
                y : blockY + r*blockHeight + r*10, //r*10 space 10 pixels apart rows
                width : blockWidth,
                height : blockHeight,
                break : false,
                color: "skyblue",
                collision: false,
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

function resetGame() {
    gameOver = false;
    player = {
        x: boardWidth / 2 - playerWidth / 2,
        y: boardHeight - playerHeight - 5,
        width: playerWidth,
        height: playerHeight,
        velocityX: playerVelocityX,
        color: playerDefaultColor
    };
    ball = {
        x: boardWidth / 2,
        y: boardHeight / 2,
        width: ballWidth,
        height: ballHeight,
        radius: 6,
        velocityX: ballVelocityX,
        velocityY: ballVelocityY
    };
    blockRows = 3;
    score = 0;
    createBlocks();

    clearTimeout(temporaryColorTimer);
    clearTimeout(returnTimer);
    playerVelocityY = 0;

    requestAnimationFrame(update);
}