import type { Look, V3 } from "../engine/Stage";

// Industrial bakery: warm golden key, cream-white tiles, violet shadows (never black)
export const bakeryLook: Look = {
  fog: "#f0e4d4", fogNear: 16, fogFar: 60,
  sun: { pos: [-8, 18, 12], color: "#fff0d8", intensity: 2.5, shadow: 26 },
  hemi: { sky: "#fff4e4", ground: "#46407a", intensity: 1.05 },
  ambient: 0.22, exposure: 1.13, aperture: 0.46, vignette: 0.38, saturation: 1.12,
  warm: "#ffb070", cool: "#5a4fd0", ink: 1,
};
export const closeLook: Look = {
  ...bakeryLook, fog: "#f2e2cc", fogNear: 8, fogFar: 34,
  sun: { pos: [6, 10, 12], color: "#ffe6c0", intensity: 2.6, shadow: 18 },
  aperture: 0.6, exposure: 1.15, vignette: 0.44, warm: "#ff9a50",
};
// hot oven light: orange, high bloom
export const ovenLook: Look = {
  ...closeLook, fog: "#e8c8a0",
  sun: { pos: [4, 8, 10], color: "#ffc080", intensity: 2.6, shadow: 16 },
  hemi: { sky: "#ffd8b0", ground: "#4a3a7a", intensity: 1.0 },
  warm: "#ff8a40", bloom: 0.42,
};
// cut-away "inside the bun" studio: deep plum backdrop, warm spot
export const insideLook: Look = {
  fog: "#4a3f6a", fogNear: 12, fogFar: 40,
  sun: { pos: [-5, 10, 10], color: "#fff0dc", intensity: 2.3, shadow: 10 },
  hemi: { sky: "#e0c8f0", ground: "#3d3c78", intensity: 0.95 },
  ambient: 0.22, exposure: 1.14, aperture: 0.55, vignette: 0.44, saturation: 1.1,
  warm: "#ffb070", cool: "#5a4fd0", ink: 1, bloom: 0.3,
};

export const ramp = (t: number, start: number, end: number) => Math.max(0, Math.min(1, (t - start) / Math.max(0.01, end - start)));
export const ease = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);
export const cam = (from: V3, look: V3, fov = 44, to: V3 = from, lookTo: V3 = look) => ({ from, to, lookFrom: look, lookTo, fov });
