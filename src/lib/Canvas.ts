export default class Canvas {
  public canvas: HTMLCanvasElement;
  protected context: CanvasRenderingContext2D;

  constructor(width: number, height: number) {
    this.canvas = document.createElement("canvas");
    this.canvas.style.maxWidth = '100%';
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext("2d")!;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  /** Clears all drawings from the canvas. */
  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  /** Fills the canvas with a solid color.
   */
  fill(color: string) {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.width, this.height);
  }

  /** Draws a circle on the canvas at the specified coordinates. */
  circle({ x, y, radius, color }: { x: number; y: number; radius: number; color: string }) {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2, false);
    this.context.fill();
  }

  /** Draws a line on the canvas from `(x1, y1)` to `(x2, y2)`. */
  line({ x1, y1, x2, y2, color, strokeWidth = 1 }: { x1: number; y1: number; x2: number; y2: number; color: string; strokeWidth?: number }) {
    this.context.strokeStyle = color;
    this.context.lineWidth = strokeWidth;
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }
}
