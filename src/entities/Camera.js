import Ray from "../lib/Ray.js";
import Vector from "../lib/Vector.js";
import { Screen } from "../lib/constants.js";

/**
 * @typedef CameraProps
 * @property {Vector} position The camera's position in world coordinates.
 * @property {number} fov The field of view, in radians.
 * @property {Vector} direction The direction the camera is facing.
 */

export default class Camera {
  /** The camera's field of view, in radians */
  #fov;

  /**
   * @param {CameraProps}
   */
  constructor({ position, fov, direction }) {
    this.position = position;
    this.direction = direction;
    if (fov) {
      this.setFOV(fov);
    }
  }
  
  setFOV(fov) {
    this.#fov = fov;
    this.#createRays(Screen.WIDTH);
  }

  /**
   * Creates numRays rays that the camera can later cast out into the world to detect visible objects.
   * @param {number} numRays 
   */
  #createRays(numRays) {
    const radiansPerRay = this.#fov / (numRays - 1);
    // Start at the leftmost edge of the FOV so it maps correctly to 3D (left to right)
    const rayAngleStartRadians = this.direction.angle + this.#fov / 2;
    this.rays = Array.from(
      { length: numRays },
      (_, index) => {
        const direction = Vector.fromAngle(rayAngleStartRadians - index * radiansPerRay);
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
   * @param {(import("./Wall.js").default)[]} walls
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

      return { intersection: closestIntersection, distance: shortestDistance };
    });
  }
}
