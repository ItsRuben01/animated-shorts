import type { Look, V3 } from "../engine/Stage";

export const FPS = 30;

export const labLook: Look = {
  fog: "#d7e2ea", fogNear: 20, fogFar: 100,
  sun: { pos: [-12, 22, 16], color: "#fff1d8", intensity: 2.5, shadow: 36 },
  hemi: { sky: "#cfe1f5", ground: "#4a3f72", intensity: 1.0 },
  ambient: 0.18, exposure: 1.12, aperture: 0.44, vignette: 0.42, saturation: 1.12,
  warm: "#ffb070", cool: "#5a4fd0", ink: 0.5,
};

export const xrayLook: Look = {
  ...labLook,
  fog: "#c5dbe9", fogNear: 14, fogFar: 76,
  sun: { pos: [10, 20, 18], color: "#e8f6ff", intensity: 2.25, shadow: 32 },
  hemi: { sky: "#bfe4ff", ground: "#3b4a8c", intensity: 1.15 },
  exposure: 1.16, aperture: 0.5, saturation: 1.18, ink: 0.42,
};

export const microLook: Look = {
  ...xrayLook,
  fog: "#b9d3e2", fogNear: 9, fogFar: 44,
  sun: { pos: [8, 14, 20], color: "#f2fbff", intensity: 2.4, shadow: 24 },
  ambient: 0.24, aperture: 0.62, exposure: 1.2, vignette: 0.48, ink: 0.4,
};

export const analogyLook: Look = {
  ...labLook,
  fog: "#cbd9e4", fogNear: 12, fogFar: 54,
  sun: { pos: [14, 18, 14], color: "#fff0d0", intensity: 2.6, shadow: 26 },
  ambient: 0.22, exposure: 1.14, aperture: 0.46, ink: 0.46,
};

export const closeLook: Look = {
  ...labLook,
  fog: "#c8d8e6", fogNear: 8, fogFar: 36,
  sun: { pos: [-8, 15, 16], color: "#fff4de", intensity: 2.7, shadow: 22 },
  aperture: 0.58, exposure: 1.18, vignette: 0.5, ink: 0.44,
};

export const ramp = (t: number, start: number, end: number) => Math.max(0, Math.min(1, (t - start) / Math.max(0.01, end - start)));

export const cam = (from: V3, look: V3, fov = 48, to: V3 = from, lookTo: V3 = look) => ({
  from, to, lookFrom: look, lookTo, fov,
});
