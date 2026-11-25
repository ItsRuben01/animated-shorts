// 2D cartoon people drawn in code. Two styles:
//  - "meme" (DEFAULT, the channel look from ref/personajes_meme.jpg): huge round white head (~45% of the height)
//    with a grey cel crescent on the left, compact pill torso with real work clothes, thick black stick arms,
//    black mitten hands, filled trouser legs + black shoes, and meme-fusion faces drawn inside the head.
//  - "classic" (episodes 1–7): small-hat, bean-coat Victorian look. Kept so old episodes re-render identically.
// Drawn fresh every frame, so walking, blinking, talking and props are just numbers.

export type Hat = "none" | "top" | "bowler" | "flatcap" | "stripecap" | "cabbie" | "boater" | "helmet"
  | "hardhat" | "cap" | "visor";
export type Eyes = "dot" | "wide" | "shock" | "closed" | "half" | "angry" | "happy" | "sad";
export type Mouth = "smile" | "flat" | "open" | "frown" | "o" | "grin" | "wavy" | "teeth";
export type Arm = "down" | "hips" | "wave" | "point" | "hold" | "up" | "cross" | "shrug" | "drink" | "warm" | "show";
export type Prop = "none" | "newspaper" | "mug" | "teacup" | "sandwich" | "coin" | "cane" | "whip" | "plate"
  | "wrench" | "blueprint" | "gear" | "walkie" | "clipboard";
// Meme-fusion expressions (meme style). Aliases share a drawing family but differ in details.
export type Expression = "neutral" | "smirk" | "troll" | "lol" | "laugh" | "rage" | "scream" | "poker"
  | "derp" | "high" | "skeptical" | "suspicious" | "happy" | "proud";
export type Outfit = "shirt" | "plaid" | "polo" | "labcoat" | "overalls" | "hivis";
export type Hairline = "mop" | "side" | "tufts" | "curly" | "brush";

export type ToonSpec = {
  style?: "meme" | "classic"; // default "meme"
  hat: Hat; hatColor?: string; band?: string;
  coat: string; // main top colour: shirt (shirt/plaid/polo), coat (labcoat), undershirt (overalls/hivis)
  vest?: string; scarf?: string; buttons?: string;
  hair?: string; moustache?: boolean; whiskers?: boolean; beard?: boolean; glasses?: boolean;
  skin?: string; freckles?: boolean; hairline?: Hairline;
  height?: number; // 0.6 (child) .. 1.0
  wide?: number; // body width factor
  // ---- meme style ----
  face?: Expression; // default expression (a pose can override it)
  outfit?: Outfit; // default "shirt"
  shirt?: string; // shirt under a labcoat (default light blue); under overalls/hivis it overrides `coat`
  plaid?: string; // check-line colour: makes the shirt (or undershirt) plaid
  tie?: string; pants?: string; denim?: string; // denim = overalls colour
  goggles?: boolean; headphones?: boolean; toolbelt?: boolean; badge?: string;
  gloves?: string; // hand colour (default black mittens)
  headScale?: number; // 1 = measured reference (head ≈ 45% of the height)
};
export type ToonPose = {
  t: number; // seconds (drives blink, idle, walk)
  walk?: number; // 0 = stand, 1 = walk cycle speed
  face?: Expression; // meme style: overrides spec.face and eyes/mouth
  eyes?: Eyes; mouth?: Mouth; talk?: boolean;
  armL?: Arm; armR?: Arm; prop?: Prop; propHand?: "L" | "R";
  look?: number; // -1 .. 1 pupils left/right
  shiver?: boolean; sit?: boolean;
};

export function drawToon(g: CanvasRenderingContext2D, s: ToonSpec, p: ToonPose) {
  return s.style === "classic" ? drawToonClassic(g, s, p) : drawToonMeme(g, s, p);
}

const INK = "#2a1a14";
const LW = 16;

const darker = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * k), g = Math.round(((n >> 8) & 255) * k), b = Math.round((n & 255) * k);
  return `rgb(${Math.min(255, r)},${Math.min(255, g)},${Math.min(255, b)})`;
};

function hand(g: CanvasRenderingContext2D, x: number, y: number, skin = "#f3efe9", r = 18) {
  g.fillStyle = skin; g.strokeStyle = INK; g.lineWidth = 6;
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); g.stroke();
}

function limb(g: CanvasRenderingContext2D, pts: number[][], w = LW) {
  g.strokeStyle = INK; g.lineWidth = w; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
  if (pts.length === 3) g.quadraticCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1]);
  else for (const p of pts.slice(1)) g.lineTo(p[0], p[1]);
  g.stroke();
}

