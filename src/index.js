import Camera from "./entities/Camera.js";
import Canvas from "./entities/Canvas.js";
import Player from "./entities/Player.js";
import Wall, { createWalls } from "./entities/Wall.js";
import Vector from "./lib/Vector.js";
import { Screen, Color } from "./lib/constants.js";
import { Input, isKeyDown } from "./lib/input.js";
import { toRadians } from "./lib/utils.js";

class RaycastingGame extends HTMLElement {
  /** @type {Canvas} */
  #scene2D;
  /** @type {Canvas} */
  #scene3D;
  /** @type {Player} */
  #player;
  /** @type {Wall[]} */
  #walls;
  /** @type {{ maxMsPerFrame: number; previousTimeMs: number }} */
  #timing;

  constructor() {
    super();
    const maxFps = Number(this.getAttribute("max-fps")) || 60;
    this.#timing = { previousTimeMs: 0, maxMsPerFrame: 1000 / maxFps };
    this.#initializeScene();
    this.run();
  }

  #updatePhysics() {
    if (isKeyDown(Input.MOVE_FORWARD)) {
      this.#player.move(this.#player.direction);
    }
    if (isKeyDown(Input.MOVE_BACKWARD)) {
      this.#player.move(this.#player.direction.scaled(-1));
    }
    if (isKeyDown(Input.TURN_LEFT)) {
      this.#player.rotate(toRadians(-4));
    }
    if (isKeyDown(Input.TURN_RIGHT)) {
      this.#player.rotate(toRadians(4));
    }
  }

  #initializeScene() {
    this.#scene2D = new Canvas(Screen.WIDTH, Screen.HEIGHT);
    this.#scene3D = new Canvas(Screen.WIDTH, Screen.HEIGHT);

    const playerPosition = new Vector(
      this.#scene2D.width / 2,
      this.#scene2D.height / 2
    );
    const fovDegrees = Number(this.getAttribute('fov')) || 60;
    this.#player = new Player({
      position: playerPosition,
      radius: 4,
      speed: 2,
      camera: new Camera({
        position: playerPosition,
        direction: new Vector(1, -1),
        fov: toRadians(fovDegrees),
      }),
    });
    this.#walls = createWalls(5, this.#scene2D.width, this.#scene2D.height);

    const shadow = this.attachShadow({ mode: "open" });
    const section2D = this.#makeSection("2D");
    const section3D = this.#makeSection("3D");
    section2D.appendChild(this.#scene2D.canvas);
    section3D.appendChild(this.#scene3D.canvas);
    shadow.appendChild(section2D);
    shadow.appendChild(section3D);
  }

  #makeSection(title) {
    const section = document.createElement("section");
    const h2 = document.createElement("h2");
    h2.innerText = title;
    section.appendChild(h2);
    return section;
  }

  #draw() {
    this.#scene2D.clear();
    this.#scene3D.clear();
    this.#scene2D.fill(Color.WHITE);
    this.#scene3D.fill(Color.BLACK);

    const scene = this.#player.see(this.#walls);
    scene.forEach(({ intersection, distance }, xCoordinate) => {
      if (intersection) {
        // 2D: Draw a line for the ray from player camera to the point of intersection on the nearest wall
        this.#scene2D.line({
          x1: this.#player.camera.position.x,
          y1: this.#player.camera.position.y,
          x2: intersection.x,
          y2: intersection.y,
          color: Color.YELLOW,
        });
        // 3D: at this vertical slice of the screen, draw a scaled line representing that wall
        const height = (this.#scene3D.height / distance) * 75; // FIXME: arbitrary constant of 75
        const y1 = (this.#scene3D.height - height) / 2;
        const y2 = y1 + height;
        this.#scene3D.line({
          x1: xCoordinate,
          y1,
          x2: xCoordinate,
          y2,
          // FIXME: is there a better way of interpolating the color here?
          // Basic idea: further away = darker. Closer = lighter. Max distance is this.#scene3D.height (minus a few pixels maybe for the walls). So at that distance,
          // the lightness should be < 100%. Hence divide this.#scene3D.height by distance scaled by some arbitrary multiplier.
          color: `hsl(0, 0%, ${
            (this.#scene3D.height / (distance * 1.2)) * 100
          }%)`,
        });
      }
    });
    // Draw these as the last layer
    this.#walls.forEach((wall) => wall.draw(this.#scene2D));
    this.#player.draw(this.#scene2D);
  }

  /**
   * Runs the game update loop.
   */
  run() {
    requestAnimationFrame((currentTimeMs) => {
      // NOTE: physics should be capped to a max FPS. It should not scale with user's refresh rate.
      // Otherwise, players on a 120 Hz screen will move faster than players on a 60 Hz screen.
      const deltaTimeMs = currentTimeMs - this.#timing.previousTimeMs;
      // Not just === because a frame could've taken longer, leading to dropped frame rate
      if (deltaTimeMs >= this.#timing.maxMsPerFrame) {
        this.#timing.previousTimeMs =
          currentTimeMs -
          // Ensure the next frame starts on schedule/at the next multiple of MS_PER_FRAME.
          // If we don't "rewind the clock," we'll have to wait longer for the next frame to run.
          (deltaTimeMs % this.#timing.maxMsPerFrame);

        // Update all physics (e.g., player movement)
        this.#updatePhysics();
      }
      // It's okay to draw/paint at the native refresh rate
      this.#draw();
      this.run();
    });
  }
}

window.customElements.define("raycasting-game", RaycastingGame);
