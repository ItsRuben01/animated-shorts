import React from "react";
import { Toon } from "../engine/Toon";
import type { CamKeys, Look } from "../engine/Stage";
import { Stage } from "../engine/Stage";
import { rider } from "./cast";
import { Atrium, BeforeAfter, Bus, Card, Damper, Pistons, Seismic, SkyLine, Storm, SunDisc, Tower, Tuner, Wind, useT } from "./sets";
import { CommentBubble } from "./overlays";
import { atriumLook, bend, busLook, cam, duskLook, runway, stormLook, xrayLook } from "./world";

type P = { dur: number };

type TowerShotProps = {
  dur: number;
  look: Look;
  camKeys: CamKeys;
  xray?: boolean;
  amp?: number;
  ballAmp?: number;
  swing?: number;
  brake?: number;
  storm?: boolean;
  wind?: boolean;
  seismic?: boolean;
  atrium?: boolean;
  dusk?: boolean;
  children?: React.ReactNode;
};

const TowerShot: React.FC<TowerShotProps> = ({
  dur, look, camKeys, xray = true, amp = 0, ballAmp = 0, swing = 0, brake = 0,
  storm = false, wind = false, seismic = false, atrium = false, dusk = false, children,
}) => {
  const t = useT();
  const tw = -bend(t, amp);
  const da = -bend(t, ballAmp) + swing;
  return (
    <Stage look={look} cam={camKeys} dur={dur}>
      <SkyLine dusk={dusk} />
      <Tower xray={xray} bend={tw} dusk={dusk} />
      {xray ? <Damper angle={da} glow={brake} /> : null}
      {xray ? <Pistons brake={brake} /> : null}
      {atrium ? <Atrium /> : null}
      {storm ? <Storm rain={wind} /> : null}
      {wind ? <Wind /> : null}
      {seismic ? <Seismic /> : null}
      {children}
    </Stage>
  );
};

const Passenger: React.FC<{ lean?: number; brake?: number }> = ({ lean = 0, brake = 0 }) => (
  <group rotation={[0, 0, lean]}>
    <Toon spec={rider} pos={[0, 0.92, 0]} h={2.15} seed={4}
      pose={{ eyes: "wide", mouth: "o", armL: "up", armR: "up", shiver: brake > 0 }} />
  </group>
);

