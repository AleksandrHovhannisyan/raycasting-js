import { Color } from "./constants.mjs";

export default class Wall {
  /**
   * 
   * @param {import("./Vector.mjs").default} start 
   * @param {import("./Vector.mjs").default} end 
   */
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  /** Draws the wall on a canvas.
   * @param {import("./Canvas.mjs").default} canvas
   */
  draw(canvas) {
    canvas.line({
      x1: this.start.x,
      y1: this.start.y,
      x2: this.end.x,
      y2: this.end.y,
      color: Color.BLACK,
    });
  }
}
