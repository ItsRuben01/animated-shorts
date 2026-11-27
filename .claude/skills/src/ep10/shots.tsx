import React from "react";
import { Toon } from "../engine/Toon";
import { Stage } from "../engine/Stage";
import type { V3 } from "../engine/Stage";
import type { Arm, Expression, Prop } from "../engine/draw";
import { CommentCard, type AvatarStyle } from "../engine/CommentCard";
import { Box } from "../engine/kit";
import { fan, guide } from "./cast";
import {
  Arrow, BaseBlock, Card, Chains, Cross, Cutter, Dial, Extruder, Jungle, Mixer, Pack, Pan, Pellet, Pile, Plant, Sapodilla, Section,
  StepSign, Stretch, Studio, Tire, Wall, useT,
} from "./sets";
import { cam, closeLook, coolLook, ease, jungleLook, plantLook, ramp, studioLook, warmLook, xrayLook } from "./world";
import esShots from "../../episodes/ep10_es/shots.json";
import enShots from "../../episodes/ep10_en/shots.json";

export type Lang = "en" | "es";
type P = { dur: number };
type Pose = { face?: Expression; armL?: Arm; armR?: Arm; look?: number; talk?: boolean; prop?: Prop };

const Guide: React.FC<{ pos: V3; h?: number; pose?: Pose; seed?: number }> = ({ pos, h = 2.5, pose = {}, seed = 3 }) => (
  <Toon spec={guide} pos={pos} h={h} seed={seed} pose={{ armL: "down", armR: "down", talk: true, ...pose }} />
);
const Fan: React.FC<{ pos: V3; h?: number; pose?: Pose; seed?: number }> = ({ pos, h = 2.4, pose = {}, seed = 9 }) => (
  <Toon spec={fan} pos={pos} h={h} seed={seed} pose={{ armL: "down", armR: "down", ...pose }} />
);

type Comment = { username: string; question: string; avatarStyle?: AvatarStyle; seed?: number };
const commentFor = (lang: Lang): Comment => {
  const list = (lang === "es" ? esShots : enShots) as Array<{ comment?: Comment }>;
  return list.find((s) => s.comment)!.comment!;
};

const CommentPop: React.FC<{ c: Comment; pop?: boolean }> = ({ c, pop = true }) => {
  const t = useT();
  const k = pop ? 0.6 + 0.4 * (1 - Math.pow(1 - ramp(t, 0, 0.35), 3)) : 1;
  return <CommentCard username={c.username} question={c.question} avatarStyle={c.avatarStyle} seed={c.seed} position={[0.35, 2.35, 1.4]} rotation={[0, -0.12, 0]} scale={0.9 * k} />;
};

const Pedestal: React.FC<{ pos: V3; w?: number; h?: number }> = ({ pos, w = 1.2, h = 1.0 }) => (
  <Box size={[w, h, w]} pos={[pos[0], h / 2, pos[2]]} color="#5a8fb8" rough={0.5} />
);

// shot 1: a tire and a gum pellet side by side on the studio floor; between them, "≈"
const HookPair: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useT();
  const s = dur / 30;
  const pop = ease(ramp(t, s * 0.45, s * 0.65));
  return (
    <group>
      <Tire pos={[-0.85, 1.0, -0.3]} r={0.55} spin={0.5} rot={[0, 0.35, 0]} />
      <Pellet pos={[0.95, 0.75 + Math.sin(t * 2.2) * 0.05, 0.3]} s={0.45} coated={false} spin={0.5} rot={[0.25, 0, 0.1]} />
      <group position={[0.05, 2.7, 0.4]} scale={0.01 + 0.99 * pop}>
        <Card pos={[0, 0, 0]} lines={["≈"]} w={0.9} h={0.7} bg="#173846" fg="#ffe6ad" />
      </group>
    </group>
  );
};

