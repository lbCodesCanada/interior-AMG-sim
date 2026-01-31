import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export function loadHorn(state, listener, loader) {

  state.hornSound = new THREE.Audio(listener);

  loader.load("./sounds/horn.mp3", buffer => {
    state.hornSound.setBuffer(buffer);
    state.hornSound.setVolume(1.0);
  });
}
