class Bird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
    this.gravity = 0.25;  // ⬅️ much slower fall
    this.lift = -6;       // ⬅️ gentler flap
    this.velocity = 0;

    this.img = new Image();
    this.img.src = "bird.png";
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // Bottom collision
    if (this.y + this.height > 700) {
      this.y = 700 - this.height;
      this.velocity = 0;
    }

    // Top collision
    if (this.y < 0) this.y = 0;
  }

  flap() {
    this.velocity = this.lift;
  }
}
