export default class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  /**
   * @param {number} scalar 
   */
  scaled(scalar) {
    const scaled = new Vector(this.x, this.y);
    scaled.x *= scalar;
    scaled.y *= scalar;
    return scaled;
  }

  /** Returns the result of normalizing this vector (i.e. making it a unit vector of length `1`). */
  normalized() {
    const unitVector = new Vector(this.x, this.y);
    return unitVector.scaled(1 / unitVector.length);
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
