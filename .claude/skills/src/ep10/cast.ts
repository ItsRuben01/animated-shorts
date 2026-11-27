import type { ToonSpec } from "../engine/draw";

// Meme-fusion cast (channel default). Gum-plant guide: white hard hat, goggles, lab coat, pink tie.
export const guide: ToonSpec = {
  hat: "hardhat", hatColor: "#f4f4f0", goggles: true, outfit: "labcoat", coat: "#f4f4f2", tie: "#e0569a",
  face: "smirk", pants: "#33405a",
};

// The gum fan from the hook (and the "friend" at the end): pink plaid shirt, cap, freckles.
export const fan: ToonSpec = {
  hat: "cap", hatColor: "#e0569a", outfit: "plaid", coat: "#f08cbf", plaid: "#9a2f66",
  hair: "#3e2a1e", hairline: "mop", face: "troll", pants: "#2f4e8a", freckles: true,
};
