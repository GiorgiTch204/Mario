const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRAVITY = 0.6;
const JUMP_STRENGTH = -10;
const PLAYER_SPEED = 4;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 50;
const PLATFORM_HEIGHT = 10;

let player = {
    x: 50,
    y: canvas.height - PLAYER_HEIGHT - PLATFORM_HEIGHT, 
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    speedY: 0,
    grounded: true,
    jumping: false
};

let platforms = [
    { x: 0, y: canvas.height - PLATFORM_HEIGHT, width: canvas.width, height: PLATFORM_HEIGHT }, 
    { x: 150, y: 300, width: 100, height: PLATFORM_HEIGHT }, 
    { x: 350, y: 250, width: 100, height: PLATFORM_HEIGHT }, 
    { x: 550, y: 200, width: 100, height: PLATFORM_HEIGHT }  
];

let keys = {
    right: false,
    left: false,
    jump: false
};

document.addEventListener('keydown', function (event) {
    if (event.code === "ArrowRight") keys.right = true;
    if (event.code === "ArrowLeft") keys.left = true;
    if (event.code === "Space") keys.jump = true;
});

document.addEventListener('keyup', function (event) {
    if (event.code === "ArrowRight") keys.right = false;
    if (event.code === "ArrowLeft") keys.left = false;
    if (event.code === "Space") keys.jump = false;
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    if (keys.right) {
        player.x += PLAYER_SPEED;
    }
    if (keys.left) {
        player.x -= PLAYER_SPEED;
    }

    if (keys.jump && player.grounded) {
        player.speedY = JUMP_STRENGTH;
        player.grounded = false;
        player.jumping = true;
    }

    player.y += player.speedY;
    player.speedY += GRAVITY;

    checkCollision();

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function checkCollision() {
    player.grounded = false;

    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height < platform.y + PLATFORM_HEIGHT &&
            player.y + player.height + player.speedY >= platform.y) {

            player.y = platform.y - player.height;
            player.speedY = 0;
            player.grounded = true;
            player.jumping = false;
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "brown";
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

gameLoop();
