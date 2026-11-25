import React from "react";
import { useCurrentFrame } from "remotion";
import { Toon } from "../engine/Toon";
import type { CamKeys, Look } from "../engine/Stage";
import { Stage } from "../engine/Stage";
import { Box, Cyl } from "../engine/kit";
import { engineer } from "./cast";
import { Card, Cell, CommentBubble, Gauge, Jack, Knife, Micro, useT } from "./sets";
import { analogyLook, cam, closeLook, labLook, microLook, ramp, xrayLook } from "./world";

type P = { dur: number };

export const LONG_SHOT_COUNT = 132;

const wideCam = (x = 0, y = 3.2, z = 15.5, fov = 43) => cam([x, y, z], [0, 2, 0], fov, [x * 0.35, y - 0.25, z - 2], [0, 2, 0]);
const nearCam = (x = 4.5, y = 2.8, z = 10.5, fov = 39) => cam([x, y, z], [1.4, 1.9, 0], fov, [x * 0.7, y - 0.2, z - 1.5], [1.2, 1.9, 0]);
const microCam = (x = 0, y = 0.5, z = 13, fov = 41) => cam([x, y, z], [0, 0, 0], fov, [x * 0.4, y * 0.6, z - 1.6], [0, 0, 0]);
const topCam = (x = 0, y = 7.5, z = 12, fov = 42) => cam([x, y, z], [0, 0.6, 0], fov, [x * 0.3, y - 0.4, z - 1.2], [0, 0.6, 0]);

const Scene: React.FC<{ dur: number; look: Look; camKeys: CamKeys; focus?: number; children: React.ReactNode }> = ({ dur, look, camKeys, focus = 13, children }) => (
  <Stage look={look} cam={camKeys} dur={dur} focus={focus}>
    {children}
  </Stage>
);

const Engineer: React.FC<{ pos?: [number, number, number]; point?: boolean; wave?: boolean }> = ({ pos = [-5.4, -0.85, 2.6], point = false, wave = false }) => (
  <Toon spec={engineer} pos={pos} h={2.55} seed={61}
    pose={{ eyes: "wide", mouth: point ? "open" : "smile", armL: wave ? "wave" : "down", armR: point ? "point" : "down", look: point ? 0.7 : 0 }} />
);

const Demand: React.FC = () => (
  <group>
    <Box size={[11, 0.2, 2.4]} pos={[0, -1.4, 0]} color="#30445f" rough={0.8} />
    <Box size={[1.6, 5.2, 1.5]} pos={[-2.8, 1.2, 0]} color="#58b58b" rough={0.5} />
    <Box size={[1.6, 0.65, 1.5]} pos={[2.8, -1.05, 0]} color="#d9a23f" rough={0.5} />
    <Card pos={[2.8, 1.5, 1.2]} lines={["1 TWh"]} w={3.2} h={1.0} bg="#23345e" fg="#dbe7ff" />
    <Card pos={[-2.8, 4.4, 1.2]} lines={["2024"]} w={2.6} h={0.9} bg="#4a2430" fg="#ffe6ad" />
  </group>
);

const Timeline: React.FC<{ years: string[]; active: number }> = ({ years, active }) => (
  <group>
    <Box size={[12.6, 0.12, 0.12]} pos={[0, 0.4, 0]} color="#6fa8c8" rough={0.4} shadow={false} />
    {years.map((year, i) => {
      const x = -5.2 + (i * 10.4) / Math.max(1, years.length - 1);
      return (
        <group key={year + i} position={[x, 0, 0]}>
          <Cyl r={0.16} h={0.3} pos={[0, 0.45, 0]} color={i === active ? "#ffd36a" : "#9fb9d8"} rough={0.35} />
          <Card pos={[0, 2.0, 0.8]} lines={[year]} w={1.7} h={0.9} bg={i === active ? "#4a2430" : "#23345e"} fg="#ffe6ad" />
        </group>
      );
    })}
  </group>
);

