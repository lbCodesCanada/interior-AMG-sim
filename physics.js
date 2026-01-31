// ===============================
// AMG GAME ENGINE – physics.js
// Handles acceleration, braking,
// drag, RPM, steering curves,
// car movement, and signals
// ===============================

import { clamp, lerp } from "./utils.js";

export function updatePhysics(state, dt) {

  const gear = state.gears[state.gearIndex];
  const mode = state.modes[state.modeIndex];

  // ---------------------------
  // Mode-based performance
  // ---------------------------
  let accelBase;
  let drag;

  if (mode === "Sport+") {
    accelBase = 150;
    drag = 0.32;
  } else if (mode === "Sport") {
    accelBase = 120;
    drag = 0.34;
  } else {
    accelBase = 95;
    drag = 0.38;
  }

  // ---------------------------
  // Acceleration / braking
  // ---------------------------
  let accel = 0;

  // Forward gear
  if (gear === "D") {
    if (state.throttle) accel += accelBase;
    if (state.brake) accel -= 220;
  }

  // Reverse gear
  else if (gear === "R") {
    if (state.throttle) accel -= accelBase * 0.7;
    if (state.brake) accel += 220;
  }

  // Neutral / Park
  else {
    if (state.brake) accel -= 220;
  }

  // Apply acceleration
  state.speed += accel * dt;

  // Apply drag
  state.speed -= state.speed * drag * dt;

  // Clamp speed
  state.speed = clamp(state.speed, -40, 260);

  // ---------------------------
  // RPM simulation
  // ---------------------------
  state.rpm = 900 + Math.abs(state.speed) * 40 + (state.throttle ? 700 : 0);
  state.rpm = Math.min(state.rpm, 7800);

  // ---------------------------
  // Steering physics
  // ---------------------------
  const steeringStrength = lerp(
    1.8,
    0.4,
    clamp(Math.abs(state.speed) / 220, 0, 1)
  );

  const yawDelta = state.steeringInput * steeringStrength * dt;

  // Rotate car
  state.car.rotation.y += yawDelta;

  // ---------------------------
  // Move car forward/back
  // ---------------------------
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(state.car.quaternion);
  const distance = (state.speed / 3.6) * dt;

  state.car.position.addScaledVector(forward, distance);

  // ---------------------------
  // Turn signal blinking
  // ---------------------------
  state.signalTimer += dt;
  if (state.signalTimer > 0.5) {
    state.signalTimer = 0;
    state.signalBlink = !state.signalBlink;
  }
}
