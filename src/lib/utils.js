/** Converts an angle from degrees to radians. */
export const toRadians = (angleDegrees) => angleDegrees * Math.PI / 180;

/** Converts an angle from radians to degrees. */
export const toDegrees = (angleRadians) => angleRadians * 180 / Math.PI;

/** Clamps a value between a min and max. */
export const clamp = ({ value, min, max }) => Math.max(Math.min(value, max), min)