// =======================================
// AMG GAME ENGINE – world.js
// Builds the road, lanes, guardrails,
// traffic cars, lighting, and updates
// them every frame.
// =======================================

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { clamp } from "./utils.js";

export function createWorld(scene, state) {

  // -------------------------------
  // Lighting
  // -------------------------------
  const ambient = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(15, 25, -10);
  scene.add(dirLight);

  // -------------------------------
  // Road
  // -------------------------------
  const roadWidth = 14;
  const roadLength = 400;

  const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength, 1, 40);
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x202020 });

  const road = new THREE.Mesh(roadGeo, roadMat);
  road.rotation.x = -Math.PI / 2;
  scene.add(road);

  state.road = road;

  // -------------------------------
  // Lane Lines
  // -------------------------------
  const laneLines = new THREE.Group();
  const laneCount = 4;

  for (let i = -laneCount / 2 + 0.5; i < laneCount / 2; i++) {
    const lineGeo = new THREE.PlaneGeometry(0.15, roadLength, 1, 40);
    const lineMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });

    const line = new THREE.Mesh(lineGeo, lineMat);
    line.rotation.x = -Math.PI / 2;
    line.position.x = (roadWidth / laneCount) * i * 2;

    laneLines.add(line);
  }

  scene.add(laneLines);
  state.laneLines = laneLines;

  // -------------------------------
  // Guardrails
  // -------------------------------
  const railMat = new THREE.MeshStandardMaterial({
    color: 0x555555,
    metalness: 0.6,
    roughness: 0.3
  });

  function createRail(xOffset) {
    const railGeo = new THREE.BoxGeometry(0.2, 1, roadLength);
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.set(xOffset, 0.5, 0);
    return rail;
  }

  const leftRail = createRail(roadWidth / 2 + 0.7);
  const rightRail = createRail(-roadWidth / 2 - 0.7);

  scene.add(leftRail);
  scene.add(rightRail);

  // -------------------------------
  // Traffic Cars
  // -------------------------------
  state.traffic = [];

  const trafficMat = new THREE.MeshStandardMaterial({
    color: 0xff3333,
    metalness: 0.4,
    roughness: 0.5
  });

  function spawnTrafficCar() {
    const geo = new THREE.BoxGeometry(1.8, 1.2, 4);
    const mesh = new THREE.Mesh(geo, trafficMat.clone());

    const laneIndex = Math.floor(Math.random() * laneCount);
    const laneX =
      (laneIndex - (laneCount - 1) / 2) * (roadWidth / laneCount);

    mesh.position.set(
      laneX,
      0.6,
      state.car.position.z - 80 - Math.random() * 150
    );

    mesh.userData.speed = 70 + Math.random() * 80; // km/h

    scene.add(mesh);
    state.traffic.push(mesh);
  }

  for (let i = 0; i < 10; i++) spawnTrafficCar();
}

// =======================================
// UPDATE WORLD EACH FRAME
// =======================================
export function updateWorld(state, dt) {

  const carZ = state.car.position.z;

  // -------------------------------
  // Loop Road Under Car
  // -------------------------------
  state.road.position.z = carZ - 50;
  state.laneLines.position.z = state.road.position.z;

  // -------------------------------
  // Traffic Movement
  // -------------------------------
  for (const t of state.traffic) {

    const relSpeed = t.userData.speed - state.speed;
    const dz = (relSpeed / 3.6) * dt;

    t.position.z += dz;

    // Respawn traffic behind car
    if (t.position.z > carZ + 60) {

      const laneCount = 4;
      const roadWidth = 14;

      const laneIndex = Math.floor(Math.random() * laneCount);
      const laneX =
        (laneIndex - (laneCount - 1) / 2) * (roadWidth / laneCount);

      t.position.set(
        laneX,
        0.6,
        carZ - 120 - Math.random() * 150
      );

      t.userData.speed = 70 + Math.random() * 80;
    }
  }
}
