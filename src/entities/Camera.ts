import type Wall from './Wall.ts';
import Ray from "../lib/Ray.ts";
import Vector from "../lib/Vector.ts";
import { Screen } from "../lib/constants.ts";

type CameraProps = {
  /** The camera's position in world coordinates. */
  position: Vector;
  /** The field of view, in radians. */
  fov?: number;
  /** The direction the camera is facing. */
  direction: Vector;
}

export default class Camera {
  /** The camera's field of view, in radians */
  private fovRadians: number;
  private rays: Ray[];
  public position: Vector;
  public direction: Vector;

  constructor({ position, fov, direction }: CameraProps) {
    this.fovRadians = 0;
    this.position = position;
    this.direction = direction;
    this.rays = [];
    if (fov) {
      this.setFOV(fov);
    }
  }
  
  setFOV(fovRadians: number) {
    this.fovRadians = fovRadians;
    this.createRays(Screen.WIDTH);
  }

  /**
   * Creates numRays rays that the camera can later cast out into the world to detect visible objects.
   */
  private createRays(numRays: number) {
    const radiansPerRay = this.fovRadians / (numRays - 1);
    const rayAngleStartRadians = this.direction.angle - this.fovRadians / 2;
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
   */
  rotate(angleDeltaRadians: number) {
    this.direction = this.direction.rotated(angleDeltaRadians);
    this.rays.forEach((ray) => ray.rotate(angleDeltaRadians));
  }

  /** Casts its rays onto the walls/environment. */
  cast(walls: Wall[]) {
    return this.rays.map((ray) => {
      let shortestDistance = Infinity;
      let closestIntersection: Vector | undefined;

      walls.forEach((wall) => {
        const result = ray.cast(wall);
        if (result) {
          let { intersection, distance } = result;
          // Get projection of the distance onto the camera's directional plane to eliminate Fish Eye effect. 
          // https://youtu.be/vYgIKn7iDH8?feature=shared&t=1464
          distance *= Vector.dot(this.direction, ray.direction) / (this.direction.length * ray.direction.length);

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
