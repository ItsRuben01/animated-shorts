import React from "react";
import { Toon } from "../engine/Toon";
import { Stage } from "../engine/Stage";
import type { V3 } from "../engine/Stage";
import type { Mouth, Eyes, Arm } from "../engine/draw";
import { CommentCard, type AvatarStyle } from "../engine/CommentCard";
import { Box } from "../engine/kit";
import { fan, worker } from "./cast";
import { Arrow, Card, Cucumber, Factory, Grader, Jar, PhMeter, Slicer, Soda, StepSign, Tank, Tunnel, Washer, XSlice, useT } from "./sets";
import { cam, closeLook, factoryLook, ramp, studioLook, warmLook, xrayLook } from "./world";
import { LAYER_FX } from "../engine/Stage";
import esShots from "../../episodes/ep7_es/shots.json";
import enShots from "../../episodes/ep7_en/shots.json";

export type Lang = "en" | "es";
type P = { dur: number };
type Pose = { eyes?: Eyes; mouth?: Mouth; armL?: Arm; armR?: Arm; look?: number };

const Worker: React.FC<{ pos: V3; h?: number; pose?: Pose; seed?: number }> = ({ pos, h = 2.5, pose = {}, seed = 3 }) => (
  <Toon spec={worker} pos={pos} h={h} seed={seed} pose={{ eyes: "dot", mouth: "flat", armL: "down", armR: "down", ...pose }} />
);
const Fan: React.FC<{ pos: V3; h?: number; pose?: Pose; seed?: number }> = ({ pos, h = 2.4, pose = {}, seed = 9 }) => (
  <Toon spec={fan} pos={pos} h={h} seed={seed} pose={{ eyes: "wide", mouth: "smile", armL: "down", armR: "down", ...pose }} />
);

// stretches the "veeery long" cucumber while the line is spoken
const LongCucumber: React.FC = () => {
  const t = useT();
  return <Cucumber pos={[0, 1.05, 1.3]} len={1.4 + ramp(t, 0.3, 2.6) * 2.2} r={0.26} ink />;
};

// shot 1: product-shot cucumber, tilted, spinning around the vertical axis and floating
const SpinCucumber: React.FC = () => {
  const t = useT();
  return (
    <group position={[0, 1.85 + Math.sin(t * 2.2) * 0.06, 0]} rotation={[0, t * 1.5, 0]}>
      <Cucumber rot={[0.15, 0, 0.95]} len={2.2} r={0.26} ink />
    </group>
  );
};

// studio sweep: deep blue-violet backdrop (never black), warm key spot + cool rim
const Studio: React.FC = () => (
  <group>
    <Box size={[30, 0.4, 30]} pos={[0, -0.2, 0]} color="#4a4e86" rough={0.85} bevel={false} />
    <Box size={[30, 16, 0.4]} pos={[0, 8, -5]} color="#555a94" rough={0.9} bevel={false} />
    <mesh position={[0, 2.2, -4.7]} layers={LAYER_FX}>
      <circleGeometry args={[2.0, 48]} />
      <meshBasicMaterial color="#b9bdf0" transparent opacity={0.3} depthWrite={false} toneMapped={false} />
    </mesh>
    <spotLight position={[-3, 6, 5]} color="#fff0d6" intensity={60} angle={0.55} penumbra={0.6} distance={20} decay={1.6} />
    <pointLight position={[2.5, 3.2, -1.5]} color="#9fb6ff" intensity={8} distance={8} decay={1.6} />
  </group>
);

type Comment = { username: string; question: string; avatarStyle?: AvatarStyle; seed?: number };
const commentFor = (lang: Lang): Comment => {
  const list = (lang === "es" ? esShots : enShots) as Array<{ comment?: Comment }>;
  return list.find((s) => s.comment)!.comment!;
};

