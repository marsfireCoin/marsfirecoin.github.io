// game.js - Updated Version
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

const spaceship = { x: 400, y: 400, width: 40, height: 40, speed: 5 };
const coins = [];
const asteroids = [];
let score = 0;

document.addEventListener("keydown", moveSpaceship);

function moveSpaceship(event) {
    if (event.key === "ArrowLeft" && spaceship.x > 0) spaceship.x -= spaceship.speed;
    if (event.key === "ArrowRight" && spaceship.x < canvas.width - spaceship.width) spaceship.x += spaceship.speed;
    if (event.key === "ArrowUp" && spaceship.y > 0) spaceship.y -= spaceship.speed;
    if (event.key === "ArrowDown" && spaceship.y < canvas.height - spaceship.height) spaceship.y += spaceship.speed;
}

function spawnCoin() {
    coins.push({ x: Math.random() * (canvas.width - 20), y: Math.random() * (canvas.height - 20), size: 20 });
}

function spawnAsteroid() {
    asteroids.push({ x: Math.random() * canvas.width, y: 0, size: 30, speed: Math.random() * 3 + 2 });
}

function drawSpaceship() {
    ctx.fillStyle = "white";
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawCoins() {
    ctx.fillStyle = "gold";
    coins.forEach((coin, index) => {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.size / 2, 0, Math.PI * 2);
        ctx.fill();
        if (detectCollision(spaceship, coin)) {
            coins.splice(index, 1);
            score += 10;
            spawnCoin();
        }
    });
}

function drawAsteroids() {
    ctx.fillStyle = "gray";
    asteroids.forEach((asteroid, index) => {
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.size / 2, 0, Math.PI * 2);
        ctx.fill();
        asteroid.y += asteroid.speed;
        if (asteroid.y > canvas.height) asteroids.splice(index, 1);
        if (detectCollision(spaceship, asteroid)) gameOver();
    });
}

function detectCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.size &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.size &&
           obj1.y + obj1.height > obj2.y;
}

function gameOver() {
    alert("Game Over! Score: " + score);
    document.location.reload();
}

async function rewardPlayer() {
    if (!signer || !userAddress) {
        alert("Connect Wallet First!");
        return;
    }

    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const amount = ethers.utils.parseUnits("10", 18);

    try {
        const tx = await contract.transfer(userAddress, amount);
        await tx.wait();
        alert("10 MarsFireCoin Sent to Your Wallet!");
    } catch (error) {
        console.error("Transaction failed", error);
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    drawCoins();
    drawAsteroids();
    if (score >= 50) rewardPlayer();
    requestAnimationFrame(update);
}

spawnCoin();
setInterval(spawnAsteroid, 2000);
update();
