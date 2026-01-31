// =======================================
// AMG GAME ENGINE – cockpit.js
// Builds the interior cockpit, steering
// wheel, dash, infotainment, mirror,
// seats, and updates them every frame.
// =======================================

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { lerp } from "./utils.js";

export function createCockpit(scene, state) {

  const car = state.car;

  // -------------------------------
  // Cockpit Shell
  // -------------------------------
  const cockpitShellGeo = new THREE.BoxGeometry(2.2, 1.5, 2.6);
  const cockpitShellMat = new THREE.MeshStandardMaterial({
    color: 0x050608,
    metalness: 0.2,
    roughness: 0.8
  });
  const cockpitShell = new THREE.Mesh(cockpitShellGeo, cockpitShellMat);
  cockpitShell.position.set(0, 1.1, 0.1);
  car.add(cockpitShell);

  // -------------------------------
  // Dashboard
  // -------------------------------
  const dashGeo = new THREE.BoxGeometry(2.4, 0.25, 0.7);
  const dashMat = new THREE.MeshStandardMaterial({
    color: 0x05070b,
    metalness: 0.3,
    roughness: 0.7
  });
  const dash = new THREE.Mesh(dashGeo, dashMat);
  dash.position.set(0, 1.35, 0.45);
  car.add(dash);

  // -------------------------------
  // Instrument Cluster Housing
  // -------------------------------
  const clusterGeo = new THREE.BoxGeometry(1.5, 0.55, 0.12);
  const clusterMat = new THREE.MeshStandardMaterial({
    color: 0x11141c,
    metalness: 0.3,
    roughness: 0.5,
    emissive: 0x05070b,
    emissiveIntensity: 0.9
  });
  const cluster = new THREE.Mesh(clusterGeo, clusterMat);
  cluster.position.set(0, 1.37, 0.3);
  car.add(cluster);

  // -------------------------------
  // Infotainment Screen (Canvas Texture)
  // -------------------------------
  const infoCanvas = document.createElement("canvas");
  infoCanvas.width = 512;
  infoCanvas.height = 256;
  const infoCtx = infoCanvas.getContext("2d");

  const infoTexture = new THREE.CanvasTexture(infoCanvas);
  infoTexture.encoding = THREE.sRGBEncoding;

  const infoGeo = new THREE.PlaneGeometry(0.95, 0.45);
  const infoMat = new THREE.MeshStandardMaterial({
    map: infoTexture,
    metalness: 0.6,
    roughness: 0.25,
    emissive: 0x111133,
    emissiveIntensity: 0.9
  });

  const infoScreen = new THREE.Mesh(infoGeo, infoMat);
  infoScreen.position.set(0.75, 1.36, 0.38);
  infoScreen.rotation.y = -0.25;
  car.add(infoScreen);

  // Save texture for updates
  state.infotainmentTexture = infoTexture;
  state.infotainmentCanvas = infoCanvas;
  state.infotainmentCtx = infoCtx;

  // -------------------------------
  // Rearview Mirror
  // -------------------------------
  const mirrorGeo = new THREE.BoxGeometry(0.9, 0.2, 0.05);
  const mirrorMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.9,
    roughness: 0.1
  });
  const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
  mirror.position.set(0, 1.7, 0.1);
  car.add(mirror);

  // -------------------------------
  // Seats
  // -------------------------------
  const seatMat = new THREE.MeshStandardMaterial({
    color: 0x151515,
    metalness: 0.1,
    roughness: 0.8
  });

  function createSeat(x) {
    const baseGeo = new THREE.BoxGeometry(0.6, 0.2, 0.6);
    const backGeo = new THREE.BoxGeometry(0.6, 0.8, 0.2);

    const base = new THREE.Mesh(baseGeo, seatMat);
    const back = new THREE.Mesh(backGeo, seatMat);

    base.position.set(x, 0.9, -0.3);
    back.position.set(x, 1.25, -0.05);

    const seat = new THREE.Group();
    seat.add(base);
    seat.add(back);
    return seat;
  }

  car.add(createSeat(-0.5));
  car.add(createSeat(0.5));

  // -------------------------------
  // Steering Wheel (AMG-ish)
  // -------------------------------
  const wheelOuterGeo = new THREE.TorusGeometry(0.45, 0.08, 20, 40);
  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.4,
    roughness: 0.4
  });

  const steeringWheel = new THREE.Mesh(wheelOuterGeo, wheelMat);
  steeringWheel.rotation.z = Math.PI / 2;
  steeringWheel.position.set(0, 1.25, 0.7);
  car.add(steeringWheel);

  // Flat bottom
  const flatGeo = new THREE.BoxGeometry(0.7, 0.12, 0.09);
  const flat = new THREE.Mesh(flatGeo, wheelMat);
  flat.position.set(0, -0.35, 0);
  steeringWheel.add(flat);

  // Center hub
  const hubGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.08, 32);
  const hubMat = new THREE.MeshStandardMaterial({
    color: 0x1b1f26,
    metalness: 0.6,
    roughness: 0.3
  });
  const hub = new THREE.Mesh(hubGeo, hubMat);
  hub.rotation.x = Math.PI / 2;
  steeringWheel.add(hub);

  // AMG-style star lines
  const starMat = new THREE.LineBasicMaterial({ color: 0xc0c4cc });
  const starGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0.18, 0.05),
    new THREE.Vector3(0, -0.1, 0.05),
    new THREE.Vector3(0, 0, 0.05),
    new THREE.Vector3(-0.16, -0.05, 0.05),
    new THREE.Vector3(0, 0, 0.05),
    new THREE.Vector3(0.16, -0.05, 0.05)
  ]);
  const star = new THREE.LineSegments(starGeo, starMat);
  hub.add(star);

  // Save wheel reference
  state.steeringWheel = steeringWheel;

  // -------------------------------
  // Turn Signal Indicators
  // -------------------------------
  const signalMatOff = new THREE.MeshStandardMaterial({
    color: 0x333333,
    emissive: 0x000000
  });

  const signalMatOn = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    emissive: 0xffaa00,
    emissiveIntensity: 1.5
  });

  const leftSignal = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 16, 16),
    signalMatOff.clone()
  );
  leftSignal.position.set(-0.45, 1.42, 0.32);
  car.add(leftSignal);

  const rightSignal = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 16, 16),
    signalMatOff.clone()
  );
  rightSignal.position.set(0.45, 1.42, 0.32);
  car.add(rightSignal);

  state.leftSignalMesh = leftSignal;
  state.rightSignalMesh = rightSignal;
}

