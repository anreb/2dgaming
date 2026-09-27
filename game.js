const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const player = new Image();
player.src = "./emoji1.png";

let playerX = 100;
let playerY = 100;

const playerSpeed = 5;

// --------------------------------
// Joystick
// --------------------------------

const joystick = document.getElementById("joystick");
const knob = document.getElementById("joystick-knob");

const joystickState = {
  active: false,
  x: 0,
  y: 0,
  angle: 0,
  magnitude: 0,
};

const joystickRadius = 75;
const knobRadius = 35;

let startX = 0;
let startY = 0;

function moveJoystick(clientX, clientY) {
  // Distance from the original touch position
  let dx = clientX - startX;
  let dy = clientY - startY;

  const distance = Math.sqrt(dx * dx + dy * dy);

  const maxDistance = joystickRadius - knobRadius;

  // Don't move the knob until the finger/mouse actually moves
  if (distance === 0) {
    return;
  }

  // Keep knob inside joystick
  if (distance > maxDistance) {
    dx = (dx / distance) * maxDistance;
    dy = (dy / distance) * maxDistance;
  }

  // Move visual knob
  knob.style.transform = `translate(${dx}px, ${dy}px)`;

  // Normalize direction
  joystickState.x = dx / maxDistance;
  joystickState.y = dy / maxDistance;

  joystickState.magnitude = Math.min(distance / maxDistance, 1);

  joystickState.angle = Math.atan2(dy, dx);
}

function resetJoystick() {
  joystickState.active = false;

  joystickState.x = 0;
  joystickState.y = 0;
  joystickState.magnitude = 0;
  joystickState.angle = 0;

  knob.style.transform = "translate(0px, 0px)";
}

joystick.addEventListener("pointerdown", (event) => {
  event.preventDefault();

  joystickState.active = true;

  // Remember where the player initially touched
  startX = event.clientX;
  startY = event.clientY;

  joystick.setPointerCapture(event.pointerId);
});

joystick.addEventListener("pointermove", (event) => {
  if (!joystickState.active) return;

  event.preventDefault();

  moveJoystick(event.clientX, event.clientY);
});

joystick.addEventListener("pointerup", (event) => {
  joystick.releasePointerCapture(event.pointerId);

  resetJoystick();
});

joystick.addEventListener("pointercancel", () => {
  resetJoystick();
});

// --------------------------------
// Game update
// --------------------------------

function update() {
  // Move player using joystick
  playerX += joystickState.x * playerSpeed;
  playerY += joystickState.y * playerSpeed;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.drawImage(player, playerX, playerY, 100, 100);
}

// --------------------------------
// Canvas size
// --------------------------------

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// --------------------------------
// Render/update loop
// --------------------------------

setInterval(update, 16);
