// Obtém o elemento canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define as propriedades do jogador
const player = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  width: 30,
  height: 30,
  color: "blue",
  speed: 8,
  lives: 4,
  level: 1,
  xp: 0,
  xpNeeded: 2,
};

// Define as propriedades do tiro
const bullet = {
  x: player.x,
  y: player.y,
  width: 5,
  height: 10,
  color: "red",
  speed: 10,
  isFired: false,
};

// Define as propriedades dos inimigos
let enemies = [];
let enemySpeed = 1;
let enemyHealth = 1;
let enemySpawnTime = 3400; // 3.4 segundos

// Define as propriedades do fundo
const backgroundColor = "black";

// Define as propriedades dos corações
const heartIcon = {
  x: 10,
  y: 10,
  width: 20,
  height: 20,
  color: "red",
  spacing: 5,
};

// Função para criar um inimigo
function createEnemy() {
  const enemy = {
    x: Math.random() * (canvas.width - 30),
    y: 0,
    width: 30,
    height: 30,
    color: "green",
    speed: enemySpeed,
    health: enemyHealth,
  };
  enemies.push(enemy);
}

// Função para desenhar o jogador
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Função para desenhar o tiro
function drawBullet() {
  ctx.fillStyle = bullet.color;
  ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

// Função para desenhar os inimigos
function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// Função para desenhar as vidas do jogador
function drawLives() {
  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText(`Vidas:`, heartIcon.x, heartIcon.y + heartIcon.height + 20);

  for (let i = 0; i < player.lives; i++) {
    const heartX = heartIcon.x + (heartIcon.width + heartIcon.spacing) * i;
    ctx.strokeStyle = heartIcon.color;
    ctx.fillStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(heartX + heartIcon.width / 2, heartIcon.y + heartIcon.height / 2, heartIcon.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

// Função para desenhar a barra de experiência
function drawExperienceBar() {
  const barWidth = 100;
  const barHeight = 10;
  const barX = 10 + heartIcon.width + heartIcon.spacing;
  const barY = heartIcon.y;
  const xpPercentage = (player.xp / player.xpNeeded) * barWidth;

  ctx.fillStyle = "yellow";
  ctx.fillRect(barX, barY, xpPercentage, barHeight);
  ctx.strokeStyle = "white";
  ctx.strokeRect(barX, barY, barWidth, barHeight);

  ctx.fillStyle = "white";
  ctx.font = "14px Arial";
  ctx.fillText(`Nível: ${player.level}`, barX, barY - 10);
}

// Função para atualizar a posição do jogador
function updatePlayer() {
  if (player.x <= 0) player.x = 0;
  if (player.x + player.width >= canvas.width) player.x = canvas.width - player.width;
  if (player.y <= 0) player.y = 0;
  if (player.y + player.height >= canvas.height) player.y = canvas.height - player.height;
}

// Função para atualizar a posição do tiro
function updateBullet() {
  if (bullet.isFired) {
    bullet.y -= bullet.speed;
    if (bullet.y <= 0) {
      bullet.isFired = false;
      bullet.y = player.y;
    }
  } else {
    bullet.x = player.x + player.width / 2 - bullet.width / 2;
  }
}

// Função para atualizar a posição dos inimigos
function updateEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;
    if (enemy.y >= canvas.height) {
      enemies.splice(index, 1);
      player.lives--;
    }

    // Verifica colisão entre tiro e inimigo
    if (
      bullet.isFired &&
      bullet.x < enemy.x + enemy.width &&
      bullet.x + bullet.width > enemy.x &&
      bullet.y < enemy.y + enemy.height &&
      bullet.y + bullet.height > enemy.y
    ) {
      bullet.isFired = false;
      enemy.health--;

      if (enemy.health <= 0) {
        enemies.splice(index, 1);
        player.xp++;

        // Verifica se o jogador passou de nível
        if (player.xp >= player.xpNeeded) {
          player.level++;
          player.xp = 0;
          player.xpNeeded += 2;
          player.speed += 1;
          player.width += 5;
          bullet.speed += 1;
          enemyHealth++;
          enemySpeed += 0.5;
        }
      }
    }
  });
}

// Função para desenhar o jogo
function draw() {
  // Desenha o fundo
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawBullet();
  drawEnemies();
  drawLives();
  drawExperienceBar();
}

// Função de loop do jogo
function gameLoop() {
  updatePlayer();
  updateBullet();
  updateEnemies();
  draw();

  if (player.lives <= 0) {
    // Fim do jogo
    alert("Game Over");
    return;
  }

  requestAnimationFrame(gameLoop);
}

// Função para controlar o movimento do jogador
function handleKeyPress(event) {
  if (event.key === "ArrowLeft") {
    player.x -= player.speed;
  } else if (event.key === "ArrowRight") {
    player.x += player.speed;
  } else if (event.key === "ArrowUp") {
    player.y -= player.speed;
  } else if (event.key === "ArrowDown") {
    player.y += player.speed;
  } else if (event.key === " ") {
    bullet.isFired = true;
  }
}

// Adiciona o evento de pressionar tecla para controlar o jogador
document.addEventListener("keydown", handleKeyPress);

// Cria um inimigo a cada 3.4 segundos
setInterval(createEnemy, enemySpawnTime);

// Inicia o loop do jogo
gameLoop();