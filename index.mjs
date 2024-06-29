import Camera from "./Camera.mjs";
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
  const playerPosition = new Vector(canvas.width / 2, canvas.height / 2);
  player = new Player({
    position: playerPosition,
    radius: 4,
    speed: 2,
    camera: new Camera({
      position: playerPosition,
      direction: new Vector(1, -1),
      fov: toRadians(60),
    })
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