export const shots: Record<number, React.FC<P>> = {
  1: ({ dur }) => <TowerShot dur={dur} look={stormLook} camKeys={cam([0, 3, 60], [0, 18, 0], 46, [0, 5, 50], [0, 20, 0])} xray={false} storm wind>
    <Card pos={[0, 36, 0]} lines={["660 t", "ESFERA DE ACERO"]} w={7.4} h={2.2} />
  </TowerShot>,

  2: ({ dur }) => <TowerShot dur={dur} look={stormLook} camKeys={cam([0, 16, 32], [0, 23, 0], 40, [0, 18, 25], [0, 23, 0])} storm>
    <Card pos={[0, 31.5, 2]} lines={["660 t", "ESFERA DE ACERO"]} w={6.8} h={2.0} />
  </TowerShot>,

  3: ({ dur }) => <TowerShot dur={dur} look={stormLook} camKeys={cam([3.8, 27.5, 14], [0, 26.2, 0], 34, [2.4, 27, 11.5], [0, 26, 0])} storm>
    <Card pos={[3.4, 29.8, 0]} lines={["9 cm", "CABLES"]} w={4.4} h={1.6} />
  </TowerShot>,

  4: ({ dur }) => <TowerShot dur={dur} look={stormLook} camKeys={cam([3.4, 19, 12], [0, 19.4, 0], 34, [2.4, 19.5, 10], [0, 19.4, 0])} storm>
    <Card pos={[2.4, 22.2, 0]} lines={["8", "PISTONES HIDRÁULICOS"]} w={4.2} h={1.6} />
  </TowerShot>,

  5: ({ dur }) => <TowerShot dur={dur} look={stormLook} camKeys={cam([0, 11, 40], [0, 23, 0], 44, [0, 13, 34], [0, 23, 0])} amp={0.02} ballAmp={0.06} storm>
    <Card pos={[0, 33, 0]} lines={["¿Y EL 4.º DATO?"]} w={7.2} h={1.8} bg="#8f3540" />
  </TowerShot>,

  6: ({ dur }) => <TowerShot dur={dur} look={xrayLook} camKeys={cam([0, 10, 62], [0, 18, 0], 48, [0, 12, 54], [0, 20, 0])} amp={0.045} ballAmp={0.1} wind seismic>
    <Card pos={[0, 36, 0]} lines={["508 m", "ALTURA"]} w={7.2} h={2.2} />
  </TowerShot>,

  7: ({ dur }) => <TowerShot dur={dur} look={xrayLook} camKeys={cam([8, 16, 48], [0, 19, 0], 46, [5, 18, 43], [0, 20, 0])} amp={0.065} ballAmp={0.14} wind seismic>
    <Card pos={[6, 31, 0]} lines={["VIENTO + SISMO"]} w={6.4} h={1.8} bg="#8f3540" />
  </TowerShot>,

  8: ({ dur }) => <TowerShot dur={dur} look={xrayLook} camKeys={cam([7, 21, 28], [0, 19, 0], 40, [5, 21, 24], [0, 20, 0])} amp={0.085} ballAmp={0.18} wind seismic>
    <Card pos={[-5.5, 28, 0]} lines={["CAÑA DE PESCAR"]} w={6.6} h={1.8} />
  </TowerShot>,

  9: ({ dur }) => <TowerShot dur={dur} look={xrayLook} camKeys={cam([0, 6, 66], [0, 20, 0], 50, [0, 8, 58], [0, 22, 0])} amp={0.095} ballAmp={0.2} wind seismic>
    <Card pos={[0, 37, 0]} lines={["508 m"]} w={6.4} h={1.9} />
  </TowerShot>,

  10: ({ dur }) => <TowerShot dur={dur} look={atriumLook} camKeys={cam([0, 25, 18], [0, 23, 0], 40, [0, 24, 15], [0, 23, 0])} ballAmp={0.08} atrium>
    <Card pos={[0, 28.5, 2]} lines={["PISO 88"]} w={5.8} h={1.7} />
  </TowerShot>,

  11: ({ dur }) => <TowerShot dur={dur} look={atriumLook} camKeys={cam([5.5, 23.5, 13], [0, 23, 0], 36, [4, 23.5, 11], [0, 23, 0])} ballAmp={0.12} atrium>
    <Card pos={[4.2, 26.8, 1]} lines={["PÉNDULO GIGANTE"]} w={6.6} h={1.8} />
  </TowerShot>,

  12: ({ dur }) => <TowerShot dur={dur} look={atriumLook} camKeys={cam([0, 23.5, 10.5], [0, 23, 0], 33, [0, 23.5, 9], [0, 23, 0])} ballAmp={0.16} atrium>
    <Card pos={[0, 27.4, -1]} lines={["41 CAPAS DE ACERO"]} w={4.8} h={1.6} />
  </TowerShot>,

  13: ({ dur }) => <TowerShot dur={dur} look={atriumLook} camKeys={cam([0, 21, 16], [0, 22, 0], 38, [1.5, 21.5, 14], [0, 22, 0])} amp={0.07} ballAmp={0.22} atrium seismic>
    <Card pos={[0, 29, 1]} lines={["EL TEMBLOR"]} w={5.8} h={1.6} bg="#8f3540" />
  </TowerShot>,

  14: ({ dur }) => <TowerShot dur={dur} look={atriumLook} camKeys={cam([6, 22, 14], [0, 22, 0], 36, [4, 22, 12.5], [0, 22, 0])} amp={0.08} ballAmp={0.28} atrium wind />,
  15: ({ dur }) => <TowerShot dur={dur} look={atriumLook} camKeys={cam([0, 22, 13], [0, 22, 0], 34, [0, 22, 11.5], [0, 22, 0])} amp={0.075} ballAmp={0.34} atrium>
    <Card pos={[0, 28.8, 1]} lines={["SACUDIDA A LA MITAD"]} w={7} h={1.8} bg="#1f6b5c" />
  </TowerShot>,

  16: ({ dur }) => <RunawayShot dur={dur} phase="start" />,
  17: ({ dur }) => <RunawayShot dur={dur} phase="wide" />,
  18: ({ dur }) => <RunawayShot dur={dur} phase="brake" />,

  19: ({ dur }) => <><TowerShot dur={dur} look={atriumLook} camKeys={cam([0, 23, 14], [0, 23, 0], 36, [0, 23, 12], [0, 23, 0])} ballAmp={0.18} atrium /><CommentBubble /></>,
  20: ({ dur }) => <><TowerShot dur={dur} look={atriumLook} camKeys={cam([4, 23, 12], [0, 23, 0], 34, [2, 23, 11], [0, 23, 0])} ballAmp={0.22} atrium /><CommentBubble /></>,

  21: ({ dur }) => <Stage look={busLook} cam={cam([0, 4.6, 14], [0, 2.1, 0], 44, [1.5, 4.3, 12.5], [0, 2.1, 0])} dur={dur}>
    <SkyLine /><Bus /><Passenger />
  </Stage>,

  22: ({ dur }) => <Stage look={busLook} cam={cam([4.5, 4.2, 12], [0, 2.2, 0], 42, [3.4, 4, 10.5], [0, 2.2, 0])} dur={dur}>
    <SkyLine /><Bus brake={1} /><Passenger lean={0.34} brake={1} />
  </Stage>,

  23: ({ dur }) => <Stage look={busLook} cam={cam([1.8, 3.6, 7.5], [0, 2.4, 0], 36, [1.2, 3.5, 6.6], [0, 2.4, 0])} dur={dur}>
    <SkyLine /><Bus brake={1} /><Passenger lean={0.46} brake={1} />
  </Stage>,

  24: ({ dur }) => <Stage look={xrayLook} cam={cam([0, 4, 30], [0, 4, 0], 48, [0, 4, 27], [0, 4, 0])} dur={dur}>
    <Tuner />
  </Stage>,

  25: ({ dur }) => <Stage look={xrayLook} cam={cam([3.5, 4.5, 27], [0, 4, 0], 42, [2.2, 4.4, 25], [0, 4, 0])} dur={dur}>
    <Tuner />
  </Stage>,

  26: ({ dur }) => <Stage look={xrayLook} cam={cam([0, 5, 25], [0, 4, 0], 40, [0, 5, 23], [0, 4, 0])} dur={dur}>
    <Tuner />
    <Card pos={[0, -1.4, 1]} lines={["MISMA FRECUENCIA", "SENTIDO OPUESTO"]} w={6.6} h={2.1} bg="#14394c" />
  </Stage>,

  27: ({ dur }) => <Stage look={stormLook} cam={cam([0, 10, 60], [0, 13, 0], 50, [0, 11, 54], [0, 13, 0])} dur={dur}>
    <SkyLine /><BeforeAfter />
  </Stage>,

  28: ({ dur }) => <Stage look={stormLook} cam={cam([0, 11, 50], [0, 12, 0], 46, [0, 11, 45], [0, 12, 0])} dur={dur}>
    <SkyLine /><BeforeAfter />
  </Stage>,

  29: ({ dur }) => <TowerShot dur={dur} look={duskLook} camKeys={cam([0, 4, 62], [0, 20, 0], 48, [0, 6, 55], [0, 21, 0])} xray={false} dusk>
    <SunDisc />
    <Card pos={[0, 36, 0]} lines={["TAIPEI 101"]} w={6.4} h={1.5} bg="#173846" fg="#ffe6ad" />
  </TowerShot>,

  30: ({ dur }) => <TowerShot dur={dur} look={duskLook} camKeys={cam([4, 6, 54], [0, 20, 0], 46, [2, 7, 50], [0, 21, 0])} xray={false} dusk>
    <SunDisc />
  </TowerShot>,
};

