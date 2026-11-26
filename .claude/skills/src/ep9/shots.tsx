import React from "react";
import { Toon } from "../engine/Toon";
import { Stage } from "../engine/Stage";
import type { V3 } from "../engine/Stage";
import type { Arm, Expression, Prop } from "../engine/draw";
import { CommentCard, type AvatarStyle } from "../engine/CommentCard";
import { Box } from "../engine/kit";
import { fan, guide } from "./cast";
import {
  Arrow, Ball, Bearing, Card, Cushion, Earth, Furnace, Header, Magnifier, Mill, Plates, Sorter, Space, SquashTest, StepSign, Studio, Tray, WireBit, useT,
} from "./sets";
import { cam, closeLook, ease, furnaceLook, labLook, millLook, ramp, spaceLook, studioLook } from "./world";
import esShots from "../../episodes/ep9_es/shots.json";
import enShots from "../../episodes/ep9_en/shots.json";

export type Lang = "en" | "es";
type P = { dur: number };
type Pose = { face?: Expression; armL?: Arm; armR?: Arm; look?: number; talk?: boolean; prop?: Prop };

const Guide: React.FC<{ pos: V3; h?: number; pose?: Pose; seed?: number }> = ({ pos, h = 2.5, pose = {}, seed = 3 }) => (
  <Toon spec={guide} pos={pos} h={h} seed={seed} pose={{ armL: "down", armR: "down", talk: true, ...pose }} />
);
const Fan: React.FC<{ pos: V3; h?: number; pose?: Pose; seed?: number }> = ({ pos, h = 2.4, pose = {}, seed = 9 }) => (
  <Toon spec={fan} pos={pos} h={h} seed={seed} pose={{ armL: "down", armR: "down", ...pose }} />
);

