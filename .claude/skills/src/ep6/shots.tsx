import React from "react";
import { Toon } from "../engine/Toon";
import type { CamKeys, Look } from "../engine/Stage";
import { Stage } from "../engine/Stage";
import { engineer } from "./cast";
import { Card, Cell, CommentBubble, Gauge, Jack, Knife, Micro, type CellProps, type MicroProps } from "./sets";
import { analogyLook, cam, closeLook, labLook, microLook, ramp, xrayLook } from "./world";

type P = { dur: number };

const CellShot: React.FC<CellProps & { dur: number; look: Look; camKeys: CamKeys; children?: React.ReactNode }> = ({ dur, look, camKeys, children, ...props }) => (
  <Stage look={look} cam={camKeys} dur={dur}>
    <Cell {...props} />
    {children}
  </Stage>
);

const MicroShot: React.FC<MicroProps & { dur: number; look: Look; camKeys: CamKeys; children?: React.ReactNode }> = ({ dur, look, camKeys, children, ...props }) => (
  <Stage look={look} cam={camKeys} dur={dur}>
    <Micro {...props} />
    {children}
  </Stage>
);

const Engineer: React.FC<{ pos?: [number, number, number]; point?: boolean; wave?: boolean }> = ({ pos = [-4.3, -0.85, 2.4], point = false, wave = false }) => (
  <Toon spec={engineer} pos={pos} h={2.55} seed={6}
    pose={{ eyes: "wide", mouth: point ? "open" : "smile", armL: wave ? "wave" : "down", armR: point ? "point" : "down", look: point ? 0.7 : 0 }} />
);

