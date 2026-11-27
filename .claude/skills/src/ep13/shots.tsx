import React from "react";
import { Toon } from "../engine/Toon";
import { Stage } from "../engine/Stage";
import type { V3 } from "../engine/Stage";
import type { Arm, Expression, Prop } from "../engine/draw";
import { CommentCard, type AvatarStyle } from "../engine/CommentCard";
import { Box } from "../engine/kit";
import { friend, worker } from "./cast";
import { Apple, Arrow, Bag, Banana, Card, Cross, GasCloud, Hand, Kitchen, Pallet, Room, Sea, Ship, StepSign, Thermo, useT } from "./sets";
import { cam, closeLook, ease, gasLook, kitchenLook, ramp, roomLook, seaLook } from "./world";
import esShots from "../../episodes/ep13_es/shots.json";
import enShots from "../../episodes/ep13_en/shots.json";

export type Lang = "en" | "es";
type P = { dur: number };
type Pose = { face?: Expression; armL?: Arm; armR?: Arm; look?: number; talk?: boolean; prop?: Prop };

const Worker: React.FC<{ pos: V3; h?: number; pose?: Pose; seed?: number }> = ({ pos, h = 2.4, pose = {}, seed = 5 }) => (
  <Toon spec={worker} pos={pos} h={h} seed={seed} pose={{ armL: "down", armR: "down", talk: true, ...pose }} />
);
const Friend: React.FC<{ pos: V3; h?: number; pose?: Pose; seed?: number }> = ({ pos, h = 2.35, pose = {}, seed = 9 }) => (
  <Toon spec={friend} pos={pos} h={h} seed={seed} pose={{ armL: "down", armR: "down", ...pose }} />
);

type Comment = { username: string; question: string; avatarStyle?: AvatarStyle; seed?: number };
const commentFor = (lang: Lang): Comment => {
  const list = (lang === "es" ? esShots : enShots) as Array<{ comment?: Comment }>;
  return list.find((s) => s.comment)!.comment!;
};
const CommentPop: React.FC<{ c: Comment }> = ({ c }) => {
  const t = useT();
  const k = 0.6 + 0.4 * (1 - Math.pow(1 - ramp(t, 0, 0.35), 3));
  return <CommentCard username={c.username} question={c.question} avatarStyle={c.avatarStyle} seed={c.seed} position={[0.35, 2.35, 1.4]} rotation={[0, -0.12, 0]} scale={0.9 * k} />;
};
const Pop: React.FC<{ at: number; pos: V3; children: React.ReactNode }> = ({ at, pos, children }) => {
  const k = ease(ramp(useT(), at, at + 0.35));
  return <group position={pos} scale={0.01 + 0.99 * k}>{children}</group>;
};
const Pedestal: React.FC<{ pos: V3; w?: number; h?: number }> = ({ pos, w = 1.6, h = 0.9 }) => (
  <Box size={[w, h, w * 0.7]} pos={[pos[0], h / 2, pos[2]]} color="#5a8fb8" rough={0.5} ink />
);