const Comment: React.FC<{ c: Comment; pop?: boolean }> = ({ c, pop = true }) => {
  const t = useT();
  const k = pop ? 0.6 + 0.4 * (1 - Math.pow(1 - ramp(t, 0, 0.35), 3)) : 1;
  return <CommentCard username={c.username} question={c.question} avatarStyle={c.avatarStyle} seed={c.seed} position={[0.35, 2.35, 1.4]} rotation={[0, -0.12, 0]} scale={0.9 * k} />;
};

export const makeShots = (lang: Lang): Record<number, React.FC<P>> => {
  const c = commentFor(lang);
  const dec = (s: string) => (lang === "es" ? s.replace(".", ",") : s);
  return {
    // 1 hook: dramatic studio close-up of a shiny cucumber spinning in the air, "25 cm"
    1: ({ dur }) => <Stage look={studioLook} dur={dur} cam={cam([0.15, 2.0, 6.2], [0, 1.85, 0], 40, [0, 1.95, 5.4], [0, 1.85, 0])}>
      <Studio />
      <SpinCucumber />
      <Card pos={[0, 3.25, 0.6]} lines={["25 cm"]} w={0.95} h={0.36} bg="#173846" fg="#f7e8bc" />
    </Stage>,

    // 2 "today I bring you the solution": the guide presents a jar
    2: ({ dur }) => <Stage look={factoryLook} dur={dur} cam={cam([0.2, 2.1, 7.6], [0, 1.4, 0], 44, [0, 1.9, 6.5], [0, 1.4, 0])}>
      <Factory />
      <Worker pos={[-0.8, 0, 0.5]} pose={{ armR: "point", mouth: "smile", look: 0.7 }} />
      <Box size={[1.2, 0.8, 1.0]} pos={[0.85, 0.4, 0.6]} color="#2f6f8f" rough={0.6} />
      <Jar pos={[0.85, 0.8, 0.6]} scale={0.7} />
    </Stage>,

    // 3 three facts + a locked fourth: wash, 6 % salt, weeks in a tank, "4"
    3: ({ dur }) => <Stage look={factoryLook} dur={dur} cam={cam([3.4, 7.2, 11.5], [0, 2.4, -1], 46, [2.4, 6.2, 9.6], [0, 2.4, -1])}>
      <Factory />
      <Washer pos={[0, 0, 2.2]} />
      <Tank pos={[0.4, 0, -3.4]} />
      <StepSign n="4" pos={[-2.0, 3.6, -0.6]} size={1.6} />
    </Stage>,

    // 4 literal definition: a veeery long cucumber
    4: ({ dur }) => <Stage look={factoryLook} dur={dur} cam={cam([0, 2.1, 8.6], [0, 1.5, 0], 44, [0, 1.9, 7.6], [0, 1.4, 0])}>
      <Factory />
      <Fan pos={[-0.95, 0, -0.4]} pose={{ eyes: "wide", mouth: "o", look: 0.5 }} />
      <Worker pos={[0.95, 0, -0.4]} pose={{ armL: "point", mouth: "flat", look: -0.6 }} />
      <LongCucumber />
    </Stage>,

    // 5 "what really happens before it reaches your home?"
    5: ({ dur }) => <Stage look={factoryLook} dur={dur} cam={cam([0, 2.3, 6.8], [0, 1.9, 0], 44, [0, 3.4, 10.2], [0, 2.2, -1])}>
      <Factory />
      <Washer pos={[-1.6, 0, -3]} />
      <Tank pos={[2.2, 0, -4.6]} />
      <Worker pos={[0, 0, 0.8]} pose={{ armR: "point", mouth: "open", eyes: "wide", look: 0.4 }} />
    </Stage>,

    // 6 step 1: high-pressure jets and brushes
    6: ({ dur }) => <Stage look={factoryLook} dur={dur} cam={cam([1.0, 3.0, 7.4], [0, 2.1, 0], 44, [0.3, 2.8, 6.3], [0, 2.1, 0])}>
      <Factory />
      <Washer />
      <StepSign n="1" pos={[-1.1, 3.7, -0.9]} size={1.2} />
    </Stage>,

    // 7 sorted by thickness — small ones earn the most coins
    7: ({ dur }) => <Stage look={factoryLook} dur={dur} cam={cam([0, 4.4, 8.2], [0, 0.9, 0], 46, [0, 4.0, 7.2], [0, 0.9, 0])}>
      <Factory />
      <Grader coins={1} />
    </Stage>,

    // 8 step 2: the brine tank, guide for scale
    8: ({ dur }) => <Stage look={factoryLook} dur={dur} cam={cam([-0.4, 2.8, 10.6], [0, 2.6, 0], 46, [0, 3.0, 9.2], [0, 2.6, 0])}>
      <Factory />
      <Tank pos={[0.5, 0, -0.5]} />
      <Worker pos={[-1.6, 0, 1.8]} h={2.3} pose={{ armR: "point", look: 0.6 }} />
      <StepSign n="2" pos={[-1.6, 3.7, 1.6]} />
    </Stage>,

    // 9 proof: x-ray — salt pulls water out, acid soaks to the centre
    9: ({ dur }) => <Stage look={xrayLook} dur={dur} cam={cam([0, 2.4, 8.4], [0, 2.3, 0], 44, [0, 2.3, 7.4], [0, 2.3, 0])}>
      <Factory />
      <XSlice pos={[0, 2.2, 0]} scale={0.75} acid={(t) => ramp(t, 0.2, Math.max(0.6, dur / 30 - 0.3))} water />
      <Card pos={[0, 4.4, 0.4]} lines={["pH ↓"]} w={1.3} h={0.6} bg="#4a2430" fg="#ffe6ad" />
    </Stage>,

    // 10 twist: gas bubbles, the pickle goes hollow
    10: ({ dur }) => <Stage look={xrayLook} dur={dur} cam={cam([0.3, 2.3, 7.6], [0, 2.2, 0], 44, [0, 2.2, 6.6], [0, 2.2, 0])}>
      <Factory />
      <XSlice pos={[0, 2.2, 0]} scale={0.75} acid={1} gas={(t) => ramp(t, 0.1, 0.8)} hollow={(t) => ramp(t, 0.9, Math.max(1.2, dur / 30 - 0.2))} />
      <Card pos={[0, 4.3, 0.4]} lines={["CO₂"]} w={1.2} h={0.6} bg="#4a2430" fg="#ffe6ad" />
    </Stage>,

    // 11 nitrogen bubbles sweep the gas out of the tank
    11: ({ dur }) => <Stage look={factoryLook} dur={dur} cam={cam([1.2, 3.3, 11.2], [0.5, 2.6, 0], 44, [0.9, 3.1, 10.2], [0.5, 2.6, 0])}>
      <Factory />
      <Tank bubbles={1} nitrogen />
    </Stage>,

    // 12 viewer comment appears in the guide's world
    12: ({ dur }) => <Stage look={factoryLook} dur={dur} cam={cam([0, 2.0, 7.8], [0, 1.8, 0], 44, [0, 2.1, 7.0], [0, 1.9, 0])}>
      <Factory />
      <Worker pos={[-0.95, 0, 0.3]} pose={{ armR: "point", eyes: "half", mouth: "smile", look: 0.8 }} />
      <Comment c={c} />
    </Stage>,

    // 13 read the comment
    13: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.35, 2.35, 5.2], [0.35, 2.35, 1.4], 46, [0.35, 2.35, 4.7], [0.35, 2.35, 1.4])}>
      <Factory />
      <Worker pos={[-0.95, 0, 0.3]} pose={{ armR: "point", eyes: "half", mouth: "smile", look: 0.8 }} />
      <Comment c={c} pop={false} />
    </Stage>,

    // 14 answer + analogy: hollow big pickle vs a shaken soda
    14: ({ dur }) => <Stage look={factoryLook} dur={dur} cam={cam([0, 2.2, 7.8], [0, 1.9, 0], 44, [0, 2.1, 7.0], [0, 1.9, 0])}>
      <Factory />
      <XSlice pos={[-0.7, 2.6, 0]} scale={0.4} acid={1} gas={1} hollow={1} />
      <Soda pos={[0.85, 0, 0.3]} shake={1} />
      <Card pos={[0, 4.2, 0.2]} lines={["CO₂"]} w={1.1} h={0.55} bg="#4a2430" fg="#ffe6ad" />
    </Stage>,

    // 15 step 3: slices, jar, vinegar
    15: ({ dur }) => <Stage look={factoryLook} dur={dur} cam={cam([0.4, 3.4, 9.8], [0.2, 1.8, 0], 44, [0.2, 3.2, 9.0], [0.2, 1.8, 0])}>
      <Factory />
      <Slicer pos={[-0.6, 0, 0]} />
      <Jar pos={[1.45, 0, 0.5]} scale={0.55} lid={false} slices={9} />
      <StepSign n="3" pos={[-1.3, 3.8, -1.0]} size={1.2} />
    </Stage>,

    // 16 the fourth step: 74 °C for 15 min
    16: ({ dur }) => <Stage look={warmLook} dur={dur} cam={cam([0.5, 2.9, 9.4], [0, 2.0, 0], 44, [0.2, 2.7, 8.5], [0, 2.0, 0])}>
      <Factory />
      <Tunnel />
      <StepSign n="4" pos={[-1.3, 4.2, -1.2]} size={1.2} />
    </Stage>,

    // 17 pH below 4.6: botulism can't grow
    17: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0, 2.2, 7.4], [0, 1.8, 0], 44, [0, 2.1, 6.6], [0, 1.8, 0])}>
      <Factory />
      <PhMeter pos={[-0.65, 0.9, 0.9]} value={dec("pH < 4.6")} />
      <Jar pos={[0.75, 0, 0.3]} scale={0.8} />
    </Stage>,

    // 18 before / after
    18: ({ dur }) => <Stage look={factoryLook} dur={dur} cam={cam([0, 1.9, 8.0], [0, 1.3, 0], 44, [0, 1.8, 7.3], [0, 1.3, 0])}>
      <Factory />
      <Box size={[1.2, 0.9, 1.0]} pos={[-1.0, 0.45, 0.6]} color="#8a5a33" rough={0.9} />
      <Cucumber pos={[-1.0, 1.15, 0.6]} rot={[0, 0.2, 0.08]} len={1.2} r={0.23} dirt ink />
      <Arrow pos={[0.0, 1.2, 1.1]} len={0.45} />
      <Jar pos={[0.95, 0, 0.6]} scale={0.8} tag />
    </Stage>,

    // 19 tag your friend
    19: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.3, 2.1, 6.4], [0, 1.6, 0], 44, [0.1, 2.0, 5.6], [0, 1.6, 0])}>
      <Factory />
      <Fan pos={[-0.85, 0, 0.2]} pose={{ eyes: "happy", mouth: "grin", armR: "up", look: 0.6 }} />
      <Jar pos={[0.7, 0, 0.9]} scale={0.85} tag />
    </Stage>,

    // 20 goodbye, like and follow
    20: ({ dur }) => <Stage look={factoryLook} dur={dur} cam={cam([0, 2.2, 7.6], [0, 1.6, 0], 44, [0, 2.5, 8.6], [0, 1.7, 0])}>
      <Factory />
      <Worker pos={[-0.8, 0, 0.4]} pose={{ armR: "wave", mouth: "smile", eyes: "happy" }} />
      <Fan pos={[0.85, 0, 0.1]} pose={{ eyes: "happy", mouth: "grin", armL: "wave" }} />
      <Jar pos={[0, 0, 1.4]} scale={0.55} tag />
    </Stage>,
  };
};
