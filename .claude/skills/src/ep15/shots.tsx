// ep15 — shots. 8-piece retention structure (styles/retention-rules.md):
// 1–2 hook · 3 promise · 4–6 body 1 · 7 loop 1 · 8–9 body 2 · 10 loop 2 · 11–12 body 3 · 13–15 CTA (14 = comment keyword)
// One world: the bakery. Metaphor/tracker: the bun fills with cream; three "?" cards flip to ✓ (how · why after baking · spot it).
import React from "react";
import { Toon } from "../engine/Toon";
import { Stage } from "../engine/Stage";
import type { V3 } from "../engine/Stage";
import type { Arm, Expression, Prop } from "../engine/draw";
import { Counter, ProgressCards } from "../engine/Hud";
import { CommentCTA, ctaFor, type CtaSpec } from "../engine/CommentCTA";
import { Box } from "../engine/kit";
import { baker, friend } from "./cast";
import { Bakery, Bun, creamY, Doser, Inside, Melting, Needle, Oven, Rack, Steam, useT } from "./sets";
import { bakeryLook, cam, closeLook, ease, insideLook, ovenLook, ramp } from "./world";
import esShots from "../../episodes/ep15_es/shots.json";
import enShots from "../../episodes/ep15_en/shots.json";

export type Lang = "en" | "es";
type P = { dur: number };
type Pose = { face?: Expression; armL?: Arm; armR?: Arm; look?: number; talk?: boolean; prop?: Prop };

const Baker: React.FC<{ pos: V3; h?: number; pose?: Pose; seed?: number }> = ({ pos, h = 2.4, pose = {}, seed = 8 }) => (
  <Toon spec={baker} pos={pos} h={h} seed={seed} pose={{ armL: "down", armR: "down", talk: true, ...pose }} />
);
const Friend: React.FC<{ pos: V3; h?: number; pose?: Pose; seed?: number }> = ({ pos, h = 2.35, pose = {}, seed = 9 }) => (
  <Toon spec={friend} pos={pos} h={h} seed={seed} pose={{ armL: "down", armR: "down", ...pose }} />
);
const Table: React.FC<{ pos?: V3; w?: number; h?: number; d?: number }> = ({ pos = [0, 0, 0], w = 2.4, h = 0.9, d = 1.3 }) => (
  <Box size={[w, h, d]} pos={[pos[0], h / 2, pos[2]]} color="#5a8fb8" rough={0.5} ink />
);

const CARDS = { y: 0.215, w: 0.44 };

