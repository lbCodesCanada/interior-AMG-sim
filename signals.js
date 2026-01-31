import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export function loadSignals(state, listener, loader) {

  state.signalTick = new THREE.Audio(listener);

  loader.load("./sounds/signal_tick.mp3", buffer => {
    state.signalTick.setBuffer(buffer);
    state.signalTick.setVolume(0.7);
  });
}
