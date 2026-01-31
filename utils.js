// =======================================
// AMG GAME ENGINE – utils.js
// Helper math functions used everywhere
// =======================================

// Clamp a value between min and max
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Linear interpolation
export function lerp(a, b, t) {
  return a + (b - a) * t;
}
