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
  player = new Player(new Vector(canvas.width / 2, canvas.height / 2));
  walls = createWalls(5, canvas.width, canvas.height);
  document.body.appendChild(canvas.canvas);
}

function Draw() {
  canvas.clear();
  canvas.fill(Color.WHITE);
  walls.forEach((wall) => wall.draw(canvas));
  player.draw(canvas);
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
}

function CheckUserInput() {
  if (isKeyDown(Input.MOVE_UP)) {
    player.position.y = player.position.y - 1;
  }
  if (isKeyDown(Input.MOVE_DOWN)) {
    player.position.y = player.position.y + 1;
  }
  if (isKeyDown(Input.MOVE_RIGHT)) {
    player.position.x = player.position.x + 1;
  }
  if (isKeyDown(Input.MOVE_LEFT)) {
    player.position.x = player.position.x - 1;
  }
  // FIXME: not working
  if (isKeyDown(Input.TURN_LEFT)) {
    player.camera.turnByRadians(toRadians(1));
  }
  if (isKeyDown(Input.TURN_RIGHT)) {
    player.camera.turnByRadians(toRadians(-1));
  }
}

function Update() {
  requestAnimationFrame(() => {
    CheckUserInput();
    Draw();
    Update();
  });
}

Init();
Update();
