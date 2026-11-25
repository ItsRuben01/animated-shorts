import type { ToonSpec } from "../engine/draw";

export const boy: ToonSpec = {
  style: "classic",
  hat: "stripecap", hatColor: "#cf4a3e", band: "#f2e6c8",
  coat: "#3f6f9e", vest: "#f2e6c8", buttons: "#d9a23f",
  hair: "#7a4a2c", hairline: "tufts", skin: "#F3EFE9", freckles: true,
  height: 0.68, wide: 1,
};

export const mom: ToonSpec = {
  style: "classic",
  hat: "boater", hatColor: "#e7d7a2", band: "#d95662",
  coat: "#d96d63", vest: "#f5efe0", buttons: "#c8933f",
  hair: "#5c3a2c", hairline: "brush", skin: "#F3EFE9",
  height: 1.0, wide: 0.95,
};
