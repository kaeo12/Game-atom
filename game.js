const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 220, y: 580, width: 40, height: 20 };
let bullets = [];
let enemies = [];
let keys = {};

document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

function drawPlayer() {
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
  ctx.fillStyle = "red";
  bullets.forEach((b, i) => {
    b.y -= 5;
    ctx.fillRect(b.x, b.y, 4, 10);
    if (b.y < 0) bullets.splice(i, 1);
  });
}

function spawnEnemies() {
  if (Math.random() < 0.02) {
    enemies.push({ x: Math.random() * 440, y: 0, size: 30 });
  }
}

function drawEnemies() {
  ctx.fillStyle = "white";
  enemies.forEach((e, i) => {
    e.y += 2;
    ctx.fillRect(e.x, e.y, e.size, e.size);
    if (e.y > 640) enemies.splice(i, 1);
  });
}

function shoot() {
  if (keys[" "] || keys["ArrowUp"]) {
    bullets.push({ x: player.x + player.width / 2 - 2, y: player.y });
  }
}

function updatePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) player.x -= 5;
  if (keys["ArrowRight"] && player.x + player.width < 480) player.x += 5;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlayer();
  shoot();
  drawPlayer();
  drawBullets();
  spawnEnemies();
  drawEnemies();
  requestAnimationFrame(gameLoop);
}

gameLoop();
