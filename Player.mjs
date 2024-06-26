import Camera from "./Camera.mjs";
import { Color, FIELD_OF_VIEW } from "./constants.mjs";

export default class Player {
  /** 
   * @param {import("./Vector.mjs").default} position
   * @param {number} speed
   */
  constructor(position, speed = 1) {
    this.position = position;
    this.speed = speed;
    this.camera = new Camera(position, FIELD_OF_VIEW);
  }

  /** Moves by the specified x and y deltas. 
   * @param {number} dx
   * @param {number} dy
  */
  moveBy(dx, dy) {
    this.position.x += dx;
    this.position.y += dy;
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
