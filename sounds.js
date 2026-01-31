// =======================================
// AMG GAME ENGINE – sounds.js
// Loads engine, horn, and signal sounds
// =======================================

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export function loadSounds(state, camera) {

  const listener = new THREE.AudioListener();
  camera.add(listener);

  const loader = new THREE.AudioLoader();

  // Engine idle
  state.engineIdle = new THREE.Audio(listener);
  loader.load("./sounds/engine_idle.mp3", (buffer) => {
    state.engineIdle.setBuffer(buffer);
    state.engineIdle.setLoop(true);
    state.engineIdle.setVolume(0.6);
    state.engineIdle.play();
  });

  // Engine rev layer
  state.engineRev = new THREE.Audio(listener);
  loader.load("./sounds/engine_rev.mp3", (buffer) => {
    state.engineRev.setBuffer(buffer);
    state.engineRev.setLoop(true);
    state.engineRev.setVolume(0);
    state.engineRev.play();
  });

  // Horn
  state.hornSound = new THREE.Audio(listener);
  loader.load("./sounds/horn.mp3", (buffer) => {
    state.hornSound.setBuffer(buffer);
    state.hornSound.setVolume(1.0);
  });

  // Turn signal tick
  state.signalTick = new THREE.Audio(listener);
  loader.load("./sounds/signal_tick.mp3", (buffer) => {
    state.signalTick.setBuffer(buffer);
    state.signalTick.setVolume(0.7);
  });
}
