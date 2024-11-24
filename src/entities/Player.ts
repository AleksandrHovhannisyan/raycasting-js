import Camera from "./Camera.ts";
import type Wall from './Wall.ts'
import type Canvas from '../lib/Canvas.ts';
import Vector from "../lib/Vector.ts";
import { Color, Screen } from "../lib/constants.ts";
import { clamp } from "../lib/utils.ts";

export default class Player {
  public position: Vector;
  public radius: number;
  public speed: number;
  public camera: Camera;

  constructor({ position, radius, speed = 1, camera }: { position: Vector, radius: number, speed: number, camera: Camera }) {
    this.position = position;
    this.radius = radius;
    this.speed = speed;
    this.camera = camera;
  }

  /** Returns the direction the player is facing. */
  get direction() {
    return this.camera.direction;
  }

  /**
   * Rotates this player by the given change in angle, in radians.
   */
  rotate(angleDeltaRadians: number) {
    this.camera.rotate(angleDeltaRadians);
  }

  /** Moves the player at its current speed in the the specified direction.
   */
  move(direction: Vector) {
    this.position.x += direction.x * this.speed;
    this.position.y += direction.y * this.speed;
    this.position.x = clamp({ value: this.position.x, min: this.radius, max: Screen.WIDTH - this.radius });
    this.position.y = clamp({ value: this.position.y, min: this.radius, max: Screen.HEIGHT - this.radius });
  }

  see(walls: Wall[]) {
    return this.camera.cast(walls);
  }

  /** Draws the player on a canvas.
   */
  draw(canvas: Canvas) {
    canvas.circle({
      x: this.position.x,
      y: this.position.y,
      radius: this.radius,
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
