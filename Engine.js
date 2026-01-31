import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export function loadEngine(state, listener, loader) {

  // Engine idle loop
  state.engineIdle = new THREE.Audio(listener);
  loader.load("./sounds/engine_idle.mp3", buffer => {
    state.engineIdle.setBuffer(buffer);
    state.engineIdle.setLoop(true);
    state.engineIdle.setVolume(0.6);
    state.engineIdle.play();
  });

  // Engine rev loop
  state.engineRev = new THREE.Audio(listener);
  loader.load("./sounds/engine_rev.mp3", buffer => {
    state.engineRev.setBuffer(buffer);
    state.engineRev.setLoop(true);
    state.engineRev.setVolume(0);
    state.engineRev.play();
  });
}
