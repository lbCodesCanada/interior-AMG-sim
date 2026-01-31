// ===============================
// AMG 3D GAME ENGINE – main.js
// Luka is the beast
// ===============================

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { createWorld, updateWorld } from "./world.js";
import { createCockpit, updateCockpit } from "./cockpit.js";
import { initControls, readControls } from "./controls.js";
import { updatePhysics } from "./physics.js";
import { clamp, lerp } from "./utils.js";

// -------------------------------
// Renderer / Scene / Camera
// -------------------------------
const canvas = document.getElementById("game");

export const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070b);

export const camera = new THREE.PerspectiveCamera(
  72,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

// Camera rig (for road feel)
export const cameraRig = new THREE.Group();
cameraRig.position.set(0, 1.25, 0.05);
camera.position.set(0, 0, 0);
cameraRig.add(camera);
scene.add(cameraRig);

// -------------------------------
// Game State
// -------------------------------
export const state = {
  speed: 0,
  rpm: 800,
  gearIndex: 0,
  gears: ["P", "R", "N", "D"],
  modeIndex: 0,
  modes: ["Comfort", "Sport", "Sport+"],
  steeringInput: 0,
  steeringAngle: 0,
  leftSignal: false,
  rightSignal: false,
  signalBlink: false,
  signalTimer: 0,
  lastSpeed: 0,
  hornCooldown: 0,
  car: null,
  infotainmentTexture: null
};

// -------------------------------
// Build World + Cockpit
// -------------------------------
state.car = new THREE.Group();
scene.add(state.car);

createWorld(scene, state);
createCockpit(scene, state);

// -------------------------------
// Controls
// -------------------------------
initControls(state);

// -------------------------------
// Resize Handling
// -------------------------------
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// -------------------------------
// Main Loop
// -------------------------------
let lastTime = performance.now();

function loop(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  // Read input
  readControls(state, dt);

  // Physics
  updatePhysics(state, dt);

  // Cockpit (wheel, dash, infotainment)
  updateCockpit(state, dt);

  // World (road, traffic)
  updateWorld(state, dt);

  // Camera road feel
  applyRoadFeel(state, dt);

  // Render
  renderer.render(scene, camera);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

// -------------------------------
// Road Feel (weight transfer)
// -------------------------------
function applyRoadFeel(state, dt) {
  const accelNow = (state.speed - state.lastSpeed) / dt;
  state.lastSpeed = state.speed;

  const accelNorm = clamp(accelNow / 220, -1, 1);
  const steerNorm = state.steeringInput;

  const pitch = lerp(cameraRig.rotation.x, accelNorm * -0.06, 0.15);
  const roll = lerp(cameraRig.rotation.z, steerNorm * -0.04, 0.15);

  const t = performance.now() / 1000;
  const vib = (state.rpm / 7800) * 0.002;
  const shakeX = Math.sin(t * 40) * vib;
  const shakeY = Math.cos(t * 35) * vib;

  cameraRig.rotation.x = pitch + shakeY;
  cameraRig.rotation.z = roll + shakeX;

  // FOV change
  const baseFov = 72;
  const maxFov = 92;
  const speedRatio = clamp(Math.abs(state.speed) / 220, 0, 1);
  camera.fov = lerp(baseFov, maxFov, speedRatio * 0.7);
  camera.updateProjectionMatrix();

  // Look forward over wheel
  const lookTarget = new THREE.Vector3(0, 1.35, 3);
  state.car.localToWorld(lookTarget);
  camera.lookAt(lookTarget);
}
