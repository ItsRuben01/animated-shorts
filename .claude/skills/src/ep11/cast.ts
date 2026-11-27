import type { ToonSpec } from "../engine/draw";

// Meme-fusion cast (channel default). Ramp mechanic: hi-vis vest, ear defenders, cap.
export const mechanic: ToonSpec = {
  hat: "cap", hatColor: "#2f4e8a", outfit: "hivis", coat: "#3f6f9a", headphones: true,
  face: "smirk", pants: "#2c3550", toolbelt: true,
};

// "Your friend": the one who blows tires up with his own lungs. Red plaid shirt, mop hair.
export const friend: ToonSpec = {
  hat: "none", outfit: "plaid", coat: "#d45a4a", plaid: "#7a2a22",
  hair: "#4a2e1e", hairline: "mop", face: "troll", pants: "#2f4e8a", freckles: true,
};