function drawProp(g: CanvasRenderingContext2D, p: Prop, x: number, y: number, t: number, side = 1) {
  if (p === "newspaper") x += side < 0 ? 0 : -124;
  g.lineWidth = 6; g.strokeStyle = INK;
  if (p === "newspaper") {
    g.save(); g.translate(x + 62, y - 10); g.rotate(-0.08);
    g.fillStyle = "#efe8d6"; g.fillRect(-70, -95, 140, 170); g.strokeRect(-70, -95, 140, 170);
    g.fillStyle = INK; g.font = "900 22px Georgia"; g.textAlign = "center"; g.fillText("THE GLOBE", 0, -62);
    g.fillRect(-55, -50, 110, 4);
    for (let i = 0; i < 7; i++) { g.fillStyle = "rgba(20,20,20,0.55)"; g.fillRect(-55, -36 + i * 14, i % 3 === 2 ? 70 : 110, 6); }
    g.restore();
  } else if (p === "mug") {
    g.fillStyle = "#d9c89a"; g.beginPath(); g.roundRect(x - 22, y - 50, 44, 58, 6); g.fill(); g.stroke();
    g.fillStyle = "#fff8e6"; g.beginPath(); g.ellipse(x, y - 52, 26, 12, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.arc(x + 26, y - 22, 14, -1.2, 1.2); g.stroke();
  } else if (p === "teacup") {
    g.fillStyle = "#f4f1ea"; g.beginPath(); g.moveTo(x - 26, y - 34); g.quadraticCurveTo(x - 24, y + 4, x, y + 4); g.quadraticCurveTo(x + 24, y + 4, x + 26, y - 34); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.ellipse(x, y + 8, 36, 8, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    for (let i = 0; i < 2; i++) { // steam
      g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 5;
      g.beginPath(); const sx = x - 8 + i * 16; g.moveTo(sx, y - 44);
      g.bezierCurveTo(sx - 12, y - 64 - Math.sin(t * 3 + i) * 6, sx + 12, y - 80, sx, y - 100); g.stroke();
    }
  } else if (p === "sandwich") {
    g.fillStyle = "#e9c27a"; g.beginPath(); g.moveTo(x - 40, y + 10); g.lineTo(x + 40, y + 10); g.lineTo(x, y - 40); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#7cb24a"; g.fillRect(x - 30, y - 2, 60, 7);
    g.fillStyle = "#d65a4a"; g.fillRect(x - 24, y + 4, 48, 5);
  } else if (p === "coin") {
    g.fillStyle = "#f2c64b"; g.beginPath(); g.arc(x, y - 12, 18, 0, Math.PI * 2); g.fill(); g.stroke();
  } else if (p === "cane") {
    limb(g, [[x, y], [x + 6, y + 260]], 10);
  } else if (p === "whip") {
    limb(g, [[x, y], [x + 30, y - 160]], 6);
    limb(g, [[x + 30, y - 160], [x + 100 + Math.sin(t * 4) * 20, y - 200], [x + 150, y - 140]], 3);
  } else if (p === "plate") {
    g.fillStyle = "#f4f1ea"; g.beginPath(); g.ellipse(x, y - 4, 48, 14, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = "#c98b4a"; g.beginPath(); g.ellipse(x - 8, y - 14, 22, 10, 0, 0, Math.PI * 2); g.fill(); g.stroke();
  }
}

// Draws one character into a 768 x 1024 canvas (room for pointing arms); feet stand on y = 1000.
export function drawToonClassic(g: CanvasRenderingContext2D, s: ToonSpec, p: ToonPose) {
  g.clearRect(0, 0, 768, 1024);
  const H = 940 * (s.height ?? 1), cx = 384, ground = 1000;
  const W = s.wide ?? 1;
  const walk = p.walk ?? 0, ph = p.t * 7.5 * (walk || 1);
  const bob = walk ? Math.abs(Math.sin(ph)) * 10 : Math.sin(p.t * 2.2) * 3;
  const shiverX = p.shiver ? Math.sin(p.t * 60) * 3 : 0;
  const tilt = Math.sin(p.t * 1.6) * 0.035 + (p.look ?? 0) * 0.025;
  const sit = !!p.sit;

  const headR = H * 0.16;
  const legLen = sit ? H * 0.2 : H * 0.34;
  const hipY = ground - legLen - bob * 0.3;
  const torsoH = H * 0.3, torsoW = H * 0.22 * W;
  const torsoTop = hipY - torsoH + 12;
  const neckY = torsoTop + 6;
  const headY = torsoTop - headR * 0.82 - bob * 0.2;
  const hx = cx + shiverX;

  // ---- legs ----
  const legSpread = torsoW * 0.22;
  for (const side of [-1, 1]) {
    const sw = walk ? Math.sin(ph + (side > 0 ? Math.PI : 0)) : 0;
    const fx = cx + side * legSpread + sw * 46, fy = ground - (walk ? Math.max(0, Math.cos(ph + (side > 0 ? Math.PI : 0))) * 18 : 0);
    if (sit) {
      const kx = cx + side * legSpread + 60, ky = hipY + 6;
      limb(g, [[cx + side * legSpread, hipY - 4], [kx, ky], [kx + 6, ground - 6]]);
      g.fillStyle = INK; g.beginPath(); g.ellipse(kx + 22, ground - 4, 24, 11, 0, 0, Math.PI * 2); g.fill();
    } else {
      limb(g, [[cx + side * legSpread, hipY - 4], [(cx + side * legSpread + fx) / 2 + sw * 8, (hipY + fy) / 2], [fx, fy - 6]]);
      g.fillStyle = INK; g.beginPath(); g.ellipse(fx + 12, fy - 6, 25, 11, 0, 0, Math.PI * 2); g.fill();
    }
  }

  // ---- arms (behind/around the body): shoulder points ----
  const shY = torsoTop + torsoH * 0.18;
  const arm = (side: -1 | 1, a: Arm) => {
    const sx = hx + side * torsoW * 0.42, sy = shY;
    const swing = walk ? Math.sin(ph + (side < 0 ? 0 : Math.PI)) * 40 : Math.sin(p.t * 2.2 + side) * 4;
    let ex: number, ey: number, hx2: number, hy: number;
    const L = H * 0.27;
    switch (a) {
      case "hips": ex = sx + side * 62; ey = sy + L * 0.45; hx2 = sx + side * 18; hy = sy + L * 0.8; break;
      case "wave": { const w = Math.sin(p.t * 9) * 18; ex = sx + side * 84; ey = sy - 24; hx2 = sx + side * 112 + w; hy = sy - L * 0.85; break; }
      case "point": ex = sx + side * L * 0.5; ey = sy - 6; hx2 = sx + side * L * 0.95; hy = sy - 30; break;
      case "hold": ex = sx + side * 52; ey = sy + L * 0.55; hx2 = sx + side * 16 + side * -60; hy = sy + L * 0.42; break;
      case "up": ex = sx + side * 78; ey = sy - L * 0.45; hx2 = sx + side * 104; hy = sy - L * 0.98; break;
      case "cross": ex = sx + side * 40; ey = sy + L * 0.45; hx2 = cx - side * torsoW * 0.15; hy = sy + L * 0.35; break;
      case "shrug": ex = sx + side * 66; ey = sy + L * 0.2; hx2 = sx + side * 100; hy = sy - 10; break;
      case "drink": ex = sx + side * 60; ey = sy + L * 0.4; hx2 = hx + side * headR * 0.55; hy = headY + headR * 0.75; break;
      case "warm": ex = sx + side * 46; ey = sy + L * 0.5; hx2 = cx + side * 18; hy = sy + L * 0.25; break;
      default: ex = sx + side * 18 + swing * 0.3; ey = sy + L * 0.5; hx2 = sx + side * 14 + swing; hy = sy + L;
    }
    return { sx, sy, ex, ey, hx: hx2, hy };
  };
  const aL = arm(-1, p.armL ?? "down"), aR = arm(1, p.armR ?? "down");
  const front = (a: Arm) => ["hold", "cross", "drink", "warm"].includes(a);
  const drawArm = (A: ReturnType<typeof arm>) => { limb(g, [[A.sx, A.sy], [A.ex, A.ey], [A.hx, A.hy]]); };
  if (!front(p.armL ?? "down")) { drawArm(aL); hand(g, aL.hx, aL.hy, s.skin); }
  if (!front(p.armR ?? "down")) { drawArm(aR); hand(g, aR.hx, aR.hy, s.skin); }

  // ---- body (bean coat) ----
  g.lineWidth = LW; g.strokeStyle = INK;
  const bx = hx - torsoW / 2;
  const grd = g.createLinearGradient(bx, 0, bx + torsoW, 0);
  grd.addColorStop(0, s.coat); grd.addColorStop(0.7, s.coat); grd.addColorStop(1, darker(s.coat, 0.72));
  g.fillStyle = grd;
  g.beginPath(); g.roundRect(bx, torsoTop, torsoW, torsoH + 18, [torsoW * 0.42, torsoW * 0.42, torsoW * 0.3, torsoW * 0.3]); g.fill(); g.stroke();
  if (s.vest) {
    g.fillStyle = s.vest;
    g.beginPath(); g.moveTo(hx - torsoW * 0.2, torsoTop + 8); g.lineTo(hx, torsoTop + torsoH * 0.55); g.lineTo(hx + torsoW * 0.2, torsoTop + 8);
    g.lineTo(hx + torsoW * 0.16, torsoTop + torsoH + 10); g.lineTo(hx - torsoW * 0.16, torsoTop + torsoH + 10); g.closePath(); g.fill(); g.lineWidth = 5; g.stroke();
  }
  // lapels
  g.lineWidth = 5; g.strokeStyle = INK;
  g.beginPath(); g.moveTo(hx - torsoW * 0.22, torsoTop + 10); g.lineTo(hx - 4, torsoTop + torsoH * 0.5); g.moveTo(hx + torsoW * 0.22, torsoTop + 10); g.lineTo(hx + 4, torsoTop + torsoH * 0.5); g.stroke();
  // buttons
  g.fillStyle = s.buttons ?? "#e9c35a";
  for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(hx + 2, torsoTop + torsoH * (0.58 + i * 0.13), 7, 0, Math.PI * 2); g.fill(); g.lineWidth = 3; g.stroke(); }
  if (s.scarf) {
    g.fillStyle = s.scarf; g.lineWidth = 5;
    g.beginPath(); g.ellipse(hx, neckY + 6, torsoW * 0.3, 18, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.roundRect(hx + 8, neckY + 8, 26, 70, 8); g.fill(); g.stroke();
  }

  if (front(p.armL ?? "down")) { drawArm(aL); }
  if (front(p.armR ?? "down")) { drawArm(aR); }

  // ---- head ----
  g.save(); g.translate(hx, headY); g.rotate(tilt); g.translate(-hx, -headY);
  g.fillStyle = s.skin ?? "#F3EFE9"; g.strokeStyle = INK; g.lineWidth = 10;
  g.beginPath(); g.arc(hx, headY, headR, 0, Math.PI * 2); g.fill(); g.stroke();
  // soft cheek shade
  const sh = g.createRadialGradient(hx - headR * 0.3, headY - headR * 0.4, headR * 0.2, hx, headY, headR * 1.05);
  sh.addColorStop(0, "rgba(255,255,255,0)"); sh.addColorStop(1, "rgba(120,110,150,0.22)");
  g.fillStyle = sh; g.beginPath(); g.ellipse(hx, headY, headR * 0.98, headR * 0.94, 0, 0, Math.PI * 2); g.fill();

  if (s.hair) {
    g.fillStyle = s.hair; g.lineWidth = 5;
    if (s.hairline === "curly") {
      for (let i = -2; i <= 2; i++) {
        g.beginPath(); g.arc(hx + i * headR * 0.36, headY - headR * (0.82 + Math.abs(i) * 0.05), headR * 0.28, 0, Math.PI * 2); g.fill(); g.stroke();
      }
    } else if (s.hairline === "brush") {
      g.beginPath(); g.moveTo(hx - headR * 0.98, headY - headR * 0.18);
      g.quadraticCurveTo(hx - headR * 0.82, headY - headR * 1.12, hx, headY - headR * 1.06);
      g.quadraticCurveTo(hx + headR * 0.82, headY - headR * 1.12, hx + headR * 0.98, headY - headR * 0.18);
      g.quadraticCurveTo(hx + headR * 0.7, headY - headR * 0.54, hx, headY - headR * 0.62);
      g.quadraticCurveTo(hx - headR * 0.7, headY - headR * 0.54, hx - headR * 0.98, headY - headR * 0.18); g.fill(); g.stroke();
    } else {
      for (const side of [-1, 1]) {
        g.beginPath(); g.moveTo(hx + side * headR * 0.98, headY - headR * 0.35);
        g.quadraticCurveTo(hx + side * headR * 1.15, headY + headR * 0.1, hx + side * headR * 0.86, headY + headR * 0.35);
        g.quadraticCurveTo(hx + side * headR * 0.7, headY - headR * 0.1, hx + side * headR * 0.98, headY - headR * 0.35); g.fill(); g.stroke();
      }
    }
  }
  if (s.freckles) {
    g.fillStyle = "rgba(96,52,38,0.45)";
    for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
      g.beginPath(); g.arc(hx + side * headR * (0.42 + i * 0.12), headY + headR * (0.16 + (i % 2) * 0.12), 3, 0, Math.PI * 2); g.fill();
    }
  }
  if (s.whiskers) {
    g.fillStyle = "#e8e3da"; g.lineWidth = 5;
    for (const side of [-1, 1]) {
      g.beginPath(); g.moveTo(hx + side * headR * 0.95, headY - headR * 0.2);
      g.quadraticCurveTo(hx + side * headR * 1.25, headY + headR * 0.55, hx + side * headR * 0.45, headY + headR * 0.8);
      g.quadraticCurveTo(hx + side * headR * 0.75, headY + headR * 0.2, hx + side * headR * 0.95, headY - headR * 0.2); g.fill(); g.stroke();
    }
  }

  // ---- face ----
  const blink = (p.t % 3.7) < 0.12;
  const eyes: Eyes = blink && p.eyes !== "shock" && p.eyes !== "wide" ? "closed" : p.eyes ?? "dot";
  const ex = headR * 0.36, ey = headY - headR * 0.05, look = (p.look ?? 0) * 6;
  g.fillStyle = INK; g.strokeStyle = INK;
  for (const side of [-1, 1]) {
    const x = hx + side * ex + look;
    if (eyes === "closed") { g.lineWidth = 6; g.beginPath(); g.moveTo(x - 13, ey); g.lineTo(x + 13, ey); g.stroke(); }
    else if (eyes === "happy") { g.lineWidth = 6; g.beginPath(); g.arc(x, ey + 6, 12, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    else if (eyes === "shock" || eyes === "wide") { const r = eyes === "shock" ? 25 : 20; g.fillStyle = "#fff"; g.lineWidth = 5; g.beginPath(); g.arc(x, ey, r, 0, Math.PI * 2); g.fill(); g.stroke(); g.fillStyle = INK; g.beginPath(); g.arc(x + look * 0.5, ey, eyes === "shock" ? 6 : 8, 0, Math.PI * 2); g.fill(); }
    else if (eyes === "half") { g.beginPath(); g.ellipse(x, ey + 3, 9, 7, 0, 0, Math.PI * 2); g.fill(); g.lineWidth = 6; g.beginPath(); g.moveTo(x - 15, ey - 3); g.lineTo(x + 15, ey - 3); g.stroke(); }
    else { g.beginPath(); g.ellipse(x, ey, 8.5, 11.5, 0, 0, Math.PI * 2); g.fill(); }
    // brows
    g.lineWidth = 8; g.lineCap = "round";
    const by = ey - headR * 0.3;
    g.beginPath();
    if (eyes === "angry") { g.moveTo(x - side * 16, by - 6); g.lineTo(x + side * 14, by + 8); }
    else if (eyes === "sad") { g.moveTo(x - side * 16, by + 6); g.lineTo(x + side * 14, by - 6); }
    else if (eyes === "wide" || eyes === "shock") { const lift = eyes === "shock" ? 18 : 10; g.moveTo(x - 14, by - lift); g.quadraticCurveTo(x, by - lift - 8, x + 14, by - lift); }
    else { g.moveTo(x - 14, by); g.lineTo(x + 14, by - 2); }
    g.stroke();
  }
  // moustache
  if (s.moustache) {
    g.fillStyle = s.hair ?? "#4a2f22"; g.lineWidth = 4;
    for (const side of [-1, 1]) {
      g.beginPath(); g.moveTo(hx, headY + headR * 0.28);
      g.quadraticCurveTo(hx + side * headR * 0.32, headY + headR * 0.15, hx + side * headR * 0.52, headY + headR * 0.36);
      g.quadraticCurveTo(hx + side * headR * 0.28, headY + headR * 0.45, hx, headY + headR * 0.36); g.fill(); g.stroke();
    }
  }
  // mouth
  let mouth: Mouth = p.mouth ?? "smile";
  if (p.talk) mouth = Math.sin(p.t * 22) > 0.1 ? "open" : "flat";
  const my = headY + headR * (s.moustache ? 0.52 : 0.42);
  g.lineWidth = 6; g.strokeStyle = INK; g.fillStyle = "#6b1e1e";
  g.beginPath();
  if (mouth === "smile") { g.arc(hx, my - 14, 18, Math.PI * 0.2, Math.PI * 0.8); g.stroke(); }
  else if (mouth === "grin") { g.moveTo(hx - 24, my - 6); g.quadraticCurveTo(hx, my + 22, hx + 24, my - 6); g.closePath(); g.fill(); g.stroke(); }
  else if (mouth === "open") { g.ellipse(hx, my, 13, 11, 0, 0, Math.PI * 2); g.fill(); g.stroke(); }
  else if (mouth === "teeth") { g.fillStyle = "#fffaf2"; g.beginPath(); g.roundRect(hx - 26, my - 20, 52, 38, 6); g.fill(); g.lineWidth = 4; g.stroke(); g.beginPath(); g.moveTo(hx, my - 20); g.lineTo(hx, my + 18); g.moveTo(hx - 26, my - 1); g.lineTo(hx + 26, my - 1); g.stroke(); }
  else if (mouth === "o") { g.ellipse(hx, my, 9, 12, 0, 0, Math.PI * 2); g.fill(); g.stroke(); }
  else if (mouth === "frown") { g.arc(hx, my + 14, 16, Math.PI * 1.2, Math.PI * 1.8); g.stroke(); }
  else if (mouth === "wavy") { g.moveTo(hx - 18, my); g.quadraticCurveTo(hx - 9, my - 8, hx, my); g.quadraticCurveTo(hx + 9, my + 8, hx + 18, my); g.stroke(); }
  else { g.moveTo(hx - 14, my); g.lineTo(hx + 14, my); g.stroke(); }
  if (s.beard) {
    g.fillStyle = s.hair ?? "#5a3a26"; g.lineWidth = 5;
    g.beginPath(); g.moveTo(hx - headR * 0.6, headY + headR * 0.5); g.quadraticCurveTo(hx, headY + headR * 1.5, hx + headR * 0.6, headY + headR * 0.5);
    g.quadraticCurveTo(hx, headY + headR * 0.85, hx - headR * 0.6, headY + headR * 0.5); g.fill(); g.stroke();
  }
  if (s.glasses) { g.lineWidth = 5; for (const side of [-1, 1]) { g.beginPath(); g.arc(hx + side * ex + look, ey, 20, 0, Math.PI * 2); g.stroke(); } }
  if (eyes === "shock" || mouth === "teeth") {
    g.fillStyle = "#a9c4ee"; g.strokeStyle = INK; g.lineWidth = 4;
    for (const side of [-1, 1]) {
      const dx = hx + side * headR * 0.92, dy = headY - headR * 0.12;
      g.beginPath(); g.moveTo(dx, dy - 26); g.quadraticCurveTo(dx + 16, dy, dx, dy + 12); g.quadraticCurveTo(dx - 16, dy, dx, dy - 26); g.fill(); g.stroke();
    }
  }

  // ---- hat ----
  const top = classicHat(g, s, hx, headY, headR);

  g.restore();

  // props held in hand
  const prop = p.prop ?? "none";
  if (prop !== "none") {
    const H2 = (p.propHand ?? "R") === "R" ? aR : aL;
    drawProp(g, prop, H2.hx, H2.hy, p.t, (p.propHand ?? "R") === "R" ? 1 : -1);
  }
  if (front(p.armL ?? "down")) hand(g, aL.hx, aL.hy, s.skin);
  if (front(p.armR ?? "down")) hand(g, aR.hx, aR.hy, s.skin);
  for (const [A, a] of [[aL, p.armL], [aR, p.armR]] as const) if (["up", "wave"].includes(a ?? "")) { drawArm(A); hand(g, A.hx, A.hy, s.skin); }
  return { headTopY: top - headR, headY, hipY };
}

// The classic hats (top, bowler, flat cap, striped cap, cabbie, helmet, boater). Returns the hat base y.
function classicHat(g: CanvasRenderingContext2D, s: ToonSpec, hx: number, headY: number, headR: number) {
  const hc = s.hatColor ?? "#2a2a33";
  const top = headY - headR * 0.78;
  g.lineWidth = 7; g.strokeStyle = INK;
  if (s.hat === "top") {
    g.fillStyle = hc; g.beginPath(); g.roundRect(hx - headR * 0.62, top - headR * 1.15, headR * 1.24, headR * 1.2, 6); g.fill(); g.stroke();
    if (s.band) { g.fillStyle = s.band; g.fillRect(hx - headR * 0.62 + 4, top - headR * 0.3, headR * 1.24 - 8, headR * 0.2); }
    g.fillStyle = hc; g.beginPath(); g.ellipse(hx, top + 2, headR * 1.0, headR * 0.17, 0, 0, Math.PI * 2); g.fill(); g.stroke();
  } else if (s.hat === "bowler") {
    g.fillStyle = hc; g.beginPath(); g.ellipse(hx, top + 4, headR * 1.05, headR * 0.17, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(hx - headR * 0.72, top + 2); g.bezierCurveTo(hx - headR * 0.75, top - headR * 0.85, hx + headR * 0.75, top - headR * 0.85, hx + headR * 0.72, top + 2); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.ellipse(hx - headR * 0.25, top - headR * 0.4, headR * 0.16, headR * 0.1, -0.5, 0, Math.PI * 2); g.fill();
  } else if (s.hat === "flatcap" || s.hat === "stripecap") {
    g.fillStyle = hc; g.beginPath();
    g.moveTo(hx - headR * 0.95, top + headR * 0.25); g.bezierCurveTo(hx - headR * 0.9, top - headR * 0.55, hx + headR * 0.9, top - headR * 0.6, hx + headR * 1.0, top + headR * 0.2);
    g.quadraticCurveTo(hx + headR * 1.45, top + headR * 0.35, hx + headR * 1.25, top + headR * 0.42); g.lineTo(hx - headR * 0.95, top + headR * 0.32); g.closePath(); g.fill(); g.stroke();
    if (s.hat === "stripecap") {
      g.save(); g.clip(); g.strokeStyle = s.band ?? "#e8e4dc"; g.lineWidth = 7;
      for (let i = -6; i <= 6; i++) { g.beginPath(); g.moveTo(hx + i * 22, top - headR); g.quadraticCurveTo(hx + i * 26, top, hx + i * 28, top + headR * 0.5); g.stroke(); }
      g.restore(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke();
    }
  } else if (s.hat === "cabbie") {
    g.fillStyle = hc; g.beginPath(); g.roundRect(hx - headR * 0.85, top - headR * 0.45, headR * 1.7, headR * 0.6, [headR * 0.3, headR * 0.3, 4, 4]); g.fill(); g.stroke();
    g.fillStyle = INK; g.beginPath(); g.ellipse(hx + headR * 0.3, top + headR * 0.17, headR * 0.7, headR * 0.12, 0.05, 0, Math.PI * 2); g.fill();
    if (s.band) { g.fillStyle = s.band; g.fillRect(hx - headR * 0.82, top - headR * 0.05, headR * 1.64, headR * 0.12); }
  } else if (s.hat === "helmet") {
    g.fillStyle = hc; g.beginPath(); g.ellipse(hx, top + 6, headR * 0.95, headR * 0.15, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(hx - headR * 0.72, top + 4); g.bezierCurveTo(hx - headR * 0.8, top - headR * 1.25, hx + headR * 0.8, top - headR * 1.25, hx + headR * 0.72, top + 4); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = hc; g.beginPath(); g.arc(hx, top - headR * 0.98, headR * 0.12, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = s.band ?? "#d9d9e0"; g.beginPath(); g.moveTo(hx, top - headR * 0.6); g.lineTo(hx + headR * 0.18, top - headR * 0.3); g.lineTo(hx, top - headR * 0.05); g.lineTo(hx - headR * 0.18, top - headR * 0.3); g.closePath(); g.fill(); g.lineWidth = 4; g.stroke();
  } else if (s.hat === "boater") {
    g.fillStyle = hc; g.beginPath(); g.ellipse(hx, top + 2, headR * 1.15, headR * 0.16, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.roundRect(hx - headR * 0.6, top - headR * 0.4, headR * 1.2, headR * 0.42, 4); g.fill(); g.stroke();
    if (s.band) { g.fillStyle = s.band; g.fillRect(hx - headR * 0.6 + 3, top - headR * 0.12, headR * 1.2 - 6, headR * 0.12); }
  }
  return top;
}

// A cartoon horse (side view), drawn in the same ink style. Faces right.
export function drawHorse(g: CanvasRenderingContext2D, t: number, walk = 0, color = "#7a4a2c", blanket?: string) {
  g.clearRect(0, 0, 1024, 1024);
  const ground = 1000, ph = t * 6 * (walk || 1), bob = walk ? Math.sin(ph * 2) * 6 : Math.sin(t * 1.8) * 2;
  const bodyY = 560 + bob, bx = 470;
  g.lineCap = "round"; g.strokeStyle = INK;
  const leg = (x: number, phase: number, back: boolean) => {
    const sw = walk ? Math.sin(ph + phase) * 40 : 0;
    const kx = x + sw * 0.5, ky = bodyY + 220, fx = x + sw, fy = ground - 14 - (walk ? Math.max(0, Math.cos(ph + phase)) * 22 : 0);
    g.lineWidth = 34; g.strokeStyle = back ? darker(color, 0.75) : color;
    g.beginPath(); g.moveTo(x, bodyY + 60); g.quadraticCurveTo(kx, ky, fx, fy); g.stroke();
    g.lineWidth = 6; g.strokeStyle = INK; g.beginPath(); g.moveTo(x - 17, bodyY + 60); g.quadraticCurveTo(kx - 17, ky, fx - 17, fy); g.stroke();
    g.beginPath(); g.moveTo(x + 17, bodyY + 60); g.quadraticCurveTo(kx + 17, ky, fx + 17, fy); g.stroke();
    g.fillStyle = INK; g.beginPath(); g.roundRect(fx - 22, fy - 6, 46, 24, 6); g.fill();
  };
  leg(bx - 190, Math.PI, true); leg(bx + 170, 0, true);
  // tail
  g.strokeStyle = "#2b1b12"; g.lineWidth = 26; g.beginPath(); g.moveTo(bx - 280, bodyY - 40); g.quadraticCurveTo(bx - 360, bodyY + 40 + Math.sin(t * 3) * 10, bx - 330, bodyY + 200); g.stroke();
  // body
  g.fillStyle = color; g.lineWidth = 9; g.strokeStyle = INK;
  g.beginPath(); g.ellipse(bx, bodyY, 300, 135, 0, 0, Math.PI * 2); g.fill(); g.stroke();
  if (blanket) { g.fillStyle = blanket; g.beginPath(); g.roundRect(bx - 120, bodyY - 132, 220, 170, 20); g.fill(); g.lineWidth = 6; g.stroke(); }
  // neck + head
  g.fillStyle = color; g.lineWidth = 9;
  g.beginPath(); g.moveTo(bx + 180, bodyY - 70); g.lineTo(bx + 290, bodyY - 300); g.lineTo(bx + 380, bodyY - 270); g.lineTo(bx + 300, bodyY + 10); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.ellipse(bx + 370, bodyY - 280, 120, 62, 0.45, 0, Math.PI * 2); g.fill(); g.stroke();
  g.fillStyle = "#2b1b12"; g.beginPath(); g.moveTo(bx + 230, bodyY - 250); g.quadraticCurveTo(bx + 280, bodyY - 380, bx + 320, bodyY - 330); g.lineTo(bx + 220, bodyY - 120); g.closePath(); g.fill(); g.lineWidth = 5; g.stroke();
  // ear, eye, nostril
  g.fillStyle = color; g.lineWidth = 7; g.beginPath(); g.moveTo(bx + 300, bodyY - 320); g.lineTo(bx + 310, bodyY - 390); g.lineTo(bx + 340, bodyY - 325); g.fill(); g.stroke();
  g.fillStyle = INK; g.beginPath(); g.ellipse(bx + 360, bodyY - 300, 10, 13, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(bx + 455, bodyY - 238, 7, 5, 0.4, 0, Math.PI * 2); g.fill();
  // bridle
  g.strokeStyle = "#3a2214"; g.lineWidth = 8; g.beginPath(); g.moveTo(bx + 320, bodyY - 310); g.lineTo(bx + 430, bodyY - 210); g.stroke();
  leg(bx - 150, 0, false); leg(bx + 210, Math.PI, false);
}

// =====================================================================================================
// MEME-FUSION STYLE (default). Measured on ref/personajes_meme.jpg (cell ≈ 535 px tall):
//   head Ø ≈ 0.45 H, torso ≈ 0.27 H, legs ≈ 0.27 H, torso width ≈ 0.69 head Ø, arm stroke ≈ 0.04 head Ø,
//   outline ≈ 0.033 head Ø, interior lines ≈ 40% of the outline, hands = black mittens, shade on the left edge.
// The head is drawn in a local frame where its radius is 100 units, so faces scale with any height.
// =====================================================================================================
const MINK = "#161414";
const M_SKIN = "#fbfbf9";
const SHADE = "rgba(28,28,48,0.2)";
type Pt = [number, number];
type Fill = string | CanvasPattern;

const lighter = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.round(c + (255 - c) * k);
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
};
const qpt = (a: Pt, c: Pt, b: Pt, t: number): Pt => [
  (1 - t) ** 2 * a[0] + 2 * t * (1 - t) * c[0] + t * t * b[0],
  (1 - t) ** 2 * a[1] + 2 * t * (1 - t) * c[1] + t * t * b[1],
];
const qpts = (a: Pt, c: Pt, b: Pt, t0 = 0, t1 = 1, n = 14): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => qpt(a, c, b, t0 + ((t1 - t0) * i) / n));

// Flat fill + a cel shadow band on the left edge (fill whole shape dark, re-fill it shifted right in the base).
function celFill(g: CanvasRenderingContext2D, path: () => void, fill: Fill, dx: number, dy = 0, shade = SHADE) {
  g.save(); path(); g.clip();
  g.fillStyle = fill; path(); g.fill();
  g.fillStyle = shade; path(); g.fill();
  g.translate(dx, dy); g.fillStyle = fill; path(); g.fill();
  g.restore();
}
function inkStroke(g: CanvasRenderingContext2D, path: () => void, w: number, color: Fill = MINK) {
  g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = color; g.lineWidth = w; path(); g.stroke();
}
// A filled, outlined tube along a polyline (trouser legs, sleeves, straps), with a soft shaded left edge.
function tube(g: CanvasRenderingContext2D, pts: Pt[], w: number, fill: Fill, out: number, shade = true) {
  const path = () => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (const q of pts.slice(1)) g.lineTo(q[0], q[1]); };
  inkStroke(g, path, w + out * 2);
  inkStroke(g, path, w, fill);
  if (shade) {
    inkStroke(g, path, w, SHADE);
    g.save(); g.translate(w * 0.2, 0); inkStroke(g, path, w * 0.6, fill); g.restore();
  }
}

const plaidCache = new Map<string, CanvasPattern | null>();
function plaid(g: CanvasRenderingContext2D, base: string, line: string, size: number): Fill {
  const key = `${base}|${line}|${size}`;
  if (!plaidCache.has(key)) {
    const c = document.createElement("canvas"); c.width = c.height = size;
    const q = c.getContext("2d")!;
    q.fillStyle = base; q.fillRect(0, 0, size, size);
    q.fillStyle = line; q.globalAlpha = 0.42;
    q.fillRect(size * 0.36, 0, size * 0.28, size); q.fillRect(0, size * 0.36, size, size * 0.28);
    q.globalAlpha = 0.3; q.fillRect(size * 0.36, size * 0.36, size * 0.28, size * 0.28);
    q.globalAlpha = 0.55; q.fillStyle = "#ffffff";
    q.fillRect(size * 0.12, 0, Math.max(1, size * 0.05), size); q.fillRect(0, size * 0.12, size, Math.max(1, size * 0.05));
    plaidCache.set(key, g.createPattern(c, "repeat"));
  }
  return plaidCache.get(key) ?? base;
}

// ---------------------------------------------------------------- faces (head-local units, R = 100)
type FaceCfg = { eyes: string; brows: string; mouth: string; extra: string[] };
const EXPR: Record<Expression, FaceCfg> = {
  neutral: { eyes: "dot", brows: "none", mouth: "smile", extra: ["nose"] },
  smirk: { eyes: "dot", brows: "smirk", mouth: "smirk", extra: ["nose"] },
  troll: { eyes: "troll", brows: "troll", mouth: "troll", extra: [] },
  lol: { eyes: "squeeze", brows: "raised", mouth: "laugh", extra: ["crow"] },
  laugh: { eyes: "squeeze", brows: "raised", mouth: "laugh", extra: ["crow", "tears"] },
  rage: { eyes: "rage", brows: "rage", mouth: "clench", extra: ["tension", "flush", "vein"] },
  scream: { eyes: "shock", brows: "high", mouth: "scream", extra: ["tension", "sweat"] },
  poker: { eyes: "poker", brows: "none", mouth: "poker", extra: [] },
  derp: { eyes: "derp", brows: "none", mouth: "dopey", extra: [] },
  high: { eyes: "stoned", brows: "none", mouth: "stoned", extra: ["blush"] },
  skeptical: { eyes: "skeptic", brows: "skeptic", mouth: "twist", extra: [] },
  suspicious: { eyes: "narrow", brows: "low", mouth: "skew", extra: [] },
  happy: { eyes: "arc", brows: "none", mouth: "openSmile", extra: [] },
  proud: { eyes: "arc", brows: "raised", mouth: "wide", extra: ["blush"] },
};
export const EXPRESSIONS = Object.keys(EXPR) as Expression[];
const CLOSED_MOUTHS = ["smile", "flat", "frown", "wavy", "smirk", "poker", "twist", "skew", "wide", "stoned"];
const BLINKERS = ["dot", "wide", "poker", "narrow", "skeptic", "derp", "half", "stoned"];

function faceFromPose(s: ToonSpec, p: ToonPose): FaceCfg {
  if (p.face) return EXPR[p.face];
  if (!p.eyes && !p.mouth && s.face) return EXPR[s.face];
  const e = p.eyes ?? "dot";
  const eyes = e === "happy" ? "arc" : e === "angry" || e === "sad" ? "dot" : e;
  const brows = e === "angry" ? "angry" : e === "sad" ? "sad" : e === "shock" ? "high" : e === "wide" ? "raised" : "none";
  const extra = e === "shock" ? ["sweat"] : e === "dot" ? ["nose"] : [];
  return { eyes, brows, mouth: p.mouth ?? "smile", extra };
}

function drawFace(g: CanvasRenderingContext2D, f: FaceCfg, o: { t: number; look: number; talk: boolean; skin: string; moustache: boolean }) {
  const FW = 3.4, EX = 24, EY = -10, lx = o.look * 5;
  const blink = (o.t % 3.7) < 0.12 && BLINKERS.includes(f.eyes);
  const eyes = blink ? "closed" : f.eyes;
  const my = 30 + (o.moustache ? 6 : 0);
  let mouth = f.mouth, jaw = 1;
  if (o.talk) {
    const k = Math.abs(Math.sin(o.t * 11));
    if (CLOSED_MOUTHS.includes(mouth)) { mouth = "talk"; jaw = k; } else jaw = 0.6 + 0.4 * k;
  }
  g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = MINK; g.fillStyle = MINK;
  const line = (w: number, fn: () => void) => { g.lineWidth = w; g.beginPath(); fn(); g.stroke(); };
  const dot = (x: number, y: number, rx: number, ry = rx) => { g.fillStyle = MINK; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fill(); };
  const white = (x: number, y: number, rx: number, ry: number, fill = "#ffffff") => {
    g.fillStyle = fill; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fill(); g.lineWidth = FW; g.stroke();
  };
  const lid = (x: number, y: number, rx: number, ry: number, cut: number) => { // skin over the top of an eye + lid line
    g.save(); g.beginPath(); g.ellipse(x, y, rx - 1, ry - 1, 0, 0, Math.PI * 2); g.clip();
    g.fillStyle = o.skin; g.fillRect(x - rx - 2, y - ry - 2, rx * 2 + 4, ry + cut + 2); g.restore();
    line(FW + 0.8, () => { g.moveTo(x - rx - 1.5, y + cut); g.lineTo(x + rx + 1.5, y + cut); });
  };

  // ---- extras that sit under the features
  if (f.extra.includes("flush")) {
    g.save(); g.beginPath(); g.arc(0, 0, 97, 0, Math.PI * 2); g.clip();
    const gr = g.createLinearGradient(0, -100, 0, 10); gr.addColorStop(0, "rgba(225,60,40,0.32)"); gr.addColorStop(1, "rgba(225,60,40,0)");
    g.fillStyle = gr; g.fillRect(-100, -100, 200, 110); g.restore();
  }
  if (f.extra.includes("blush")) {
    g.fillStyle = "rgba(240,120,120,0.32)";
    for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(sd * 54, 16, 13, 6.5, 0, 0, Math.PI * 2); g.fill(); }
  }

  // ---- eyes + brows
  for (const sd of [-1, 1] as const) {
    let x = sd * EX, y = EY;
    switch (eyes) {
      case "dot": dot(x + lx, y, 5.6, 7.2); g.fillStyle = "#ffffff"; g.beginPath(); g.arc(x + lx + 1.8, y - 2.6, 1.7, 0, Math.PI * 2); g.fill(); break;
      case "closed": line(FW + 0.6, () => { g.moveTo(x - 9, y); g.lineTo(x + 9, y); }); break;
      case "arc": line(FW + 0.8, () => g.arc(x, y + 6, 10, Math.PI * 1.12, Math.PI * 1.88)); break;
      case "half": dot(x + lx, y + 2, 4.6, 4.6); line(FW + 0.8, () => { g.moveTo(x - 10, y - 3); g.lineTo(x + 10, y - 3); }); break;
      case "wide": white(x, y, 11, 12); dot(x + lx, y, 4.5); break;
      case "shock": white(x, y - 2, 15, 16); dot(x + lx * 0.5, y - 2, 2.6); break;
      case "squeeze":
        line(FW + 1.2, () => { g.moveTo(x - 14, y + 3); g.quadraticCurveTo(x, y - 13, x + 14, y + 3); });
        line(FW * 0.6, () => { g.moveTo(x - 10, y + 7); g.quadraticCurveTo(x, y + 2, x + 10, y + 7); });
        break;
      case "troll": {
        y = -34; x = sd * 30;
        g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(x - 20, y + 2); g.quadraticCurveTo(x, y - 16, x + 20, y);
        g.quadraticCurveTo(x, y + 9, x - 20, y + 2); g.fill(); g.lineWidth = FW; g.stroke();
        dot(x - sd * 7, y - 2, 3.2);
        line(FW * 0.6, () => { g.moveTo(x - 16, y + 12); g.quadraticCurveTo(x, y + 18, x + 16, y + 12); }); // under-eye bag
        break;
      }
      case "rage": white(x, y, 14, 14); dot(x, y, 2.4);
        g.strokeStyle = "#d4372c"; line(1.6, () => { g.moveTo(x + sd * 13, y + 2); g.lineTo(x + sd * 7, y + 1); g.moveTo(x - sd * 12, y - 6); g.lineTo(x - sd * 7, y - 3); }); g.strokeStyle = MINK;
        break;
      case "poker": x = sd * 33; y = -8; white(x, y, 14, 8.5); dot(x, y + 2, 4); lid(x, y, 14, 8.5, -1); break;
      case "derp":
        if (sd < 0) { white(x - 2, y - 2, 13, 13); dot(x - 7, y - 7, 4); }
        else { white(x + 2, y + 4, 9, 9); dot(x + 5, y + 8, 3.6); }
        break;
      case "stoned": white(x, y, 12, 10, "#f6dcdc"); dot(x + lx, y + 3, 4); lid(x, y, 12, 10, 0); break;
      case "skeptic":
        if (sd < 0) { white(x, y - 1, 13, 11); dot(x + 2, y, 4.4); }
        else { white(x, y + 1, 12, 7.5); dot(x + 2, y + 2.5, 3.8); lid(x, y + 1, 12, 7.5, -1.5); }
        break;
      case "narrow": white(x, y, 13, 6.5); dot(x + 6, y + 1.5, 3.8); lid(x, y, 13, 6.5, -2.5); break;
    }
    const bw = FW + 0.8;
    switch (f.brows) {
      case "smirk": line(bw, () => { if (sd < 0) { g.moveTo(x - 13, y - 22); g.quadraticCurveTo(x, y - 36, x + 12, y - 27); } else { g.moveTo(x - 12, y - 24); g.quadraticCurveTo(x, y - 28, x + 13, y - 23); } }); break;
      case "raised": line(bw, () => { g.moveTo(x - 12, y - 25); g.quadraticCurveTo(x, y - 33, x + 12, y - 25); }); break;
      case "high": line(bw, () => { g.moveTo(x - 13, y - 33); g.quadraticCurveTo(x, y - 43, x + 13, y - 33); }); break;
      case "troll": line(FW, () => { g.moveTo(x - sd * 14, y - 13); g.quadraticCurveTo(x + sd * 2, y - 24, x + sd * 22, y - 20); }); break;
      case "rage": line(FW * 2.4, () => { g.moveTo(x + sd * 17, y - 31); g.lineTo(x - sd * 11, y - 17); }); break;
      case "angry": line(FW * 1.7, () => { g.moveTo(x + sd * 14, y - 26); g.lineTo(x - sd * 11, y - 16); }); break;
      case "sad": line(bw, () => { g.moveTo(x - sd * 11, y - 27); g.lineTo(x + sd * 13, y - 19); }); break;
      case "skeptic": line(bw, () => { if (sd < 0) { g.moveTo(x - 14, y - 26); g.quadraticCurveTo(x, y - 40, x + 13, y - 29); } else { g.moveTo(x - 13, y - 19); g.lineTo(x + 13, y - 22); } }); break;
      case "low": line(bw, () => { g.moveTo(x + sd * 14, y - 21); g.lineTo(x - sd * 12, y - 15); }); break;
    }
    if (f.extra.includes("crow")) line(FW * 0.6, () => {
      g.moveTo(x + sd * 16, y - 3); g.lineTo(x + sd * 23, y - 7); g.moveTo(x + sd * 16, y + 3); g.lineTo(x + sd * 23, y + 6);
    });
    if (f.extra.includes("tears")) {
      const tx = x + sd * 20, ty = y + 10 + ((o.t * 1.6) % 1) * 8;
      g.fillStyle = "#8fcbf2"; g.beginPath(); g.moveTo(tx, ty - 10); g.quadraticCurveTo(tx + sd * 9, ty + 3, tx, ty + 6);
      g.quadraticCurveTo(tx - sd * 9, ty + 3, tx, ty - 10); g.fill(); g.lineWidth = FW * 0.6; g.stroke();
    }
  }

  // ---- nose / tension marks
  if (f.extra.includes("nose")) line(FW * 0.7, () => g.arc(4, 9, 5, -Math.PI * 0.55, Math.PI * 0.6));
  if (f.extra.includes("tension")) line(FW * 0.6, () => {
    g.moveTo(-5, -44); g.lineTo(-3, -32); g.moveTo(5, -44); g.lineTo(3, -32);
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) { g.moveTo(sd * (56 + i * 7), 22 + i * 5); g.lineTo(sd * (50 + i * 7), 34 + i * 5); }
  });
  if (f.extra.includes("vein")) {
    g.strokeStyle = "#d4372c"; line(3.2, () => {
      const vx = 50, vy = -58;
      for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { g.moveTo(vx + a * 3, vy + b * 10); g.quadraticCurveTo(vx + a * 3, vy + b * 3, vx + a * 10, vy + b * 3); }
    }); g.strokeStyle = MINK;
  }
  if (f.extra.includes("sweat")) {
    g.fillStyle = "#a9d4f2"; const dx = 70, dy = -40;
    g.beginPath(); g.moveTo(dx, dy - 16); g.quadraticCurveTo(dx + 11, dy + 2, dx, dy + 8); g.quadraticCurveTo(dx - 11, dy + 2, dx, dy - 16); g.fill(); g.lineWidth = FW * 0.7; g.stroke();
  }

  // ---- mouth
  const DARK = "#5a1717", TONGUE = "#e0707a";
  // open mouth: dark fill, upper teeth down to `teethTo` (y), tongue ellipse, ink outline
  const openShape = (path: () => void, teethTo: number | null, tongue: Pt | null) => {
    g.fillStyle = DARK; path(); g.fill();
    g.save(); path(); g.clip();
    if (teethTo !== null) { g.fillStyle = "#ffffff"; g.fillRect(-60, -100, 120, teethTo + 100); }
    if (tongue) { g.fillStyle = TONGUE; g.beginPath(); g.ellipse(tongue[0], tongue[1], 15, 9, 0, 0, Math.PI * 2); g.fill(); }
    g.restore(); g.lineWidth = FW; path(); g.stroke();
  };
  switch (mouth) {
    case "smile": line(FW, () => g.arc(0, my - 20, 23, Math.PI * 0.24, Math.PI * 0.76)); break;
    case "flat": line(FW, () => { g.moveTo(-14, my); g.lineTo(14, my); }); break;
    case "talk": {
      const ry = 2 + 10 * jaw;
      openShape(() => { g.beginPath(); g.ellipse(0, my, 12, ry, 0, 0, Math.PI * 2); }, null, ry > 7 ? [0, my + ry * 0.7] : null);
      break;
    }
    case "open": openShape(() => { g.beginPath(); g.ellipse(0, my, 13, 11 * jaw, 0, 0, Math.PI * 2); }, null, [0, my + 8 * jaw]); break;
    case "o": openShape(() => { g.beginPath(); g.ellipse(0, my, 8, 11 * jaw, 0, 0, Math.PI * 2); }, null, null); break;
    case "frown": line(FW, () => g.arc(0, my + 15, 16, Math.PI * 1.22, Math.PI * 1.78)); break;
    case "wavy": line(FW, () => { g.moveTo(-18, my); g.quadraticCurveTo(-9, my - 7, 0, my); g.quadraticCurveTo(9, my + 7, 18, my); }); break;
    case "grin": openShape(() => { g.beginPath(); g.moveTo(-24, my - 6); g.quadraticCurveTo(0, my + 26 * jaw, 24, my - 6); g.closePath(); }, my, null); break;
    case "teeth": {
      g.fillStyle = "#ffffff"; g.beginPath(); g.roundRect(-26, my - 14, 52, 30 * jaw, 8); g.fill(); g.lineWidth = FW; g.stroke();
      line(FW * 0.6, () => { g.moveTo(-26, my); g.lineTo(26, my); for (const x of [-13, 0, 13]) { g.moveTo(x, my - 14); g.lineTo(x, my - 14 + 30 * jaw); } });
      break;
    }
    case "smirk": line(FW, () => { g.moveTo(-16, my + 2); g.quadraticCurveTo(6, my + 8, 24, my - 7); g.moveTo(21, my - 11); g.quadraticCurveTo(26, my - 7, 26, my - 2); }); break;
    case "openSmile": openShape(() => { g.beginPath(); g.moveTo(-28, my - 8); g.quadraticCurveTo(0, my - 3, 28, my - 8); g.quadraticCurveTo(0, my + 40 * jaw, -28, my - 8); g.closePath(); }, my + 3, [0, my + 20 * jaw]); break;
    case "wide": line(FW, () => { g.arc(0, my - 36, 40, Math.PI * 0.24, Math.PI * 0.76); g.moveTo(-31, my - 13); g.lineTo(-34, my - 6); g.moveTo(31, my - 13); g.lineTo(34, my - 6); }); break;
    case "laugh": {
      const path = () => { g.beginPath(); g.moveTo(-42, my - 12); g.quadraticCurveTo(0, my - 20, 42, my - 12); g.quadraticCurveTo(0, my + 64 * jaw, -42, my - 12); g.closePath(); };
      openShape(path, my - 3, [0, my + 26 * jaw]);
      g.save(); path(); g.clip(); line(FW * 0.5, () => { for (let x = -30; x <= 30; x += 10) { g.moveTo(x, my - 20); g.lineTo(x, my - 3); } }); g.restore();
      break;
    }
    case "troll": {
      // Wide sly grin filling the lower face: upper + lower teeth rows, gum line, cheek folds, chin.
      const y0 = -12, yTop = 22, ySep = 60, yBot = 104 * jaw + 20 * (1 - jaw);
      const qy = (t: number, yc: number) => (1 - t) ** 2 * y0 + 2 * t * (1 - t) * yc + t * t * y0;
      const path = () => { g.beginPath(); g.moveTo(-80, y0); g.quadraticCurveTo(0, yTop, 80, y0); g.quadraticCurveTo(0, yBot, -80, y0); g.closePath(); };
      g.fillStyle = "#ffffff"; path(); g.fill();
      g.save(); path(); g.clip();
      line(FW * 0.7, () => { g.moveTo(-80, y0); g.quadraticCurveTo(0, ySep, 80, y0); });
      line(FW * 0.45, () => {
        for (let x = -64; x <= 64; x += 14) {
          const t = (x + 80) / 160, t2 = (x + 87) / 160;
          g.moveTo(x, qy(t, yTop) - 2); g.lineTo(x, qy(t, ySep)); g.moveTo(x + 7, qy(t2, ySep)); g.lineTo(x + 7, qy(t2, yBot) + 2);
        }
      });
      g.restore(); g.lineWidth = FW; path(); g.stroke();
      line(FW * 0.6, () => {
        g.moveTo(-84, y0 - 8); g.quadraticCurveTo(0, yTop - 10, 84, y0 - 8); // upper lip
        for (const sd of [-1, 1]) { g.moveTo(sd * 74, -34); g.quadraticCurveTo(sd * 96, -14, sd * 82, 8); } // cheek folds
        g.moveTo(-8, -16); g.quadraticCurveTo(0, -10, 8, -16); // nostrils
        g.moveTo(-18, 68); g.quadraticCurveTo(0, 74, 18, 68); // chin
      });
      break;
    }
    case "clench": {
      g.fillStyle = "#ffffff"; g.beginPath(); g.roundRect(-38, my - 10, 76, 32 * jaw + 4, 10); g.fill(); g.lineWidth = FW + 0.4; g.stroke();
      line(FW * 0.5, () => { g.moveTo(-38, my + 6 * jaw); g.lineTo(38, my + 6 * jaw); for (let x = -28; x <= 28; x += 9.5) { g.moveTo(x, my - 10); g.lineTo(x, my + 22 * jaw); } });
      line(FW * 0.6, () => { g.moveTo(-42, my - 16); g.quadraticCurveTo(0, my - 22, 42, my - 16); g.moveTo(-40, my + 30 * jaw + 6); g.quadraticCurveTo(0, my + 36 * jaw + 6, 40, my + 30 * jaw + 6); });
      break;
    }
    case "scream": openShape(() => { g.beginPath(); g.ellipse(0, my + 10, 20, 28 * jaw, 0, 0, Math.PI * 2); }, my + 10 - 28 * jaw + 7, [0, my + 10 + 20 * jaw]); break;
    case "poker": line(FW, () => { g.moveTo(-26, my + 2); g.quadraticCurveTo(0, my + 4, 26, my + 1); }); break;
    case "dopey": {
      openShape(() => { g.beginPath(); g.moveTo(-26, my - 4); g.quadraticCurveTo(4, my + 2, 30, my - 12); g.quadraticCurveTo(10, my + 32 * jaw, -26, my - 4); g.closePath(); }, null, null);
      g.fillStyle = "#ffffff"; g.fillRect(-4, my - 3, 8, 8); g.fillRect(5, my - 5, 8, 8); line(FW * 0.5, () => { g.rect(-4, my - 3, 8, 8); g.rect(5, my - 5, 8, 8); });
      g.fillStyle = TONGUE; g.beginPath(); g.ellipse(12, my + 14 * jaw, 9, 11, -0.3, 0, Math.PI * 2); g.fill(); g.lineWidth = FW * 0.8; g.stroke();
      break;
    }
    case "stoned": line(FW, () => { g.moveTo(-30, my - 4); g.quadraticCurveTo(0, my + 16, 32, my - 7); }); break;
    case "twist": line(FW, () => { g.moveTo(-10, my + 5); g.quadraticCurveTo(10, my + 9, 28, my - 3); g.quadraticCurveTo(33, my - 7, 30, my - 12); }); break;
    case "skew": line(FW, () => { g.moveTo(-12, my + 6); g.quadraticCurveTo(6, my + 3, 20, my); g.lineTo(23, my + 4); }); break;
  }
}

// ---------------------------------------------------------------- hair & hats (head-local units)
function memeHair(g: CanvasRenderingContext2D, s: ToonSpec, out: number) {
  if (!s.hair) return;
  const hc = s.hair, style = s.hairline ?? "mop";
  if (style === "curly") {
    for (let i = 0; i <= 8; i++) {
      const a = Math.PI + 0.12 + (i / 8) * (Math.PI - 0.24);
      const c = () => { g.beginPath(); g.arc(Math.cos(a) * 90, Math.sin(a) * 90 + 4, 27, 0, Math.PI * 2); };
      celFill(g, c, hc, 6); inkStroke(g, c, out * 0.8);
    }
    return;
  }
  const path = () => {
    g.beginPath();
    if (style === "brush") {
      g.arc(0, 0, 103, Math.PI + 0.42, -0.42); g.quadraticCurveTo(0, -80, -94, -42);
    } else if (style === "tufts") {
      g.arc(0, 0, 102, Math.PI + 0.1, Math.PI + 0.75); g.quadraticCurveTo(-60, -60, -88, -8); g.closePath();
      g.moveTo(101, -10); g.arc(0, 0, 102, -0.1, -0.75, true); g.quadraticCurveTo(60, -60, 88, -8);
    } else if (style === "side") {
      g.arc(0, 0, 104, Math.PI + 0.1, -0.1); g.lineTo(90, -4); g.lineTo(84, -34);
      g.quadraticCurveTo(10, -36, -50, -66); g.quadraticCurveTo(-78, -40, -92, -4);
    } else { // mop: rounded mop with a jagged fringe, like the reference
      g.arc(0, 0, 105, Math.PI + 0.1, -0.1); g.lineTo(92, -4); g.lineTo(84, -32);
      const n = 8;
      for (let i = 1; i < n; i++) { const x = 84 - (168 * i) / n; g.lineTo(x, i % 2 ? -60 + Math.abs(x) * 0.16 : -40 + Math.abs(x) * 0.1); }
      g.lineTo(-84, -32); g.lineTo(-92, -4);
    }
    g.closePath();
  };
  celFill(g, path, hc, 12, 4);
  inkStroke(g, path, out);
  if (style === "mop" || style === "side")
    inkStroke(g, () => { g.beginPath(); g.moveTo(-34, -92); g.quadraticCurveTo(-24, -76, -30, -62); g.moveTo(22, -96); g.quadraticCurveTo(32, -80, 28, -64); }, out * 0.4, "rgba(0,0,0,0.45)");
}

function memeHat(g: CanvasRenderingContext2D, s: ToonSpec, out: number) {
  const thin = out * 0.45;
  if (s.hat === "hardhat") {
    const hc = s.hatColor ?? "#f2c230";
    const dome = () => { g.beginPath(); g.moveTo(-92, -34); g.bezierCurveTo(-96, -136, 96, -136, 92, -34); g.closePath(); };
    celFill(g, dome, hc, 14, 2, "rgba(150,90,0,0.28)"); inkStroke(g, dome, out);
    const ridge = () => { g.beginPath(); g.roundRect(-13, -108, 26, 74, 11); };
    celFill(g, ridge, lighter(hc, 0.18), 5, 0, "rgba(150,90,0,0.25)"); inkStroke(g, ridge, thin);
    g.fillStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.ellipse(48, -86, 13, 6, 0.6, 0, Math.PI * 2); g.fill();
    const brim = () => { g.beginPath(); g.moveTo(-114, -36); g.quadraticCurveTo(0, -56, 114, -36); g.lineTo(110, -22); g.quadraticCurveTo(0, -40, -110, -22); g.closePath(); };
    celFill(g, brim, darker(hc, 0.92), 10, 0, "rgba(150,90,0,0.3)"); inkStroke(g, brim, out * 0.85);
  } else if (s.hat === "cap" || s.hat === "visor") {
    const hc = s.hatColor ?? (s.hat === "cap" ? "#3f6fae" : "#d2402f");
    if (s.hat === "cap") {
      const crown = () => { g.beginPath(); g.moveTo(-99, -26); g.bezierCurveTo(-102, -128, 98, -130, 99, -28); g.quadraticCurveTo(0, -46, -99, -26); g.closePath(); };
      celFill(g, crown, hc, 14, 2); inkStroke(g, crown, out);
      inkStroke(g, () => { g.beginPath(); g.moveTo(0, -104); g.quadraticCurveTo(-36, -80, -46, -38); g.moveTo(0, -104); g.quadraticCurveTo(36, -80, 46, -38); }, thin);
      g.fillStyle = hc; g.beginPath(); g.ellipse(0, -105, 9, 5, 0, 0, Math.PI * 2); g.fill(); g.lineWidth = thin; g.stroke();
    } else {
      const band = () => { g.beginPath(); g.moveTo(-100, -50); g.quadraticCurveTo(0, -72, 100, -50); g.lineTo(100, -32); g.quadraticCurveTo(0, -54, -100, -32); g.closePath(); };
      celFill(g, band, hc, 10); inkStroke(g, band, out * 0.85);
    }
    const bill = () => { g.beginPath(); g.moveTo(26, -42); g.quadraticCurveTo(112, -66, 146, -32); g.quadraticCurveTo(124, -16, 30, -26); g.closePath(); };
    celFill(g, bill, darker(hc, 0.86), 8, 0); inkStroke(g, bill, out * 0.85);
  } else if (s.hat !== "none") {
    classicHat(g, s, 0, 0, 100);
  }
}

// ---------------------------------------------------------------- props (absolute px, k = size factor)
const MEME_PROPS: Prop[] = ["wrench", "blueprint", "gear", "walkie", "clipboard"];
function memeProp(g: CanvasRenderingContext2D, p: Prop, x: number, y: number, t: number, side: number, k: number, out: number) {
  const o = out / k, thin = o * 0.45;
  g.save(); g.translate(x, y); g.scale(k, k);
  const steel = "#b3b9c1";
  if (p === "wrench") {
    g.rotate(side * 0.28);
    const handle = () => { g.beginPath(); g.roundRect(-11, -118, 22, 176, 10); };
    celFill(g, handle, steel, 7); inkStroke(g, handle, o * 0.8);
    const head = () => { g.beginPath(); g.arc(0, -142, 32, -Math.PI / 2 + 0.62, Math.PI * 1.5 - 0.62); g.lineTo(-10, -148); g.lineTo(10, -148); g.closePath(); };
    celFill(g, head, steel, 9); inkStroke(g, head, o * 0.8);
    const ring = () => { g.beginPath(); g.arc(0, 66, 21, 0, Math.PI * 2); };
    celFill(g, ring, steel, 6); inkStroke(g, ring, o * 0.8);
    g.fillStyle = "#6b7078"; g.beginPath(); g.arc(0, 66, 9, 0, Math.PI * 2); g.fill(); g.lineWidth = thin; g.stroke();
    inkStroke(g, () => { g.beginPath(); g.moveTo(4, -100); g.lineTo(4, 30); }, 3, "rgba(255,255,255,0.7)");
  } else if (p === "gear") {
    g.translate(side * 12, -58); g.rotate(t * 0.8);
    const path = () => {
      g.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        for (const [da, r] of [[-0.34, 38], [-0.19, 52], [0.19, 52], [0.34, 38]] as const) {
          const px = Math.cos(a + da) * r, py = Math.sin(a + da) * r;
          if (i === 0 && da === -0.34) g.moveTo(px, py); else g.lineTo(px, py);
        }
      }
      g.closePath();
    };
    celFill(g, path, "#a3a9b1", 9); inkStroke(g, path, o * 0.8);
    g.fillStyle = "#e9ebee"; g.beginPath(); g.arc(0, 0, 15, 0, Math.PI * 2); g.fill(); g.lineWidth = o * 0.7; g.stroke();
    g.lineWidth = thin; g.beginPath(); g.arc(0, 0, 28, 0, Math.PI * 2); g.stroke();
  } else if (p === "blueprint") {
    g.rotate(side * 0.5);
    const roll = () => { g.beginPath(); g.roundRect(-23, -128, 46, 204, 18); };
    celFill(g, roll, "#4f86c8", 9); inkStroke(g, roll, o * 0.8);
    inkStroke(g, () => { g.beginPath(); for (const yy of [-96, -64, 32, 58]) { g.moveTo(-14, yy); g.lineTo(12, yy); } g.moveTo(-8, -110); g.lineTo(-8, -80); }, 2.4, "rgba(255,255,255,0.75)");
    g.fillStyle = "#dfeaf7"; g.beginPath(); g.ellipse(0, -124, 22, 9, 0, 0, Math.PI * 2); g.fill(); g.lineWidth = o * 0.7; g.stroke();
    g.lineWidth = thin; g.beginPath(); g.ellipse(1, -124, 10, 4, 0, 0, Math.PI * 1.6); g.stroke();
  } else if (p === "walkie") {
    g.translate(side * 6, -62); g.rotate(side * 0.12);
    inkStroke(g, () => { g.beginPath(); g.moveTo(-12, -50); g.lineTo(-12, -96); }, 9);
    const body = () => { g.beginPath(); g.roundRect(-25, -56, 50, 104, 11); };
    celFill(g, body, "#34373c", 9, 0, "rgba(0,0,0,0.35)"); inkStroke(g, body, o * 0.8);
    inkStroke(g, () => { g.beginPath(); for (let yy = -40; yy <= -12; yy += 7) { g.moveTo(-14, yy); g.lineTo(14, yy); } }, 2.4, "#6b6f76");
    g.fillStyle = "#a6d36a"; g.fillRect(-14, 0, 28, 14); g.lineWidth = thin; g.strokeStyle = MINK; g.strokeRect(-14, 0, 28, 14);
    g.fillStyle = "#f2b632"; g.beginPath(); g.arc(13, -64, 6, 0, Math.PI * 2); g.fill(); g.stroke();
  } else if (p === "clipboard") {
    g.translate(-side * 14, -30); g.rotate(side * 0.14);
    const board = () => { g.beginPath(); g.roundRect(-62, -82, 124, 156, 9); };
    celFill(g, board, "#5c9a52", 10); inkStroke(g, board, o * 0.8);
    g.fillStyle = "#ffffff"; g.fillRect(-50, -66, 100, 128); g.lineWidth = thin; g.strokeStyle = MINK; g.strokeRect(-50, -66, 100, 128);
    inkStroke(g, () => { g.beginPath(); for (let yy = -44; yy <= 44; yy += 15) { g.moveTo(-38, yy); g.lineTo(yy % 2 ? 22 : 38, yy); } }, 2.4, "#9aa4b0");
    const clip = () => { g.beginPath(); g.roundRect(-22, -94, 44, 22, 6); };
    celFill(g, clip, "#c3c8ce", 5); inkStroke(g, clip, o * 0.7);
  }
  g.restore();
}

// ---------------------------------------------------------------- the meme-fusion character
export function drawToonMeme(g: CanvasRenderingContext2D, s: ToonSpec, p: ToonPose) {
  g.clearRect(0, 0, 768, 1024);
  const H = 880 * (s.height ?? 1), cx = 384, ground = 1000, k = H / 880;
  const OUT = 11 * k, THIN = 4.6 * k, ARM = 15 * k;
  const walk = p.walk ?? 0, ph = p.t * 7.5 * (walk || 1);
  const bob = walk ? Math.abs(Math.sin(ph)) * 10 * k : Math.sin(p.t * 2.2) * 3 * k;
  const shiverX = p.shiver ? Math.sin(p.t * 60) * 3 : 0;
  const tilt = Math.sin(p.t * 1.6) * 0.03 + (p.look ?? 0) * 0.025;
  const sit = !!p.sit;

  const R = 0.212 * H * (s.headScale ?? 1);
  const legLen = sit ? 0.15 * H : 0.27 * H;
  const hipY = ground - legLen - bob * 0.3;
  const Th = 0.29 * H, Tw = 0.28 * H * (s.wide ?? 1);
  const torsoTop = hipY - Th;
  const hx = cx + shiverX;
  const headY = torsoTop - R + 0.028 * H - bob * 0.2;
  const outfit: Outfit = s.outfit ?? "shirt";
  const skin = s.skin ?? M_SKIN;
  const pat = (base: string) => (s.plaid || outfit === "plaid" ? plaid(g, base, s.plaid ?? darker(base, 0.5), Math.round(34 * k)) : base);
  const under = s.shirt && (outfit === "overalls" || outfit === "hivis") ? s.shirt : s.coat;
  const topFill: Fill = outfit === "labcoat" ? s.coat : pat(under);
  const pants = outfit === "overalls" ? (s.denim ?? "#3a5a8c") : s.pants ?? (outfit === "labcoat" ? "#4a4a50" : "#2e4268");

  // ---- legs: filled trouser tubes + black shoes
  const legX = Tw * 0.23, legW = (outfit === "labcoat" ? 0.048 : 0.064) * H;
  for (const side of [-1, 1]) {
    const phase = ph + (side > 0 ? Math.PI : 0);
    const sw = walk ? Math.sin(phase) : 0, lift = walk ? Math.max(0, Math.cos(phase)) * 18 * k : 0;
    const top: Pt = [hx + side * legX, hipY - 0.03 * H];
    let foot: Pt, pts: Pt[];
    if (sit) {
      const knee: Pt = [top[0] + 0.13 * H, hipY + 0.01 * H];
      foot = [knee[0] + 0.01 * H, ground - 0.03 * H];
      pts = [top, knee, foot];
    } else {
      foot = [cx + side * legX * 1.05 + sw * 0.06 * H, ground - 0.03 * H - lift];
      pts = qpts(top, [(top[0] + foot[0]) / 2 + side * 0.008 * H + sw * 0.01 * H, (top[1] + foot[1]) / 2], foot, 0, 1, 10);
    }
    tube(g, pts, legW, pants, OUT);
    const sx = foot[0] + (sit ? 0.03 * H : side * 0.022 * H), sy = foot[1] + 0.006 * H;
    g.fillStyle = MINK; g.beginPath(); g.ellipse(sx, sy, 0.062 * H, 0.029 * H, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 3 * k; g.beginPath(); g.ellipse(sx, sy - 0.006 * H, 0.04 * H, 0.012 * H, 0, Math.PI * 1.15, Math.PI * 1.6); g.stroke();
  }

  // ---- arms: shoulder → elbow → hand
  const shY = torsoTop + 0.055 * H;
  const armOf = (side: -1 | 1, a: Arm) => {
    const s0: Pt = [hx + side * (Tw / 2 - 0.035 * H), shY];
    const swing = walk ? Math.sin(ph + (side < 0 ? 0 : Math.PI)) * 0.05 * H : Math.sin(p.t * 2.2 + side) * 0.004 * H;
    const X = (f: number) => s0[0] + side * f * H, Y = (f: number) => s0[1] + f * H;
    let e: Pt, h: Pt;
    switch (a) {
      case "hips": e = [X(0.12), Y(0.12)]; h = [hx + side * (Tw / 2 + 0.005 * H), hipY - 0.035 * H]; break;
      case "wave": { const w = Math.sin(p.t * 9) * 0.02 * H; e = [X(0.13), Y(0.02)]; h = [X(0.16) + w, Y(-0.16)]; break; }
      case "point": e = [X(0.13), Y(0.01)]; h = [X(0.27), Y(-0.04)]; break;
      case "hold": e = [X(0.07), Y(0.15)]; h = [hx + side * 0.05 * H, Y(0.13)]; break;
      case "up": e = [X(0.09), Y(-0.1)]; h = [X(0.12), Y(-0.25)]; break;
      case "cross": e = [X(0.06), Y(0.13)]; h = [hx - side * 0.1 * H, Y(0.11)]; break;
      case "shrug": e = [X(0.12), Y(0.08)]; h = [X(0.2), Y(-0.02)]; break;
      case "drink": e = [X(0.1), Y(0.14)]; h = [hx + side * 0.25 * R, headY + 0.5 * R]; break;
      case "warm": e = [X(0.06), Y(0.15)]; h = [hx + side * 0.04 * H, Y(0.17)]; break;
      case "show": e = [X(0.08), Y(0.17)]; h = [X(0.17), Y(0.06)]; break;
      default: e = [X(0.065) + swing * 0.3, Y(0.13)]; h = [X(0.075) + swing, Y(0.28)];
    }
    return { s: s0, e, h, side };
  };
  type A = ReturnType<typeof armOf>;
  const armL = p.armL ?? "down", armR = p.armR ?? "down";
  const aL = armOf(-1, armL), aR = armOf(1, armR);
  const isFront = (a: Arm) => ["hold", "cross", "drink", "warm"].includes(a);
  const sleeveFill: Fill = topFill;
  const drawArm = (a: A) => {
    if (outfit === "labcoat") { tube(g, qpts(a.s, a.e, a.h, 0, 0.86), 0.056 * H, sleeveFill, OUT); return; }
    inkStroke(g, () => { const q = qpts(a.s, a.e, a.h); g.beginPath(); g.moveTo(q[0][0], q[0][1]); for (const v of q) g.lineTo(v[0], v[1]); }, ARM);
  };
  const drawSleeve = (a: A) => {
    if (outfit === "labcoat") return;
    tube(g, qpts(a.s, a.e, a.h, 0, 0.2, 4), 0.064 * H, sleeveFill, OUT);
  };
  if (!isFront(armL)) drawArm(aL);
  if (!isFront(armR)) drawArm(aR);

  // ---- torso (pill) + clothes
  const tx = hx - Tw / 2, ty = torsoTop;
  const rTop = Tw * 0.3, rBot = Tw * 0.1;
  const hem = outfit === "labcoat" ? 0.1 * H : 0, wext = outfit === "labcoat" ? 0.012 * H : 0;
  const torso = () => { g.beginPath(); g.roundRect(tx - wext, ty, Tw + 2 * wext, Th + hem, [rTop, rTop, rBot, rBot]); };
  const shadeDx = Tw * 0.12;
  const collar = (fill: Fill) => {
    for (const sd of [-1, 1]) {
      const path = () => { g.beginPath(); g.moveTo(hx + sd * 0.26 * Tw, ty + 0.004 * H); g.lineTo(hx + sd * 0.02 * Tw, ty + 0.058 * H); g.lineTo(hx + sd * 0.22 * Tw, ty + 0.088 * H); g.closePath(); };
      g.fillStyle = fill; path(); g.fill(); inkStroke(g, path, THIN);
    }
  };
  const tie = (color: string) => {
    const path = () => { g.beginPath(); g.moveTo(hx - 0.035 * Tw, ty + 0.055 * H); g.lineTo(hx + 0.035 * Tw, ty + 0.055 * H); g.lineTo(hx + 0.07 * Tw, ty + 0.17 * H); g.lineTo(hx, ty + 0.2 * H); g.lineTo(hx - 0.07 * Tw, ty + 0.17 * H); g.closePath(); };
    celFill(g, path, color, 0.03 * Tw); inkStroke(g, path, THIN);
    const knot = () => { g.beginPath(); g.roundRect(hx - 0.055 * Tw, ty + 0.035 * H, 0.11 * Tw, 0.03 * H, 3 * k); };
    g.fillStyle = color; knot(); g.fill(); inkStroke(g, knot, THIN);
  };
  const belt = () => {
    g.save(); torso(); g.clip();
    g.fillStyle = "#3a2a20"; g.fillRect(tx - 10, hipY - 0.032 * H, Tw + 20, 0.032 * H);
    g.restore();
    inkStroke(g, () => { g.beginPath(); g.moveTo(tx, hipY - 0.032 * H); g.lineTo(tx + Tw, hipY - 0.032 * H); }, THIN);
    const b = () => { g.beginPath(); g.roundRect(hx - 0.045 * Tw, hipY - 0.03 * H, 0.09 * Tw, 0.026 * H, 2 * k); };
    g.fillStyle = "#c9ccd0"; b(); g.fill(); inkStroke(g, b, THIN * 0.7);
  };

  if (outfit === "labcoat") {
    celFill(g, torso, s.coat, shadeDx);
    const shirtV = () => { g.beginPath(); g.moveTo(hx - 0.22 * Tw, ty + 0.004 * H); g.lineTo(hx + 0.22 * Tw, ty + 0.004 * H); g.lineTo(hx + 0.035 * Tw, hipY - 0.01 * H); g.lineTo(hx - 0.035 * Tw, hipY - 0.01 * H); g.closePath(); };
    g.fillStyle = s.shirt ?? "#bcd3ea"; shirtV(); g.fill(); inkStroke(g, shirtV, THIN);
    const gap = () => { g.beginPath(); g.moveTo(hx - 0.035 * Tw, hipY - 0.01 * H); g.lineTo(hx + 0.035 * Tw, hipY - 0.01 * H); g.lineTo(hx + 0.09 * Tw, hipY + hem - 2); g.lineTo(hx - 0.09 * Tw, hipY + hem - 2); g.closePath(); };
    g.fillStyle = pants; gap(); g.fill(); inkStroke(g, gap, THIN);
    tie(s.tie ?? "#2f4e8a");
    for (const sd of [-1, 1]) {
      const lapel = () => { g.beginPath(); g.moveTo(hx + sd * 0.22 * Tw, ty + 0.004 * H); g.lineTo(hx + sd * 0.36 * Tw, ty + 0.07 * H); g.lineTo(hx + sd * 0.27 * Tw, ty + 0.085 * H); g.lineTo(hx + sd * 0.05 * Tw, hipY - 0.06 * H); g.closePath(); };
      g.fillStyle = sd < 0 ? darker(s.coat, 0.9) : s.coat; lapel(); g.fill(); inkStroke(g, lapel, THIN);
      inkStroke(g, () => { g.beginPath(); g.moveTo(hx + sd * 0.2 * Tw, hipY + 0.02 * H); g.lineTo(hx + sd * 0.42 * Tw, hipY + 0.02 * H); }, THIN); // hip pockets
    }
    inkStroke(g, () => { g.beginPath(); g.moveTo(hx + 0.24 * Tw, ty + 0.13 * H); g.lineTo(hx + 0.42 * Tw, ty + 0.13 * H); }, THIN); // chest pocket
    inkStroke(g, () => { g.beginPath(); g.moveTo(hx + 0.3 * Tw, ty + 0.13 * H); g.lineTo(hx + 0.3 * Tw, ty + 0.1 * H); }, 4 * k, "#2f5fb8"); // pen
  } else {
    celFill(g, torso, topFill, shadeDx);
    if (outfit === "overalls") {
      collar(topFill);
      const bibW = 0.29 * Tw, waist = hipY - 0.09 * H;
      const bib = () => {
        g.beginPath(); g.moveTo(hx - bibW, ty + 0.075 * H); g.lineTo(hx + bibW, ty + 0.075 * H); g.lineTo(hx + bibW, waist);
        g.lineTo(tx + Tw + 4, waist); g.lineTo(tx + Tw + 4, hipY + 4); g.lineTo(tx - 4, hipY + 4); g.lineTo(tx - 4, waist); g.lineTo(hx - bibW, waist); g.closePath();
      };
      g.save(); torso(); g.clip(); celFill(g, bib, pants, shadeDx); inkStroke(g, bib, THIN * 1.3); g.restore();
      for (const sd of [-1, 1]) {
        tube(g, [[hx + sd * bibW * 0.85, ty + 0.08 * H], [hx + sd * 0.4 * Tw, ty + 0.004 * H]], 0.03 * H, pants, THIN * 0.8, false);
        g.fillStyle = "#e6b84a"; g.strokeStyle = MINK; g.beginPath(); g.arc(hx + sd * bibW * 0.8, ty + 0.09 * H, 0.009 * H, 0, Math.PI * 2); g.fill(); g.lineWidth = THIN * 0.7; g.stroke();
      }
      const pocket = () => { g.beginPath(); g.roundRect(hx - 0.15 * Tw, ty + 0.11 * H, 0.3 * Tw, 0.055 * H, [0, 0, 8 * k, 8 * k]); };
      inkStroke(g, pocket, THIN);
    } else if (outfit === "hivis") {
      collar(topFill);
      const vest = s.vest ?? "#f47a1f";
      const vpath = () => {
        g.beginPath(); g.moveTo(tx - 6, ty - 6); g.lineTo(hx - 0.2 * Tw, ty - 6); g.lineTo(hx, ty + 0.1 * H); g.lineTo(hx + 0.2 * Tw, ty - 6);
        g.lineTo(tx + Tw + 6, ty - 6); g.lineTo(tx + Tw + 6, hipY + 6); g.lineTo(tx - 6, hipY + 6); g.closePath();
      };
      g.save(); torso(); g.clip();
      celFill(g, vpath, vest, shadeDx);
      const stripe = (x: number, y: number, w: number, h: number) => {
        g.fillStyle = "#e9ef57"; g.fillRect(x, y, w, h);
        g.fillStyle = "#d7d9d4"; if (w > h) g.fillRect(x, y + h * 0.38, w, h * 0.24); else g.fillRect(x + w * 0.38, y, w * 0.24, h);
        inkStroke(g, () => { g.beginPath(); g.rect(x, y, w, h); }, THIN * 0.6);
      };
      for (const sd of [-1, 1]) stripe(hx + sd * 0.3 * Tw - 0.02 * H, ty - 6, 0.04 * H, Th * 0.55 + 6);
      stripe(tx - 6, ty + Th * 0.55, Tw + 12, 0.042 * H); stripe(tx - 6, ty + Th * 0.78, Tw + 12, 0.042 * H);
      inkStroke(g, () => { g.beginPath(); g.moveTo(hx - 0.2 * Tw, ty - 6); g.lineTo(hx, ty + 0.1 * H); g.lineTo(hx + 0.2 * Tw, ty - 6); g.moveTo(hx, ty + 0.1 * H); g.lineTo(hx, hipY); }, THIN);
      g.restore();
    } else {
      collar(outfit === "plaid" ? topFill : lighter(s.coat, 0.12));
      inkStroke(g, () => { g.beginPath(); g.moveTo(hx, ty + 0.06 * H); g.lineTo(hx, hipY - 0.032 * H); }, THIN);
      g.fillStyle = MINK;
      for (let i = 0; i < (outfit === "polo" ? 2 : 3); i++) { g.beginPath(); g.arc(hx + 0.03 * Tw, ty + 0.08 * H + i * 0.045 * H, 2.6 * k, 0, Math.PI * 2); g.fill(); }
      if (outfit === "polo" || s.badge) {
        const b = () => { g.beginPath(); g.rect(hx + 0.16 * Tw, ty + 0.085 * H, 0.16 * Tw, 0.04 * H); };
        g.fillStyle = s.badge ?? "#f2b632"; b(); g.fill(); g.fillStyle = "#e05a2a"; g.fillRect(hx + 0.16 * Tw, ty + 0.105 * H, 0.16 * Tw, 0.02 * H); inkStroke(g, b, THIN * 0.7);
      } else {
        const pk = () => { g.beginPath(); g.moveTo(hx + 0.14 * Tw, ty + 0.085 * H); g.lineTo(hx + 0.36 * Tw, ty + 0.085 * H); g.lineTo(hx + 0.36 * Tw, ty + 0.14 * H); g.lineTo(hx + 0.25 * Tw, ty + 0.15 * H); g.lineTo(hx + 0.14 * Tw, ty + 0.14 * H); g.closePath(); };
        inkStroke(g, pk, THIN * 0.8);
        inkStroke(g, () => { g.beginPath(); g.moveTo(hx + 0.14 * Tw, ty + 0.1 * H); g.lineTo(hx + 0.36 * Tw, ty + 0.1 * H); }, THIN * 0.6);
      }
      if (s.tie) tie(s.tie);
      belt();
    }
  }
  if (s.toolbelt) {
    const px = hx + 0.26 * Tw;
    const pouch = () => { g.beginPath(); g.roundRect(px, hipY - 0.04 * H, 0.1 * H, 0.09 * H, 6 * k); };
    inkStroke(g, () => { g.beginPath(); g.moveTo(px + 0.03 * H, hipY - 0.04 * H); g.lineTo(px + 0.04 * H, hipY - 0.08 * H); }, 7 * k, "#5a5f66");
    celFill(g, pouch, "#8a5a32", 8 * k); inkStroke(g, pouch, THIN);
    inkStroke(g, () => { g.beginPath(); g.moveTo(px, hipY - 0.015 * H); g.lineTo(px + 0.1 * H, hipY - 0.015 * H); }, THIN * 0.7);
  }
  inkStroke(g, torso, OUT);
  if (!isFront(armL)) drawSleeve(aL);
  if (!isFront(armR)) drawSleeve(aR);
  if (isFront(armL)) { drawArm(aL); drawSleeve(aL); }
  if (isFront(armR)) { drawArm(aR); drawSleeve(aR); }

  // ---- head (local frame: radius 100)
  const u = R / 100, o = OUT / u;
  g.save(); g.translate(hx, headY); g.rotate(tilt); g.scale(u, u);
  const headPath = () => { g.beginPath(); g.arc(0, 0, 100, 0, Math.PI * 2); };
  celFill(g, headPath, skin, 11, -6, "rgba(40,40,60,0.2)");
  inkStroke(g, headPath, o);
  const phones = s.headphones && s.hat !== "hardhat";
  if (phones) tube(g, Array.from({ length: 15 }, (_, i) => { const a = Math.PI + 0.3 + (i / 14) * (Math.PI - 0.6); return [Math.cos(a) * 112, Math.sin(a) * 112] as Pt; }), 11, "#5b5e63", o * 0.7, false);
  memeHair(g, s, o);
  drawFace(g, faceFromPose(s, p), { t: p.t, look: p.look ?? 0, talk: !!p.talk, skin, moustache: !!s.moustache });
  if (s.freckles) {
    g.fillStyle = "rgba(150,80,50,0.45)";
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(sd * (44 + i * 8), 10 + (i % 2) * 7, 2.2, 0, Math.PI * 2); g.fill(); }
  }
  if (s.moustache) {
    for (const sd of [-1, 1]) {
      const m = () => { g.beginPath(); g.moveTo(0, 18); g.quadraticCurveTo(sd * 20, 8, sd * 36, 24); g.quadraticCurveTo(sd * 18, 30, 0, 24); g.closePath(); };
      g.fillStyle = s.hair ?? "#4a2f22"; m(); g.fill(); inkStroke(g, m, o * 0.4);
    }
  }
  if (s.beard) {
    const b = () => { g.beginPath(); g.moveTo(-62, 40); g.quadraticCurveTo(0, 130, 62, 40); g.quadraticCurveTo(0, 70, -62, 40); g.closePath(); };
    celFill(g, b, s.hair ?? "#5a3a26", 8); inkStroke(g, b, o * 0.6);
  }
  if (s.glasses && !s.goggles) for (const sd of [-1, 1]) inkStroke(g, () => { g.beginPath(); g.arc(sd * 24, -10, 17, 0, Math.PI * 2); }, o * 0.45);
  if (s.goggles) {
    g.fillStyle = "#4a4d52"; g.beginPath(); g.roundRect(-104, -34, 208, 17, 6); g.fill();
    const lens = () => {
      g.beginPath(); g.moveTo(-80, -30); g.quadraticCurveTo(-80, -48, -60, -48); g.lineTo(60, -48); g.quadraticCurveTo(80, -48, 80, -30);
      g.lineTo(78, -6); g.quadraticCurveTo(76, 6, 60, 6); g.lineTo(18, 6); g.quadraticCurveTo(0, -10, -18, 6); g.lineTo(-60, 6); g.quadraticCurveTo(-76, 6, -78, -6); g.closePath();
    };
    g.fillStyle = "rgba(140,200,240,0.5)"; lens(); g.fill();
    inkStroke(g, () => { g.beginPath(); g.moveTo(-58, -38); g.lineTo(-44, -6); g.moveTo(-46, -40); g.lineTo(-36, -18); g.moveTo(30, -40); g.lineTo(42, -12); }, 3, "rgba(255,255,255,0.75)");
    inkStroke(g, lens, 6, "#8e959e"); inkStroke(g, lens, o * 0.5);
  }
  memeHat(g, s, o);
  if (phones) {
    for (const sd of [-1, 1]) {
      const cup = () => { g.beginPath(); g.roundRect(sd > 0 ? 92 : -124, -38, 32, 72, 13); };
      celFill(g, cup, "#6e7176", 8, 0, "rgba(0,0,0,0.3)"); inkStroke(g, cup, o * 0.75);
    }
  }
  g.restore();

  // ---- props, then hands on top (black mittens with a thumb)
  const prop = p.prop ?? "none";
  const held = (p.propHand ?? "R") === "R" ? aR : aL;
  if (MEME_PROPS.includes(prop)) memeProp(g, prop, held.h[0], held.h[1], p.t, held.side, k, OUT);
  else if (prop !== "none") drawProp(g, prop, held.h[0], held.h[1], p.t, held.side);
  for (const a of [aL, aR]) {
    const [x, y] = a.h;
    g.fillStyle = s.gloves ?? MINK; g.strokeStyle = MINK; g.lineWidth = THIN * 0.6;
    g.beginPath(); g.ellipse(x, y, 0.037 * H, 0.034 * H, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.ellipse(x - a.side * 0.027 * H, y - 0.012 * H, 0.014 * H, 0.012 * H, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.28)"; g.lineWidth = 3 * k;
    g.beginPath(); g.arc(x, y, 0.022 * H, Math.PI * 1.15, Math.PI * 1.55); g.stroke();
  }
  return { headTopY: headY - R * 1.25, headY, hipY };
}