export const shots: Record<number, React.FC<P>> = {
  1: ({ dur }) => <CellShot dur={dur} look={labLook} camKeys={cam([0, 3.2, 13], [0, 1.9, 0], 46, [0, 2.7, 10.2], [0, 1.9, 0])} bench>
    <Card pos={[-4.1, 4.8, 1.2]} lines={["0"]} w={1.5} h={0.9} bg="#23345e" fg="#dbe7ff" />
    <Card pos={[4.1, 4.8, 1.2]} lines={["3"]} w={1.5} h={0.9} bg="#4a2430" fg="#ffe6ad" />
  </CellShot>,

  2: ({ dur }) => <CellShot dur={dur} look={closeLook} camKeys={cam([5.1, 2.9, 7.2], [2.1, 1.9, 0], 39, [4.2, 2.5, 5.7], [2.0, 1.9, 0])}>
    <Card pos={[2.2, 5.5, 1.4]} lines={["3860 mAh/g"]} w={3.8} h={1.0} bg="#23345e" fg="#dbe7ff" />
  </CellShot>,

  3: ({ dur }) => <CellShot dur={dur} look={labLook} camKeys={cam([0, 3.0, 11.5], [0, 1.9, 0], 44, [0, 2.7, 9.4], [0, 1.9, 0])} labels />,

  4: ({ dur }) => <CellShot dur={dur} look={labLook} camKeys={cam([-1.2, 3.1, 11], [0, 2.2, 0], 44, [0, 2.8, 9.2], [0, 2.2, 0])}>
    <Card pos={[0, 6.2, 1.5]} lines={["?"]} w={2.0} h={1.5} bg="#4a2430" fg="#ffe6ad" />
  </CellShot>,

  5: ({ dur }) => <CellShot dur={dur} look={xrayLook} camKeys={cam([0.4, 2.5, 9.2], [0, 1.9, 0], 43, [-0.3, 2.2, 7.2], [0, 1.9, 0])}
    growth={(t) => ramp(t, 0.2, 2.4)} crack={(t) => ramp(t, 1.0, 2.6) * 0.9} short />,

  6: ({ dur }) => <CellShot dur={dur} look={labLook} camKeys={cam([-0.8, 3.0, 12.5], [0, 1.6, 0], 46, [0, 2.7, 10.4], [0, 1.7, 0])}>
    <Engineer pos={[-4.2, -0.8, 2.6]} point />
  </CellShot>,

  7: ({ dur }) => <CellShot dur={dur} look={closeLook} camKeys={cam([4.9, 2.6, 6.2], [2.0, 1.9, 0], 38, [4.1, 2.4, 5.2], [1.8, 1.9, 0])}
    pores growth={(t) => ramp(t, 0, 2.2) * 0.16} />,

  8: ({ dur }) => <CellShot dur={dur} look={xrayLook} camKeys={cam([3.7, 2.4, 6.0], [1.2, 1.9, 0], 37, [2.8, 2.2, 5.0], [1.0, 1.9, 0])}
    pores growth={(t) => 0.16 + ramp(t, 0.1, 2.3) * 0.24} />,

  9: ({ dur }) => <CellShot dur={dur} look={xrayLook} camKeys={cam([2.2, 2.3, 6.4], [0.7, 1.9, 0], 36, [1.5, 2.1, 5.3], [0.5, 1.9, 0])}
    pores growth={(t) => 0.4 + ramp(t, 0.1, 2.4) * 0.18} />,

  10: ({ dur }) => <MicroShot dur={dur} look={microLook} camKeys={cam([0, 0.4, 11], [0, 0, 0], 44, [0, 0.2, 8.8], [0, 0, 0])} pore growth={0.38}>
    <Card pos={[0, 3.7, 1]} lines={["?"]} w={1.7} h={1.2} bg="#4a2430" fg="#ffe6ad" />
  </MicroShot>,

  11: ({ dur }) => <MicroShot dur={dur} look={microLook} camKeys={cam([-2.6, 0.7, 10], [-1, 0, 0], 41, [-1.7, 0.3, 8.3], [-1, 0, 0])} pore={false}>
    <Card pos={[-2.6, 3.4, 1]} lines={["0"]} w={1.4} h={0.9} bg="#23345e" fg="#dbe7ff" />
  </MicroShot>,

  12: ({ dur }) => <MicroShot dur={dur} look={microLook} camKeys={cam([-1.8, 0.3, 9.4], [0, 0, 0], 40, [-0.6, 0.2, 7.8], [0, 0, 0])}
    pore crack={(t) => ramp(t, 0.2, 2.5)} />,

  13: ({ dur }) => <MicroShot dur={dur} look={microLook} camKeys={cam([0, 0.2, 12.5], [0, 0, 0], 46, [0, 0, 9.6], [0, 0, 0])} pore />,

  14: ({ dur }) => <MicroShot dur={dur} look={microLook} camKeys={cam([3.6, 0.5, 7.4], [1.6, 0, 0], 37, [2.7, 0.3, 6.1], [1.3, 0, 0])}
    pore growth={(t) => ramp(t, 0.2, 2.6)} />,

  15: ({ dur }) => <MicroShot dur={dur} look={microLook} camKeys={cam([1.4, 0.6, 9.0], [0.8, 0, 0], 40, [0.9, 0.3, 7.6], [0.8, 0, 0])}
    pore pressure growth={(t) => 0.35 + ramp(t, 0.2, 2.4) * 0.35} />,

  16: ({ dur }) => <MicroShot dur={dur} look={microLook} camKeys={cam([-0.2, 0.4, 9.6], [0, 0, 0], 42, [-0.6, 0.2, 7.9], [0, 0, 0])}
    pore pressure growth={(t) => 0.62 + ramp(t, 0.2, 2.4) * 0.3} crack={(t) => ramp(t, 0.6, 2.6)} short />,

  17: ({ dur }) => <CellShot dur={dur} look={xrayLook} camKeys={cam([0, 3.1, 12.2], [0, 1.9, 0], 46, [0, 2.7, 10.0], [0, 1.9, 0])}
    crack={0.6} growth={0.4}>
    <Engineer pos={[4.3, -0.85, 2.6]} point />
    <Card pos={[0, 6.1, 1.4]} lines={["?"]} w={1.8} h={1.2} bg="#4a2430" fg="#ffe6ad" />
  </CellShot>,

  18: ({ dur }) => <CellShot dur={dur} look={xrayLook} camKeys={cam([-4.6, 2.7, 8.2], [-1.8, 2.0, 0], 38, [-3.7, 2.4, 6.9], [-1.7, 2.0, 0])}
    crack={(t) => ramp(t, 0.2, 2.5)} pores>
    <Card pos={[-2.2, 5.6, 1.4]} lines={["1", "?"]} w={2.0} h={1.5} bg="#4a2430" fg="#ffe6ad" />
  </CellShot>,

  19: ({ dur }) => <Stage look={analogyLook} cam={cam([0, 2.6, 10], [0, 1.4, 0], 44, [0, 2.3, 8.2], [0, 1.4, 0])} dur={dur}>
    <group position={[-2.3, 0, 0]}><Knife /></group>
    <group position={[2.3, 0, 0]}><Jack push={(t) => ramp(t, 0.3, 2.4)} /></group>
  </Stage>,

  20: ({ dur }) => <CellShot dur={dur} look={labLook} camKeys={cam([0, 3.2, 13], [0, 2.0, 0], 47, [0, 2.9, 11], [0, 2.0, 0])}>
    <CommentBubble />
    <Engineer pos={[-4.3, -0.85, 2.6]} />
  </CellShot>,

  21: ({ dur }) => <Stage look={labLook} cam={cam([0, 2.9, 9], [0, 3.1, 0], 40, [0, 2.8, 7.5], [0, 3.1, 0])} dur={dur}>
    <CommentBubble />
    <Engineer pos={[3.8, -0.85, 2.4]} point />
  </Stage>,

  22: ({ dur }) => <Stage look={analogyLook} cam={cam([0, 2.7, 11.5], [0, 1.5, 0], 45, [0, 2.4, 9.6], [0, 1.5, 0])} dur={dur}>
    <group position={[-2.5, 0, 0]}><Knife /></group>
    <group position={[2.5, 0, 0]}><Jack /></group>
  </Stage>,

  23: ({ dur }) => <Stage look={analogyLook} cam={cam([2.8, 2.5, 9.0], [2.1, 1.7, 0], 39, [2.2, 2.2, 7.4], [2.1, 1.7, 0])} dur={dur}>
    <group position={[2.0, 0, 0]}><Jack push={(t) => ramp(t, 0.2, 2.5)} /></group>
    <Engineer pos={[-3.8, -0.85, 2.6]} point />
  </Stage>,

  24: ({ dur }) => <Stage look={closeLook} cam={cam([0, 1.8, 9], [0, 0, 0], 41, [0, 1.3, 7.3], [0, 0, 0])} dur={dur}>
    <group position={[0, 0.3, 0]}><Gauge position={(t) => ramp(t, 0.15, 2.5) * 0.5} /></group>
  </Stage>,

  25: ({ dur }) => <Stage look={closeLook} cam={cam([0, 1.9, 10], [0, 0.1, 0], 43, [0, 1.5, 8.2], [0, 0.1, 0])} dur={dur}>
    <group position={[0, 0.2, 0]}><Gauge position={(t) => 0.12 + ramp(t, 0.2, 2.5) * 0.78} /></group>
  </Stage>,

  26: ({ dur }) => <Stage look={closeLook} cam={cam([0.6, 1.6, 8.6], [0, 0, 0], 40, [0, 1.2, 7.1], [0, 0, 0])} dur={dur}>
    <group position={[0, 0.2, 0]}><Gauge position={(t) => 0.5 + Math.sin(t * 1.8) * 0.08} /></group>
  </Stage>,

  27: ({ dur }) => <CellShot dur={dur} look={xrayLook} camKeys={cam([0, 2.7, 10.5], [0, 1.9, 0], 44, [0, 2.3, 8.6], [0, 1.9, 0])}
    pores growth={(t) => ramp(t, 0.2, 2.5)} crack={(t) => ramp(t, 0.8, 2.6)} short />,

  28: ({ dur }) => <CellShot dur={dur} look={labLook} camKeys={cam([0.4, 2.8, 10.2], [0, 1.9, 0], 43, [0, 2.4, 8.7], [0, 1.9, 0])} flat />,

  29: ({ dur }) => <CellShot dur={dur} look={closeLook} camKeys={cam([-4.4, 2.6, 7.4], [-2.4, 2.0, 0], 37, [-3.5, 2.3, 6.2], [-2.3, 2.0, 0])}
    crack={0.35} pores>
    <Engineer pos={[3.8, -0.85, 2.6]} point />
  </CellShot>,

  30: ({ dur }) => <CellShot dur={dur} look={labLook} camKeys={cam([0, 3.1, 12.6], [0, 1.7, 0], 47, [0, 2.8, 10.3], [0, 1.8, 0])}>
    <Engineer pos={[4.1, -0.85, 2.6]} wave />
    <Card pos={[-4.2, 5.0, 1.2]} lines={["?"]} w={1.5} h={1.1} bg="#4a2430" fg="#ffe6ad" />
  </CellShot>,
};
