import React from "react";
import { Toon } from "../engine/Toon";
import { Stage } from "../engine/Stage";
import type { V3 } from "../engine/Stage";
import type { Arm, Expression, Prop } from "../engine/draw";
import { CommentCard, type AvatarStyle } from "../engine/CommentCard";
import { Box } from "../engine/kit";
import { friend, mechanic } from "./cast";
import {
  AirJar, AirTire, Apron, CarTire, Card, Cross, Dial, Flash, Hangar, MainGear, N2C, N2Cart, O2C, Plane, Puffs, Runway, XrayTire, useT,
} from "./sets";
import { apronLook, cam, closeLook, duskLook, ease, hangarLook, ramp, xrayLook } from "./world";
import esShots from "../../episodes/ep11_es/shots.json";
import enShots from "../../episodes/ep11_en/shots.json";

export type Lang = "en" | "es";
type P = { dur: number };
type Pose = { face?: Expression; armL?: Arm; armR?: Arm; look?: number; talk?: boolean; prop?: Prop };

const Mech: React.FC<{ pos: V3; h?: number; pose?: Pose; seed?: number }> = ({ pos, h = 2.45, pose = {}, seed = 3 }) => (
  <Toon spec={mechanic} pos={pos} h={h} seed={seed} pose={{ armL: "down", armR: "down", talk: true, ...pose }} />
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

// deep-indigo room for the X-ray shots (never black)
const XRoom: React.FC = () => (
  <group>
    <Box size={[40, 0.4, 40]} pos={[0, -0.2, 0]} color="#3a3c78" rough={0.85} bevel={false} />
    <Box size={[40, 20, 0.4]} pos={[0, 9, -5]} color="#44468a" rough={0.9} bevel={false} />
    {Array.from({ length: 9 }).map((_, i) => (
      <Box key={i} size={[0.04, 20, 0.05]} pos={[-8 + i * 2, 9, -4.7]} color="#5a5ca8" rough={0.9} bevel={false} shadow={false} />
    ))}
  </group>
);

// shot 2: the jet glides in and touches down mid-shot; smoke where the wheels meet the runway
const Landing: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useT();
  const s = dur / 30;
  const u = ease(ramp(t, 0, s));
  const td = 0.55; // touchdown share of the shot
  const x = -5.5 + u * 7.5;
  const y = Math.max(0, 1.3 * (1 - u / td));
  const xTouch = -5.5 + td * 7.5 - 0.4 * 0.36;
  const tTouch = (() => { // invert ease numerically for the smoke timer
    for (let k = 0; k <= 100; k++) if (ease(k / 100) >= td) return (k / 100) * s;
    return s * td;
  })();
  return (
    <group>
      <Plane pos={[x, y, 0]} rot={[0, 0, y > 0 ? 0.07 : 0.03]} scale={0.36} spin={t > tTouch ? 9 : 0} />
      <Puffs pos={[xTouch, 0.15, 0.5]} on={(tt) => ramp(tt, tTouch, tTouch + 1.2)} n={10} spread={1.1} size={0.35} />
      <Puffs pos={[xTouch, 0.15, -0.5]} on={(tt) => ramp(tt, tTouch, tTouch + 1.2)} n={8} spread={0.9} size={0.3} />
    </group>
  );
};

// shot 9: 1986 flashback — the jet climbs away at dusk, a small flash at the gear
const Flashback: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useT();
  const s = dur / 30;
  const u = ramp(t, 0, s);
  const x = -4.5 + u * 7;
  const y = 1.6 + u * 2.6;
  return (
    <group>
      <Plane pos={[x, y, 0]} rot={[0, 0, 0.2]} scale={0.32} gear={u < 0.45} />
      <Flash pos={[x - 0.1, y + 0.2, 0.6]} on={(tt) => ramp(tt, s * 0.55, s * 0.85)} s={0.9} />
    </group>
  );
};

