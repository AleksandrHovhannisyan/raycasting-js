import Vector from "../lib/Vector.ts";
import { Color, Screen } from "../lib/constants.ts";
import Canvas from "../lib/Canvas.ts";

export default class Wall {
  public start: Vector;
  public end: Vector;

  constructor(start: Vector, end: Vector) {
    this.start = start;
    this.end = end;
  }

  /** Draws the wall on a canvas.
   */
  draw(canvas: Canvas) {
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
 */
export const createWalls = (numWalls: number, canvasWidth: number, canvasHeight: number) => {
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