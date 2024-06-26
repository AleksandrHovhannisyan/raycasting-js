import Ray from "./Ray.mjs";
import { Screen } from "./constants.mjs";
import { toRadians } from "./utils.mjs";

export default class Camera {
  /**
   * @param {import("./Vector.mjs").default} position
   * @param {number} fovDegrees
   */
  constructor(position, fovDegrees) {
    this.position = position;
    this.angle = 0;
    this.fov = fovDegrees;
    this.createRays(Screen.WIDTH);
  }

  createRays(numRays) {
    const degreesPerRay = this.fov / numRays;
    const rayAngleStart = this.angle - this.fov / 2;
    this.rays = Array.from(
      { length: numRays },
      (_, index) =>
        new Ray(this.position, toRadians(rayAngleStart + index * degreesPerRay))
    );
  }

  /**
   * Turns the camera by the given angle, in radians.
   * @param {number} angleDeltaRadians
   */
  turnByRadians(angleDeltaRadians) {
    this.angle += angleDeltaRadians;
    this.rays.forEach((ray) => ray.setAngle(ray.angle + angleDeltaRadians));
  }

  /**
   *
   * @param {(import("./Wall.mjs").default)[]} walls
   */
  cast(walls) {
    return this.rays.map((ray, index) => {
      let shortestDistance = Infinity;
      /** @type {(import("./Vector.mjs").default)|undefined} */
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