export const makeShots = (lang: Lang): Record<number, React.FC<P>> => {
  const c = commentFor(lang);
  const sec = (dur: number) => dur / 30;
  return {
    // 1 hook: a jet's tire up close; the puff of "air" next to it gets crossed out
    1: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.2, 1.8, 8.4], [0.1, 1.9, 0], 42, [0.1, 1.8, 7.5], [0.1, 1.9, 0])}>
      <Apron />
      <Box size={[6, 0.9, 2.4]} pos={[0, 3.9, -0.4]} color="#f4f5f7" rough={0.35} ink />
      <Box size={[6, 0.2, 2.42]} pos={[0, 3.5, -0.4]} color="#2f6fb8" rough={0.4} bevel={false} />
      <Box size={[0.2, 1.9, 0.2]} pos={[-0.55, 2.5, -0.2]} color="#c6ccd6" rough={0.25} ink />
      <AirTire pos={[-0.55, 0.88, 0]} r={0.62} spin={0.4} />
      <Puffs pos={[0.85, 2.2, 0.9]} n={9} on={1} spread={0.4} size={0.26} color="#ffffff" />
      <Cross pos={[0.85, 2.3, 1.4]} on={(t) => ramp(t, sec(dur) * 0.4, sec(dur) * 0.6)} s={0.55} />
    </Stage>,

    // 2 over 60 t, hot brakes… and a gas that changes everything: touchdown
    2: ({ dur }) => <Stage look={apronLook} dur={dur} cam={cam([-1.5, 1.4, 13.5], [-1.5, 1.4, 0], 44, [0.6, 1.2, 12.5], [0.6, 1.0, 0])}>
      <Runway />
      <Landing dur={dur} />
      <Card pos={[-0.4, 4.2, -1]} lines={["> 60 t"]} w={2.2} h={0.75} bg="#173846" fg="#ffe6ad" />
    </Stage>,

    // 3 ~14 bar: six times your car — big gauge vs small gauge
    3: ({ dur }) => <Stage look={closeLook} dur={dur} cam={cam([0.1, 2.0, 8.2], [0.15, 1.8, 0], 44, [0.1, 2.0, 7.4], [0.15, 1.8, 0])}>
      <Apron />
      <AirTire pos={[-0.65, 1.0, 0]} r={0.7} />
      <CarTire pos={[1.05, 0.45, 0.5]} r={0.3} spin={0} />
      <group position={[-0.65, 2.75, 0.2]} scale={0.85}><Dial value={(t) => 0.1 + ease(ramp(t, 0.2, sec(dur) * 0.6)) * 0.8} /></group>
      <group position={[1.05, 1.55, 0.5]} scale={0.55}><Dial value={0.18} /></group>
      <Card pos={[0.3, 3.95, -0.2]} lines={["×6"]} w={1.3} h={0.7} bg="#173846" fg="#ffe6ad" />
    </Stage>,

    // 4 you can't just blow into it: nitrogen goes in under pressure
    4: ({ dur }) => <Stage look={hangarLook} dur={dur} cam={cam([0.1, 2.2, 8.2], [0.1, 1.5, 0], 44, [0.1, 2.0, 7.3], [0.1, 1.5, 0])}>
      <Hangar />
      <N2Cart pos={[-0.1, 0, -2.0]} hoseTo={[1.25, 1.14, 0.21]} />
      <AirTire pos={[0.9, 1.0, 0]} r={0.7} />
      <group position={[0.9, 2.55, 0.2]} scale={0.6}><Dial value={(t) => 0.25 + ease(ramp(t, 0.3, sec(dur) - 0.2)) * 0.6} /></group>
      <Mech pos={[-1.05, 0, 1.0]} pose={{ armR: "point", face: "smirk", look: 0.7 }} />
    </Stage>,

    // 5 viewer comment: isn't air mostly nitrogen?
    5: ({ dur }) => <Stage look={hangarLook} dur={dur} cam={cam([0, 2.0, 7.8], [0, 1.8, 0], 44, [0.3, 2.3, 5.6], [0.35, 2.3, 1.4])}>
      <Hangar />
      <Mech pos={[-0.95, 0, 0.3]} pose={{ armR: "point", face: "skeptical", look: 0.8 }} />
      <CommentPop c={c} />
    </Stage>,

    // 6 a jar of air: 78 % nitrogen… the other 21 % is oxygen
    6: ({ dur }) => <Stage look={hangarLook} dur={dur} cam={cam([0, 2.5, 8.8], [0, 2.2, 0], 44, [0, 2.4, 8.0], [0, 2.2, 0])}>
      <Hangar />
      <Box size={[2.8, 0.6, 1.8]} pos={[0, 0.3, 0]} color="#5a6a8a" rough={0.5} />
      <AirJar pos={[0, 0.6, 0]} highlight={(t) => ramp(t, sec(dur) * 0.45, sec(dur) * 0.6)} />
      <Card pos={[0, 4.35, 0.2]} lines={["78 % N₂"]} w={2.4} h={0.65} bg="#1c3f78" fg="#dcebff" />
      <group scale={0.01 + 0.99 * ease(ramp(useT(), sec(dur) * 0.45, sec(dur) * 0.6))} position={[0, 3.55, 0.3]}>
        <Card pos={[0, 0, 0]} lines={["21 % O₂"]} w={2.4} h={0.65} bg="#7a2028" fg="#ffe0e0" />
      </group>
    </Stage>,

    // 7 braking: the brake stack heats the tire from inside, the rubber gives off gases
    7: ({ dur }) => <Stage look={xrayLook} dur={dur} cam={cam([0, 2.1, 8.4], [0, 2.0, 0], 44, [0, 2.1, 7.6], [0, 2.0, 0])}>
      <XRoom />
      <XrayTire pos={[0, 2.0, 0]} r={1.1} o2={8} heat={(t) => ramp(t, 0.1, sec(dur) * 0.6)} vapor={(t) => ramp(t, sec(dur) * 0.45, sec(dur) * 0.8)} />
    </Stage>,

    // 8 with oxygen those gases can ignite… and the tire can explode
    8: ({ dur }) => <Stage look={xrayLook} dur={dur} cam={cam([0, 2.1, 7.8], [0, 2.0, 0], 44, [0, 2.1, 6.9], [0.2, 2.1, 0])}>
      <XRoom />
      <XrayTire pos={[0, 2.0, 0]} r={1.1} o2={8} heat={1} vapor={1} shake={(t) => ramp(t, sec(dur) * 0.4, sec(dur) * 0.55)} ignite={(t) => ramp(t, sec(dur) * 0.55, sec(dur) * 0.7)} />
    </Stage>,

    // 9 1986, Mexico: a tire filled with air exploded in flight
    9: ({ dur }) => <Stage look={duskLook} dur={dur} cam={cam([-1.6, 2.4, 15.5], [-1.6, 2.6, 0], 44, [1.4, 3.2, 14.5], [1.4, 3.6, 0])}>
      <Runway sky={["#6e6aa8", "#b48ab0", "#f0b890"]} />
      <Flashback dur={dur} />
      <Card pos={[0, 6.6, -2]} lines={["1986"]} w={2.6} h={0.9} bg="#2a1f3c" fg="#ffd9a8" />
    </Stage>,

    // 10 the rule today: under 5 % oxygen inside — only blue molecules left
    10: ({ dur }) => <Stage look={xrayLook} dur={dur} cam={cam([0, 2.5, 8.6], [0, 2.4, 0], 44, [0, 2.5, 7.9], [0, 2.4, 0])}>
      <XRoom />
      <XrayTire pos={[0, 1.8, 0]} r={1.05} o2={0} />
      <Card pos={[0, 4.15, 0.2]} lines={["< 5 % O₂"]} w={2.4} h={0.7} bg="#173846" fg="#ffe6ad" />
    </Stage>,

    // 11 tag your friend who still inflates tires with his lungs
    11: ({ dur }) => <Stage look={hangarLook} dur={dur} cam={cam([0.2, 2.0, 7.6], [0.1, 1.5, 0], 44, [0.1, 1.9, 6.8], [0.1, 1.5, 0])}>
      <Hangar />
      <AirTire pos={[0.85, 1.0, 0]} r={0.7} />
      <Friend pos={[-0.9, 0, 0.7]} pose={{ face: "rage", armL: "hold", armR: "hold", look: 0.8 }} />
      <Puffs pos={[-0.15, 1.95, 0.9]} n={5} on={(t) => 0.4 + 0.6 * ((t * 1.6) % 1)} spread={0.35} size={0.12} />
      <Card pos={[0.85, 2.55, 0.3]} lines={["@ ______"]} w={1.5} h={0.5} bg="#fff6dc" fg="#c0392b" />
    </Stage>,

    // 12 goodbye, like and follow — both wave in front of the jet
    12: ({ dur }) => <Stage look={apronLook} dur={dur} cam={cam([0, 2.2, 7.8], [0, 1.7, 0], 44, [0, 2.6, 9.0], [0, 1.9, 0])}>
      <Apron />
      <Plane pos={[-1.5, 0, -8]} rot={[0, 0.5, 0]} scale={0.6} />
      <Mech pos={[-0.8, 0, 0.4]} pose={{ armR: "wave", face: "happy" }} />
      <Friend pos={[0.85, 0, 0.1]} pose={{ face: "happy", armL: "wave" }} />
    </Stage>,
  };
};

export { N2C, O2C };
