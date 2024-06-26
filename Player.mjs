import Camera from "./Camera.mjs";
import { Color } from "./constants.mjs";

export default class Player {
  /** 
   * @param {{ position: import("./Vector.mjs").default; speed: number; fovDegrees: number }}
   */
  constructor({ position, speed = 1, fovDegrees }) {
    this.position = position;
    this.speed = speed;
    this.camera = new Camera(position, fovDegrees);
  }

  /** Moves by the specified x and y deltas. 
   * @param {number} dx
   * @param {number} dy
  */
  moveBy(dx, dy) {
    this.position.x += dx * this.speed;
    this.position.y += dy * this.speed;
  }

  /**
   * 
   * @param {(import("./Wall.mjs").default)[]} walls 
   */
  see(walls) {
    return this.camera.cast(walls);
  }

  /** Draws the player on a canvas.
   * @param {import("./Canvas.mjs").default} canvas
   */
  draw(canvas) {
    canvas.circle({
      x: this.position.x,
      y: this.position.y,
      radius: 2,
      color: Color.BLACK,
    });
  }
}
