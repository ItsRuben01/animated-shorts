import React from "react";
import { Toon } from "../engine/Toon";
import { Stage } from "../engine/Stage";
import type { V3 } from "../engine/Stage";
import type { Arm, Expression, Prop } from "../engine/draw";
import { CommentCard, type AvatarStyle } from "../engine/CommentCard";
import { Box, Cyl } from "../engine/kit";
import { friend, operator } from "./cast";
import { Can, CanCut, Card, Conveyor, Cupper, Disc, DomeArrows, Ironer, Mill, Paper, PressureArrows, Seamer, StepSign, Studio, useT } from "./sets";
import { cam, closeLook, ease, labLook, millLook, ramp, studioLook } from "./world";
import esShots from "../../episodes/ep14_es/shots.json";
import enShots from "../../episodes/ep14_en/shots.json";

export type Lang = "en" | "es";
type P = { dur: number };
type Pose = { face?: Expression; armL?: Arm; armR?: Arm; look?: number; talk?: boolean; prop?: Prop };

const Op: React.FC<{ pos: V3; h?: number; pose?: Pose; seed?: number }> = ({ pos, h = 2.4, pose = {}, seed = 6 }) => (
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
const Pop: React.FC<{ at: number; pos: V3; children: React.ReactNode }> = ({ at, pos, children }) => {
  const k = ease(ramp(useT(), at, at + 0.35));
  return <group position={pos} scale={0.01 + 0.99 * k}>{children}</group>;
};
const Pedestal: React.FC<{ pos: V3; w?: number; h?: number }> = ({ pos, w = 1.4, h = 0.9 }) => (
  <Box size={[w, h, w * 0.7]} pos={[pos[0], h / 2, pos[2]]} color="#5a8fb8" rough={0.5} ink />
);

export const makeShots = (lang: Lang): Record<number, React.FC<P>> => {
  const c = commentFor(lang);
  const sec = (dur: number) => dur / 30;
  return {
    // 1 hook: a can next to a sheet of paper — same wall thickness
    1: ({ dur }) => <Stage look={studioLook} dur={dur} cam={cam([0.2, 1.9, 5.4], [0.1, 1.55, 0], 42, [0.1, 1.8, 4.6], [0.1, 1.55, 0])}>
      <Studio />
      <Pedestal pos={[0.1, 0, 0]} w={2.2} h={0.7} />
      <Can pos={[-0.35, 0.7, 0.1]} s={1.05} spin={0.5} />
      <Paper pos={[0.65, 0.7, -0.05]} rot={[0, -0.5, 0]} />
      <Pop at={sec(dur) * 0.4} pos={[0.1, 3.05, 0]}><Card pos={[0, 0, 0]} lines={["1/10 mm"]} w={1.9} h={0.65} bg="#173846" fg="#ffe6ad" /></Pop>
    </Stage>,

    // 2 relax: I'll show you how it's made
    2: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0.2, 2.1, 7.4], [0, 1.5, 0], 44, [0, 1.9, 6.5], [0, 1.5, 0])}>
      <Mill />
      <Op pos={[-0.85, 0, 0.5]} pose={{ armR: "point", face: "smirk", look: 0.7 }} />
      <Pedestal pos={[0.95, 0, 0.6]} w={1.3} h={0.9} />
      {[[-0.25, 0], [0.25, 0], [0, 0.4]].map(([x, z], i) => <Can key={i} pos={[0.95 + x, 0.9, 0.6 - z * 0.5]} s={0.55} spin={0} />)}
      <Can pos={[0.95, 1.67, 0.5]} s={0.55} spin={0.4} />
    </Stage>,

    // 3 a disc, a stretch, 2,000 a minute… and a 4th step
    3: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0.5, 3.4, 10.4], [0, 1.8, 0], 44, [0.3, 3.1, 9.6], [0, 1.8, 0])}>
      <Mill />
      <Conveyor pos={[0, 0, -1.6]} len={9} n={14} speed={1.6} />
      <Disc pos={[-1.3, 1.25, 1.2]} rot={[0.9, 0, 0]} r={0.5} />
      <Box size={[0.8, 1.1, 0.8]} pos={[-1.3, 0.55, 1.2]} color="#5a8fb8" rough={0.5} />
      <Card pos={[0.3, 3.4, -1.2]} lines={["2000 / min"]} w={2.6} h={0.7} bg="#173846" fg="#ffe6ad" />
      <StepSign n="4" pos={[1.4, 1.7, 1.6]} size={0.9} />
    </Stage>,

    // 4 a flat disc: one press and out pops a little cup
    4: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.2, 2.4, 8.6], [0, 1.8, 0], 44, [0.1, 2.3, 7.8], [0, 1.7, 0])}>
      <Mill />
      <Cupper pos={[0.3, 0, 0]} at={sec(dur) * 0.45} />
      <Op pos={[-1.3, 0, 1.5]} h={2.2} pose={{ armR: "point", face: "proud", look: 0.8 }} />
    </Stage>,

    // 5 rammed through rings: the wall ends up 1/10 mm
    5: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.2, 2.6, 7.6], [0.2, 1.5, 0], 44, [0.2, 2.4, 6.8], [0.4, 1.5, 0])}>
      <Mill />
      <Ironer pos={[0, 0, 0]} dur={sec(dur)} />
      <Pop at={sec(dur) * 0.7} pos={[0.6, 3.1, 0]}><Card pos={[0, 0, 0]} lines={["1/10 mm"]} w={1.9} h={0.65} bg="#173846" fg="#ffe6ad" /></Pop>
    </Stage>,

    // 6 the domed bottom holds the pressure like an arch
    6: ({ dur }) => <Stage look={labLook} dur={dur} cam={cam([0, 2.4, 5.6], [0, 2.0, 0], 42, [0, 2.3, 5.0], [0, 2.0, 0])}>
      <Mill />
      <Pedestal pos={[0, 0, 0]} w={1.4} h={1.05} />
      {/* can lying with its bottom facing the camera: the concave dome */}
      <group position={[0, 1.5, 0.2]} rotation={[-Math.PI / 2 + 0.35, 0, 0]}>
        <Can s={1.05} spin={0} />
        <Cyl r={0.3} h={0.012} pos={[0, -0.004, 0]} color="#9aa3ad" rough={0.3} seg={40} />
        <Cyl r={0.2} h={0.012} pos={[0, 0.0, 0]} color="#b8c0ca" rough={0.25} seg={40} />
        <Cyl r={0.08} h={0.012} pos={[0, 0.004, 0]} color="#d4dbe4" rough={0.2} seg={32} />
      </group>
      <PressureArrows pos={[0, 1.14, 0.7]} s={0.55} on={(t) => ramp(t, sec(dur) * 0.35, sec(dur) * 0.55)} />
    </Stage>,

    // 7 inside: a lining — the soda never touches the aluminium
    7: ({ dur }) => <Stage look={labLook} dur={dur} cam={cam([0, 2.1, 5.0], [0, 1.65, 0], 42, [0, 2.0, 4.4], [0, 1.65, 0])}>
      <Mill />
      <Pedestal pos={[0, 0, 0]} w={1.4} h={0.9} />
      <CanCut pos={[0, 0.9, 0]} s={1.15} fill={0.85} liner={(t) => ease(ramp(t, 0.2, sec(dur) * 0.55))} />
    </Stage>,

    // 8 viewer comment
    8: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0, 2.0, 7.8], [0, 1.8, 0], 44, [0.3, 2.3, 5.6], [0.35, 2.3, 1.4])}>
      <Mill />
      <Op pos={[-0.95, 0, 0.3]} pose={{ armR: "point", face: "skeptical", look: 0.8 }} />
      <CommentPop c={c} />
    </Stage>,

    // 9 it isn't: fill first, then the lid is seamed on in a split second
    9: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.2, 2.6, 6.4], [0, 2.0, 0], 44, [0.1, 2.5, 5.8], [0, 2.0, 0])}>
      <Mill />
      <Seamer pos={[0.3, 0, 0]} dur={sec(dur)} />
      <Op pos={[-1.25, 0, 1.3]} h={2.2} pose={{ armR: "point", face: "lol", look: 0.8 }} />
    </Stage>,

    // 10 the 4th step: the gas pushes from inside and makes it rock hard
    10: ({ dur }) => <Stage look={labLook} dur={dur} cam={cam([0, 2.2, 6.2], [0, 1.8, 0], 44, [0, 2.1, 5.6], [0, 1.8, 0])}>
      <Mill />
      <Pedestal pos={[0.5, 0, 0]} w={1.3} h={0.9} />
      <Can pos={[0.5, 0.9, 0]} s={1.0} spin={0.3} />
      <PressureArrows pos={[0.5, 0.9, 0]} on={(t) => ramp(t, 0.2, sec(dur) * 0.4)} />
      <Card pos={[0.5, 2.85, -0.2]} lines={["CO₂"]} w={1.2} h={0.55} bg="#173846" fg="#bfe0ff" />
      <Op pos={[-1.05, 0, 0.9]} h={2.3} pose={{ armR: "point", face: "proud", look: 0.8 }} />
    </Stage>,

    // 11 tag your friend who always shakes the can
    11: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.2, 2.0, 7.0], [0.1, 1.6, 0], 44, [0.1, 1.9, 6.3], [0.1, 1.6, 0])}>
      <Mill />
      <Friend pos={[-0.6, 0, 0.8]} pose={{ face: "troll", armR: "up", look: 0.6 }} />
      <Can pos={[0.05, 2.05, 1.0]} s={0.6} spin={0} shake={1} />
      <Card pos={[0.95, 2.6, 0]} lines={["@ ______"]} w={1.5} h={0.5} bg="#fff6dc" fg="#c0392b" />
    </Stage>,

    // 12 goodbye
    12: ({ dur }) => <Stage look={millLook} dur={dur} cam={cam([0, 2.2, 7.8], [0, 1.7, 0], 44, [0, 2.6, 9.0], [0, 1.9, 0])}>
      <Mill />
      <Conveyor pos={[0, 0, -2]} len={9} n={14} speed={1.2} />
      <Op pos={[-0.85, 0, 0.4]} pose={{ armR: "wave", face: "happy" }} />
      <Friend pos={[0.9, 0, 0.1]} pose={{ face: "happy", armL: "wave" }} />
    </Stage>,
  };
};
