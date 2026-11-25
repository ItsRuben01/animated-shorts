import type { ToonSpec } from "../engine/draw";

// Factory guide (the narrator on screen): white helmet, white coat, green apron, moustache.
export const worker: ToonSpec = {
  hat: "helmet", hatColor: "#f4f4f0", band: "#2e7d5b",
  coat: "#f2efe6", vest: "#2e7d5b", buttons: "#e0b44a",
  hair: "#3b2b27", hairline: "brush", moustache: true, skin: "#F3EFE9",
  height: 0.95, wide: 0.96,
};

// The pickle fan from the hook (and the "friend" at the end).
export const fan: ToonSpec = {
  hat: "none", coat: "#d9534f", scarf: "#f2c14e",
  hair: "#6b3e26", hairline: "curly", glasses: true, skin: "#F3EFE9", freckles: true,
  height: 0.9, wide: 1.0,
};
