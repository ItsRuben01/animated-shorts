import type { Look, V3 } from "../engine/Stage";

// Airport apron at midday: clean white key, sky-blue fill, indigo shadows (never black).
export const apronLook: Look = {
  fog: "#cfe0ee", fogNear: 22, fogFar: 90,
  sun: { pos: [-12, 22, 14], color: "#fff4e4", intensity: 2.6, shadow: 34 },
  hemi: { sky: "#dcecff", ground: "#3e4488", intensity: 1.05 },
  ambient: 0.2, exposure: 1.12, aperture: 0.42, vignette: 0.36, saturation: 1.1,
  warm: "#ffb070", cool: "#5a4fd0", ink: 1,
};

// Low, close look for the hook and the tire close-ups (golden sidelight)
export const closeLook: Look = {
  ...apronLook,
  fog: "#e8d8c8", fogNear: 10, fogFar: 46,
  sun: { pos: [9, 9, 12], color: "#ffd9a8", intensity: 2.7, shadow: 20 },
  aperture: 0.56, exposure: 1.14, vignette: 0.44, warm: "#ff9a50",
};

// Hangar: cool overhead strips + warm bounce
export const hangarLook: Look = {
  fog: "#d6dbe6", fogNear: 16, fogFar: 60,
  sun: { pos: [-6, 18, 12], color: "#f6f8ff", intensity: 2.4, shadow: 26 },
  hemi: { sky: "#eef2ff", ground: "#40427e", intensity: 1.05 },
  ambient: 0.22, exposure: 1.14, aperture: 0.46, vignette: 0.38, saturation: 1.08,
  warm: "#ffb070", cool: "#5a4fd0", ink: 1,
};

// X-ray of the tire's inside: deep indigo, glowing molecules (never black)
export const xrayLook: Look = {
  fog: "#2a2c62", fogNear: 14, fogFar: 50,
  sun: { pos: [-6, 10, 10], color: "#e6f0ff", intensity: 2.1, shadow: 8 },
  hemi: { sky: "#8a8ee0", ground: "#2e2c6a", intensity: 0.95 },
  ambient: 0.25, exposure: 1.14, aperture: 0.5, vignette: 0.45, saturation: 1.12,
  warm: "#ffb070", cool: "#5a4fd0", ink: 1, bloom: 0.38,
};

// 1986 flashback: dusky violet sky, warm low sun
export const duskLook: Look = {
  fog: "#b49ab8", fogNear: 20, fogFar: 80,
  sun: { pos: [12, 6, 10], color: "#ffc890", intensity: 2.3, shadow: 20 },
  hemi: { sky: "#c8b4dc", ground: "#3a336e", intensity: 1.0 },
  ambient: 0.22, exposure: 1.1, aperture: 0.4, vignette: 0.5, saturation: 1.0,
  warm: "#ff9a50", cool: "#5a4fd0", ink: 1, bloom: 0.34, contrast: 1.2,
};

export const ramp = (t: number, start: number, end: number) => Math.max(0, Math.min(1, (t - start) / Math.max(0.01, end - start)));
export const ease = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);

export const cam = (from: V3, look: V3, fov = 44, to: V3 = from, lookTo: V3 = look) => ({ from, to, lookFrom: look, lookTo, fov });
