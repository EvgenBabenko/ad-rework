import { RainDrop } from "./rain-drop";

export class Rain {
  private activeDrops: number;
  private timerID: number | null;

  constructor(
    private container: React.RefObject<HTMLDivElement | null>,
    private maxDrops: number,
    private spawnInterval: number
  ) {
    this.activeDrops = 0;
    this.timerID = null;
  }

  start() {
    if (this.timerID) {
      return;
    }

    this.timerID = setInterval(() => {
      if (this.activeDrops < this.maxDrops) {
        this.spawnDrop();
      }
    }, this.spawnInterval);
  }

  stop() {
    if (this.timerID) {
      clearInterval(this.timerID);
      this.timerID = null;
    }
  }

  spawnDrop() {
    this.activeDrops++;
    const drop = RainDrop.getInstance(this.container);

    // When drop is recycled, count it back
    const originalDestroy = drop.destroy.bind(drop);
    drop.destroy = () => {
      originalDestroy();
      this.activeDrops--;
    };
  }
}
