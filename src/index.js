import Camera from "./entities/Camera.js";
import Canvas from "./entities/Canvas.js";
import Player from "./entities/Player.js";
import Wall, { createWalls } from "./entities/Wall.js";
import Vector from "./lib/Vector.js";
import { Screen, Color } from "./lib/constants.js";
import { Input, isKeyDown } from "./lib/input.js";
import { toRadians } from "./lib/utils.js";

/** @type {Canvas} */
let scene2D;
/** @type {Canvas} */
let scene3D;
/** @type {Player} */
let player;
/** @type {Wall[]} */
let walls;

function Init() {
  scene2D = new Canvas(Screen.WIDTH, Screen.HEIGHT);
  scene3D = new Canvas(Screen.WIDTH, Screen.HEIGHT);
  const playerPosition = new Vector(scene2D.width / 2, scene2D.height / 2);
  player = new Player({
    position: playerPosition,
    radius: 4,
    speed: 2,
    camera: new Camera({
      position: playerPosition,
      direction: new Vector(1, -1),
      fov: toRadians(60),
    }),
  });
  walls = createWalls(5, scene2D.width, scene2D.height);
  document.querySelector('#twod').appendChild(scene2D.canvas);
  document.querySelector('#threed').appendChild(scene3D.canvas);
}

function Draw() {
  scene2D.clear();
  scene3D.clear();
  scene2D.fill(Color.WHITE);
  scene3D.fill(Color.BLACK);

  const scene = player.see(walls);
  scene.forEach(({ intersection, distance }, xCoordinate) => {
    if (intersection) {
      // 2D: Draw a line for the ray from player camera to the point of intersection on the nearest wall
      scene2D.line({
        x1: player.camera.position.x,
        y1: player.camera.position.y,
        x2: intersection.x,
        y2: intersection.y,
        color: Color.YELLOW,
      });
      // 3D: at this vertical slice of the screen, draw a scaled line representing that wall
      const height = scene3D.height / distance * 75; // FIXME: arbitrary constant of 75
      const y1 = (scene3D.height - height) / 2;
      const y2 = y1 + height;
      scene3D.line({
        x1: xCoordinate,
        y1,
        x2: xCoordinate,
        y2,
        // FIXME: is there a better way of interpolating the color here?
        // Basic idea: further away = darker. Closer = lighter. Max distance is scene3D.height (minus a few pixels maybe for the walls). So at that distance,
        // the lightness should be < 100%. Hence divide scene3D.height by distance scaled by some arbitrary multiplier.
        color: `hsl(0, 0%, ${scene3D.height / (distance * 1.2) * 100}%)`,
      });
    }
  });
  // Draw these as the last layer
  walls.forEach((wall) => wall.draw(scene2D));
  player.draw(scene2D);
}

function HandleInput() {
  if (isKeyDown(Input.MOVE_FORWARD)) {
    player.move(player.direction);
  }
  if (isKeyDown(Input.MOVE_BACKWARD)) {
    player.move(player.direction.scaled(-1));
  }
  if (isKeyDown(Input.TURN_LEFT)) {
    player.rotate(toRadians(-4));
  }
  if (isKeyDown(Input.TURN_RIGHT)) {
    player.rotate(toRadians(4));
  }
}

function Update() {
  requestAnimationFrame(() => {
    HandleInput();
    Draw();
    Update();
  });
}

Init();
Update();
