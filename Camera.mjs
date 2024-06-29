import Ray from "./Ray.mjs";
import Vector from "./Vector.mjs";
import { Screen } from "./constants.mjs";
import { toRadians } from "./utils.mjs";

export default class Camera {
  // TODO: accept fov in radians to keep everything in radians, for consistency
  /**
   * @param {{ position: Vector; fovDegrees: number; direction: Vector; }}
   */
  constructor({ position, fovDegrees, direction }) {
    this.position = position;
    this.direction = direction;
    this.fov = fovDegrees;
    this.createRays(Screen.WIDTH);
  }

  /**
   * Creates numRays rays that the camera can later cast out into the world to detect visible objects.
   * @param {number} numRays 
   */
  createRays(numRays) {
    const radiansPerRay = toRadians(this.fov / (numRays - 1));
    const rayAngleStartRadians = this.direction.angle - toRadians(this.fov / 2);
    this.rays = Array.from(
      { length: numRays },
      (_, index) => {
        const direction = Vector.fromAngle(rayAngleStartRadians + index * radiansPerRay);
        return new Ray(this.position, direction);
      }
    );
  }

  /**
   * Rotates this camera by the given change in angle, in radians.
   * @param {number} angleDeltaRadians
   */
  rotate(angleDeltaRadians) {
    this.direction = this.direction.rotated(angleDeltaRadians);
    // FIXME: Why do I have to do -angleDeltaRadians for this to work as expected?
    this.rays.forEach((ray) => ray.rotate(-angleDeltaRadians));
  }

  /**
   *
   * @param {(import("./Wall.mjs").default)[]} walls
   */
  cast(walls) {
    return this.rays.map((ray, index) => {
      let shortestDistance = Infinity;
      /** @type {(Vector)|undefined} */
      let closestIntersection;

      walls.forEach((wall) => {
        const result = ray.cast(wall);
        if (result) {
          const { intersection, distance } = result;

          if (distance < shortestDistance) {
            shortestDistance = distance;
            closestIntersection = intersection;
          }
        }
      });

      return closestIntersection;
    });
  }
}
