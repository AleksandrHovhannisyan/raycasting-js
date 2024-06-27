import Canvas from "./Canvas.mjs";
import Player from "./Player.mjs";
import Vector from "./Vector.mjs";
import Wall, { createWalls } from "./Wall.mjs";
import { Screen, Color } from "./constants.mjs";
import { Input, isKeyDown } from "./input.mjs";
import { toRadians } from "./utils.mjs";

/** @type {Canvas} */
let canvas;
/** @type {Player} */
let player;
/** @type {Wall[]} */
let walls;

function Init() {
  canvas = new Canvas(Screen.WIDTH, Screen.HEIGHT);
  player = new Player({
    position: new Vector(canvas.width / 2, canvas.height / 2),
    speed: 2,
    fovDegrees: 60,
  });
  walls = createWalls(5, canvas.width, canvas.height);
  document.body.appendChild(canvas.canvas);
}

function Draw() {
  canvas.clear();
  canvas.fill(Color.WHITE);
  const intersections = player.see(walls);
  intersections.forEach((intersection) => {
    if (intersection) {
      canvas.line({
        x1: player.camera.position.x,
        y1: player.camera.position.y,
        x2: intersection.x,
        y2: intersection.y,
        color: Color.YELLOW,
      });
    }
  });
  // Draw these as the last layer
  walls.forEach((wall) => wall.draw(canvas));
  player.draw(canvas);
}

function HandleInput() {
  if (isKeyDown(Input.MOVE_UP)) {
    player.moveBy(0, -1);
  }
  if (isKeyDown(Input.MOVE_DOWN)) {
    player.moveBy(0, 1);
  }
  if (isKeyDown(Input.MOVE_RIGHT)) {
    player.moveBy(1, 0);
  }
  if (isKeyDown(Input.MOVE_LEFT)) {
    player.moveBy(-1, 0);
  }
  if (isKeyDown(Input.TURN_LEFT)) {
    player.camera.turnByRadians(toRadians(4));
  }
  if (isKeyDown(Input.TURN_RIGHT)) {
    player.camera.turnByRadians(toRadians(-4));
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
