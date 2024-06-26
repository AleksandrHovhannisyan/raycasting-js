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
  MOVE_UP: "w",
  MOVE_DOWN: "s",
  MOVE_RIGHT: "d",
  MOVE_LEFT: "a",
  TURN_LEFT: 'ArrowLeft',
  TURN_RIGHT: 'ArrowRight',
};