const Garage: React.FC = () => (
  <group>
    {Array.from({ length: 5 }).map((_, i) => (
      <group key={i}>
        <Box size={[9, 0.18, 2.4]} pos={[0, -1.2 + i * 1.15, 0]} color="#4c5f95" rough={0.6} />
        {Array.from({ length: 6 }).map((__, j) => (
          <mesh key={j} position={[-3.5 + j * 1.4, -0.92 + i * 1.15, 0.75]}>
            <sphereGeometry args={[0.21, 14, 12]} />
            <meshStandardMaterial color="#e8584f" roughness={0.4} />
          </mesh>
        ))}
      </group>
    ))}
    <Card pos={[4.6, 3.8, 1]} lines={["372"]} w={2.0} h={0.9} bg="#23345e" fg="#dbe7ff" />
  </group>
);

const MetalPlate: React.FC<{ peaks?: number }> = ({ peaks = 4 }) => (
  <group>
    <Box size={[10, 0.55, 2.8]} pos={[0, -0.4, 0]} color="#d7dce8" rough={0.28} />
    {Array.from({ length: peaks }).map((_, i) => (
      <mesh key={i} position={[-3.4 + i * (6.8 / Math.max(1, peaks - 1)), 0.1, 0.45]}>
        <coneGeometry args={[0.34, 0.75 + (i % 2) * 0.4, 12]} />
        <meshStandardMaterial color="#e8584f" roughness={0.35} />
      </mesh>
    ))}
    <Card pos={[0, 3.5, 1]} lines={["3860"]} w={2.4} h={1.0} bg="#23345e" fg="#dbe7ff" />
  </group>
);

const IonHighway: React.FC<{ lane: "ion" | "electron" }> = ({ lane }) => {
  const frame = useCurrentFrame();
  const k = (frame % 90) / 90;
  const color = lane === "ion" ? "#58b58b" : "#ffd36a";
  return (
    <group>
      <Box size={[12, 0.35, 2.2]} pos={[0, -0.6, 0]} color="#30445f" rough={0.7} />
      <Box size={[12, 0.12, 0.12]} pos={[0, 0.0, 1.0]} color="#6fa8c8" rough={0.4} shadow={false} />
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[-5 + ((i / 7 + k) % 1) * 10, 0.35 + Math.sin(i) * 0.12, 1.05]}>
          <sphereGeometry args={[0.28, 14, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.35} />
        </mesh>
      ))}
      <Card pos={[0, 3.2, 1]} lines={[lane === "ion" ? "Li+" : "e-"]} w={2.2} h={1.0} bg={lane === "ion" ? "#23345e" : "#4a2430"} fg="#ffe6ad" />
    </group>
  );
};

