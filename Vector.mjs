export default class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  get length() {
    return Math.sqrt(this.x^2 + this.y^2);
  }

  /** Normalizes this vector, turning it into a unit vector (i.e. of length `1`). */
  normalize() {
    this.x /= this.length;
    this.y /= this.length;
  }

  /**
   * Returns a new vector constructed from the given angle.
   * @param {number} angleRadians
   */
  static fromAngle(angleRadians) {
    const vector = new Vector();
    vector.x = Math.cos(angleRadians);
    vector.y = Math.sin(angleRadians);
    return vector;
  }
}
