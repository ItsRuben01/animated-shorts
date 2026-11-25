import React from "react";
import { Box, Cyl, Ground } from "../engine/kit";
import { Stage } from "../engine/Stage";
import type { CamKeys, V3 } from "../engine/Stage";
import type { ToonPose, ToonSpec } from "../engine/draw";
import { Toon } from "../engine/Toon";
import { planks } from "../engine/tex";
import { boy, mom } from "./cast";
import { Belt, Card, EnergyArrows, Heart, Millstones, Motor, River, storeLook, Store, WaterWheel, xrayLook, macroLook, millLook } from "./sets";

type P = { dur: number };
const cam = (from: V3, look: V3, fov = 48, to = from, lookTo = look): CamKeys => ({
  from, to, lookFrom: look, lookTo, fov,
});

type TProps = { spec: ToonSpec; pos: V3; h?: number; seed?: number; pose?: Partial<ToonPose> } & Partial<ToonPose>;
const T: React.FC<TProps> = ({ spec, pos, h, seed, pose, ...flat }) => (
  <Toon spec={spec} pos={pos} h={h} seed={seed} pose={{ ...pose, ...flat } as Omit<ToonPose, "t">} />
);

const Pair: React.FC<{ x?: number; talk?: "boy" | "mom" | "none"; eyes?: "wide" | "happy" | "dot"; mouth?: "open" | "smile" | "o" }> = ({ x = 0, talk = "none", eyes = "dot", mouth = "smile" }) => (
  <group position={[x, 0, 0]}>
    <T spec={boy} pos={[-0.85, 0, 1.9]} h={1.42} seed={1} pose={{ eyes: talk === "boy" ? eyes : "dot", mouth: talk === "boy" ? mouth : "smile", talk: talk === "boy", armL: "point", armR: "down", look: 0.3 }} />
    <T spec={mom} pos={[0.9, 0, 1.6]} h={1.9} seed={2} pose={{ eyes: talk === "mom" ? eyes : "dot", mouth: talk === "mom" ? mouth : "smile", talk: talk === "mom", armL: "down", armR: talk === "mom" ? "up" : "down" }} />
  </group>
);

const Plug: React.FC = () => (
  <group position={[-1.6, 0.25, 0.2]}>
    <Box size={[0.55, 0.36, 0.34]} color="#e8e2d2" />
    <Cyl r={0.05} h={0.5} pos={[0.35, 0, 0]} rot={[0, 0, Math.PI / 2]} color="#3a3a3a" />
    <Box size={[1.8, 0.05, 0.05]} pos={[1.45, 0, 0]} color="#3a3a3a" />
  </group>
);

