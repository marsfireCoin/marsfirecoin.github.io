const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

const rover = {
    x: 50,
    y: canvas.height - 60,
    width: 50,
    height: 30,
    speed: 5,
    image: new Image()
};
rover.image.src = "assets/rover.png";

const obstacles = [];
const coins = [];
const powerUps = [];
let score = 0;

function spawnObstacle() {
    obstacles.push({ x: canvas.width, y: Math.random() * (canvas.height - 50), width: 30, height: 30, image: new Image() });
    obstacles[obstacles.length - 1].image.src = "assets/asteroid.png";
}

function spawnCoin() {
    coins.push({ x: canvas.width, y: Math.random() * (canvas.height - 50), width: 20, height: 20, image: new Image() });
    coins[coins.length - 1].image.src = "assets/mfc-coin.png";
}

function spawnPowerUp() {
    powerUps.push({ x: canvas.width, y: Math.random() * (canvas.height - 50), width: 25, height: 25, image: new Image() });
    powerUps[powerUps.length - 1].image.src = "assets/power-up.png";
}

function drawRover() {
    ctx.drawImage(rover.image, rover.x, rover.y, rover.width, rover.height);
}

function drawObstacles() {
    obstacles.forEach((obstacle, index) => {
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        obstacle.x -= 3;
        if (obstacle.x + obstacle.width < 0) obstacles.splice(index, 1);
    });
}

function drawCoins() {
    coins.forEach((coin, index) => {
        ctx.drawImage(coin.image, coin.x, coin.y, coin.width, coin.height);
        coin.x -= 3;
        if (coin.x + coin.width < 0) coins.splice(index, 1);
    });
}

function drawPowerUps() {
    powerUps.forEach((powerUp, index) => {
        ctx.drawImage(powerUp.image, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        powerUp.x -= 3;
        if (powerUp.x + powerUp.width < 0) powerUps.splice(index, 1);
    });
}

function checkCollisions() {
    coins.forEach((coin, index) => {
        if (rover.x < coin.x + coin.width && rover.x + rover.width > coin.x && rover.y < coin.y + coin.height && rover.y + rover.height > coin.y) {
            coins.splice(index, 1);
            score += 10;
            rewardMFC(1); // Reward 1 MFC per coin collected
        }
    });
    obstacles.forEach((obstacle) => {
        if (rover.x < obstacle.x + obstacle.width && rover.x + rover.width > obstacle.x && rover.y < obstacle.y + obstacle.height && rover.y + rover.height > obstacle.y) {
            alert("Game Over! Score: " + score);
            document.location.reload();
        }
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRover();
    drawObstacles();
    drawCoins();
    drawPowerUps();
    checkCollisions();
    requestAnimationFrame(update);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && rover.y > 0) {
        rover.y -= rover.speed;
    } else if (event.key === "ArrowDown" && rover.y < canvas.height - rover.height) {
        rover.y += rover.speed;
    }
});

setInterval(spawnObstacle, 2000);
setInterval(spawnCoin, 3000);
setInterval(spawnPowerUp, 5000);

update();