export const makeShots = (lang: Lang): Record<number, React.FC<P>> => {
  const cta = ctaFor((lang === "es" ? esShots : enShots) as Array<{ cta?: CtaSpec }>)!;
  const S = (dur: number) => dur / 30;
  return {
    // 1 HOOK — frame 0: the needle is already inside the cut bun and cream starts to bloom (empty → full)
    1: ({ dur }) => <Stage look={insideLook} dur={dur} cam={cam([0.1, 1.45, 5.4], [0, 1.25, 0], 42, [0.05, 1.4, 4.7], [0, 1.3, 0])}>
      <Inside />
      <Bun pos={[0, 0.8, 0]} s={1.75} cut fill={(t) => 0.12 + ease(ramp(t, 0, S(dur) * 0.9)) * 0.8} />
      <Needle pos={[1.3, 0.8 + creamY(1.75), 0.05]} len={1.3} insert={1} flow={1} />
    </Stage>,

    // 2 HOOK — "injected. Literally": the needle pulls out of a whole bun, a tiny dot is left
    2: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.3, 1.9, 5.4], [0.1, 1.4, 0], 42, [0.2, 1.8, 4.8], [0.1, 1.4, 0])}>
      <Bakery />
      <Table pos={[0.3, 0, 0]} w={2.0} />
      <Bun pos={[0.3, 0.9, 0.1]} s={1.1} holes={1} glowHoles={(t) => ramp(t, S(dur) * 0.55, S(dur) * 0.8)} />
      <Needle pos={[1.25, 1.05, 0.65]} len={0.9} insert={(t) => 1 - ease(ramp(t, 0.3, S(dur) * 0.6))} />
      <Baker pos={[-1.15, 0, 1.0]} h={2.3} pose={{ face: "lol", armR: "point", look: 0.7 }} />
    </Stage>,

    // 3 PROMISE — three things you'll take away: three "?" cards; the bakery line behind
    3: ({ dur }) => <>
      <Stage look={bakeryLook} dur={dur} cam={cam([0.4, 2.6, 8.4], [0, 1.6, 0], 44, [0.2, 2.4, 7.4], [0, 1.6, 0])}>
        <Bakery />
        <Rack pos={[0.5, 0, -1.2]} n={3} />
        <Baker pos={[-1.15, 0, 1.0]} h={2.3} pose={{ face: "smirk", armR: "point", look: 0.7 }} />
      </Stage>
      <ProgressCards total={3} appear={0.5} y={CARDS.y} w={CARDS.w} />
    </>,

    // 4 BODY 1 — in the oven the dough rises; inside: air pockets
    4: ({ dur }) => <Stage look={ovenLook} dur={dur} cam={cam([0, 1.7, 5.6], [0, 1.4, 0], 42, [0, 1.6, 4.9], [0, 1.4, 0])}>
      <Bakery />
      <Oven pos={[0, 0, -2.4]} />
      <Box size={[2.2, 0.8, 1.2]} pos={[0, 0.4, 0.4]} color="#b4bcc6" rough={0.35} />
      <Bun pos={[0, 0.8, 0.4]} s={1.6} cut rise={(t) => 0.35 + ease(ramp(t, 0.1, S(dur) * 0.8)) * 0.65} baked={(t) => ramp(t, 0.3, S(dur))} />
      <Steam pos={[0, 1.7, 0.4]} on={(t) => ramp(t, S(dur) * 0.5, S(dur))} />
    </Stage>,

    // 5 BODY 1 — the needle: a steel tube that pierces without tearing
    5: ({ dur }) => <Stage look={insideLook} dur={dur} cam={cam([0.2, 1.45, 5.6], [0.1, 1.25, 0], 42, [0.1, 1.4, 5.0], [0.1, 1.3, 0])}>
      <Inside />
      <Bun pos={[0, 0.8, 0]} s={1.75} cut fill={0} />
      <Needle pos={[1.3, 0.8 + creamY(1.75), 0.05]} len={1.3} insert={(t) => ease(ramp(t, 0.3, S(dur) * 0.7))} />
    </Stage>,

    // 6 BODY 1 — the piston measures every shot: 0 → 15 g; card 1 flips ✓
    6: ({ dur }) => <>
      <Stage look={closeLook} dur={dur} cam={cam([0.3, 2.3, 6.4], [0.1, 1.6, 0], 42, [0.2, 2.1, 5.7], [0.1, 1.6, 0])}>
        <Bakery />
        <Doser pos={[0.55, 0, -0.3]} push={(t) => ease(ramp(t, 0.4, S(dur) * 0.75))} />
        <Table pos={[-0.85, 0, 0.6]} w={1.4} h={0.7} />
        <Bun pos={[-0.85, 0.7, 0.6]} s={0.85} holes={1} />
      </Stage>
      <ProgressCards total={3} flips={[S(dur) - 0.6]} active={0} y={CARDS.y} w={CARDS.w} />
      <Counter from={0} to={15} start={0.4} end={S(dur) * 0.75} suffix=" g" lang={lang} y={0.76} size={140} />
    </>,

    // 7 LOOP 1 — "that's not the craziest part": quick push into the glowing oven
    7: ({ dur }) => <Stage look={ovenLook} dur={dur} cam={cam([0, 1.8, 6.0], [0, 1.4, -2.4], 44, [0, 1.6, 3.2], [0, 1.4, -2.4])}>
      <Bakery />
      <Oven pos={[0, 0, -2.4]} glow={1} />
    </Stage>,

    // 8 BODY 2 — cream can't survive the oven: it melts and burns
    8: ({ dur }) => <Stage look={ovenLook} dur={dur} cam={cam([0, 1.9, 5.4], [0, 1.2, 0], 42, [0, 1.8, 4.8], [0, 1.2, 0])}>
      <Bakery />
      <Oven pos={[0, 0, -2.2]} />
      <Box size={[1.8, 0.8, 1.2]} pos={[0, 0.4, 0.4]} color="#b4bcc6" rough={0.35} />
      <Melting pos={[0, 0.83, 0.4]} s={1.2} melt={(t) => ease(ramp(t, S(dur) * 0.25, S(dur) * 0.85))} />
    </Stage>,

    // 9 BODY 2 — they wait for the bun to cool… and only then the needle goes in; card 2 ✓
    9: ({ dur }) => <>
      <Stage look={bakeryLook} dur={dur} cam={cam([0.2, 2.2, 5.8], [0, 1.3, 0], 42, [0.1, 2.0, 5.1], [0, 1.3, 0])}>
        <Bakery />
        <Rack pos={[0, 0, 0]} n={3} holes={0} />
        <Steam pos={[0, 1.6, 0]} n={8} on={(t) => 1 - ramp(t, 0.2, S(dur) * 0.55)} />
        <Needle pos={[0.45 + 0.6, 1.24, 0.42]} len={0.6} insert={(t) => ease(ramp(t, S(dur) * 0.6, S(dur) * 0.85))} />
      </Stage>
      <ProgressCards total={3} flips={[-1, S(dur) - 0.5]} active={1} y={CARDS.y} w={CARDS.w} />
    </>,

    // 10 LOOP 2 — "and here's the trick": the baker leans in with a grin
    10: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.1, 1.9, 5.2], [-0.2, 1.7, 0], 42, [0.0, 1.8, 3.9], [-0.2, 1.75, 0])}>
      <Bakery />
      <Baker pos={[-0.2, 0, 0.6]} pose={{ face: "troll", armR: "point", look: 0.4 }} />
    </Stage>,

    // 11 BODY 3 — grab your bun and find the dot: where the needle went in (glows)
    11: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 1.55, 4.0], [0, 1.15, 0], 40, [0, 1.45, 3.4], [0, 1.15, 0])}>
      <Bakery />
      <Table pos={[0, 0, 0]} w={2.0} h={0.7} />
      <Bun pos={[0, 0.7, 0.1]} s={1.35} holes={1} glowHoles={(t) => ramp(t, 0.4, 0.9)} />
    </Stage>,

    // 12 BODY 3 — several dots: several shots so the cream reaches everywhere; card 3 ✓
    12: ({ dur }) => <>
      <Stage look={insideLook} dur={dur} cam={cam([0, 1.45, 6.2], [0, 1.25, 0], 42, [0, 1.4, 5.6], [0, 1.25, 0])}>
        <Inside />
        <Bun pos={[0, 0.8, 0]} s={1.25} cut long holes={3} glowHoles={(t) => ramp(t, 0.2, 0.6)} fill={(t) => ease(ramp(t, 0.3, S(dur) * 0.8))} />
      </Stage>
      <ProgressCards total={3} flips={[-1, -1, S(dur) - 0.6]} active={2} y={CARDS.y} w={CARDS.w} />
    </>,

    // 13 CTA (close the loop) — "you'll never look at a bun the same way": the full bun, the baker and the friend
    13: ({ dur }) => <>
      <Stage look={bakeryLook} dur={dur} cam={cam([0, 2.0, 6.8], [0, 1.4, 0], 44, [0, 2.2, 7.6], [0, 1.5, 0])}>
        <Bakery />
        <Table pos={[0, 0, 0.3]} w={1.6} h={0.9} />
        <Bun pos={[0, 0.9, 0.3]} s={1.15} cut fill={1} />
        <Baker pos={[-1.2, 0, 0.6]} h={2.3} pose={{ face: "proud", armL: "point", look: 0.6 }} />
        <Friend pos={[1.25, 0, 0.6]} h={2.25} pose={{ face: "happy", armR: "up", look: -0.6 }} />
      </Stage>
      <ProgressCards total={3} flips={[-1, -1, -1]} y={CARDS.y} w={CARDS.w} />
    </>,

    // 14 CTA — comment keyword: the phone in the bakery types «CREMA», sends it, the DM lands
    14: ({ dur }) => <Stage look={bakeryLook} dur={dur} cam={cam([0.3, 2.5, 6.2], [0.3, 2.4, 0.8], 40, [0.3, 2.45, 5.8], [0.3, 2.4, 0.8])}>
      <Bakery />
      <Box size={[2.2, 0.9, 1.4]} pos={[0.3, 0.45, 0.8]} color="#5a8fb8" rough={0.6} />
      <CommentCTA keyword={cta.keyword} reply={cta.reply} channel={cta.channel} mode={cta.mode} lang={lang} position={[0.3, 2.08, 0.8]} />
      <Baker pos={[-1.05, 0, 1.4]} h={2.2} pose={{ face: "happy", armR: "point", look: 0.8 }} />
    </Stage>,

    // 15 CTA — follow: both wave, a tray of filled buns
    15: ({ dur }) => <Stage look={bakeryLook} dur={dur} cam={cam([0, 2.2, 7.6], [0, 1.6, 0], 44, [0, 2.5, 8.6], [0, 1.8, 0])}>
      <Bakery />
      <Rack pos={[0, 0, -1.6]} n={3} holes={1} />
      <Baker pos={[-0.85, 0, 0.4]} pose={{ armR: "wave", face: "happy" }} />
      <Friend pos={[0.9, 0, 0.1]} pose={{ face: "happy", armL: "wave" }} />
    </Stage>,
  };
};