export const shots: Record<number, React.FC<P>> = {
  1: ({ dur }) => <Stage look={storeLook} cam={cam([0, 2.5, 5.2], [0, 1.45, 0.9], 46)} dur={dur}>
    <Store><Pair talk="boy" eyes="wide" mouth="open" /><Belt pos={[0, 0, 0.15]} moving /><Card pos={[0, 3.4, -2.2]} lines={["SABE PARAR"]} bg="#c94f45" /></Store>
  </Stage>,

  2: ({ dur }) => <Stage look={storeLook} cam={cam([0.5, 2.1, 3.7], [-0.3, 1.5, 1.6], 42)} dur={dur}>
    <Store><T spec={boy} pos={[-0.3, 0, 1.9]} h={1.5} seed={1} eyes="wide" mouth="o" talk armL="up" armR="up" /><Belt pos={[0, 0, 0.15]} moving /></Store>
  </Stage>,

  3: ({ dur }) => <Stage look={storeLook} cam={cam([1.9, 2.6, 5.0], [0, 1.6, 1.1], 50)} dur={dur}>
    <Store><Pair talk="mom" mouth="open" /><Belt pos={[0, 0, 0.15]} moving /><Card pos={[0, 3.6, -2.4]} lines={["CINTA", "MOTOR", "SENSOR"]} w={3.2} h={1.5} bg="#1f6b4e" /></Store>
  </Stage>,

  4: ({ dur }) => <Stage look={storeLook} cam={cam([1.1, 1.95, 3.5], [0, 1.1, 0.1], 44)} dur={dur}>
    <Store><Belt pos={[0, 0, 0.15]} moving /><Card pos={[-0.2, 2.9, -1.4]} lines={["CINTA"]} w={2.4} h={0.8} bg="#c8933f" fg="#173846" /></Store>
  </Stage>,

  5: ({ dur }) => <Stage look={xrayLook} cam={cam([0.7, 1.8, 4.7], [0, 0.8, 0], 47)} dur={dur}>
    <Ground map={planks("#9fb0b6", [4, 4])} size={30} /><Belt xray moving pos={[0, 0, 0]} /><Motor pos={[0, -0.35, 0]} scale={0.75} /><Card pos={[-2.1, 2.6, -1.6]} lines={["MOTOR"]} w={2.2} h={0.75} bg="#c25b2f" />
  </Stage>,

  6: ({ dur }) => <Stage look={xrayLook} cam={cam([1.3, 2.1, 4.3], [0.6, 1.4, 0], 45)} dur={dur}>
    <Ground map={planks("#9fb0b6", [4, 4])} size={30} /><Belt xray moving beam pos={[0, 0, 0]} /><Card pos={[2.4, 2.9, -1.4]} lines={["SENSOR", "LUZ INVISIBLE"]} w={2.8} h={1.1} bg="#a33b43" />
  </Stage>,

  7: ({ dur }) => <Stage look={macroLook} cam={cam([1.3, 1.75, 3.1], [0.8, 1.35, 0], 40)} dur={dur}>
    <Ground map={planks("#9fb0b6", [3, 3])} size={18} /><Belt xray moving beam product="milk" toX={-1.8} pos={[0, 0, 0]} /><Card pos={[-1.6, 2.6, -1.2]} lines={["HAZ LIBRE"]} w={2.2} h={0.7} bg="#357a8e" />
  </Stage>,

  8: ({ dur }) => <Stage look={macroLook} cam={cam([0.5, 1.65, 2.7], [0.7, 1.3, 0], 38)} dur={dur}>
    <Ground map={planks("#9fb0b6", [3, 3])} size={18} /><Belt xray moving beam beamBroken product="milk" slide toX={1.05} pos={[0, 0, 0]} />
  </Stage>,

  9: ({ dur }) => <Stage look={macroLook} cam={cam([0, 1.85, 3.3], [0, 1.3, 0], 42)} dur={dur}>
    <Ground map={planks("#9fb0b6", [3, 3])} size={18} /><Belt xray moving={false} beam beamBroken product="milk" toX={1.05} pos={[0, 0, 0]} /><Card pos={[-1.5, 3.0, -1.2]} lines={["¡CLIC!"]} w={2.0} h={0.8} bg="#d94a42" />
  </Stage>,

  10: ({ dur }) => <Stage look={xrayLook} cam={cam([1.5, 2.25, 4.5], [0.9, 1.3, 0], 47)} dur={dur}>
    <Ground map={planks("#9fb0b6", [4, 4])} size={24} /><Belt xray moving={false} beam product="milk" toX={1.05} pos={[0, 0, 0]} /><Card pos={[-1.9, 3.0, -1.5]} lines={["HAZ", "ESCÁNER"]} w={2.4} h={1.0} bg="#357a8e" />
  </Stage>,

  11: ({ dur }) => <Stage look={storeLook} cam={cam([0, 2.4, 5.5], [0, 1.35, 0.7], 50)} dur={dur}>
    <Store><Pair talk="mom" eyes="happy" /><Belt pos={[0, 0, 0.15]} moving={false} product="milk" toX={1.05} /></Store>
  </Stage>,

  12: ({ dur }) => <Stage look={storeLook} cam={cam([0.3, 2.0, 4.1], [-0.35, 1.5, 1.5], 44)} dur={dur}>
    <Store><Pair talk="boy" eyes="wide" mouth="open" /><Belt pos={[0, 0, 0.15]} moving /><Card pos={[0, 3.5, -2.2]} lines={["¿DE DÓNDE?"]} w={2.8} h={0.85} bg="#1f6b4e" /></Store>
  </Stage>,

  13: ({ dur }) => <Stage look={xrayLook} cam={cam([0.9, 1.9, 4.3], [0, 0.9, 0], 46)} dur={dur}>
    <Ground map={planks("#9fb0b6", [4, 4])} size={24} /><Motor pos={[0, -0.1, 0]} scale={0.85} /><Plug /><EnergyArrows pos={[0.3, 0, 0]} /><Card pos={[1.9, 2.6, -1.4]} lines={["ENCHUFE"]} w={2.1} h={0.75} bg="#c8933f" fg="#173846" />
  </Stage>,

  14: ({ dur }) => <Stage look={xrayLook} cam={cam([0.2, 1.7, 4.4], [0, 0.95, 0], 45)} dur={dur}>
    <Ground map={planks("#9fb0b6", [4, 4])} size={24} /><Motor pos={[0, -0.1, 0]} scale={0.85} /><EnergyArrows pos={[0, 0, 0]} count={4} /><Card pos={[0, 2.9, -1.5]} lines={["ELÉCTRICA", "→ MECÁNICA"]} w={3.4} h={1.2} bg="#1f6b4e" />
  </Stage>,

  15: ({ dur }) => <Stage look={millLook} cam={cam([4.6, 3.1, 7.2], [0, 2.1, 0], 52)} dur={dur}>
    <River /><WaterWheel /><Card pos={[0, 5.6, -1.8]} lines={["MOLINO DE RÍO"]} w={3.4} h={0.9} bg="#1f6b4e" />
  </Stage>,

  16: ({ dur }) => <Stage look={millLook} cam={cam([2.8, 2.7, 5.5], [0, 2.2, 0], 46)} dur={dur}>
    <River /><WaterWheel scale={1.1} />
  </Stage>,

  17: ({ dur }) => <Stage look={millLook} cam={cam([2.1, 2.4, 4.5], [0, 1.4, 0], 44)} dur={dur}>
    <Ground map={planks("#9fb0b6", [4, 4])} size={26} /><Millstones /><Card pos={[0, 3.5, -1.6]} lines={["GRANOS", "ACEITUNAS"]} w={2.8} h={1.0} bg="#c8933f" fg="#173846" />
  </Stage>,

  18: ({ dur }) => <Stage look={millLook} cam={cam([5.0, 3.3, 8.2], [0, 2.0, 0], 54, [4.4, 3.0, 7.4], [0, 2.0, 0])} dur={dur}>
    <River /><WaterWheel pos={[-2.4, 0, 0]} scale={0.8} /><Millstones pos={[2.6, 0, 0]} scale={0.9} /><Card pos={[0, 5.2, -1.8]} lines={["FUERZA → FUERZA"]} w={3.6} h={0.85} bg="#c94f45" />
  </Stage>,

  19: ({ dur }) => <Stage look={storeLook} cam={cam([0, 2.1, 3.9], [-0.4, 1.5, 1.6], 44)} dur={dur}>
    <Store><T spec={boy} pos={[-0.4, 0, 1.9]} h={1.5} seed={1} eyes="happy" mouth="grin" talk armL="up" armR="up" /><T spec={mom} pos={[1.1, 0, 1.6]} h={1.9} seed={2} eyes="happy" /><Belt pos={[0, 0, 0.15]} moving /><Card pos={[0, 3.6, -2.2]} lines={["INGENIERÍA"]} w={3.0} h={0.9} bg="#1f6b4e" /></Store>
  </Stage>,

  20: ({ dur }) => <Stage look={storeLook} cam={cam([0.7, 1.95, 4.2], [0.2, 1.35, 0.7], 46)} dur={dur}>
    <Store><T spec={boy} pos={[-1.15, 0, 1.9]} h={1.45} seed={1} eyes="wide" talk armL="point" /><Belt pos={[0, 0, 0.15]} moving={false} beam beamBroken product="pineapple" toX={1.05} /></Store>
  </Stage>,

  21: ({ dur }) => <Stage look={storeLook} cam={cam([1.3, 2.35, 4.7], [0.4, 1.6, 1.1], 48)} dur={dur}>
    <Store><Pair talk="mom" eyes="happy" /><Belt pos={[0, 0, 0.15]} moving={false} /><Heart pos={[2.0, 2.4, 0.2]} scale={0.8} /><Card pos={[0, 3.6, -2.2]} lines={["SÍGUENOS"]} w={3.0} h={0.85} bg="#c94f45" /></Store>
  </Stage>,

  22: ({ dur }) => <Stage look={storeLook} cam={cam([0, 2.45, 5.1], [0, 1.6, 0.9], 50)} dur={dur}>
    <Store><Pair talk="mom" eyes="happy" /><Heart pos={[-1.9, 2.5, 0.2]} scale={0.7} /><Card pos={[0, 3.7, -2.3]} lines={["ME GUSTA", "APRENDE"]} w={3.2} h={1.1} bg="#1f6b4e" /></Store>
  </Stage>,

  23: ({ dur }) => <Stage look={storeLook} cam={cam([2.5, 2.5, 5.5], [0, 1.35, 0.5], 50, [2.1, 2.4, 5.2], [0, 1.35, 0.5])} dur={dur}>
    <Store><Pair talk="mom" /><Belt pos={[0, 0, 0.15]} moving /><Card pos={[0, 3.6, -2.2]} lines={["LA PRÓXIMA VEZ"]} w={3.4} h={0.85} bg="#c8933f" fg="#173846" /></Store>
  </Stage>,

  24: ({ dur }) => <Stage look={storeLook} cam={cam([0, 2.45, 5.3], [0, 1.45, 0.7], 48)} dur={dur}>
    <Store><Pair talk="mom" eyes="happy" /><Belt pos={[0, 0, 0.15]} moving={false} beam beamBroken product="milk" toX={1.05} /><Card pos={[0, 3.7, -2.3]} lines={["JUSTO A TIEMPO"]} w={3.4} h={0.9} bg="#c94f45" /></Store>
  </Stage>,
};

export const shotComponent = (id: number): React.FC<P> | undefined => shots[id];
