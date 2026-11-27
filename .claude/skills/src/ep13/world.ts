import type { Look, V3 } from "../engine/Stage";

// Ripening warehouse: cool white key, warm banana bounce, indigo shadows (never black)
export const roomLook: Look = {
  fog: "#e4e6ee", fogNear: 16, fogFar: 60,
  sun: { pos: [-8, 18, 12], color: "#fff6e8", intensity: 2.4, shadow: 26 },
  hemi: { sky: "#eef2ff", ground: "#40427e", intensity: 1.05 },
  ambient: 0.22, exposure: 1.13, aperture: 0.46, vignette: 0.38, saturation: 1.12,
  warm: "#ffb070", cool: "#5a4fd0", ink: 1,
};
export const closeLook: Look = {
  ...roomLook, fog: "#ece2d6", fogNear: 8, fogFar: 36,
  sun: { pos: [6, 10, 12], color: "#ffe6c0", intensity: 2.6, shadow: 18 },
  aperture: 0.6, exposure: 1.15, vignette: 0.44, warm: "#ff9a50",
};
// sealed room full of gas: teal-violet, glowing molecules
export const gasLook: Look = {
  fog: "#3a4a7a", fogNear: 10, fogFar: 40,
  sun: { pos: [-6, 12, 10], color: "#e6fff0", intensity: 2.2, shadow: 14 },
  hemi: { sky: "#9ad8c8", ground: "#2e2c6a", intensity: 1.0 },
  ambient: 0.25, exposure: 1.14, aperture: 0.5, vignette: 0.45, saturation: 1.12,
  warm: "#ffb070", cool: "#5a4fd0", ink: 1, bloom: 0.36,
};
// open sea: bright sky, blue water
export const seaLook: Look = {
  fog: "#cfe4f2", fogNear: 25, fogFar: 110,
  sun: { pos: [-14, 20, 12], color: "#fff4e0", intensity: 2.6, shadow: 40 },
  hemi: { sky: "#dcecff", ground: "#3e4488", intensity: 1.05 },
  ambient: 0.2, exposure: 1.12, aperture: 0.38, vignette: 0.34, saturation: 1.12,
  warm: "#ffb070", cool: "#5a4fd0", ink: 1,
};
export const kitchenLook: Look = {
  ...closeLook, fog: "#f0e2cc",
  sun: { pos: [-6, 12, 12], color: "#ffe8c8", intensity: 2.5, shadow: 18 },
  hemi: { sky: "#fff2dc", ground: "#4a3f7a", intensity: 1.05 },
};

export const ramp = (t: number, start: number, end: number) => Math.max(0, Math.min(1, (t - start) / Math.max(0.01, end - start)));
export const ease = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);
export const cam = (from: V3, look: V3, fov = 44, to: V3 = from, lookTo: V3 = look) => ({ from, to, lookFrom: look, lookTo, fov });
