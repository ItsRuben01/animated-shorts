import type { Look, V3 } from "../engine/Stage";

export const FPS = 30;
export const VOICE_SECONDS = 101.58;
export const TOTAL = Math.ceil(VOICE_SECONDS * FPS);

export const TOWER = {
  tiers: 8,
  tierH: 3.3,
  baseR: 5.1,
  step: 0.42,
  flare: 0.55,
  ballY: 23.1,
  ballR: 2.05,
  pivotY: 27.2,
  pistonY: 19.3,
};

export const stormLook: Look = {
  fog: "#a8b8c6", fogNear: 26, fogFar: 120,
  sun: { pos: [-14, 28, 18], color: "#dfe9f4", intensity: 2.4, shadow: 48 },
  hemi: { sky: "#b9d0e6", ground: "#403c69", intensity: 1.05 },
  ambient: 0.16, exposure: 1.1, aperture: 0.42, vignette: 0.4, saturation: 1.08,
  warm: "#ffc089", cool: "#4b4ed0", ink: 0.5,
};

export const xrayLook: Look = {
  ...stormLook,
  fog: "#b9d3e2", fogNear: 18, fogFar: 90,
  sun: { pos: [10, 22, 16], color: "#e8f6ff", intensity: 2.2, shadow: 44 },
  hemi: { sky: "#bfe4ff", ground: "#3b4a8c", intensity: 1.15 },
  exposure: 1.16, aperture: 0.48, saturation: 1.18, ink: 0.42,
};

export const atriumLook: Look = {
  ...xrayLook,
  fog: "#a9c3d1", fogNear: 8, fogFar: 38,
  sun: { pos: [6, 30, 12], color: "#fff0cf", intensity: 2.5, shadow: 22 },
  ambient: 0.26, aperture: 0.62, exposure: 1.2, vignette: 0.46, ink: 0.46,
};

export const busLook: Look = {
  fog: "#c7d9e4", fogNear: 14, fogFar: 60,
  sun: { pos: [12, 18, 12], color: "#fff2da", intensity: 2.4, shadow: 26 },
  hemi: { sky: "#cbe2ff", ground: "#4b477e", intensity: 1.0 },
  ambient: 0.2, exposure: 1.12, aperture: 0.46, vignette: 0.36, saturation: 1.12,
  warm: "#ffb070", cool: "#5a4fd0", ink: 0.44,
};

export const duskLook: Look = {
  fog: "#e7b88d", fogNear: 30, fogFar: 150,
  sun: { pos: [-26, 12, 26], color: "#ffd2a0", intensity: 3.1, shadow: 60 },
  hemi: { sky: "#ffdcb8", ground: "#5a4274", intensity: 1.0 },
  ambient: 0.2, exposure: 1.12, aperture: 0.34, vignette: 0.34, saturation: 1.14,
  warm: "#ffc182", cool: "#50479e", ink: 0.44,
};

export const sceneOf = (id: number): number =>
  id <= 5 ? 1 : id <= 9 ? 2 : id <= 12 ? 3 : id <= 18 ? 4 : id <= 23 ? 5 : id <= 28 ? 6 : 7;

export const bend = (t: number, amp = 0.055, speed = 1.9) => Math.sin(t * speed) * amp;
export const ballAngle = (t: number, amp = 0.12, speed = 1.9) => -Math.sin(t * speed + 0.85) * amp;

export const runway = (t: number, start: number, end: number, base: number, top: number) => {
  const k = Math.min(1, Math.max(0, (t - start) / (end - start)));
  return base + (top - base) * k;
};

export const cam = (from: V3, look: V3, fov = 48, to: V3 = from, lookTo: V3 = look) => ({
  from, to, lookFrom: look, lookTo, fov,
});