const Lattice: React.FC<{ hop?: boolean }> = ({ hop = false }) => {
  const frame = useCurrentFrame();
  const p = (Math.sin(frame * 0.09) + 1) / 2;
  return (
    <group>
      {Array.from({ length: 35 }).map((_, i) => (
        <mesh key={i} position={[-4.4 + (i % 7) * 1.45, -1.5 + Math.floor(i / 7) * 1.0, 0]}>
          <sphereGeometry args={[0.24, 12, 10]} />
          <meshStandardMaterial color="#5e96b9" roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[-1.5 + p * 2.9, 0.5, 0.75]}>
        <sphereGeometry args={[0.42, 18, 14]} />
        <meshStandardMaterial color="#e8584f" emissive="#e8584f" emissiveIntensity={hop ? 0.5 : 0.15} roughness={0.35} />
      </mesh>
      <Card pos={[0, 3.5, 1]} lines={[hop ? "Li+" : "10-3"]} w={2.4} h={0.9} bg="#23345e" fg="#dbe7ff" />
    </group>
  );
};

const PoreGrid: React.FC<{ count?: number; mark?: boolean }> = ({ count = 6, mark = false }) => (
  <group>
    <Box size={[10.5, 5.4, 2]} pos={[0, 0, -0.4]} color="#bfe4ff" rough={0.3} />
    {Array.from({ length: count }).map((_, i) => (
      <mesh key={i} position={[-3.8 + (i % 3) * 3.2, -1.2 + Math.floor(i / 3) * 2.4, 0.85]}>
        <sphereGeometry args={[0.5 + (i % 3) * 0.12, 18, 14]} />
        <meshStandardMaterial color="#111d33" roughness={1} />
      </mesh>
    ))}
    {mark ? <Card pos={[0, 3.3, 1]} lines={["0"]} w={1.6} h={0.9} bg="#4a2430" fg="#ffe6ad" /> : null}
  </group>
);

const CrackTip: React.FC<{ fill?: number | ((t: number) => number); ahead?: boolean }> = ({ fill = 0, ahead = false }) => {
  const t = useT();
  const f = Math.max(0, Math.min(1, typeof fill === "function" ? fill(t) : fill));
  return (
  <group>
    <Box size={[11, 5.4, 2]} pos={[0, 0, -0.5]} color="#bfe4ff" rough={0.3} />
    <Box size={[7.6, 0.2, 0.12]} pos={[-0.8, 0.2, 0.85]} color="#152239" rough={0.9} shadow={false} />
    <Box size={[3.8 * f, 0.28, 0.16]} pos={[-4.5 + 1.9 * f, 0.2, 0.92]} color="#e8584f" rough={0.35} shadow={false} />
    {ahead ? (
      <group>
        <Cyl r={0.42} h={0.3} pos={[3.5, 0.2, 1.0]} rot={[Math.PI / 2, 0, 0]} color="#58b58b" rough={0.4} />
        <Card pos={[3.5, 2.5, 1.2]} lines={["0"]} w={1.5} h={0.9} bg="#23345e" fg="#dbe7ff" />
      </group>
    ) : null}
    <Card pos={[-3.8, 3.2, 1.2]} lines={["600"]} w={2.2} h={0.9} bg="#4a2430" fg="#ffe6ad" />
  </group>
  );
};

const GrainView: React.FC<{ deflect?: boolean }> = ({ deflect = false }) => (
  <group>
    {Array.from({ length: 12 }).map((_, i) => (
      <Box key={i} size={[2.5, 1.8, 0.5]} pos={[-4.1 + (i % 4) * 2.75, -1.25 + Math.floor(i / 4) * 2.05, 0]} color={i % 3 === 0 ? "#7f98c4" : "#bfe4ff"} rough={0.6} />
    ))}
    <Box size={[7.4, 0.16, 0.14]} pos={[-0.8, -0.4, 0.55]} color="#1b2742" rough={0.9} shadow={false} />
    {deflect ? <Box size={[0.16, 2.2, 0.14]} pos={[1.7, 0.5, 0.6]} color="#1b2742" rough={0.9} shadow={false} /> : null}
    <Card pos={[0, 3.5, 1]} lines={deflect ? ["450", "337"] : ["3-5x"]} w={2.6} h={1.2} bg="#4a2430" fg="#ffe6ad" />
  </group>
);

const Weibull: React.FC = () => (
  <group>
    <Box size={[11, 0.16, 0.16]} pos={[0, -2, 0]} color="#6fa8c8" rough={0.4} shadow={false} />
    <Box size={[0.16, 5.2, 0.16]} pos={[-5, 0.6, 0]} color="#6fa8c8" rough={0.4} shadow={false} />
    {Array.from({ length: 9 }).map((_, i) => (
      <Box key={i} size={[0.9, 0.18, 0.18]} pos={[-4.2 + i * 1.05, -1.75 + i * i * 0.055, 0.2]} rot={[0, 0, 0.18 + i * 0.05]} color="#ffd36a" rough={0.4} shadow={false} />
    ))}
    <Card pos={[2.8, 2.8, 0.8]} lines={["P"]} w={1.6} h={0.9} bg="#4a2430" fg="#ffe6ad" />
  </group>
);

const Factory: React.FC<{ laser?: boolean }> = ({ laser = false }) => (
  <group>
    <Box size={[11, 0.3, 4]} pos={[0, -1.5, 0]} color="#30445f" rough={0.8} />
    {[-3.2, 0, 3.2].map((x) => <Cyl key={x} r={0.55} h={3.2} pos={[x, -0.75, 0]} rot={[0, 0, Math.PI / 2]} color="#9fb9d8" rough={0.4} />)}
    <Box size={[9.5, 0.09, 2.0]} pos={[0, -0.15, 0]} color="#d7dce8" rough={0.25} />
    {laser ? (
      <group>
        <Box size={[0.8, 1.1, 0.8]} pos={[1.6, 2.6, 0]} color="#c94b4b" rough={0.4} />
        <mesh position={[1.6, 1.3, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.28, 1.6, 10]} />
          <meshBasicMaterial color="#ff9a2a" fog={false} />
        </mesh>
        <pointLight position={[1.6, 0.7, 0.4]} color="#ff9a2a" intensity={6} distance={7} decay={1.6} />
      </group>
    ) : null}
    <Card pos={[-4.2, 3.4, 1]} lines={["2028"]} w={2.4} h={0.9} bg="#4a2430" fg="#ffe6ad" />
  </group>
);

const Car: React.FC = () => (
  <group>
    <Box size={[6.4, 1.4, 2.6]} pos={[0, 0.1, 0]} color="#c94b4b" rough={0.45} />
    <Box size={[3.4, 1.2, 2.4]} pos={[-0.5, 1.35, 0]} color="#9fb9d8" rough={0.3} />
    {[-2.0, 2.0].map((x) => (
      <Cyl key={x} r={0.72} h={0.36} pos={[x, -0.85, 0]} rot={[Math.PI / 2, 0, 0]} color="#1b2742" rough={0.8} />
    ))}
    <Card pos={[0, 3.6, 1]} lines={["2x"]} w={2.0} h={1.0} bg="#23345e" fg="#dbe7ff" />
  </group>
);

const Burn: React.FC = () => (
  <group>
    <Cell growth={0.65} crack={0.5} short />
    <mesh position={[2.9, 3.1, 1.2]}>
      <coneGeometry args={[0.6, 2.4, 10]} />
      <meshBasicMaterial color="#ff8a2a" fog={false} />
    </mesh>
    <pointLight position={[2.9, 2.4, 1.2]} color="#ff8a2a" intensity={9} distance={10} decay={1.5} />
    <Card pos={[-3.4, 4.4, 1.2]} lines={["20"]} w={1.8} h={0.9} bg="#4a2430" fg="#ffe6ad" />
  </group>
);

const BeforeAfter: React.FC = () => (
  <group>
    <group position={[-3.4, 0, 0]} scale={0.62}>
      <Cell growth={0.8} crack={0.9} short bench={false} />
    </group>
    <group position={[3.4, 0, 0]} scale={0.62}>
      <Cell flat bench={false} />
    </group>
    <Card pos={[0, 4.5, 1]} lines={["1", "2"]} w={2.0} h={1.2} bg="#23345e" fg="#ffe6ad" />
  </group>
);

const CoDesign: React.FC = () => (
  <group>
    {[-3.8, -1.9, 0, 1.9, 3.8].map((x, i) => (
      <Card key={x} pos={[x, 2.6 + Math.sin(i) * 0.35, 0]} lines={[String(i + 1)]} w={1.4} h={1.0} bg={i === 2 ? "#4a2430" : "#23345e"} fg="#ffe6ad" />
    ))}
    <Box size={[11, 0.18, 0.18]} pos={[0, 0.2, 0]} color="#6fa8c8" rough={0.4} shadow={false} />
    <Engineer pos={[4.9, -0.85, 2.6]} wave />
  </group>
);

const hookShot = (id: number): React.FC<P> => {
  if ([2, 3, 4].includes(id)) return ({ dur }) => <Scene dur={dur} look={labLook} camKeys={wideCam()}><Demand /></Scene>;
  if ([5, 6, 7].includes(id)) return ({ dur }) => <Scene dur={dur} look={labLook} camKeys={wideCam(-2)}><Cell labels /><Card pos={[4.8, 4.6, 1.2]} lines={["10x"]} w={2.2} h={1.0} bg="#4a2430" fg="#ffe6ad" /></Scene>;
  if ([8, 9, 22].includes(id)) return ({ dur }) => <Scene dur={dur} look={labLook} camKeys={wideCam()}><Cell /><Card pos={[0, 5.4, 1.3]} lines={["0"]} w={1.6} h={1.0} bg="#23345e" fg="#dbe7ff" /></Scene>;
  if ([10, 11, 12, 13, 14].includes(id)) return ({ dur }) => <Scene dur={dur} look={xrayLook} camKeys={nearCam()}><Cell growth={(t) => ramp(t, 0.3, 2.4)} crack={(t) => ramp(t, 1.1, 2.6)} short /><Card pos={[4.6, 5.0, 1.2]} lines={["?"]} w={1.8} h={1.2} bg="#4a2430" fg="#ffe6ad" /></Scene>;
  if ([15, 16, 17, 18].includes(id)) return ({ dur }) => <Scene dur={dur} look={closeLook} camKeys={nearCam(-4.6)}><MetalPlate peaks={id % 2 ? 5 : 3} /><Engineer pos={[-5.2, -0.85, 2.6]} point /></Scene>;
  if (id === 19) return ({ dur }) => <Scene dur={dur} look={analogyLook} camKeys={wideCam()}><Garage /><Card pos={[4.6, 0.2, 1]} lines={["1"]} w={1.6} h={1.0} bg="#4a2430" fg="#ffe6ad" /></Scene>;
  if ([20, 21, 23].includes(id)) return ({ dur }) => <Scene dur={dur} look={microLook} camKeys={microCam(1.5)} focus={11}><Micro pore growth={(t) => ramp(t, 0.3, 2.4)} crack={(t) => ramp(t, 1.1, 2.5)} /><Card pos={[3.6, 3.4, 1]} lines={["0"]} w={1.5} h={0.9} bg="#4a2430" fg="#ffe6ad" /></Scene>;
  return ({ dur }) => <Scene dur={dur} look={labLook} camKeys={wideCam()}><Cell /><Engineer pos={[4.9, -0.85, 2.6]} point /></Scene>;
};

const physicsShot = (id: number): React.FC<P> => {
  if ([24, 25, 26].includes(id)) return ({ dur }) => <Scene dur={dur} look={labLook} camKeys={wideCam()}><Cell /><Card pos={[0, 5.6, 1.2]} lines={["Li+", "e-"]} w={3.2} h={1.3} bg="#23345e" fg="#dbe7ff" /></Scene>;
  if ([27, 28].includes(id)) return ({ dur }) => <Scene dur={dur} look={xrayLook} camKeys={wideCam()} focus={12}><IonHighway lane="ion" /></Scene>;
  if (id === 29) return ({ dur }) => <Scene dur={dur} look={analogyLook} camKeys={wideCam()}><IonHighway lane="electron" /></Scene>;
  if ([30, 31, 32, 33, 34].includes(id)) return ({ dur }) => <Scene dur={dur} look={analogyLook} camKeys={wideCam()}><Garage /></Scene>;
  if ([35, 36, 37].includes(id)) return ({ dur }) => <Scene dur={dur} look={closeLook} camKeys={nearCam()}><MetalPlate /></Scene>;
  if ([38, 39, 40, 41].includes(id)) return ({ dur }) => <Scene dur={dur} look={microLook} camKeys={microCam(-1.2)} focus={11}><MetalPlate peaks={6} /></Scene>;
  if ([42, 43, 44, 47, 48, 49, 50].includes(id)) return ({ dur }) => <Scene dur={dur} look={xrayLook} camKeys={wideCam()}><Lattice hop={id === 43 || id === 48} /></Scene>;
  if ([45, 46].includes(id)) return ({ dur }) => <Scene dur={dur} look={closeLook} camKeys={nearCam(4.2)}><Cell /><Card pos={[4.8, 4.6, 1.2]} lines={["10-3"]} w={2.4} h={1.0} bg="#4a2430" fg="#ffe6ad" /></Scene>;
  return ({ dur }) => <Scene dur={dur} look={labLook} camKeys={wideCam()}><Lattice /></Scene>;
};

const historyShot = (id: number): React.FC<P> => {
  if ([51, 52, 53, 54, 55, 56].includes(id)) return ({ dur }) => <Scene dur={dur} look={labLook} camKeys={wideCam()}><Timeline years={["1839", "1884", "1914", "1970"]} active={Math.min(3, id - 51)} /></Scene>;
  if ([57, 58, 59].includes(id)) return ({ dur }) => <Scene dur={dur} look={analogyLook} camKeys={topCam()}><Timeline years={["1966", "1973", "1978", "2028"]} active={id - 57} /></Scene>;
  if ([60, 61, 62].includes(id)) return ({ dur }) => <Scene dur={dur} look={labLook} camKeys={wideCam()}><Cell /><Engineer pos={[-5.2, -0.85, 2.6]} point /></Scene>;
  if ([63, 64].includes(id)) return ({ dur }) => <Scene dur={dur} look={xrayLook} camKeys={nearCam()}><Cell growth={(t) => ramp(t, 0.2, 2.5)} short /></Scene>;
  if (id === 65) return ({ dur }) => <Scene dur={dur} look={closeLook} camKeys={wideCam()}>
    <Burn />
  </Scene>;
  if ([66, 67, 68].includes(id)) return ({ dur }) => <Scene dur={dur} look={labLook} camKeys={wideCam()}><Cell flat /><Card pos={[-4.8, 4.8, 1.2]} lines={["1"]} w={1.7} h={1.0} bg="#23345e" fg="#dbe7ff" /></Scene>;
  if ([69, 70, 71].includes(id)) return ({ dur }) => <Scene dur={dur} look={microLook} camKeys={microCam()} focus={11}><CrackTip fill={0.2} ahead /></Scene>;
  if ([72, 73, 74, 75].includes(id)) return ({ dur }) => <Scene dur={dur} look={closeLook} camKeys={nearCam(-4.4)}><Gauge position={(t) => ramp(t, 0.2, 2.5) * 0.4} /><Engineer pos={[4.8, -0.85, 2.6]} point /></Scene>;
  return ({ dur }) => <Scene dur={dur} look={labLook} camKeys={wideCam()}><Timeline years={["1839", "1884", "1914"]} active={0} /></Scene>;
};

const mechanicsShot = (id: number): React.FC<P> => {
  if ([76, 77, 78].includes(id)) return ({ dur }) => <Scene dur={dur} look={microLook} camKeys={microCam()} focus={11}><PoreGrid count={7} /></Scene>;
  if ([79, 80, 81].includes(id)) return ({ dur }) => <Scene dur={dur} look={microLook} camKeys={microCam(2)} focus={11}><Micro pore growth={(t) => ramp(t, 0.3, 2.2) * 0.6} pressure /></Scene>;
  if ([82, 83, 84].includes(id)) return ({ dur }) => <Scene dur={dur} look={microLook} camKeys={microCam(-2)} focus={11}><PoreGrid count={id === 82 ? 9 : id === 83 ? 12 : 7} mark /></Scene>;
  if ([85, 86, 87, 88, 89].includes(id)) return ({ dur }) => <Scene dur={dur} look={closeLook} camKeys={wideCam()}><Weibull /></Scene>;
  if ([90, 91, 92, 93].includes(id)) return ({ dur }) => <Scene dur={dur} look={microLook} camKeys={microCam(1.6)} focus={11}><CrackTip fill={0.15} ahead /></Scene>;
  if ([94, 95].includes(id)) return ({ dur }) => <Scene dur={dur} look={analogyLook} camKeys={wideCam()}><group position={[-3.2, 0, 0]}><Knife /></group><group position={[3.0, 0, 0]}><Jack push={(t) => ramp(t, 0.2, 2.5)} /></group></Scene>;
  if ([96, 97, 98, 99].includes(id)) return ({ dur }) => <Scene dur={dur} look={xrayLook} camKeys={nearCam()}><CrackTip fill={(t) => ramp(t, 0.2, 2.5)} /><Card pos={[4.6, 4.8, 1.2]} lines={["600"]} w={2.2} h={1.0} bg="#4a2430" fg="#ffe6ad" /></Scene>;
  if ([100, 101, 102].includes(id)) return ({ dur }) => <Scene dur={dur} look={microLook} camKeys={microCam()} focus={11}><GrainView deflect={id !== 100} /></Scene>;
  if ([103, 104, 105, 106].includes(id)) return ({ dur }) => <Scene dur={dur} look={closeLook} camKeys={wideCam()}><Gauge position={(t) => 0.2 + ramp(t, 0.2, 2.5) * 0.6} /><Card pos={[4.6, 3.6, 1]} lines={["P"]} w={1.8} h={1.0} bg="#4a2430" fg="#ffe6ad" /></Scene>;
  if ([107, 108, 109, 110].includes(id)) return ({ dur }) => <Scene dur={dur} look={xrayLook} camKeys={nearCam(-4.2)}><Lattice hop /><CommentBubble /><Engineer pos={[4.8, -0.85, 2.6]} point /></Scene>;
  return ({ dur }) => <Scene dur={dur} look={microLook} camKeys={microCam()} focus={11}><Micro pore /></Scene>;
};

const futureShot = (id: number): React.FC<P> => {
  if ([111, 112, 113, 114].includes(id)) return ({ dur }) => <Scene dur={dur} look={labLook} camKeys={wideCam()}><Car /><Engineer pos={[-5.2, -0.85, 2.6]} point /></Scene>;
  if ([115, 116, 117, 118, 119, 120, 121, 122].includes(id)) return ({ dur }) => <Scene dur={dur} look={analogyLook} camKeys={topCam()}><Factory laser={id === 117 || id === 121} /></Scene>;
  if ([123, 124, 125].includes(id)) return ({ dur }) => <Scene dur={dur} look={closeLook} camKeys={wideCam()}>
    <Cell growth={0.5} crack={0.4} short />
    <Card pos={[-4.8, 4.8, 1.2]} lines={["?"]} w={1.8} h={1.2} bg="#4a2430" fg="#ffe6ad" />
  </Scene>;
  if ([126, 127].includes(id)) return ({ dur }) => <Scene dur={dur} look={labLook} camKeys={wideCam()}><BeforeAfter /></Scene>;
  if ([128, 129].includes(id)) return ({ dur }) => <Scene dur={dur} look={labLook} camKeys={wideCam()}><CoDesign /></Scene>;
  if ([130, 131].includes(id)) return ({ dur }) => <Scene dur={dur} look={xrayLook} camKeys={nearCam()}><CrackTip fill={(t) => ramp(t, 0.2, 2.5)} /><Gauge position={(t) => 0.8 - ramp(t, 0.2, 2.5) * 0.6} /></Scene>;
  return ({ dur }) => <Scene dur={dur} look={labLook} camKeys={wideCam()}><Cell flat /><Engineer pos={[4.9, -0.85, 2.6]} wave /></Scene>;
};

const visualFor = (id: number): React.FC<P> => {
  if (id <= 23) return hookShot(id);
  if (id <= 50) return physicsShot(id);
  if (id <= 75) return historyShot(id);
  if (id <= 110) return mechanicsShot(id);
  return futureShot(id);
};

export const longShots: Record<number, React.FC<P>> = Object.fromEntries(
  Array.from({ length: LONG_SHOT_COUNT }, (_, i) => [i + 1, visualFor(i + 1)]),
) as Record<number, React.FC<P>>;

export const LongShotView: React.FC<{ id: number; dur: number }> = ({ id, dur }) => {
  const Shot = longShots[id];
  return Shot ? <Shot dur={dur} /> : null;
};
