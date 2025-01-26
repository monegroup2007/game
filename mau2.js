const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const canvasSize = 400;
let snake = [{ x: 200, y: 200 }];
let food = { x: 100, y: 100 };
let direction = { x: 0, y: -1 }; // Ban đầu rắn đi lên
let score = 0;
let speed = 150;
const obstacles = [
  { x: 140, y: 140 },
  { x: 240, y: 240 }
];

// Lấy âm thanh
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');

// Vẽ canvas
function clearCanvas() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvasSize, canvasSize);
}

// Vẽ rắn
function drawSnake() {
  ctx.fillStyle = 'lime';
  snake.forEach(part => {
    ctx.fillRect(part.x, part.y, gridSize, gridSize);
  });
}

// Vẽ thức ăn
function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Vẽ chướng ngại vật
function drawObstacles() {
  ctx.fillStyle = 'gray';
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, gridSize, gridSize);
  });
}

// Di chuyển rắn
function moveSnake() {
  const head = { x: snake[0].x + direction.x * gridSize, y: snake[0].y + direction.y * gridSize };

  // Kiểm tra ăn thức ăn
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').innerText = score;
    eatSound.play();
    generateFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

// Kiểm tra va chạm
function checkCollision() {
  const head = snake[0];
  // Va chạm với tường
  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
    return true;
  }
  // Va chạm với chính mình
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  // Va chạm với chướng ngại vật
  for (const obstacle of obstacles) {
    if (head.x === obstacle.x && head.y === obstacle.y) {
      return true;
    }
  }
  return false;
}

// Sinh thức ăn mới
function generateFood() {
  food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
  food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

// Điều khiển rắn
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowUp' && direction.y === 0) {
    direction = { x: 0, y: -1 };
  } else if (event.key === 'ArrowDown' && direction.y === 0) {
    direction = { x: 0, y: 1 };
  } else if (event.key === 'ArrowLeft' && direction.x === 0) {
    direction = { x: -1, y: 0 };
  } else if (event.key === 'ArrowRight' && direction.x === 0) {
    direction = { x: 1, y: 0 };
  }
});

// Chọn độ khó
function setDifficulty(level) {
  if (level === 'easy') speed = 200;
  else if (level === 'medium') speed = 150;
  else if (level === 'hard') speed = 100;

  document.location.reload();
}

// Vòng lặp trò chơi
function gameLoop() {
  if (checkCollision()) {
    gameOverSound.play();
    alert('Game Over! Score: ' + score);
    document.location.reload();
    return;
  }

  setTimeout(() => {
    clearCanvas();
    drawFood();
    drawObstacles();
    moveSnake();
    drawSnake();
    gameLoop();
  }, speed - Math.min(score * 10, 100)); // Tăng tốc độ khi điểm tăng
}

// Bắt đầu trò chơi
generateFood();
gameLoop();
