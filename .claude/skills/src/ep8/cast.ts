import type { ToonSpec } from "../engine/draw";

// Meme-fusion cast (channel default). Factory guide: white hard hat, safety goggles, lab coat, red tie.
export const guide: ToonSpec = {
  hat: "hardhat", hatColor: "#f4f4f0", goggles: true, outfit: "labcoat", coat: "#f4f4f2", tie: "#c0392b",
  face: "smirk", pants: "#33405a",
};

// The hot-dog fan from the hook (and the "friend" at the end): red plaid shirt, cap.
export const fan: ToonSpec = {
  hat: "cap", hatColor: "#d9534f", outfit: "plaid", coat: "#d9534f", plaid: "#7a1f1a",
  hair: "#6b3e26", hairline: "mop", face: "troll", pants: "#2f4e8a",
};

// Erwin O. Freund, Chicago 1920s: hat, moustache, glasses, dark suit — the man who peeled the first one.
export const freund: ToonSpec = {
  hat: "bowler", hatColor: "#2a2a30", outfit: "shirt", coat: "#3b3f4a", tie: "#8a2a2a",
  moustache: true, glasses: true, hair: "#6a6a6a", hairline: "side", face: "lol", pants: "#2c2f38",
};
