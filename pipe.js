class Pipe {
  constructor(x, canvasHeight) {
    this.x = x;
    this.width = 80;
    this.gap = 190;     // ⬅️ wider gap for slower game
    this.speed = 1.5;   // ⬅️ slower pipe movement

    this.top = Math.floor(Math.random() * (canvasHeight - this.gap - 100)) + 50;
    this.bottom = canvasHeight - (this.top + this.gap);

    this.passed = false;
  }

  draw(ctx, canvasHeight) {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, 0, this.width, this.top);
    ctx.fillRect(this.x, canvasHeight - this.bottom, this.width, this.bottom);
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x + this.width < 0;
  }
}
