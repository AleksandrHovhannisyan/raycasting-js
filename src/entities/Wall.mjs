import Vector from "../lib/Vector.mjs";
import { Color, Screen } from "../lib/constants.mjs";

export default class Wall {
  /**
   * 
   * @param {Vector} start 
   * @param {Vector} end 
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

/**
 * Creates and returns randomly generated walls within the given canvas bounds.
 * @param {number} numWalls
 * @param {number} canvasWidth 
 * @param {number} canvasHeight 
 * @returns 
 */
export const createWalls = (numWalls, canvasWidth, canvasHeight) => {
  const walls = Array.from({ length: numWalls }, () => {
    const x1 = Math.random() * canvasWidth;
    const y1 = Math.random() * canvasHeight;
    const x2 = Math.random() * canvasWidth;
    const y2 = Math.random() * canvasHeight;
    return new Wall(new Vector(x1, y1), new Vector(x2, y2));
  });
  const wallTop = new Wall(
    new Vector(Screen.PADDING, Screen.PADDING),
    new Vector(canvasWidth - Screen.PADDING, Screen.PADDING)
  );
  const wallRight = new Wall(
    new Vector(canvasWidth - Screen.PADDING, Screen.PADDING),
    new Vector(canvasWidth - Screen.PADDING, canvasHeight - Screen.PADDING)
  );
  const wallBottom = new Wall(
    new Vector(canvasWidth - Screen.PADDING, canvasHeight - Screen.PADDING),
    new Vector(Screen.PADDING, canvasHeight - Screen.PADDING)
  );
  const wallLeft = new Wall(
    new Vector(Screen.PADDING, canvasHeight - Screen.PADDING),
    new Vector(Screen.PADDING, Screen.PADDING)
  );
  walls.push(wallTop);
  walls.push(wallRight);
  walls.push(wallBottom);
  walls.push(wallLeft);
  return walls;
}