import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

import { loadEngine } from "./sounds/Engine.js";
import { loadTwinTurbo } from "./sounds/TwinTurbo.js";
import { loadHorn } from "./sounds/Horn.js";
import { loadSignals } from "./sounds/Signals.js";

export function loadSounds(state, camera) {

  const listener = new THREE.AudioListener();
  camera.add(listener);

  const loader = new THREE.AudioLoader();

  loadEngine(state, listener, loader);
  loadTwinTurbo(state, listener, loader);
  loadHorn(state, listener, loader);
  loadSignals(state, listener, loader);
}