export const makeShots = (lang: Lang): Record<number, React.FC<P>> => {
  const c = commentFor(lang);
  return {
    // 1 hook: a tire next to a piece of gum — "almost the same rubber"
    1: ({ dur }) => <Stage look={studioLook} dur={dur} cam={cam([0.1, 2.0, 7.6], [0, 1.4, 0], 40, [0, 1.9, 6.8], [0, 1.4, 0])}>
      <Studio />
      <HookPair dur={dur} />
    </Stage>,

    // 2 "relax, today I'll show you how": guide presents a tray of gum on a pedestal
    2: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([0.2, 2.1, 7.6], [0, 1.5, 0], 44, [0, 1.9, 6.5], [0, 1.5, 0])}>
      <Plant />
      <Guide pos={[-0.85, 0, 0.5]} pose={{ armR: "point", face: "smirk", look: 0.7 }} />
      <Pedestal pos={[0.95, 0, 0.6]} w={1.3} h={0.9} />
      <Pile pos={[0.95, 0.95, 0.6]} n={12} />
    </Stage>,

    // 3 three facts + a locked fourth: tire, mixer, 50 °C… and "4"
    3: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([3.0, 6.8, 12.8], [0, 2.2, -1], 46, [2.2, 6.0, 10.8], [0, 2.2, -1])}>
      <Plant />
      <Tire pos={[-1.6, 0.95, 2.2]} r={0.6} spin={0.4} rot={[0, 0.5, 0]} />
      <Mixer pos={[0, 0, -1.6]} scale={0.9} />
      <Card pos={[1.6, 4.2, -0.8]} lines={["50 °C"]} w={1.7} h={0.7} bg="#4a2430" fg="#ffe6ad" />
      <StepSign n="4" pos={[1.5, 2.0, 2.6]} size={1.2} />
    </Stage>,

    // 4 literal definition: chew it, don't swallow it — the fan stretches a strand
    4: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 2.6, 8.4], [0, 1.6, 0.6], 44, [0, 2.5, 7.6], [0, 1.6, 0.6])}>
      <Plant />
      <Fan pos={[-1.15, 0, 0.6]} h={2.3} pose={{ face: "troll", armR: "show", look: 0.6 }} />
      <Guide pos={[1.25, 0, 0.6]} h={2.3} pose={{ armL: "point", face: "poker", look: -0.6 }} />
      <Stretch pos={[0.05, 1.5, 1.3]} len={(t) => 0.4 + ease(ramp(t, 0.2, dur / 30 - 0.3)) * 1.1} r={0.09} />
    </Stage>,

    // 5 "what is it really made of?": guide close, pull back to the machines
    5: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([0, 2.3, 6.8], [0, 1.9, 0], 44, [0, 3.4, 10.4], [0, 2.2, -1])}>
      <Plant />
      <Mixer pos={[-2.8, 0, -3.4]} scale={0.8} />
      <Pan pos={[2.8, 0, -3.4]} scale={0.8} coat={1} />
      <Guide pos={[0, 0, 0.8]} pose={{ armR: "point", face: "suspicious", look: 0.4 }} />
    </Stage>,

    // 6 the Maya chewed the sap of the sapodilla tree
    6: ({ dur }) => <Stage look={jungleLook} dur={dur} cam={cam([1.4, 1.9, 9.6], [0, 2.0, 0], 44, [0.8, 1.8, 8.6], [0, 1.9, 0])}>
      <Jungle />
      <Sapodilla pos={[0, 0, 0]} />
    </Stage>,

    // 7 today: synthetic butyl rubber, like a tire's inner tube
    7: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 2.3, 7.8], [0, 1.7, 0], 42, [0, 2.2, 7.0], [0, 1.7, 0])}>
      <Plant />
      <Box size={[3.4, 0.9, 1.6]} pos={[0, 0.45, 0.4]} color="#e3e8ee" rough={0.35} />
      <Tire pos={[-0.85, 1.55, 0.4]} r={0.45} tube spin={0.3} rot={[-0.4, 0.3, 0]} />
      <BaseBlock pos={[0.95, 1.18, 0.4]} s={1.0} rot={[0, -0.3, 0]} />
      <Card pos={[0, 2.9, -0.2]} lines={["IIR"]} w={1.3} h={0.6} bg="#173846" fg="#ffe6ad" />
    </Stage>,

    // 8 X-ray: chains tangle like spaghetti — that's why it stretches
    8: ({ dur }) => <Stage look={xrayLook} dur={dur} cam={cam([0, 2.2, 7.2], [0, 2.1, 0], 44, [0, 2.2, 6.4], [0, 2.1, 0])}>
      <Studio />
      <Chains pos={[0, 2.1, 0]} r={1.25} stretch={(t) => ease(ramp(t, dur / 30 * 0.45, dur / 30 * 0.85))} />
    </Stage>,

    // 9 step 1: gum base is melted and goes into the paddle mixer
    9: ({ dur }) => <Stage look={warmLook} dur={dur} cam={cam([0.3, 6.4, 8.6], [0, 1.9, 0.4], 44, [0.1, 6.0, 7.8], [0, 1.9, 0.4])}>
      <Plant />
      <Mixer pink={0} />
      <BaseBlock pos={[-1.0, 0.25, 2.2]} s={0.9} rot={[0, 0.4, 0]} />
      <BaseBlock pos={[-0.9, 0.72, 2.2]} s={0.8} rot={[0, -0.2, 0]} />
      <StepSign n="1" pos={[1.0, 3.2, 2.6]} size={0.8} />
    </Stage>,

    // 10 sugar, syrup and flavor; 5–15 minutes of mixing (mass turns pink)
    10: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([0.3, 6.0, 8.4], [0, 2.6, 0], 44, [0.1, 5.6, 7.6], [0, 2.6, 0])}>
      <Plant />
      <Mixer pink={(t) => ramp(t, 0.3, dur / 30 - 0.3)} pour={1} />
      <Card pos={[0, 5.4, -0.6]} lines={["5–15 min"]} w={2.2} h={0.65} bg="#173846" fg="#ffe6ad" />
    </Stage>,

    // 11 wink: goes in hard, comes out soft — guide smirks, arms crossed
    11: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 2.9, 8.6], [0, 1.9, 0], 44, [0, 2.8, 7.8], [0, 1.9, 0])}>
      <Plant />
      <Mixer pos={[0.6, 0, -1.6]} pink={1} scale={0.85} />
      <Guide pos={[-1.1, 0, 1.6]} h={2.3} pose={{ face: "smirk", armL: "cross", armR: "cross", look: 0.7 }} />
      <BaseBlock pos={[0.2, 0.25, 1.8]} s={0.6} />
      <Arrow pos={[0.85, 0.3, 1.8]} len={0.4} />
      <Pellet pos={[1.4, 0.2, 1.8]} s={0.22} coated={false} />
    </Stage>,

    // 12 step 2: extruder at ~50 °C, rollers flatten it into a sheet
    12: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([0.4, 4.6, 10.6], [0, 1.6, 0], 44, [0.1, 4.2, 9.6], [0, 1.6, 0])}>
      <Plant />
      <group rotation={[0, 0.95, 0]} scale={0.85}><Extruder /></group>
      <Card pos={[-1.6, 4.0, 1.6]} lines={["50 °C"]} w={1.5} h={0.6} bg="#4a2430" fg="#ffe6ad" />
      <StepSign n="2" pos={[1.4, 3.4, -2.2]} size={1.0} />
    </Stage>,

    // 13 step 3: cut, then cooled to firm up
    13: ({ dur }) => <Stage look={coolLook} dur={dur} cam={cam([0.3, 4.4, 10.4], [0, 1.5, 0], 44, [0.1, 4.0, 9.6], [0, 1.5, 0])}>
      <Plant />
      <group rotation={[0, 0.95, 0]} scale={0.85}><Cutter /></group>
      <StepSign n="3" pos={[-1.3, 3.4, 1.4]} size={0.9} />
    </Stage>,

    // 14 viewer comment appears in the guide's world
    14: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([0, 2.0, 7.8], [0, 1.8, 0], 44, [0, 2.1, 7.0], [0, 1.9, 0])}>
      <Plant />
      <Guide pos={[-0.95, 0, 0.3]} pose={{ armR: "point", face: "smirk", look: 0.8 }} />
      <CommentPop c={c} />
    </Stage>,

    // 15 read the comment
    15: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.35, 2.35, 5.2], [0.35, 2.35, 1.4], 46, [0.35, 2.35, 4.7], [0.35, 2.35, 1.4])}>
      <Plant />
      <Guide pos={[-0.95, 0, 0.3]} pose={{ armR: "point", face: "skeptical", look: 0.8 }} />
      <CommentPop c={c} pop={false} />
    </Stage>,

    // 16 answer: "7" gets crossed out — a few days, not seven years
    16: ({ dur }) => <Stage look={coolLook} dur={dur} cam={cam([0, 2.2, 7.6], [0, 2.0, 0], 44, [0, 2.2, 6.8], [0, 2.0, 0])}>
      <Plant />
      <Guide pos={[-1.2, 0, 0.6]} pose={{ armL: "shrug", armR: "shrug", face: "lol", look: 0.6 }} />
      <StepSign n="7" pos={[0.9, 2.6, 0]} size={1.3} />
      <Cross pos={[0.9, 2.9, 0.25]} on={(t) => ramp(t, dur / 30 * 0.3, dur / 30 * 0.5)} s={0.6} />
      <Card pos={[0.9, 1.5, 0.1]} lines={["< 3 d"]} w={1.5} h={0.6} bg="#2f6b3a" fg="#ffe6ad" />
    </Stage>,

    // 17 step 4: coating pan, syrup layer by layer
    17: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([0.3, 3.8, 8.4], [0, 2.1, 0], 44, [0.1, 3.5, 7.6], [0, 2.1, 0])}>
      <Plant />
      <Pan coat={(t) => ramp(t, 0.2, dur / 30 - 0.2)} />
      <StepSign n="4" pos={[1.5, 3.9, -1.4]} size={0.9} />
    </Stage>,

    // 18 comparison: painting a wall — many thin coats; the pellet section grows ring by ring
    18: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 2.2, 8.8], [0, 2.0, 0], 44, [0, 2.2, 8.0], [0, 2.0, 0])}>
      <Plant />
      <Wall pos={[-1.0, 0, -0.4]} coats={(t) => ramp(t, 0.2, dur / 30 - 0.3)} />
      <Section pos={[1.05, 2.1, 0.4]} scale={0.6} layers={(t) => 2 + ramp(t, 0.2, dur / 30 - 0.3) * 10} />
    </Stage>,

    // 19 twist: drying air under 8 % humidity, otherwise pellets clump
    19: ({ dur }) => <Stage look={coolLook} dur={dur} cam={cam([0.2, 3.3, 8.6], [0, 2.1, 0], 44, [0.1, 3.1, 7.8], [0, 2.1, 0])}>
      <Plant />
      <Pan pos={[-0.9, 0, 0]} coat={1} sticky={(t) => ramp(t, dur / 30 * 0.55, dur / 30 * 0.85)} scale={0.9} />
      <Dial pos={[1.5, 2.6, 0.4]} value={(t) => 0.15 + ramp(t, dur / 30 * 0.5, dur / 30 * 0.8) * 0.75} />
      <Card pos={[1.5, 1.5, 0.4]} lines={["< 8 %"]} w={1.4} h={0.55} bg="#173846" fg="#ffe6ad" />
    </Stage>,

    // 20 the shell is a third of the gum's weight
    20: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 2.2, 6.4], [0, 2.1, 0], 44, [0, 2.2, 5.8], [0, 2.1, 0])}>
      <Plant />
      <Section pos={[0, 2.1, 0]} scale={0.85} layers={12} highlight />
      <Card pos={[0, 3.45, -0.2]} lines={["≈ 33 %"]} w={1.7} h={0.6} bg="#173846" fg="#ffe6ad" />
    </Stage>,

    // 21 before / after: tree sap → a coated pellet with your friend's name
    21: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 3.0, 7.6], [0, 1.3, 0.6], 44, [0, 2.8, 7.0], [0, 1.3, 0.6])}>
      <Plant />
      <Box size={[3.4, 0.9, 1.6]} pos={[0, 0.45, 0.6]} color="#e3e8ee" rough={0.35} />
      <Box size={[0.6, 0.5, 0.6]} pos={[-1.1, 1.15, 0.6]} color="#a07848" rough={0.8} ink />
      <Box size={[0.52, 0.04, 0.52]} pos={[-1.1, 1.41, 0.6]} color="#f6f2e4" rough={0.3} bevel={false} />
      <Arrow pos={[0.0, 1.25, 0.9]} len={0.35} />
      <Pellet pos={[1.05, 1.25, 0.6]} s={0.35} spin={0.6} rot={[0.3, 0, 0]} />
      <Card pos={[0.7, 0.5, 1.42]} lines={["@ ______"]} w={1.1} h={0.42} bg="#fff6dc" fg="#c0392b" />
    </Stage>,

    // 22 tag your friend: the fan proudly shows his pack
    22: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.3, 2.1, 6.4], [0, 1.6, 0], 44, [0.1, 2.0, 5.6], [0, 1.6, 0])}>
      <Plant />
      <Fan pos={[-0.85, 0, 0.2]} pose={{ face: "proud", armR: "up", look: 0.6 }} />
      <Pedestal pos={[0.75, 0, 0.9]} w={1.0} h={0.9} />
      <Pack pos={[0.75, 1.55, 0.9]} scale={0.6} tag rot={[-0.15, -0.2, 0]} />
    </Stage>,

    // 23 goodbye, like and follow
    23: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([0, 2.2, 7.6], [0, 1.6, 0], 44, [0, 2.5, 8.6], [0, 1.7, 0])}>
      <Plant />
      <Guide pos={[-0.8, 0, 0.4]} pose={{ armR: "wave", face: "happy" }} />
      <Fan pos={[0.85, 0, 0.1]} pose={{ face: "happy", armL: "wave" }} />
      <Pile pos={[0, 0.06, 1.6]} n={10} />
    </Stage>,
  };
};
