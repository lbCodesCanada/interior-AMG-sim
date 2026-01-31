import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export function loadTwinTurbo(state, listener, loader) {

  // Turbo spool (continuous)
  state.turboSpool = new THREE.Audio(listener);
  loader.load("./sounds/turbo_spool.mp3", buffer => {
    state.turboSpool.setBuffer(buffer);
    state.turboSpool.setLoop(true);
    state.turboSpool.setVolume(0);
    state.turboSpool.play();
  });

  // Blowoff valve (short burst)
  state.bov = new THREE.Audio(listener);
  loader.load("./sounds/bov.mp3", buffer => {
    state.bov.setBuffer(buffer);
    state.bov.setVolume(0.9);
  });
}
