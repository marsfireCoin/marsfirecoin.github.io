const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 500;

document.body.style.background = "#121212";
document.body.style.color = "white";
document.body.style.textAlign = "center";
document.body.style.fontFamily = "Arial, sans-serif";

const gameContainer = document.createElement("div");
gameContainer.style.display = "flex";
gameContainer.style.flexDirection = "column";
gameContainer.style.alignItems = "center";
document.body.appendChild(gameContainer);

gameContainer.appendChild(canvas);

const rover = {
    x: 50,
    y: canvas.height - 70,
    width: 60,
    height: 40,
    speed: 6,
    image: new Image()
};
rover.image.src = "assets/rover.png";

const obstacles = [];
const coins = [];
const powerUps = [];
let score = 0;
let gameOver = false;

const scoreDisplay = document.createElement("p");
scoreDisplay.style.fontSize = "20px";
scoreDisplay.style.marginTop = "10px";
gameContainer.appendChild(scoreDisplay);

function updateScore() {
    scoreDisplay.innerText = `Score: ${score}`;
}

function spawnObstacle() {
    obstacles.push({ x: canvas.width, y: Math.random() * (canvas.height - 50), width: 35, height: 35, image: new Image() });
    obstacles[obstacles.length - 1].image.src = "assets/asteroid.png";
}

function spawnCoin() {
    coins.push({ x: canvas.width, y: Math.random() * (canvas.height - 50), width: 25, height: 25, image: new Image() });
    coins[coins.length - 1].image.src = "assets/mfc-coin.png";
}

function spawnPowerUp() {
    powerUps.push({ x: canvas.width, y: Math.random() * (canvas.height - 50), width: 30, height: 30, image: new Image() });
    powerUps[powerUps.length - 1].image.src = "assets/power-up.png";
}

function drawRover() {
    ctx.drawImage(rover.image, rover.x, rover.y, rover.width, rover.height);
}

function drawObstacles() {
    obstacles.forEach((obstacle, index) => {
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        obstacle.x -= 4;
        if (obstacle.x + obstacle.width < 0) obstacles.splice(index, 1);
    });
}

function drawCoins() {
    coins.forEach((coin, index) => {
        ctx.drawImage(coin.image, coin.x, coin.y, coin.width, coin.height);
        coin.x -= 4;
        if (coin.x + coin.width < 0) coins.splice(index, 1);
    });
}

function drawPowerUps() {
    powerUps.forEach((powerUp, index) => {
        ctx.drawImage(powerUp.image, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        powerUp.x -= 4;
        if (powerUp.x + powerUp.width < 0) powerUps.splice(index, 1);
    });
}

function checkCollisions() {
    if (gameOver) return;

    coins.forEach((coin, index) => {
        if (rover.x < coin.x + coin.width && rover.x + rover.width > coin.x && rover.y < coin.y + coin.height && rover.y + rover.height > coin.y) {
            coins.splice(index, 1);
            score += 10;
            updateScore();
            rewardMFC(1);
        }
    });

    obstacles.forEach((obstacle) => {
        if (rover.x < obstacle.x + obstacle.width && rover.x + rover.width > obstacle.x && rover.y < obstacle.y + obstacle.height && rover.y + rover.height > obstacle.y) {
            gameOver = true;
            setTimeout(() => {
                alert("Game Over! Score: " + score);
                document.location.reload();
            }, 100);
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

updateScore();
update();
