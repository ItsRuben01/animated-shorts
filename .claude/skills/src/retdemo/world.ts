import type { Look, V3 } from "../engine/Stage";

// "Inside your phone": deep navy tech world, warm gold key, cyan ions. Shadows indigo, never black.
export const techLook: Look = {
  fog: "#151a3a", fogNear: 14, fogFar: 46,
  sun: { pos: [-6, 12, 10], color: "#ffe9c4", intensity: 2.2, shadow: 12 },
  hemi: { sky: "#8c9be8", ground: "#2a2a6e", intensity: 0.95 },
  ambient: 0.22, exposure: 1.12, aperture: 0.5, vignette: 0.42, saturation: 1.12,
  warm: "#ffb070", cool: "#5a4fd0", ink: 1, bloom: 0.34, contrast: 1.18,
};

export const closeLook: Look = { ...techLook, aperture: 0.6, fogNear: 8, fogFar: 32 };

// warning: the plating shot goes a little colder and redder in the highlights
export const dangerLook: Look = { ...techLook, warm: "#ff7a5a", saturation: 1.18, exposure: 1.08 };

// bedroom at night: moonlight from the window + warm lamp
export const nightLook: Look = {
  fog: "#1a2050", fogNear: 10, fogFar: 40,
  sun: { pos: [5, 11, 9], color: "#c4d0ff", intensity: 1.7, shadow: 10 },
  hemi: { sky: "#7d8be0", ground: "#3a347a", intensity: 1.0 },
  ambient: 0.25, exposure: 1.16, aperture: 0.55, vignette: 0.48, saturation: 1.08,
  warm: "#ffb070", cool: "#4c46c8", ink: 1, bloom: 0.38, contrast: 1.16,
};

export const ramp = (t: number, start: number, end: number) => Math.max(0, Math.min(1, (t - start) / Math.max(0.01, end - start)));
export const smooth = (k: number) => k * k * (3 - 2 * k);

export const cam = (from: V3, look: V3, fov = 40, to: V3 = from, lookTo: V3 = look) => ({ from, to, lookFrom: look, lookTo, fov });
