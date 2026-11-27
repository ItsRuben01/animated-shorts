import type { Look, V3 } from "../engine/Stage";

// Candy plant: clean white key from the skylights, warm bounce, violet-blue shadows (never black).
export const plantLook: Look = {
  fog: "#ece4e8", fogNear: 18, fogFar: 70,
  sun: { pos: [-10, 20, 14], color: "#fff3e6", intensity: 2.5, shadow: 30 },
  hemi: { sky: "#f2eef2", ground: "#46407a", intensity: 1.0 },
  ambient: 0.2, exposure: 1.12, aperture: 0.44, vignette: 0.38, saturation: 1.1,
  warm: "#ffb070", cool: "#5a4fd0", ink: 1,
};

export const closeLook: Look = {
  ...plantLook,
  fog: "#e6dce2", fogNear: 9, fogFar: 40,
  sun: { pos: [-7, 14, 15], color: "#fff4e6", intensity: 2.7, shadow: 20 },
  aperture: 0.56, exposure: 1.16, vignette: 0.45,
};

export const warmLook: Look = {
  ...closeLook,
  sun: { pos: [8, 14, 14], color: "#ffdcb0", intensity: 2.6, shadow: 20 },
  warm: "#ff9a50", exposure: 1.14, bloom: 0.3,
};

export const coolLook: Look = {
  ...plantLook,
  fog: "#d4e2ec", fogNear: 10, fogFar: 46,
  sun: { pos: [6, 14, 18], color: "#eef6ff", intensity: 2.4, shadow: 22 },
  hemi: { sky: "#dcecff", ground: "#3b4a8c", intensity: 1.15 },
  aperture: 0.5, exposure: 1.16, saturation: 1.08, warm: "#ffc890",
};

// Maya rainforest: green-gold key, teal shadows
export const jungleLook: Look = {
  fog: "#b9d6a8", fogNear: 10, fogFar: 42,
  sun: { pos: [-6, 18, 10], color: "#fff0c8", intensity: 2.5, shadow: 20 },
  hemi: { sky: "#d8f0c0", ground: "#2f4a6a", intensity: 1.05 },
  ambient: 0.2, exposure: 1.12, aperture: 0.5, vignette: 0.42, saturation: 1.12,
  warm: "#ffb070", cool: "#4a5fc0", ink: 1,
};

// X-ray look for the polymer chains: deep indigo, glowing pink (never black)
export const xrayLook: Look = {
  fog: "#2a2c62", fogNear: 14, fogFar: 50,
  sun: { pos: [-6, 10, 10], color: "#ffe6f2", intensity: 2.2, shadow: 8 },
  hemi: { sky: "#8a8ee0", ground: "#2e2c6a", intensity: 0.9 },
  ambient: 0.25, exposure: 1.14, aperture: 0.5, vignette: 0.45, saturation: 1.12,
  warm: "#ffb070", cool: "#5a4fd0", ink: 1, bloom: 0.38,
};

// shot 1 product studio: dim fill, the spot does the work
export const studioLook: Look = {
  fog: "#4a4f86", fogNear: 12, fogFar: 40,
  sun: { pos: [-6, 12, 10], color: "#fff0e0", intensity: 1.7, shadow: 5 },
  hemi: { sky: "#a6a0dc", ground: "#3d3c78", intensity: 0.9 },
  ambient: 0.2, exposure: 1.12, aperture: 0.6, vignette: 0.42, saturation: 1.05,
  warm: "#ffb070", cool: "#5a4fd0", ink: 1, bloom: 0.32, contrast: 1.2,
};

export const ramp = (t: number, start: number, end: number) => Math.max(0, Math.min(1, (t - start) / Math.max(0.01, end - start)));
export const ease = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);

export const cam = (from: V3, look: V3, fov = 44, to: V3 = from, lookTo: V3 = look) => ({ from, to, lookFrom: look, lookTo, fov });
