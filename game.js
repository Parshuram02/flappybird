let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let bird, pipes, score, frame, gameOver;

function initGame() {
  bird = new Bird(100, canvas.height / 2);
  pipes = new Queue();
  score = new Score();
  frame = 0;
  gameOver = false;
}

function resetGame() {
  initGame();
  gameLoop();
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (gameOver) {
      resetGame(); // restart after game over
    } else {
      bird.flap(); // jump during gameplay
    }
  }
  if (e.key==="ArrowUp") {
    bird.flap(); // jump during gameplay
    }   
});11

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    // Update bird
    bird.update();
    bird.draw(ctx);

    // Add new pipes
    if (frame % 150 === 0) {
      pipes.enqueue(new Pipe(canvas.width, canvas.height));
    }

    // Update pipes
    let size = pipes.size();
    for (let i = 0; i < size; i++) {
      let pipe = pipes.items[i];
      pipe.update();
      pipe.draw(ctx, canvas.height);

      // Score check
      if (!pipe.passed && pipe.x + pipe.width < bird.x) {
        pipe.passed = true;
        score.increment();
      }

      // Collision check
      if (
        bird.x + bird.width > pipe.x &&
        bird.x < pipe.x + pipe.width &&
        (bird.y < pipe.top ||
          bird.y + bird.height > canvas.height - pipe.bottom)
      ) {
        gameOver = true;
      }
    }

    // Remove offscreen pipes
    if (!pipes.isEmpty() && pipes.front().offscreen()) {
      pipes.dequeue();
    }

    // Draw score
    score.draw(ctx);

    frame++;
    requestAnimationFrame(gameLoop);
  } else {
    // Game Over screen
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.fillText("GAME OVER", canvas.width / 4, canvas.height / 2);

    ctx.fillStyle = "black";
    ctx.font = "25px Arial";
    ctx.fillText("Final Score: " + score.value, canvas.width / 3, canvas.height / 2 + 40);
    ctx.fillText("Press SPACE to Restart", canvas.width / 4.5, canvas.height / 2 + 80);
  }
}

initGame();
gameLoop();
