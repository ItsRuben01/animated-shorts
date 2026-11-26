import React from "react";
import { Toon } from "../engine/Toon";
import { Stage } from "../engine/Stage";
import type { V3 } from "../engine/Stage";
import type { Arm, Expression, Prop } from "../engine/draw";
import { CommentCard, type AvatarStyle } from "../engine/CommentCard";
import { Box } from "../engine/kit";
import { fan, freund, guide } from "./cast";
import {
  Arrow, Bun, Calibres, Card, Chopper, Frame, Ice, Linker, Links, Oven, Pack, Peeler, Phone, Plant, Sausage, StepSign, Studio, Stuffer, Thermo, Tub, XSection, useT,
} from "./sets";
import { cam, closeLook, coldLook, ease, ovenLook, pastLook, plantLook, ramp, studioLook } from "./world";
import esShots from "../../episodes/ep8_es/shots.json";
import enShots from "../../episodes/ep8_en/shots.json";

export type Lang = "en" | "es";
type P = { dur: number };
type Pose = { face?: Expression; armL?: Arm; armR?: Arm; look?: number; talk?: boolean; prop?: Prop };

const Guide: React.FC<{ pos: V3; h?: number; pose?: Pose; seed?: number }> = ({ pos, h = 2.5, pose = {}, seed = 3 }) => (
  <Toon spec={guide} pos={pos} h={h} seed={seed} pose={{ armL: "down", armR: "down", talk: true, ...pose }} />
);
const Fan: React.FC<{ pos: V3; h?: number; pose?: Pose; seed?: number }> = ({ pos, h = 2.4, pose = {}, seed = 9 }) => (
  <Toon spec={fan} pos={pos} h={h} seed={seed} pose={{ armL: "down", armR: "down", ...pose }} />
);

// shot 1: product-shot sausage spinning in the air; its casing slides off half-way through the line
const SpinSausage: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useT();
  const peel = ramp(t, dur / 30 * 0.55, dur / 30 * 0.85);
  return (
    <group position={[0, 1.9 + Math.sin(t * 2.2) * 0.06, 0]} rotation={[0, t * 1.2, 0]}>
      <Sausage rot={[0.1, 0, 0.28]} len={2.6} r={0.3} casing={peel < 0.98} peel={peel} ink />
    </group>
  );
};

// shot 4: the long tender definition — sausage lowers itself into a bun
const BunDrop: React.FC = () => {
  const t = useT();
  const k = ease(ramp(t, 0.4, 1.8));
  return (
    <group>
      <Box size={[1.9, 0.7, 1.1]} pos={[0, 0.35, 1.3]} color="#e3e8ee" rough={0.35} />
      <Bun pos={[0, 0.88, 1.3]} scale={0.8} />
      <Sausage pos={[0, 1.9 - k * 0.92, 1.3]} len={1.55} r={0.15} ink />
    </group>
  );
};

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

