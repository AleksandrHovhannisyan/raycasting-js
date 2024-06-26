import Canvas from "./Canvas.mjs";
import Player from "./Player.mjs";
import Vector from "./Vector.mjs";
import Wall from "./Wall.mjs";
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
  document.body.appendChild(canvas.canvas);

  walls = Array.from({ length: 5 }, () => {
    const x1 = Math.random() * canvas.width;
    const y1 = Math.random() * canvas.height;
    const x2 = Math.random() * canvas.width;
    const y2 = Math.random() * canvas.height;
    return new Wall(new Vector(x1, y1), new Vector(x2, y2));
  });
  const wallTop = new Wall(
    new Vector(Screen.PADDING, Screen.PADDING),
    new Vector(Screen.WIDTH - Screen.PADDING, Screen.PADDING)
  );
  const wallRight = new Wall(
    new Vector(Screen.WIDTH - Screen.PADDING, Screen.PADDING),
    new Vector(Screen.WIDTH - Screen.PADDING, Screen.HEIGHT - Screen.PADDING)
  );
  const wallBottom = new Wall(
    new Vector(Screen.WIDTH - Screen.PADDING, Screen.HEIGHT - Screen.PADDING),
    new Vector(Screen.PADDING, Screen.HEIGHT - Screen.PADDING)
  );
  const wallLeft = new Wall(
    new Vector(Screen.PADDING, Screen.HEIGHT - Screen.PADDING),
    new Vector(Screen.PADDING, Screen.PADDING)
  );
  walls.push(wallTop);
  walls.push(wallRight);
  walls.push(wallBottom);
  walls.push(wallLeft);
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
