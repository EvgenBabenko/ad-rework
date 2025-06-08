export class RainDrop {
  // static pool: RainDrop[] = [];

  /** unique id */
  id: string = "";
  className: string = "";
  scale: number = 0;
  scaleEnd: number = 0;
  opacity: number = 0;
  translateX: number = 0;
  translateY: number = 0;
  active: boolean = false;
  slipDownSpeed: number = 0;
  dropDownSpeed: number = 0;
  hasLanded: boolean = false;

  constructor() {
    this.reset();
  }

  reset() {
    this.id = Math.random().toString(36).slice(2);
    this.className = "raindrop_" + Math.floor(this.random(1, 4));
    this.scale = this.random(5, 15);
    this.scaleEnd = this.random(0.3, 0.9);
    this.opacity = 0;
    this.translateX = this.random(0, 360);
    this.translateY = this.random(0, 200);
    this.active = true;
    this.slipDownSpeed = this.random(1, 6);
    this.dropDownSpeed = this.random(1.2, 2.5);
    this.hasLanded = false;
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

    // drop down
    if (!this.hasLanded) {
      this.scale = Math.max(this.scale - this.dropDownSpeed, this.scaleEnd);
      this.opacity = Math.min(this.opacity + 0.15, 1);

      if (this.scale === this.scaleEnd) {
        this.opacity = 1;
        this.hasLanded = true;
      }
    }

    // slip down
    this.translateY += this.slipDownSpeed;

    if (this.translateY >= 250) {
      this.active = false;
      // RainDrop.pool.push(this); // return to pool
    }
  }

  random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // static getInstance(): RainDrop {
  //   return RainDrop.pool.length > 0
  //     ? (RainDrop.pool.pop() as RainDrop)
  //     : new RainDrop();
  // }
}
