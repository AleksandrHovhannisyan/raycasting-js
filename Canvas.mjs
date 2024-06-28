// TODO: use custom element
export default class Canvas {
  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext("2d");
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
   * @param {string} color
   */
  fill(color) {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.width, this.height);
  }

  /** Draws a circle on the canvas at the specified coordinates.
   * @param {{ x: number; y: number; radius: number; color: string }}
   */
  circle({ x, y, radius, color }) {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2, false);
    this.context.fill();
  }

  /** Draws a line on the canvas from `(x1, y1)` to `(x2, y2)`.
   * @param {{ x1: number; y1: number; x2: number; y2: number; color: string; strokeWidth: number }}
   */
  line({ x1, y1, x2, y2, color, strokeWidth = 1 }) {
    this.context.strokeStyle = color;
    this.context.lineWidth = strokeWidth;
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }
}
