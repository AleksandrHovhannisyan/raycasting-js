import Vector from "./Vector.mjs";

export default class Ray {
  /**
   * @param {Vector} position 
   * @param {Vector} direction 
   */
  constructor(position, direction) {
    this.position = position;
    this.direction = direction
  }

  /**
   * Rotates this ray by the given change in angle, in radians.
   * @param {number} angleRadians 
   */
  rotate(angleDeltaRadians) {
    this.direction = this.direction.rotated(angleDeltaRadians);
  }

  /**
   * Casts this ray onto the specified wall and returns the intersection point and distance to the intersection, if one is found.
   * https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line_segment
   * https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/565282#565282
   * @param {import("../Wall.mjs").default} wall
   */
  cast(wall) {
    // Wall, L1
    const x1 = wall.start.x;
    const y1 = wall.start.y;
    const x2 = wall.end.x;
    const y2 = wall.end.y;

    // Ray, L2
    const x3 = this.position.x;
    const y3 = this.position.y;
    const x4 = this.position.x + this.direction.x;
    const y4 = this.position.y - this.direction.y;

    // Zero implies the two lines are parallel and never intersect
    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (!denominator) {
      return;
    }

    // Using same variable names as in the Wikipedia article
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

    if (t >= 0 && t <= 1 && u >= 0) {
      const intersection = new Vector();
      intersection.x = x1 + t * (x2 - x1);
      intersection.y = y1 + t * (y2 - y1);
      return { intersection, distance: u };
    }
  }
}
