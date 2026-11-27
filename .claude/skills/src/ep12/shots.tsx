import React from "react";
import { Toon } from "../engine/Toon";
import { Stage } from "../engine/Stage";
import type { V3 } from "../engine/Stage";
import type { Arm, Expression, Prop } from "../engine/draw";
import { CommentCard, type AvatarStyle } from "../engine/CommentCard";
import { Box } from "../engine/kit";
import { friend, operator } from "./cast";
import { Arrow, Bin, Card, Cross, Grain, HeadPress, MACHINE, Mill, Roller, Screw, StepSign, Stream, Studio, WireFeed, useT } from "./sets";
import { cam, closeLook, ease, labLook, millLook, ramp, studioLook } from "./world";
import esShots from "../../episodes/ep12_es/shots.json";
import enShots from "../../episodes/ep12_en/shots.json";

export type Lang = "en" | "es";
type P = { dur: number };
type Pose = { face?: Expression; armL?: Arm; armR?: Arm; look?: number; talk?: boolean; prop?: Prop };

const Op: React.FC<{ pos: V3; h?: number; pose?: Pose; seed?: number }> = ({ pos, h = 2.4, pose = {}, seed = 4 }) => (
  <Toon spec={operator} pos={pos} h={h} seed={seed} pose={{ armL: "down", armR: "down", talk: true, ...pose }} />
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

const Pedestal: React.FC<{ pos: V3; w?: number; h?: number }> = ({ pos, w = 1.0, h = 0.8 }) => (
  <Box size={[w, h, w]} pos={[pos[0], h / 2, pos[2]]} color="#5a8fb8" rough={0.5} ink />
);

const Pop: React.FC<{ at: number; to?: number; pos: V3; children: React.ReactNode }> = ({ at, to, pos, children }) => {
  const k = ease(ramp(useT(), at, to ?? at + 0.35));
  return <group position={pos} scale={0.01 + 0.99 * k}>{children}</group>;
};

export const makeShots = (lang: Lang): Record<number, React.FC<P>> => {
  const c = commentFor(lang);
  const sec = (dur: number) => dur / 30;
  return {
    // 1 hook: the thread appears on the screw as it rolls between the dies — no blade anywhere
    1: ({ dur }) => <Stage look={studioLook} dur={dur} cam={cam([0.05, 2.35, 4.4], [0, 1.8, 0], 40, [0.02, 2.15, 3.5], [0, 1.8, 0])}>
      <Studio />
      <Roller pos={[0, 0, 0]} period={sec(dur) * 0.95} />
    </Stage>,

    // 2 goes in smooth… comes out threaded
    2: ({ dur }) => <Stage look={studioLook} dur={dur} cam={cam([0, 1.7, 5.6], [0, 1.4, 0], 42, [0, 1.6, 5.0], [0, 1.4, 0])}>
      <Studio />
      <Pedestal pos={[-0.75, 0, 0]} />
      <Screw pos={[-0.75, 0.8, 0]} len={1.1} r={0.12} thread={0} spin={0.6} />
      <Arrow pos={[0.02, 1.4, 0.3]} len={0.4} />
      <Pedestal pos={[0.75, 0, 0]} />
      <Screw pos={[0.75, 0.8, 0]} len={1.1} r={0.12} thread={(t) => ease(ramp(t, 0.2, sec(dur) * 0.55))} spin={0.6} />
    </Stage>,

    // 3 wire, blows, pressure… and a fourth detail
    3: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0.6, 4.2, 11.8], [0, 1.9, 0], 44, [0.3, 3.8, 10.6], [0, 1.9, 0])}>
      <Mill />
      <group position={[-1.7, 0, -0.6]} scale={0.6}><WireFeed /></group>
      <HeadPress pos={[0.2, 0, -2.6]} scale={0.6} />
      <Roller pos={[1.5, 0, 0.9]} scale={0.65} />
      <StepSign n="4" pos={[-0.6, 3.2, 2.2]} size={0.9} />
    </Stage>,

    // 4 it starts as steel wire; a blade chops it into blanks
    4: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.5, 2.0, 6.6], [0.3, 1.1, 0], 44, [0.3, 1.8, 5.8], [0.3, 1.1, 0])}>
      <Mill />
      <WireFeed pos={[-0.55, 0, 0]} />
    </Stage>,

    // 5 cold heading: the ram hits, the head swells
    5: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.2, 2.6, 8.4], [0, 2.2, 0], 44, [0.1, 2.5, 7.4], [0, 2.1, 0])}>
      <Mill />
      <HeadPress pos={[0.35, 0, 0]} scale={0.8} period={1.1} />
      <Op pos={[-1.3, 0, 1.4]} h={2.3} pose={{ armR: "point", face: "smirk", look: 0.8 }} />
      <Card pos={[0.35, 4.75, 0.4]} lines={["≈ 20 °C"]} w={1.7} h={0.6} bg="#173846" fg="#bfe0ff" />
    </Stage>,

    // 6 the thread: it rolls between two steel dies that squeeze it
    6: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0.4, 2.6, 7.4], [0.2, 1.6, 0], 44, [0.2, 2.4, 6.6], [0.3, 1.6, 0])}>
      <Mill />
      <Roller pos={[0.55, 0, 0]} period={1.4} />
      <Op pos={[-1.15, 0, 1.6]} h={2.3} pose={{ armR: "point", face: "proud", look: 0.8 }} />
    </Stage>,

    // 7 one pass, up to 500 a minute — screws pour into the bin
    7: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0.3, 3.0, 8.4], [0.2, 1.8, 0], 44, [0.2, 2.8, 7.6], [0.2, 1.8, 0])}>
      <Mill />
      <Roller pos={[-0.55, 0, -0.2]} scale={0.8} period={0.45} />
      <Stream from={[0.2, 1.4, 0.3]} to={[1.05, 0.8, 0.9]} n={7} rate={2.2} />
      <Bin pos={[1.1, 0, 0.9]} />
      <Card pos={[0.2, 3.7, -0.3]} lines={["500 / min"]} w={2.3} h={0.7} bg="#173846" fg="#ffe6ad" />
    </Stage>,

    // 8 viewer comment
    8: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0, 2.0, 7.8], [0, 1.8, 0], 44, [0.3, 2.3, 5.6], [0.35, 2.3, 1.4])}>
      <Mill />
      <Op pos={[-0.95, 0, 0.3]} pose={{ armR: "point", face: "skeptical", look: 0.8 }} />
      <CommentPop c={c} />
    </Stage>,

    // 9 cut vs rolled: cutting slices the fibres (chips fly), rolling makes them follow the thread
    9: ({ dur }) => <Stage look={labLook} dur={dur} cam={cam([0, 2.3, 6.6], [0, 2.2, 0], 44, [0, 2.3, 6.0], [0, 2.2, 0])}>
      <Mill />
      <Grain pos={[0, 3.1, 0]} mode="cut" />
      <Cross pos={[0, 3.2, 0.25]} on={(t) => ramp(t, sec(dur) * 0.3, sec(dur) * 0.45)} s={0.65} />
      <Grain pos={[0, 1.25, 0]} mode="rolled" glow={(t) => ramp(t, sec(dur) * 0.55, sec(dur) * 0.8)} />
    </Stage>,

    // 10 the fourth detail: up to 30 % stronger, not a gram lost
    10: ({ dur }) => <Stage look={labLook} dur={dur} cam={cam([0, 2.3, 6.4], [0, 2.1, 0], 44, [0, 2.3, 5.8], [0, 2.1, 0])}>
      <Mill />
      <group position={[0, 1.6, 0]} scale={1.25}><Grain mode="rolled" glow={1} /></group>
      <Pop at={sec(dur) * 0.15} pos={[0, 3.55, 0.3]}><Card pos={[0, 0, 0]} lines={["+30 %"]} w={1.8} h={0.7} bg="#173846" fg="#ffe6ad" /></Pop>
      <Pop at={sec(dur) * 0.6} pos={[0, 0.25, 0.4]}><Card pos={[0, 0, 0]} lines={["0 g"]} w={1.2} h={0.55} bg="#2f6b3a" fg="#ffe6ad" /></Pop>
    </Stage>,

    // 11 tag your friend who over-tightens everything
    11: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.2, 2.0, 7.4], [0.1, 1.5, 0], 44, [0.1, 1.9, 6.6], [0.1, 1.5, 0])}>
      <Mill />
      <Box size={[1.6, 0.9, 1.0]} pos={[0.85, 0.45, 0]} color="#a07848" rough={0.8} ink />
      <Screw pos={[0.85, 0.75, 0.1]} len={0.9} r={0.16} spin={6} />
      <Friend pos={[-0.85, 0, 0.7]} pose={{ face: "rage", armR: "show", prop: "wrench", look: 0.8 }} />
      <Card pos={[0.85, 2.55, 0.2]} lines={["@ ______"]} w={1.5} h={0.5} bg="#fff6dc" fg="#c0392b" />
    </Stage>,

    // 12 goodbye, like and follow
    12: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0, 2.2, 7.8], [0, 1.7, 0], 44, [0, 2.6, 9.0], [0, 1.9, 0])}>
      <Mill />
      <Op pos={[-0.85, 0, 0.4]} pose={{ armR: "wave", face: "happy" }} />
      <Friend pos={[0.9, 0, 0.1]} pose={{ face: "happy", armL: "wave" }} />
      <Bin pos={[0, 0, 1.6]} n={20} />
    </Stage>,
  };
};

export { MACHINE };
