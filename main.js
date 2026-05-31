const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const playBtn = document.getElementById("playBtn");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 0.7;
let skin = "cyan";

let gameStarted = false;
let paused = false;

let score = 0;
let coins = 0;

let gamemode = "cube";

let cameraShake = 0;

const stars = [];
const obstacles = [];
const particles = [];
const portals = [];
const jumpPads = [];
const coinObjects = [];

for (let i = 0; i < 100; i++) {

  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 3
  });
}

const player = {
  x: 150,
  y: 300,
  width: 40,
  height: 40,
  velocityY: 0,
  jumping: false,
  rotation: 0
};

function setSkin(color) {
  skin = color;
}

function restartGame() {

  obstacles.length = 0;
  particles.length = 0;
  portals.length = 0;
  jumpPads.length = 0;
  coinObjects.length = 0;

  player.y = 300;
  player.velocityY = 0;

  score = 0;
  coins = 0;

  gamemode = "cube";

  spawnPortals();
}

function createParticles(x, y) {

  for (let i = 0; i < 20; i++) {

    particles.push({
      x,
      y,
      dx: (Math.random() - 0.5) * 12,
      dy: (Math.random() - 0.5) * 12,
      size: Math.random() * 6 + 2,
      life: 60
    });
  }
}

function collision(a, b) {

  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function createObstacle() {

  let random = Math.random();

  if (random < 0.7) {

    obstacles.push({
      type: "spike",
      x: canvas.width,
      y: canvas.height - 100,
      width: 40,
      height: 40
    });

  } else {

    obstacles.push({
      type: "smallSpike",
      x: canvas.width,
      y: canvas.height - 80,
      width: 35,
      height: 20
    });
  }

  if (Math.random() < 0.3) {

    jumpPads.push({
      x: canvas.width + 200,
      y: canvas.height - 70,
      width: 40,
      height: 10
    });
  }

  if (Math.random() < 0.4) {

    coinObjects.push({
      x: canvas.width + 300,
      y: canvas.height - 200,
      width: 25,
      height: 25
    });
  }
}

setInterval(() => {

  if (gameStarted && !paused) {

    createObstacle();
  }

}, 1200);

function spawnPortals() {

  portals.push({
    x: canvas.width + 1200,
    y: canvas.height - 220,
    width: 60,
    height: 120,
    mode: "ship"
  });

  portals.push({
    x: canvas.width + 2600,
    y: canvas.height - 220,
    width: 60,
    height: 120,
    mode: "wave"
  });
}

spawnPortals();

function jump() {

  if (paused) return;

  if (gamemode === "cube") {

    if (!player.jumping) {

      player.velocityY = -14;

      player.jumping = true;
    }
  }
}

let holding = false;

window.addEventListener("keydown", (e) => {

  if (e.code === "Space") {

    if (gamemode === "cube") {

      jump();

    } else {

      holding = true;
    }
  }
});

window.addEventListener("keyup", (e) => {

  if (e.code === "Space") {

    holding = false;
  }
});

window.addEventListener("mousedown", (e) => {

  if (e.button === 1) {

    paused = !paused;

    return;
  }

  holding = true;

  if (gamemode === "cube") {

    jump();
  }
});

window.addEventListener("mouseup", () => {

  holding = false;
});

window.addEventListener("contextmenu", (e) => {

  e.preventDefault();
});

function drawTriangle(x, y, width, height) {

  ctx.beginPath();

  ctx.moveTo(x, y + height);

  ctx.lineTo(x + width / 2, y);

  ctx.lineTo(x + width, y + height);

  ctx.closePath();

  ctx.fill();
}

function drawBackground() {

  ctx.fillStyle = "#050510";

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";

  stars.forEach((star) => {

    ctx.fillRect(star.x, star.y, star.size, star.size);

    if (!paused) {

      star.x -= 1;

      if (star.x < 0) {

        star.x = canvas.width;
      }
    }
  });
}

function drawGround() {

  ctx.fillStyle = "#333";

  ctx.fillRect(
    0,
    canvas.height - 60,
    canvas.width,
    60
  );
}

function drawPlayer() {

  ctx.save();

  ctx.translate(
    player.x + player.width / 2 + (Math.random() * cameraShake),
    player.y + player.height / 2 + (Math.random() * cameraShake)
  );

  if (gamemode === "cube") {

    if (player.jumping) {

      player.rotation += 0.12;
    }

    ctx.rotate(player.rotation);

    ctx.fillStyle = skin;

    ctx.fillRect(
      -20,
      -20,
      40,
      40
    );
  }

  if (gamemode === "ship") {

    ctx.rotate(player.velocityY * 0.05);

    ctx.fillStyle = skin;

    ctx.beginPath();

    ctx.moveTo(-20, -15);
    ctx.lineTo(20, 0);
    ctx.lineTo(-20, 15);

    ctx.closePath();

    ctx.fill();

    ctx.fillStyle = "orange";

    ctx.fillRect(-30, -5, 10, 10);
  }

  if (gamemode === "wave") {

    ctx.strokeStyle = skin;

    ctx.lineWidth = 6;

    ctx.beginPath();

    ctx.moveTo(-20, 20);
    ctx.lineTo(20, -20);

    ctx.stroke();
  }

  ctx.restore();
}

function updatePlayer() {

  if (paused) return;

  if (gamemode === "cube") {

    player.velocityY += gravity;

    player.y += player.velocityY;

    let ground = canvas.height - 100;

    if (player.y > ground) {

      player.y = ground;

      player.velocityY = 0;

      player.jumping = false;
    }
  }

  if (gamemode === "ship") {

    if (holding) {

      player.velocityY -= 0.6;

    } else {

      player.velocityY += 0.4;
    }

    player.velocityY *= 0.98;

    player.y += player.velocityY;
  }

  if (gamemode === "wave") {

    if (holding) {

      player.y -= 8;

    } else {

      player.y += 8;
    }
  }

  if (player.y < 0) {

    player.y = 0;
  }

  if (player.y > canvas.height - 100) {

    createParticles(player.x, player.y);

    cameraShake = 20;

    restartGame();
  }
}

function drawObstacles() {

  obstacles.forEach((obj, index) => {

    if (!paused) {

      obj.x -= 7;
    }

    ctx.fillStyle = "red";

    drawTriangle(
      obj.x,
      obj.y,
      obj.width,
      obj.height
    );

    if (collision(player, obj)) {

      createParticles(player.x, player.y);

      cameraShake = 20;

      restartGame();
    }

    if (obj.x + obj.width < 0) {

      obstacles.splice(index, 1);

      score++;
    }
  });
}

function drawJumpPads() {

  jumpPads.forEach((pad) => {

    if (!paused) {

      pad.x -= 7;
    }

    ctx.fillStyle = "yellow";

    ctx.fillRect(
      pad.x,
      pad.y,
      pad.width,
      pad.height
    );

    if (collision(player, pad)) {

      player.velocityY = -18;
    }
  });
}

function drawCoins() {

  coinObjects.forEach((coin, index) => {

    if (!paused) {

      coin.x -= 7;
    }

    ctx.fillStyle = "gold";

    ctx.beginPath();

    ctx.arc(
      coin.x,
      coin.y,
      12,
      0,
      Math.PI * 2
    );

    ctx.fill();

    if (collision(player, coin)) {

      coinObjects.splice(index, 1);

      coins++;
    }
  });
}

function drawPortals() {

  portals.forEach((portal) => {

    if (!paused) {

      portal.x -= 7;
    }

    if (portal.mode === "ship") {

      ctx.fillStyle = "cyan";

    } else {

      ctx.fillStyle = "lime";
    }

    ctx.fillRect(
      portal.x,
      portal.y,
      portal.width,
      portal.height
    );

    if (collision(player, portal)) {

      gamemode = portal.mode;
    }
  });
}

function drawParticles() {

  particles.forEach((p, index) => {

    p.x += p.dx;
    p.y += p.dy;

    p.life--;

    ctx.fillStyle = skin;

    ctx.fillRect(
      p.x,
      p.y,
      p.size,
      p.size
    );

    if (p.life <= 0) {

      particles.splice(index, 1);
    }
  });
}

function drawUI() {

  ctx.fillStyle = "white";

  ctx.font = "30px Arial";

  ctx.fillText(
    "Score: " + score,
    40,
    50
  );

  ctx.fillText(
    "Coins: " + coins,
    40,
    90
  );

  ctx.fillText(
    "Mode: " + gamemode,
    40,
    130
  );

  if (paused) {

    ctx.font = "70px Arial";

    ctx.fillText(
      "PAUSED",
      canvas.width / 2 - 150,
      canvas.height / 2
    );
  }
}

function gameLoop() {

  drawBackground();

  drawGround();

  drawPortals();

  drawJumpPads();

  drawCoins();

  drawPlayer();

  drawObstacles();

  drawParticles();

  updatePlayer();

  drawUI();

  if (cameraShake > 0) {

    cameraShake -= 1;
  }

  requestAnimationFrame(gameLoop);
}

playBtn.addEventListener("click", () => {

  menu.style.display = "none";

  canvas.style.display = "block";

  gameStarted = true;

  gameLoop();
});