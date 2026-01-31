// ===============================
// AMG GAME ENGINE – controls.js
// Handles all player input
// ===============================

export const keys = {};

// Initialize controls
export function initControls(state) {
  document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });
}

// Read controls each frame
export function readControls(state, dt) {
  // ---------------------------
  // Gear selector (G)
  // ---------------------------
  if (keys["g"]) {
    state.gearIndex = (state.gearIndex + 1) % state.gears.length;
    keys["g"] = false; // prevent repeat
  }

  // ---------------------------
  // Drive mode (M)
  // ---------------------------
  if (keys["m"]) {
    state.modeIndex = (state.modeIndex + 1) % state.modes.length;
    keys["m"] = false;
  }

  // ---------------------------
  // Turn signals (Z / X)
  // ---------------------------
  if (keys["z"]) {
    state.leftSignal = true;
    state.rightSignal = false;
  }
  if (keys["x"]) {
    state.rightSignal = true;
    state.leftSignal = false;
  }
  if (keys["z"] && keys["x"]) {
    state.leftSignal = false;
    state.rightSignal = false;
  }

  // ---------------------------
  // Horn (H)
  // ---------------------------
  if (keys["h"] && state.hornCooldown <= 0) {
    console.log("HORN: BEEEEEP (sound coming soon)");
    state.hornCooldown = 0.3;
  }
  state.hornCooldown -= dt;

  // ---------------------------
  // Steering (A / D)
  // ---------------------------
  if (keys["a"]) state.steeringInput += 3 * dt;
  if (keys["d"]) state.steeringInput -= 3 * dt;

  // Clamp steering input
  state.steeringInput = Math.max(-1, Math.min(1, state.steeringInput));

  // Natural steering return
  state.steeringInput *= 0.9;

  // ---------------------------
  // Throttle & brake handled in physics.js
  // ---------------------------
}
