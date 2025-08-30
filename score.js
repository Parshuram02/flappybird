class Score {
  constructor() {
    this.value = 0;
  }

  increment() {
    this.value++;
  }

  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + this.value, 20, 50);
  }
}
