import type { Look, V3 } from "../engine/Stage";

// Clean food-factory light: warm key from the windows, cool violet-blue shadows (never black).
export const factoryLook: Look = {
  fog: "#dfe8df", fogNear: 18, fogFar: 70,
  sun: { pos: [-10, 20, 14], color: "#fff1d8", intensity: 2.5, shadow: 30 },
  hemi: { sky: "#e3efe0", ground: "#46407a", intensity: 1.0 },
  ambient: 0.2, exposure: 1.12, aperture: 0.44, vignette: 0.38, saturation: 1.1,
  warm: "#ffb070", cool: "#5a4fd0", ink: 1,
};

export const closeLook: Look = {
  ...factoryLook,
  fog: "#d6e2d8", fogNear: 9, fogFar: 40,
  sun: { pos: [-7, 14, 15], color: "#fff4de", intensity: 2.7, shadow: 20 },
  aperture: 0.56, exposure: 1.16, vignette: 0.45,
};

export const xrayLook: Look = {
  ...factoryLook,
  fog: "#c8dccf", fogNear: 10, fogFar: 46,
  sun: { pos: [6, 14, 18], color: "#f4fff0", intensity: 2.4, shadow: 22 },
  hemi: { sky: "#d6f2df", ground: "#3b4a8c", intensity: 1.15 },
  aperture: 0.5, exposure: 1.18, saturation: 1.16,
};

export const warmLook: Look = {
  ...closeLook,
  sun: { pos: [8, 14, 14], color: "#ffe2b8", intensity: 2.6, shadow: 20 },
  warm: "#ff9a50", exposure: 1.14,
};

// shot 1 product studio: dim fill, the spot does the work; shadows stay blue-violet
export const studioLook: Look = {
  fog: "#4a4f86", fogNear: 12, fogFar: 40,
  sun: { pos: [-6, 12, 10], color: "#fff0d6", intensity: 1.6, shadow: 5 },
  hemi: { sky: "#9aa0dc", ground: "#3d3c78", intensity: 0.85 },
  ambient: 0.2, exposure: 1.12, aperture: 0.6, vignette: 0.42, saturation: 1.0,
  warm: "#ffb070", cool: "#5a4fd0", ink: 1, bloom: 0.32, contrast: 1.2,
};

export const ramp = (t: number, start: number, end: number) => Math.max(0, Math.min(1, (t - start) / Math.max(0.01, end - start)));

export const cam = (from: V3, look: V3, fov = 44, to: V3 = from, lookTo: V3 = look) => ({ from, to, lookFrom: look, lookTo, fov });
