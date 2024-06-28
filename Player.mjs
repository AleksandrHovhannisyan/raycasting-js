import Camera from "./Camera.mjs";
import Vector from "./Vector.mjs";
import { Color } from "./constants.mjs";
import { toDegrees } from "./utils.mjs";

export default class Player {
  /** 
   * @param {{ position: import("./Vector.mjs").default; speed: number; angle?: number; fovDegrees: number }}
   */
  constructor({ position, speed = 1, angle = 0, fovDegrees }) {
    this.position = position;
    this.speed = speed;
    this.angle = angle;
    this.camera = new Camera({ position, angle, fovDegrees });
  }

  /** A unit vector representing this player's direction/heading. */
  get direction() {
    return Vector.fromAngle(this.angle).normalized();
  }

  /**
   * @param {number} angleDeltaRadians 
   */
  turnByRadians(angleDeltaRadians) {
    this.angle += angleDeltaRadians;
    this.camera.turnByRadians(angleDeltaRadians);
  }

  /** Moves by the specified x and y deltas. 
   * @param {import("./Vector.mjs").default} direction
  */
  move(direction) {
    this.position.x += direction.x * this.speed;
    this.position.y += direction.y * this.speed;
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
      radius: 4,
      color: Color.BLACK,
    });
    canvas.line({
      x1: this.position.x,
      y1: this.position.y,
      x2: this.position.x + this.direction.x * 20,
      y2: this.position.y + this.direction.y * 20,
      color: Color.BLACK,
      strokeWidth: 2,
    })
  }
}
