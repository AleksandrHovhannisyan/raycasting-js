const makeGlobalKeyDownListener = () => {
  const heldKeys = new Set();

  document.addEventListener("keydown", (e) => heldKeys.add(e.key));
  document.addEventListener("keyup", (e) => heldKeys.delete(e.key));

  /**
   * @param {string} key
   */
  const isKeyDown = (key) => heldKeys.has(key);

  return isKeyDown;
};

/** Returns true if the given key is currently being held down. */
export const isKeyDown = makeGlobalKeyDownListener();

export const Input = {
  MOVE_FORWARD: "w",
  MOVE_BACKWARD: "s",
  TURN_LEFT: 'a',
  TURN_RIGHT: 'd',
};