export const makeShots = (lang: Lang): Record<number, React.FC<P>> => {
  const c = commentFor(lang);
  const sec = (dur: number) => dur / 30;
  return {
    // 1 hook (H1: first frame = the object filling the screen): green bananas, then the camera pulls back into the gas room
    1: ({ dur }) => <Stage look={gasLook} dur={dur} cam={cam([0.05, 1.95, 3.0], [0, 1.6, 0], 44, [0.2, 2.3, 7.2], [0, 1.8, 0])}>
      <Room door={(t) => ramp(t, sec(dur) * 0.6, sec(dur) * 0.95)} />
      <Pedestal pos={[0, 0, 0]} w={1.8} h={1.1} />
      <Hand pos={[0.1, 1.55, 0]} s={0.95} ripe={0} rot={[0, -0.2, 0]} />
      <GasCloud pos={[0, 2.2, 0]} w={4.5} h={3} d={3} n={24} on={(t) => ramp(t, sec(dur) * 0.25, sec(dur) * 0.9)} />
    </Stage>,

    // 2 relax: it's how they turn yellow
    2: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 2.0, 5.4], [0, 1.5, 0], 42, [0, 1.9, 4.8], [0, 1.5, 0])}>
      <Room />
      <Pedestal pos={[0, 0, 0]} />
      <Hand pos={[0.1, 1.45, 0]} s={0.8} ripe={(t) => ease(ramp(t, 0.1, sec(dur) - 0.2))} />
    </Stage>,

    // 3 ship at 13 °C, sealed room, invisible gas… and a trick for home
    3: ({ dur }) => <Stage look={roomLook} dur={dur} cam={cam([0.4, 3.0, 9.4], [0, 2.0, 0], 44, [0.2, 2.8, 8.6], [0, 2.0, 0])}>
      <Room />
      <Pallet pos={[0.5, 0, -1.6]} />
      <Thermo pos={[-1.4, 2.0, 0.6]} level={0.45} />
      <Card pos={[-1.4, 3.35, 0.6]} lines={["13 °C"]} w={1.3} h={0.55} bg="#173846" fg="#bfe0ff" />
      <GasCloud pos={[0.5, 2.6, -1.4]} w={2.6} h={1.6} d={1.6} n={12} on={(t) => ramp(t, sec(dur) * 0.4, sec(dur) * 0.65)} />
      <StepSign n="4" pos={[1.4, 1.7, 1.6]} size={0.9} />
    </Stage>,

    // 4 picked green, across the ocean at ~13 °C
    4: ({ dur }) => <Stage look={seaLook} dur={dur} cam={cam([-1.0, 2.6, 11.5], [0, 1.6, 0], 44, [0.8, 2.4, 10.5], [0.4, 1.6, 0])}>
      <Sea />
      <Ship pos={[0, 0, -1]} scale={0.45} />
      <Card pos={[0.4, 4.6, -1]} lines={["13 °C"]} w={1.6} h={0.65} bg="#173846" fg="#bfe0ff" />
    </Stage>,

    // 5 not one degree lower: below 13 °C the peel goes grey
    5: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 2.1, 6.4], [0, 1.6, 0], 44, [0, 2.0, 5.8], [0, 1.6, 0])}>
      <Room />
      <Pedestal pos={[0, 0, 0]} w={2.6} h={0.9} />
      <Hand pos={[-0.7, 1.35, 0]} s={0.55} ripe={0} />
      <Hand pos={[0.75, 1.35, 0]} s={0.55} grey={(t) => ease(ramp(t, sec(dur) * 0.3, sec(dur) * 0.7))} />
      <Thermo pos={[0.75, 2.75, -0.3]} s={0.55} level={(t) => 0.5 - ramp(t, 0.2, sec(dur) * 0.5) * 0.3} cold />
      <Card pos={[-0.7, 2.6, -0.3]} lines={["13 °C"]} w={1.1} h={0.45} bg="#2f6b3a" fg="#ffe6ad" />
      <Cross pos={[0.75, 1.5, 0.6]} on={(t) => ramp(t, sec(dur) * 0.65, sec(dur) * 0.85)} s={0.45} />
    </Stage>,

    // 6 into the ripening room: door shut, ethylene in from the nozzle
    6: ({ dur }) => <Stage look={roomLook} dur={dur} cam={cam([0.3, 2.6, 9.0], [0.3, 2.0, 0], 44, [0.2, 2.5, 8.2], [0.3, 2.0, 0])}>
      <Room door={(t) => ramp(t, 0.1, sec(dur) * 0.5)} />
      <Pallet pos={[0.6, 0, -1.6]} />
      <GasCloud pos={[0.6, 2.4, -1.2]} w={3.2} h={2.4} d={2} n={18} on={(t) => ramp(t, sec(dur) * 0.45, sec(dur))} from={[1.6, 4.9, -5.4]} />
      <Worker pos={[-1.2, 0, 1.4]} h={2.3} pose={{ armR: "point", face: "smirk", look: 0.8 }} />
    </Stage>,

    // 7 a whiff: 100–150 ppm, for 24–48 h
    7: ({ dur }) => <Stage look={gasLook} dur={dur} cam={cam([0, 2.6, 8.4], [0, 2.2, 0], 44, [0, 2.5, 7.6], [0, 2.2, 0])}>
      <Room />
      <Pallet pos={[0, 0, -1.4]} ripe={(t) => ramp(t, 0, sec(dur)) * 0.5} />
      <GasCloud pos={[0, 2.4, -0.8]} w={3.4} h={3} d={2.4} n={14} s={0.1} />
      <Pop at={sec(dur) * 0.1} pos={[0, 4.4, 0.4]}><Card pos={[0, 0, 0]} lines={["100–150 ppm"]} w={2.7} h={0.7} bg="#173846" fg="#bff0e0" /></Pop>
      <Pop at={sec(dur) * 0.6} pos={[0, 3.55, 0.6]}><Card pos={[0, 0, 0]} lines={["24–48 h"]} w={1.9} h={0.6} bg="#2f6b3a" fg="#ffe6ad" /></Pop>
    </Stage>,

    // 8 viewer comment
    8: ({ dur }) => <Stage look={roomLook} dur={dur} cam={cam([0, 2.0, 7.8], [0, 1.8, 0], 44, [0.3, 2.3, 5.6], [0.35, 2.3, 1.4])}>
      <Room />
      <Worker pos={[-0.95, 0, 0.3]} pose={{ armR: "point", face: "skeptical", look: 0.8 }} />
      <CommentPop c={c} />
    </Stage>,

    // 9 it's the banana's own hormone: the banana breathes out the same molecules; they just add a nudge
    9: ({ dur }) => <Stage look={gasLook} dur={dur} cam={cam([0, 2.2, 6.6], [0, 2.0, 0], 44, [0, 2.2, 6.0], [0, 2.0, 0])}>
      <Room />
      <Pedestal pos={[0, 0, 0]} w={1.8} h={1.0} />
      <Banana pos={[0, 1.65, 0]} s={1.1} ripe={(t) => ramp(t, sec(dur) * 0.4, sec(dur))} />
      <GasCloud pos={[0, 2.6, 0]} w={2.4} h={1.4} d={1.2} n={10} from={[0, 1.7, 0]} on={(t) => ramp(t, 0, sec(dur) * 0.6)} />
      <Card pos={[0, 4.0, -0.4]} lines={["C₂H₄"]} w={1.4} h={0.6} bg="#173846" fg="#bff0e0" />
      <Arrow pos={[-1.25, 2.6, 0.2]} len={0.5} />
    </Stage>,

    // 10 the kitchen trick: paper bag + one apple
    10: ({ dur }) => <Stage look={kitchenLook} dur={dur} cam={cam([0, 2.5, 6.2], [0, 1.7, 0], 44, [0, 2.4, 5.6], [0, 1.7, 0])}>
      <Kitchen />
      <Bag pos={[-0.55, 1.12, 0]} s={0.9} />
      <Apple pos={[0.75, 1.42, 0.2]} s={1.0} />
      <Hand pos={[0.05, 1.5, 0.55]} s={0.42} ripe={(t) => ramp(t, 0.2, sec(dur)) * 0.6} />
      <GasCloud pos={[-0.2, 2.2, 0]} w={1.6} h={0.8} d={0.6} n={6} s={0.06} from={[0.75, 1.45, 0.2]} on={(t) => ramp(t, 0.2, sec(dur) * 0.8)} />
    </Stage>,

    // 11 tag your friend who always eats them green
    11: ({ dur }) => <Stage look={kitchenLook} dur={dur} cam={cam([0.2, 2.0, 7.0], [0.1, 1.6, 0], 44, [0.1, 1.9, 6.3], [0.1, 1.6, 0])}>
      <Kitchen />
      <Friend pos={[-0.7, 0, 1.4]} pose={{ face: "poker", armR: "show", look: 0.6 }} />
      <Banana pos={[-0.05, 1.55, 1.6]} s={0.45} rot={[0, 0, 1.2]} ripe={0} />
      <Hand pos={[0.85, 1.4, 0.2]} s={0.45} ripe={0} />
      <Card pos={[0.85, 2.55, -0.2]} lines={["@ ______"]} w={1.5} h={0.5} bg="#fff6dc" fg="#c0392b" />
    </Stage>,

    // 12 goodbye — ripe yellow pallet behind
    12: ({ dur }) => <Stage look={roomLook} dur={dur} cam={cam([0, 2.2, 7.8], [0, 1.7, 0], 44, [0, 2.6, 9.0], [0, 1.9, 0])}>
      <Room />
      <Pallet pos={[0, 0, -2.2]} ripe={1} />
      <Worker pos={[-0.85, 0, 0.4]} pose={{ armR: "wave", face: "happy" }} />
      <Friend pos={[0.9, 0, 0.1]} pose={{ face: "happy", armL: "wave" }} />
    </Stage>,
  };
};
