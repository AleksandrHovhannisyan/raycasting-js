import Camera from "./Camera.mjs";
import Vector from "./Vector.mjs";
import { Color } from "./constants.mjs";

export default class Player {
  /**
   * @param {{ position: Vector; speed: number; direction?: Vector; fovDegrees: number }}
   */
  constructor({ position, speed = 1, direction, fovDegrees }) {
    this.position = position;
    this.speed = speed;
    this.direction = direction.normalized() ?? new Vector(1, 0);
    // TODO: Maybe the player constructor should accept a camera object already constructed?
    this.camera = new Camera({
      position: this.position,
      direction: this.direction,
      fovDegrees,
    });
  }

  /**
   * Rotates this player by the given change in angle, in radians.
   * @param {number} angleDeltaRadians
   */
  rotate(angleDeltaRadians) {
    this.direction = this.direction.rotated(angleDeltaRadians);
    this.camera.rotate(angleDeltaRadians);
  }

  /** Moves the player at its current speed in the the specified direction.
   * @param {Vector} direction
   */
  move(direction) {
    this.position.x += direction.x * this.speed;
    this.position.y += direction.y * this.speed;
  }

  /**
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
    });
  }
}