// shot 1: a mirror ball spins in the studio; a hammer drops and smacks it at ~55 % of the line
const HookBall: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useT();
  const s = dur / 30;
  const hit = s * 0.55;
  const down = t < hit ? ease(ramp(t, hit - 0.35, hit)) : 1 - ease(ramp(t, hit + 0.1, hit + 0.6));
  const kick = t > hit ? Math.exp(-(t - hit) * 6) : 0;
  return (
    <group>
      <Ball pos={[0, 1.9 + Math.sin(t * 2.2) * 0.05 - kick * 0.12, 0]} r={0.75} spin={1.1} squash={kick * 0.25} />
      <group position={[0.15, 1.9 + 0.75 + 0.3 + (1 - down) * 2.6, 0]} rotation={[0, 0, 0.08]}>
        <Box size={[1.3, 0.55, 0.7]} color="#3a3f46" rough={0.4} ink />
        <Box size={[0.16, 2.2, 0.16]} pos={[0, 1.35, 0]} color="#c98a45" rough={0.7} ink />
      </group>
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

const Pedestal: React.FC<{ pos: V3; w?: number; h?: number }> = ({ pos, w = 1.2, h = 1.0 }) => (
  <Box size={[w, h, w]} pos={[pos[0], h / 2, pos[2]]} color="#3f6f9a" rough={0.5} />
);

export const makeShots = (lang: Lang): Record<number, React.FC<P>> => {
  const c = commentFor(lang);
  return {
    // 1 hook: studio close-up of a mirror steel ball; a hammer smacks it ("made by smashing")
    1: ({ dur }) => <Stage look={studioLook} dur={dur} cam={cam([0.15, 2.1, 6.4], [0, 2.1, 0], 40, [0, 2.15, 5.5], [0, 2.1, 0])}>
      <Studio />
      <HookBall dur={dur} />
    </Stage>,

    // 2 "relax, today I'll show you how": the guide presents a bearing on a pedestal
    2: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0.2, 2.1, 7.6], [0, 1.5, 0], 44, [0, 1.9, 6.5], [0, 1.5, 0])}>
      <Mill />
      <Guide pos={[-0.85, 0, 0.5]} pose={{ armR: "point", face: "smirk", look: 0.7 }} />
      <Pedestal pos={[0.95, 0, 0.6]} w={1.1} h={0.9} />
      <Bearing pos={[0.95, 1.55, 0.6]} scale={0.5} rot={[0, -0.35, 0]} />
    </Stage>,

    // 3 three facts + a locked fourth: 20 t press, 840 °C furnace… and "4"
    3: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([3.4, 7.2, 12.5], [0, 2.4, -1], 46, [2.4, 6.4, 10.6], [0, 2.4, -1])}>
      <Mill />
      <Header pos={[-2.4, 0, 1.2]} />
      <Card pos={[-0.9, 5.6, 1.6]} lines={["20 t"]} w={1.6} h={0.7} bg="#173846" fg="#ffe6ad" />
      <Furnace pos={[2.6, 0, -2.6]} />
      <Card pos={[1.4, 4.6, -1.6]} lines={["840 °C"]} w={2.0} h={0.7} bg="#4a2430" fg="#ffe6ad" />
      <StepSign n="4" pos={[1.6, 3.3, 2.2]} size={1.4} />
    </Stage>,

    // 4 literal definition: hard, round, shiny… a pair, or a hundred
    4: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 5.4, 10.4], [0, 1.2, 0.8], 44, [0, 5.0, 9.6], [0, 1.2, 0.8])}>
      <Mill />
      <Fan pos={[-1.2, 0, 2.6]} h={2.1} pose={{ face: "troll", look: 0.6 }} />
      <Guide pos={[1.2, 0, 2.6]} h={2.1} pose={{ armL: "point", face: "poker", look: -0.6 }} />
      <Box size={[2.6, 0.9, 2.6]} pos={[0, 0.45, 0.6]} color="#d7dde3" rough={0.35} />
      <Tray pos={[0, 0.97, 0.6]} fill={(t) => ease(ramp(t, dur / 30 * 0.62, dur / 30 * 0.92))} />
    </Stage>,

    // 5 "how do they get them so round?": guide close, pull back to the machines
    5: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0, 2.3, 6.8], [0, 1.9, 0], 44, [0, 3.4, 10.4], [0, 2.2, -1])}>
      <Mill />
      <Header pos={[-2.6, 0, -3.2]} />
      <Plates pos={[2.6, 0, -3.6]} />
      <Guide pos={[0, 0, 0.8]} pose={{ armR: "point", face: "suspicious", look: 0.4 }} />
    </Stage>,

    // 6 step 1: wire chunks slammed between two cups
    6: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0.4, 3.4, 11.4], [0, 2.6, 0], 44, [0.1, 3.1, 10.4], [0, 2.6, 0])}>
      <Mill />
      <Header />
      <StepSign n="1" pos={[1.7, 4.3, 0.8]} size={1.0} />
    </Stage>,

    // 7 up to 20 t; out comes a ball with a ring, like Saturn
    7: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 2.3, 6.4], [0, 2.1, 0], 42, [0, 2.2, 5.6], [0, 2.1, 0])}>
      <Mill />
      <Ball pos={[0, 2.0, 0]} r={0.6} ring={1} raw spin={0.5} rot={[0.42, 0, 0.18]} />
      <Card pos={[0, 3.25, -0.4]} lines={["20 t"]} w={1.1} h={0.5} bg="#173846" fg="#ffe6ad" />
    </Stage>,

    // 8 step 2: rolling between grooved plates until the ring is gone
    8: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0.3, 5.2, 10.6], [0, 1.9, 0], 44, [0.1, 4.8, 9.6], [0, 1.9, 0])}>
      <Mill />
      <Plates ring={(t) => 1 - ramp(t, 0.3, dur / 30 - 0.4)} />
      <StepSign n="2" pos={[0, 4.6, -1.4]} size={1.0} />
    </Stage>,

    // 9 wink: the more they rub them, the harder they get (guide smirks, arms crossed)
    9: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 2.9, 10.2], [0, 1.9, 0], 44, [0, 2.8, 9.4], [0, 1.9, 0])}>
      <Mill />
      <Plates pos={[0.4, 0, -1.4]} ring={0} balls={12} lift={0.75} />
      <Guide pos={[-0.9, 0, 1.6]} h={2.3} pose={{ face: "smirk", armL: "cross", armR: "cross", look: 0.7 }} />
      <Card pos={[0.6, 4.5, -1.6]} lines={["HRC ↑"]} w={1.6} h={0.65} bg="#173846" fg="#ffe6ad" />
    </Stage>,

    // 10 step 3: furnace at 840 °C, then the oil bath
    10: ({ dur }) => <Stage look={furnaceLook} dur={dur} cam={cam([0.2, 3.2, 12.4], [0, 2.1, 0], 44, [0.1, 3.0, 11.4], [0, 2.1, 0])}>
      <Mill />
      <Furnace />
      <StepSign n="3" pos={[1.3, 4.0, -0.6]} size={1.0} />
      <Card pos={[-1.2, 3.75, 1.15]} lines={["840 °C"]} w={1.8} h={0.65} bg="#4a2430" fg="#ffe6ad" />
    </Stage>,

    // 11 twist: if the hardening fails, the soft ball gets squashed
    11: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.2, 2.6, 8.4], [0, 2.2, 0], 44, [0.1, 2.5, 7.6], [0, 2.2, 0])}>
      <Mill />
      <SquashTest squash={(t) => ease(ramp(t, dur / 30 * 0.35, dur / 30 * 0.75))} />
      <Card pos={[0, 4.45, 0.9]} lines={["< 58 HRC"]} w={2.0} h={0.65} bg="#4a2430" fg="#ffe6ad" />
    </Stage>,

    // 12 viewer comment appears in the guide's world
    12: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0, 2.0, 7.8], [0, 1.8, 0], 44, [0, 2.1, 7.0], [0, 1.9, 0])}>
      <Mill />
      <Guide pos={[-0.95, 0, 0.3]} pose={{ armR: "point", face: "smirk", look: 0.8 }} />
      <CommentPop c={c} />
    </Stage>,

    // 13 read the comment
    13: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.35, 2.35, 5.2], [0.35, 2.35, 1.4], 46, [0.35, 2.35, 4.7], [0.35, 2.35, 1.4])}>
      <Mill />
      <Guide pos={[-0.95, 0, 0.3]} pose={{ armR: "point", face: "skeptical", look: 0.8 }} />
      <CommentPop c={c} pop={false} />
    </Stage>,

    // 14 answer: thousands of rpm — one bump and the whole bearing shakes
    14: ({ dur }) => <Stage look={labLook} dur={dur} cam={cam([0, 2.3, 6.6], [0, 2.0, 0], 44, [0, 2.2, 5.9], [0, 2.0, 0])}>
      <Mill />
      <Pedestal pos={[0, 0, 0]} w={1.6} h={0.9} />
      <Bearing pos={[0, 2.05, 0]} scale={0.95} spin={9} bad wobble={(t) => ramp(t, dur / 30 * 0.5, dur / 30 * 0.6)} rot={[0, 0, 0]} />
      <Card pos={[0, 3.6, -0.6]} lines={["rpm ×1000"]} w={1.9} h={0.55} bg="#173846" fg="#ffe6ad" />
    </Stage>,

    // 15 step 4: lapping — softer bronze plates and abrasive paste
    15: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0.3, 5.2, 10.6], [0, 1.9, 0], 44, [0.1, 4.8, 9.6], [0, 1.9, 0])}>
      <Mill />
      <Plates ring={0} lap spin={0.5} />
      <StepSign n="4" pos={[0, 4.6, -1.4]} size={1.0} />
    </Stage>,

    // 16 proof: under the magnifier, the profile closes — 80 nm
    16: ({ dur }) => <Stage look={labLook} dur={dur} cam={cam([0.1, 2.4, 8.6], [0, 2.3, 0], 44, [0.05, 2.35, 7.8], [0, 2.3, 0])}>
      <Mill />
      <Magnifier pos={[0, 2.1, 0]} trace={(t) => ramp(t, 0.2, dur / 30 - 0.4)} />
      <Card pos={[0, 4.0, -0.6]} lines={["80 nm"]} w={1.6} h={0.65} bg="#173846" fg="#ffe6ad" />
    </Stage>,

    // 17 comparison: a 1 cm ball blown up to Earth size — its tallest mountain is ~100 m
    17: ({ dur }) => <Stage look={spaceLook} dur={dur} cam={cam([0, 2.4, 8.8], [0, 2.5, 0], 44, [0, 2.5, 8.2], [0, 2.55, 0])}>
      <Space />
      <Earth pos={[0, 2.0, 0]} r={1.7} morph={(t) => ramp(t, dur / 30 * 0.25, dur / 30 * 0.3)} />
      <Card pos={[0, 4.9, -0.4]} lines={["1 cm → 12 742 km"]} w={3.0} h={0.6} bg="#173846" fg="#ffe6ad" />
      <Card pos={[0, 0.0, 0.6]} lines={["▲ 100 m"]} w={1.7} h={0.6} bg="#4a2430" fg="#ffe6ad" />
    </Stage>,

    // 18 sorted by size — every ball in a bearing is a twin
    18: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0.1, 3.0, 12.0], [0, 1.7, 0], 44, [0.05, 2.9, 11.2], [0, 1.7, 0])}>
      <Mill />
      <Sorter />
      <Card pos={[-1.4, 0.55, 0.72]} lines={["−1 µm"]} w={0.9} h={0.36} bg="#fff6dc" fg="#173846" />
      <Card pos={[0, 0.55, 0.72]} lines={["0"]} w={0.9} h={0.36} bg="#fff6dc" fg="#173846" />
      <Card pos={[1.4, 0.55, 0.72]} lines={["+1 µm"]} w={0.9} h={0.36} bg="#fff6dc" fg="#173846" />
    </Stage>,

    // 19 before / after: a scrap of wire → a perfect ball with your friend's name
    19: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 3.0, 7.6], [0, 1.3, 0.6], 44, [0, 2.8, 7.0], [0, 1.3, 0.6])}>
      <Mill />
      <Box size={[3.2, 0.9, 1.6]} pos={[0, 0.45, 0.6]} color="#e3e8ee" rough={0.35} />
      <WireBit pos={[-1.0, 1.12, 0.6]} />
      <Arrow pos={[0.0, 1.25, 0.9]} len={0.35} />
      <Ball pos={[1.0, 1.35, 0.6]} r={0.45} spin={0.6} />
      <Card pos={[0.6, 0.5, 1.42]} lines={["@ ______"]} w={1.1} h={0.42} bg="#fff6dc" fg="#c0392b" />
    </Stage>,

    // 20 tag your friend: the fan proudly shows his perfect pair on a cushion
    20: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.3, 2.1, 6.4], [0, 1.6, 0], 44, [0.1, 2.0, 5.6], [0, 1.6, 0])}>
      <Mill />
      <Fan pos={[-0.85, 0, 0.2]} pose={{ face: "proud", armR: "up", look: 0.6 }} />
      <Cushion pos={[0.65, 0, 0.9]} scale={0.8} tag />
    </Stage>,

    // 21 goodbye, like and follow
    21: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0, 2.2, 7.6], [0, 1.6, 0], 44, [0, 2.5, 8.6], [0, 1.7, 0])}>
      <Mill />
      <Guide pos={[-0.8, 0, 0.4]} pose={{ armR: "wave", face: "happy" }} />
      <Fan pos={[0.85, 0, 0.1]} pose={{ face: "happy", armL: "wave" }} />
      <Bearing pos={[0, 0.55, 1.5]} scale={0.42} rot={[-0.9, 0, 0]} />
    </Stage>,
  };
};