const RunawayShot: React.FC<{ dur: number; phase: "start" | "wide" | "brake" }> = ({ dur, phase }) => {
  const t = useT();
  const amp = phase === "start" ? 0.07 : phase === "wide" ? 0.1 : 0.07;
  const ballAmp = phase === "start" ? 0.34 : phase === "wide" ? 0.58 : runway(t, 0.2, 2.6, 0.58, 0.05);
  const swing = phase === "start" ? 0 : phase === "wide" ? 0.14 * Math.sin(t * 4) : 0.1 * Math.sin(t * 4);
  const brake = phase === "brake" ? 1 : 0;
  const camKeys = phase === "start"
    ? cam([0, 23, 12], [0, 22.5, 0], 34, [1, 23, 11], [0, 22.5, 0])
    : phase === "wide"
      ? cam([5.5, 24, 12], [0, 22.5, 0], 38, [3.5, 23.5, 10.5], [0, 22.5, 0])
      : cam([3, 19.8, 10], [0, 20, 0], 36, [1.5, 19.8, 9], [0, 20, 0]);
  return (
    <TowerShot dur={dur} look={atriumLook} camKeys={camKeys} amp={amp} ballAmp={ballAmp} swing={swing} brake={brake} atrium seismic={phase !== "wide"}>
      {phase === "start" ? <Card pos={[0, 29, 1]} lines={["GIRO INESPERADO"]} w={7} h={1.8} bg="#8f3540" /> : null}
      {phase === "wide" ? <Card pos={[0, 29, 1]} lines={["SIN FRENO"]} w={6.4} h={1.7} bg="#8f3540" /> : null}
      {phase === "brake" ? <Card pos={[0, 24.4, -1.5]} lines={["8 PISTONES FRENAN"]} w={5.4} h={1.7} bg="#1f6b5c" /> : null}
    </TowerShot>
  );
};
