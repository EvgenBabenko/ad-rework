export class RainDrop {
  static pool: RainDrop[] = [];

  id: string = "";
  className: string = "";
  scale: number = 0;
  opacity: number = 0;
  translateX: number = 0;
  translateY: number = 0;
  active: boolean = false;
  slipDownSpeed: number = 0;
  weight: number = 0;

  constructor() {
    this.reset();
  }

  reset() {
    this.id = Math.random().toString(36).slice(2); // Unique ID
    this.className = "raindrop_" + Math.floor(this.random(1, 4));
    this.scale = this.random(5, 7);
    this.opacity = 0;
    this.translateX = this.random(0, 470);
    this.translateY = this.random(0, 200);
    this.active = true;
    this.slipDownSpeed = this.random(1, 6);
    this.weight = 1;
  }

  getStyle() {
    const matrix = `matrix(${this.scale}, 0, 0, ${this.scale}, ${this.translateX}, ${this.translateY})`;

    return {
      transform: matrix,
      opacity: this.opacity,
    };
  }

  update() {
    if (!this.active) return;

    // this is falling down
    if (this.scale > 1) {
      this.scale -= 1.5;
      this.opacity = Math.min(this.opacity + 0.1, 1);
    } else {
      this.opacity = 1;
    }

    // this is sliding
    this.translateY += this.slipDownSpeed;

    if (this.translateY >= 255) {
      this.active = false;
    }
  }

  // destroy() {
  //   this.active = false;
  //   RainDrop.pool.push(this);
  // }

  random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  static getInstance(): RainDrop {
    return RainDrop.pool.length > 0
      ? (RainDrop.pool.pop() as RainDrop)
      : new RainDrop();
  }
}
