export default class Vector {
  public x: number;
  public y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /** Returns the Cartesian length of this vector. */
  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  /** Returns this vector's angle, in radians. */
  get angle() {
    return Math.atan2(this.y, this.x);
  }

  /** Returns a new vector that's the result of scaling this vector by the given scalar. */
  scaled(scalar: number) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  /** Returns a new vector that's the result of normalizing this vector (i.e., a unit vector of length `1` in the same direction). */
  normalized() {
    return Vector.from(this).scaled(1 / this.length);
  }

  /** Returns a new vector that's the result of rotating this vector by the given change in angle, in radians.
  */
  rotated(angleDeltaRadians: number) {
    return new Vector(
      this.x * Math.cos(angleDeltaRadians) - this.y * Math.sin(angleDeltaRadians),
      this.x * Math.sin(angleDeltaRadians) + this.y * Math.cos(angleDeltaRadians)
    )
  }

  /**
   * Returns a copy of a vector.
   */
  static from(vector: Vector) {
    return new Vector(vector.x, vector.y);
  }
  
  /**
   * Returns a new vector constructed from the given angle.
   */
  static fromAngle(angleRadians: number) {
    return new Vector(
      Math.cos(angleRadians),
      Math.sin(angleRadians)
    );
  }

  /**
   * Returns the dot product of two vectors.
   */
  static dot(a: Vector, b: Vector) {
    return a.x * b.x + a.y * b.y;
  }
}