// =======================================
// UPDATE COCKPIT EACH FRAME
// =======================================
export function updateCockpit(state, dt) {

  // -------------------------------
  // Steering Wheel Animation
  // -------------------------------
  const targetAngle = state.steeringInput * 0.9;
  state.steeringWheel.rotation.y = lerp(
    state.steeringWheel.rotation.y,
    targetAngle + Math.PI,
    0.25
  );

  // -------------------------------
  // Turn Signal Lights
  // -------------------------------
  state.leftSignalMesh.material.emissiveIntensity =
    state.leftSignal && state.signalBlink ? 1.5 : 0;

  state.rightSignalMesh.material.emissiveIntensity =
    state.rightSignal && state.signalBlink ? 1.5 : 0;

  // -------------------------------
  // Infotainment Screen Update
  // -------------------------------
  const ctx = state.infotainmentCtx;
  const canvas = state.infotainmentCanvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, "#050816");
  grad.addColorStop(1, "#111133");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Header
  ctx.fillStyle = "#ff4040";
  ctx.font = "bold 32px system-ui";
  ctx.textAlign = "left";
  ctx.fillText("luka is the beast", 24, 46);

  // Performance Data
  ctx.fillStyle = "#f5f7fb";
  ctx.font = "26px system-ui";
  ctx.fillText(`Speed: ${state.speed.toFixed(0)} km/h`, 24, 100);
  ctx.fillText(`RPM:   ${state.rpm.toFixed(0)}`, 24, 140);
  ctx.fillText(`Gear:  ${state.gears[state.gearIndex]}`, 24, 180);
  ctx.fillText(`Mode:  ${state.modes[state.modeIndex]}`, 24, 220);

  // Speed bar
  const maxBarWidth = 220;
  const ratio = Math.min(1, Math.abs(state.speed) / 260);

  ctx.fillStyle = "#333a55";
  ctx.fillRect(canvas.width - maxBarWidth - 40, 90, maxBarWidth, 20);

  ctx.fillStyle = "#4bff7a";
  ctx.fillRect(
    canvas.width - maxBarWidth - 40,
    90,
    maxBarWidth * ratio,
    20
  );

  state.infotainmentTexture.needsUpdate = true;
}