export const makeShots = (lang: Lang): Record<number, React.FC<P>> => {
  const c = commentFor(lang);
  const dec = (s: string) => (lang === "es" ? s.replace(".", ",") : s);
  return {
    // 1 hook: studio close-up of a glossy sausage; its see-through sleeve flies off ("stripped naked")
    1: ({ dur }) => <Stage look={studioLook} dur={dur} cam={cam([0.15, 2.0, 6.2], [0, 1.9, 0], 40, [0, 1.95, 5.3], [0, 1.9, 0])}>
      <Studio />
      <SpinSausage dur={dur} />
    </Stage>,

    // 2 "relax, today I'll show you why": the guide presents the plant
    2: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([0.2, 2.1, 7.6], [0, 1.4, 0], 44, [0, 1.9, 6.5], [0, 1.4, 0])}>
      <Plant />
      <Guide pos={[-0.8, 0, 0.5]} pose={{ armR: "point", face: "smirk", look: 0.7 }} />
      <Pack pos={[0.95, 0.9, 0.6]} scale={0.7} rot={[0, -0.4, 0]} />
      <Box size={[1.4, 0.9, 1.1]} pos={[0.95, 0.45, 0.6]} color="#3d7fb8" rough={0.6} />
    </Stage>,

    // 3 three facts + a locked fourth: ice, casing, 68 °C… and "4"
    3: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([3.4, 7.2, 11.5], [0, 2.2, -1], 46, [2.4, 6.2, 9.6], [0, 2.2, -1])}>
      <Plant />
      <Chopper pos={[-2.2, 0, 1.6]} />
      <Stuffer pos={[1.6, 0, 2.0]} out={0.7} />
      <Oven pos={[0.2, 0, -3.6]} />
      <StepSign n="4" pos={[-2.6, 3.9, -1.2]} size={1.6} />
    </Stage>,

    // 4 literal definition: long, tender, made for a bun
    4: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 2.4, 10.0], [0, 1.3, 1.0], 44, [0, 2.2, 9.3], [0, 1.3, 1.0])}>
      <Plant />
      <Fan pos={[-1.4, 0, 1.4]} h={2.1} pose={{ face: "troll", look: 0.6 }} />
      <Guide pos={[1.4, 0, 1.4]} h={2.1} pose={{ armL: "point", face: "poker", look: -0.6 }} />
      <BunDrop />
    </Stage>,

    // 5 "what really happens before it reaches your home?"
    5: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([0, 2.3, 6.8], [0, 1.9, 0], 44, [0, 3.4, 10.2], [0, 2.2, -1])}>
      <Plant />
      <Chopper pos={[-2.2, 0, -3]} />
      <Oven pos={[2.4, 0, -4.4]} />
      <Guide pos={[0, 0, 0.8]} pose={{ armR: "point", face: "suspicious", look: 0.4 }} />
    </Stage>,

    // 6 step 1: meat + crushed ice spinning in the bowl chopper, 0 °C
    6: ({ dur }) => <Stage look={coldLook} dur={dur} cam={cam([0.6, 5.4, 7.2], [0, 1.8, 0], 44, [0.2, 5.0, 6.4], [0, 1.8, 0])}>
      <Plant />
      <Chopper paste={(t) => ramp(t, 0.2, 2.5)} />
      <StepSign n="1" pos={[-1.2, 3.9, -1.4]} size={1.1} />
      <Card pos={[1.2, 3.6, -1.2]} lines={["0 °C"]} w={1.2} h={0.55} bg="#173846" fg="#ffe6ad" />
    </Stage>,

    // 7 fat goes in last and cold; if it warms, the sausage sweats fat
    7: ({ dur }) => {
      const half = dur / 30 * 0.5;
      return <Stage look={coldLook} dur={dur} cam={cam([0.2, 3.6, 9.8], [0.2, 1.9, 0], 44, [0.3, 3.2, 9.0], [0.2, 1.9, 0])}>
        <Plant />
        <Chopper pos={[-0.9, 0, -0.4]} fat={(t) => ramp(t, 0.1, half)} ice={10} />
        <Thermo pos={[1.25, 0, 0.4]} scale={0.85} level={(t) => 0.15 + ramp(t, half, half + 1.2) * 0.65} label={dec("> 12 °C")} hot />
        <SweatSausage start={half} />
      </Stage>;
    },

    // 8 step 2: stuffed under pressure into the cellulose sleeve
    8: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([0.6, 3.0, 9.6], [0.4, 1.6, 0], 44, [0.6, 2.8, 8.8], [0.6, 1.5, 0])}>
      <Plant />
      <Stuffer out={(t) => ramp(t, 0.2, dur / 30 - 0.2)} />
      <StepSign n="2" pos={[-1.2, 4.3, -1.4]} size={1.2} />
    </Stage>,

    // 9 size does matter: three calibres, the casing decides
    9: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 2.6, 8.0], [0, 1.6, 0], 44, [0, 2.5, 7.2], [0, 1.6, 0])}>
      <Plant />
      <Calibres grow={(t) => ramp(t, 0.2, 1.8)} />
      <Card pos={[0, 3.0, -0.2]} lines={[dec("Ø 14.5–45 mm")]} w={2.3} h={0.6} bg="#173846" fg="#ffe6ad" />
    </Stage>,

    // 10 the linker twists the rope into links
    10: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([-0.4, 3.0, 8.4], [0.0, 1.4, 0], 44, [0.4, 2.7, 7.6], [0.4, 1.4, 0])}>
      <Plant />
      <Linker />
    </Stage>,

    // 11 step 3: smokehouse to 68 °C inside, then a cold shower
    11: ({ dur }) => {
      const s = dur / 30;
      return <Stage look={ovenLook} dur={dur} cam={cam([0.4, 2.6, 8.6], [0, 2.3, 0], 44, [0.2, 2.5, 7.6], [0, 2.3, 0])}>
        <Plant />
        <Oven glow={(t) => 1 - ramp(t, s * 0.6, s * 0.75)} shower={(t) => ramp(t, s * 0.62, s * 0.72)} cooked={(t) => ramp(t, 0.1, s * 0.55)} />
        <StepSign n="3" pos={[-2.9, 3.9, 0.6]} size={1.1} />
        <Card pos={[2.9, 4.4, 0.6]} lines={["68 °C · 155 °F"]} w={2.4} h={0.55} bg="#4a2430" fg="#ffe6ad" />
      </Stage>;
    },

    // 12 viewer comment appears in the guide's world
    12: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([0, 2.0, 7.8], [0, 1.8, 0], 44, [0, 2.1, 7.0], [0, 1.9, 0])}>
      <Plant />
      <Guide pos={[-0.95, 0, 0.3]} pose={{ armR: "point", face: "smirk", look: 0.8 }} />
      <CommentPop c={c} />
    </Stage>,

    // 13 read the comment
    13: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.35, 2.35, 5.2], [0.35, 2.35, 1.4], 46, [0.35, 2.35, 4.7], [0.35, 2.35, 1.4])}>
      <Plant />
      <Guide pos={[-0.95, 0, 0.3]} pose={{ armR: "point", face: "smirk", look: 0.8 }} />
      <CommentPop c={c} pop={false} />
    </Stage>,

    // 14 answer: cellulose doesn't digest → step 4 sign
    14: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([0, 2.2, 7.8], [0, 1.9, 0], 44, [0, 2.1, 7.0], [0, 1.9, 0])}>
      <Plant />
      <Guide pos={[-1.0, 0, 0.3]} pose={{ face: "poker", armL: "cross", armR: "cross" }} />
      <Sausage pos={[0.55, 1.5, 1.3]} rot={[0, -0.2, 0.25]} len={1.2} r={0.15} casing ink />
      <StepSign n="4" pos={[0.7, 3.6, -0.8]} size={1.2} />
    </Stage>,

    // 15 the fourth step: steam, blade, air jet — casings fly off
    15: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([0.6, 3.0, 7.6], [0.2, 1.4, 0], 44, [0.2, 2.6, 6.4], [0.3, 1.4, 0])}>
      <Plant />
      <Peeler />
      <StepSign n="4" pos={[-2.6, 3.6, -1.0]} size={1.1} />
    </Stage>,

    // 16 analogy: peeling the film off a brand-new phone
    16: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 2.0, 5.0], [0, 1.4, 0.8], 44, [0, 1.9, 4.5], [0, 1.4, 0.8])}>
      <Plant />
      <Box size={[3.0, 1.0, 1.6]} pos={[0, 0.5, 0.4]} color="#e3e8ee" rough={0.35} />
      <Phone pos={[-0.55, 1.55, 0.8]} peel={(t) => ramp(t, 0.3, 1.4)} scale={0.5} />
      <PeelLater />
    </Stage>,

    // 17 proof: cross-section — the outer protein sets into its own skin
    17: ({ dur }) => <Stage look={coldLook} dur={dur} cam={cam([0, 2.4, 7.4], [0, 2.3, 0], 44, [0, 2.3, 6.6], [0, 2.3, 0])}>
      <Plant />
      <XSection pos={[0, 2.3, 0]} scale={1.15} skin={(t) => ramp(t, 0.2, dur / 30 - 0.4)} casing={(t) => ramp(t, dur / 30 * 0.5, dur / 30 - 0.2)} />
      <Card pos={[0, 4.15, 0.4]} lines={["°C ↑"]} w={1.3} h={0.55} bg="#4a2430" fg="#ffe6ad" />
    </Stage>,

    // 18 Erwin O. Freund, 1920s, laughing: the sausage held its shape
    18: ({ dur }) => <Stage look={pastLook} dur={dur} cam={cam([0, 2.1, 7.4], [0, 1.9, 0], 44, [0, 2.0, 6.6], [0, 1.9, 0])}>
      <Plant />
      <Frame pos={[0, 3.2, -1.2]} />
      <Toon spec={freund} pos={[-0.55, 0, -0.2]} h={2.5} seed={5} pose={{ face: "lol", armR: "show", armL: "down", talk: true }} />
      <Sausage pos={[0.75, 1.55, 0.3]} rot={[0, 0, 1.2]} len={1.3} r={0.14} ink />
      <Card pos={[0.9, 4.6, -1.0]} lines={["1920s"]} w={1.4} h={0.55} bg="#3a2a20" fg="#f3e7c4" />
    </Stage>,

    // 19 before / after: paste with ice → naked sausages packed with your friend's name
    19: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 3.2, 8.2], [0, 1.2, 0.6], 44, [0, 3.0, 7.6], [0, 1.2, 0.6])}>
      <Plant />
      <Box size={[3.2, 0.9, 1.6]} pos={[0, 0.45, 0.6]} color="#e3e8ee" rough={0.35} />
      <Tub pos={[-0.95, 0.9, 0.6]} scale={0.7} />
      <Arrow pos={[0.0, 1.35, 0.9]} len={0.35} />
      <Pack pos={[0.95, 0.92, 0.6]} scale={0.55} tag rot={[0, -0.2, 0]} />
      <Ice pos={[-1.35, 0.98, 1.2]} />
    </Stage>,

    // 20 tag your friend: the fan with the tagged pack
    20: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.3, 2.1, 6.4], [0, 1.6, 0], 44, [0.1, 2.0, 5.6], [0, 1.6, 0])}>
      <Plant />
      <Fan pos={[-0.85, 0, 0.2]} pose={{ face: "laugh", armR: "up", look: 0.6 }} />
      <Box size={[1.6, 0.9, 1.2]} pos={[0.8, 0.45, 0.9]} color="#3d7fb8" rough={0.6} />
      <Pack pos={[0.8, 0.92, 0.9]} scale={0.7} tag rot={[0, -0.3, 0]} />
    </Stage>,

    // 21 goodbye, like and follow
    21: ({ dur }) => <Stage look={plantLook} dur={dur} cam={cam([0, 2.2, 7.6], [0, 1.6, 0], 44, [0, 2.5, 8.6], [0, 1.7, 0])}>
      <Plant />
      <Guide pos={[-0.8, 0, 0.4]} pose={{ armR: "wave", face: "happy" }} />
      <Fan pos={[0.85, 0, 0.1]} pose={{ face: "happy", armL: "wave" }} />
      <Links pos={[0, 0.25, 1.5]} n={4} len={0.6} r={0.1} casing={false} ink />
    </Stage>,
  };
};

// shot 7 (second half): a cooked sausage that "sweats" fat beads
const SweatSausage: React.FC<{ start: number }> = ({ start }) => {
  const t = useT();
  const k = ramp(t, start, start + 1.4);
  return <Sausage pos={[0.2, 0.25, 2.0]} rot={[0, -0.2, 0]} len={1.3} r={0.17} sweat={k} ink />;
};

// shot 16: the sausage next to the phone peels a beat after the film
const PeelLater: React.FC = () => {
  const t = useT();
  return <Sausage pos={[0.3, 1.18, 0.8]} rot={[0, 0, 0.1]} len={0.8} r={0.14} casing peel={ramp(t, 1.2, 2.2)} ink />;
};
