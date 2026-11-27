import type { ToonSpec } from "../engine/draw";

// Meme-fusion cast. Can-plant operator: red hard hat, goggles, ear defenders, white lab coat over a red shirt.
export const operator: ToonSpec = {
  hat: "hardhat", hatColor: "#d8342c", goggles: true, headphones: true, outfit: "labcoat", coat: "#f4f4f2", shirt: "#e8a0a0", tie: "#d8342c",
  face: "smirk", pants: "#33405a",
};

// "Your friend" (recurring, as in ep11–ep13)
export const friend: ToonSpec = {
  hat: "none", outfit: "plaid", coat: "#d45a4a", plaid: "#7a2a22",
  hair: "#4a2e1e", hairline: "mop", face: "troll", pants: "#2f4e8a", freckles: true,
};
