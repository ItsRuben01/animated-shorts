import type { Look, V3 } from "../engine/Stage";

// Steel-ball plant: cool white skylights, warm bounce from the furnace side, violet-blue shadows (never black).
export const millLook: Look = {
  fog: "#dfe3e8", fogNear: 18, fogFar: 70,
  sun: { pos: [-10, 20, 14], color: "#fff3e0", intensity: 2.5, shadow: 30 },
  hemi: { sky: "#eef2f6", ground: "#46407a", intensity: 1.0 },
  ambient: 0.2, exposure: 1.12, aperture: 0.44, vignette: 0.38, saturation: 1.1,
  warm: "#ffb070", cool: "#5a4fd0", ink: 1,
};

export const closeLook: Look = {
  ...millLook,
  fog: "#d8dde4", fogNear: 9, fogFar: 40,
  sun: { pos: [-7, 14, 15], color: "#fff4de", intensity: 2.7, shadow: 20 },
  aperture: 0.56, exposure: 1.16, vignette: 0.45,
};

export const furnaceLook: Look = {
  ...closeLook,
  fog: "#e6d6c8",
  sun: { pos: [8, 14, 14], color: "#ffd9a8", intensity: 2.6, shadow: 20 },
  warm: "#ff9a50", exposure: 1.14, bloom: 0.34,
};

// lab / measuring room: cooler, cleaner
export const labLook: Look = {
  ...millLook,
  fog: "#d4e0ec", fogNear: 10, fogFar: 46,
  sun: { pos: [6, 14, 18], color: "#eef6ff", intensity: 2.4, shadow: 22 },
  hemi: { sky: "#dcecff", ground: "#3b4a8c", intensity: 1.15 },
  aperture: 0.5, exposure: 1.16, saturation: 1.08, warm: "#ffc890",
};

// space shot for the Earth comparison: deep indigo, never black
export const spaceLook: Look = {
  fog: "#262a5c", fogNear: 30, fogFar: 90,
  sun: { pos: [-8, 6, 10], color: "#fff4e0", intensity: 2.8, shadow: 10 },
  hemi: { sky: "#7f8ad8", ground: "#2e2c6a", intensity: 0.8 },
  ambient: 0.2, exposure: 1.12, aperture: 0.5, vignette: 0.45, saturation: 1.12,
  warm: "#ffb070", cool: "#5a4fd0", ink: 1, bloom: 0.36,
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
export const ease = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);

export const cam = (from: V3, look: V3, fov = 44, to: V3 = from, lookTo: V3 = look) => ({ from, to, lookFrom: look, lookTo, fov });
