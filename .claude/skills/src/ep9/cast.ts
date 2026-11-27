import type { ToonSpec } from "../engine/draw";

// Meme-fusion cast (channel default). Steel-plant guide: yellow hard hat, goggles, hi-vis vest over a blue shirt.
export const guide: ToonSpec = {
  hat: "hardhat", hatColor: "#f2c230", goggles: true, outfit: "hivis", coat: "#3d6fb8", vest: "#f07a1f",
  face: "smirk", pants: "#33405a", gloves: "#2a2a30", headphones: true,
};

// The mechanics fan from the hook (and the "friend" at the end): denim overalls, red cap, wrench.
export const fan: ToonSpec = {
  hat: "cap", hatColor: "#c0392b", outfit: "overalls", denim: "#3b5f9a", coat: "#f4f1ea",
  hair: "#6b3e26", hairline: "mop", face: "troll", pants: "#3b5f9a", freckles: true,
};
