import type { ToonSpec } from "../engine/draw";

// Meme-fusion cast. Baker: white cap, white coat with a pink tie, flour-white gloves.
export const baker: ToonSpec = {
  hat: "cap", hatColor: "#f4f4f0", outfit: "labcoat", coat: "#f6f4ee", shirt: "#f4c8a8", tie: "#e0569a",
  face: "smirk", pants: "#5a4a3a", gloves: "#f4f4f0", moustache: true,
};

// "Your friend" (recurring, as in ep11–ep14)
export const friend: ToonSpec = {
  hat: "none", outfit: "plaid", coat: "#d45a4a", plaid: "#7a2a22",
  hair: "#4a2e1e", hairline: "mop", face: "troll", pants: "#2f4e8a", freckles: true,
};
