const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    color: 'white',
    speed: 5,
    dx: 0,
    dy: 0
};

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos() {
    player.x += player.dx;
    player.y += player.dy;

    // Wall detection
    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    if (player.y < 0) {
        player.y = 0;
    }

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

let score = 0;

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

let gameOver = false;

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 40);
}

function restartGame() {
    player.x = canvas.width / 2;
    player.y = canvas.height - 50;
    enemies.length = 0;
    projectiles.length = 0;
    score = 0;
    gameOver = false;
    update();
}

function checkCollisions() {
    // Projectiles with enemies
    for (let i = 0; i < projectiles.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (
                projectiles[i].x < enemies[j].x + enemies[j].width &&
                projectiles[i].x + projectiles[i].width > enemies[j].x &&
                projectiles[i].y < enemies[j].y + enemies[j].height &&
                projectiles[i].y + projectiles[i].height > enemies[j].y
            ) {
                projectiles.splice(i, 1);
                enemies.splice(j, 1);
                score++;
                i--;
                break;
            }
        }
    }

    // Player with enemies
    for (let i = 0; i < enemies.length; i++) {
        if (
            player.x < enemies[i].x + enemies[i].width &&
            player.x + player.width > enemies[i].x &&
            player.y < enemies[i].y + enemies[i].height &&
            player.y + player.height > enemies[i].y
        ) {
            gameOver = true;
        }
    }
}

function update() {
    clear();
    drawPlayer();
    newPos();
    requestAnimationFrame(update);
}

function move(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = -player.speed;
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
        player.dy = -player.speed;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        player.dy = player.speed;
    }
}

function stop(e) {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'd' ||
        e.key === 'ArrowLeft' ||
        e.key === 'a' ||
        e.key === 'ArrowUp' ||
        e.key === 'w' ||
        e.key === 'ArrowDown' ||
        e.key === 's'
    ) {
        player.dx = 0;
        player.dy = 0;
    }
}

const projectiles = [];

function shoot(e) {
    if (e.key === ' ') {
        projectiles.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10,
            color: 'red',
            speed: 7
        });
    }
}

function drawProjectiles() {
    for (let i = 0; i < projectiles.length; i++) {
        const p = projectiles[i];
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.width, p.height);
    }
}

function updateProjectiles() {
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].y -= projectiles[i].speed;
        if (projectiles[i].y < 0) {
            projectiles.splice(i, 1);
            i--;
        }
    }
}

const enemies = [];

function spawnEnemies() {
    setInterval(() => {
        const x = Math.random() * (canvas.width - 30);
        const y = -30;
        const width = 30;
        const height = 30;
        const color = 'green';
        const speed = 2;
        enemies.push({ x, y, width, height, color, speed });
    }, 1000);
}

function drawEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y, e.width, e.height);
    }
}

function updateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += enemies[i].speed;
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            i--;
        }
    }
}

function update() {
    if (gameOver) {
        drawGameOver();
        return;
    }
    clear();
    drawPlayer();
    drawProjectiles();
    drawEnemies();
    drawScore();
    newPos();
    updateProjectiles();
    updateEnemies();
    checkCollisions();
    requestAnimationFrame(update);
}

update();
spawnEnemies();

document.addEventListener('keydown', move);
document.addEventListener('keyup', stop);
document.addEventListener('keydown', e => {
    shoot(e);
    if (e.key === 'r' && gameOver) {
        restartGame();
    }
});
