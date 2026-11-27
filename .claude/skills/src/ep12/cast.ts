import type { ToonSpec } from "../engine/draw";

// Meme-fusion cast. Fastener-plant operator: green hard hat, goggles, grey shirt, denim overalls.
export const operator: ToonSpec = {
  hat: "hardhat", hatColor: "#4fa86a", goggles: true, outfit: "overalls", denim: "#2f5a8a", coat: "#d8dce2",
  face: "smirk", pants: "#2f5a8a", gloves: "#2a2a30",
};

// "Your friend" (same recurring friend as ep11): red plaid shirt, mop hair, freckles.
export const friend: ToonSpec = {
  hat: "none", outfit: "plaid", coat: "#d45a4a", plaid: "#7a2a22",
  hair: "#4a2e1e", hairline: "mop", face: "troll", pants: "#2f4e8a", freckles: true,
};
