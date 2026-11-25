import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { CamKeys, Look } from "../engine/Stage";
import { Toon } from "../engine/Toon";
import { Sign } from "../engine/kit";
import { Circuit, CodeCard, Desk, Led, PushButton, Resistor, Room } from "./sets";
import { C } from "./cast";
import { closeLook, deskLook, roomLook } from "./sets";

export type Shot = { look: Look; cam: CamKeys; focus: number; Body: React.FC<{ dur: number }> };

const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

const B = (fn: (t: number, dur: number) => React.ReactNode): React.FC<{ dur: number }> => ({ dur }) => {
  const t = useT();
  return <>{fn(t, dur)}</>;
};

const kid = (pose: React.ComponentProps<typeof Toon>["pose"] = {}, pos: [number, number, number] = [-2.15, 0, 1.15]) => (
  <Toon spec={C.boy} pose={pose} pos={pos} h={1.7} seed={2} />
);
const dad = (pose: React.ComponentProps<typeof Toon>["pose"] = {}, pos: [number, number, number] = [2.05, 0, 1.05]) => (
  <Toon spec={C.dad} pose={pose} pos={pos} h={1.85} seed={5} />
);

const Table: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <group>
    <Circuit />
    {children}
  </group>
);

const live = { from: [4.8, 3.0, 5.4], to: [4.3, 2.5, 4.8], lookFrom: [0, 1.15, 0], fov: 56 } as CamKeys;

export const SHOTS: Record<number, Shot> = {
  1: {
    look: roomLook, focus: 6.2, cam: live,
    Body: B(() => (
      <group>
        <Room><Desk><Table /></Desk>{kid({ eyes: "wide", mouth: "o", armL: "down", armR: "down" })}</Room>
      </group>
    )),
  },
  2: {
    look: roomLook, focus: 5.2,
    cam: { from: [4.3, 2.5, 4.8], to: [3.8, 2.2, 4.4], lookFrom: [0, 1.1, 0], fov: 54 },
    Body: B(() => (
      <Room><Desk><Table /></Desk>{kid({ eyes: "dot", mouth: "smile", armR: "point", look: 1 })}</Room>
    )),
  },
  3: {
    look: roomLook, focus: 4.6,
    cam: { from: [3.8, 2.2, 4.4], to: [3.3, 2.0, 4.0], lookFrom: [-0.2, 1.2, 0], fov: 52 },
    Body: B(() => (
      <Room>
        <Desk><Table /></Desk>
        {kid({ eyes: "wide", mouth: "open", armR: "point", look: 1 })}
        {dad({ eyes: "happy", mouth: "smile", armL: "wave" })}
      </Room>
    )),
  },
  4: {
    look: roomLook, focus: 4.2,
    cam: { from: [3.3, 2.0, 4.0], to: [2.9, 1.9, 3.6], lookFrom: [0, 1.1, 0], fov: 52 },
    Body: B(() => (
      <Room>
        <Desk><Table /></Desk>
        {kid({ eyes: "dot", mouth: "smile", look: 1 })}
        {dad({ eyes: "happy", mouth: "grin", armR: "point", look: -1 }, [1.5, 0, 1.45])}
      </Room>
    )),
  },
  5: {
    look: closeLook, focus: 1.7,
    cam: { from: [1.9, 1.8, 2.0], to: [1.6, 1.7, 1.8], lookFrom: [0.62, 1.18, -0.18], fov: 44 },
    Body: B(() => <Room><Desk><Table /></Desk></Room>),
  },
  6: {
    look: closeLook, focus: 1.6,
    cam: { from: [1.25, 1.5, 1.75], to: [1.02, 1.45, 1.6], lookFrom: [0.62, 1.15, -0.18], fov: 42 },
    Body: B(() => <Room><Desk><Table /></Desk><PushButton pos={[0.62, 1.1, -0.18]} /></Room>),
  },
  7: {
    look: closeLook, focus: 1.7,
    cam: { from: [0.15, 1.62, 1.45], to: [0.4, 1.55, 1.5], lookFrom: [0.62, 1.15, -0.18], fov: 42 },
    Body: B(() => <Room><Desk><Table /></Desk><PushButton pos={[0.62, 1.1, -0.18]} /></Room>),
  },
  8: {
    look: closeLook, focus: 1.9,
    cam: { from: [0.0, 1.7, 2.2], to: [0.2, 1.6, 2.0], lookFrom: [0.3, 1.2, 0.5], fov: 46 },
    Body: B(() => <Room><Desk><Table /></Desk></Room>),
  },
  9: {
    look: closeLook, focus: 1.9,
    cam: { from: [-0.4, 1.7, 2.0], to: [-0.2, 1.6, 1.8], lookFrom: [0.1, 1.2, 0.4], fov: 46 },
    Body: B(() => <Room><Desk><Table /></Desk></Room>),
  },
  10: {
    look: closeLook, focus: 1.8,
    cam: { from: [-1.6, 1.7, 1.8], to: [-1.3, 1.6, 1.6], lookFrom: [-0.95, 1.12, 0], fov: 42 },
    Body: B(() => <Room><Desk><Table /></Desk></Room>),
  },
  11: {
    look: closeLook, focus: 1.7,
    cam: { from: [1.2, 1.6, 1.5], to: [1.1, 1.55, 1.4], lookFrom: [0.62, 1.2, -0.18], fov: 42 },
    Body: B(() => (
      <Room>
        <Desk><Circuit pressed={false} /></Desk>
        <Sign lines={["HIGH"]} pos={[0.62, 1.52, -0.65]} w={0.95} h={0.36} bg="#161a22" fg="#7ee0a0" />
      </Room>
    )),
  },
  12: {
    look: closeLook, focus: 1.7,
    cam: { from: [1.1, 1.55, 1.4], to: [1.0, 1.5, 1.35], lookFrom: [0.62, 1.2, -0.18], fov: 42 },
    Body: B((t) => (
      <Room>
        <Desk><Circuit pressed={t > 0.5} /></Desk>
        <Sign lines={[t > 0.5 ? "LOW" : "HIGH"]} pos={[0.62, 1.52, -0.65]} w={0.95} h={0.36} bg="#161a22" fg={t > 0.5 ? "#ff9a6a" : "#7ee0a0"} />
      </Room>
    )),
  },
  13: {
    look: closeLook, focus: 1.8,
    cam: { from: [2.4, 1.7, 1.8], to: [2.1, 1.6, 1.6], lookFrom: [1.55, 1.2, -0.18], fov: 42 },
    Body: B(() => <Room><Desk><Table /></Desk><Led pos={[1.55, 1.1, -0.18]} /></Room>),
  },
  14: {
    look: closeLook, focus: 1.8,
    cam: { from: [1.9, 1.8, 1.9], to: [1.6, 1.7, 1.7], lookFrom: [1.25, 1.2, -0.4], fov: 42 },
    Body: B(() => <Room><Desk><Table /></Desk><Resistor pos={[1.05, 1.16, -0.62]} /></Room>),
  },
  15: {
    look: closeLook, focus: 1.8,
    cam: { from: [2.2, 1.55, 1.7], to: [2.0, 1.5, 1.5], lookFrom: [1.6, 1.1, 0.1], fov: 42 },
    Body: B(() => <Room><Desk><Table /></Desk></Room>),
  },
  16: {
    look: closeLook, focus: 1.5,
    cam: { from: [1.4, 1.6, 1.4], to: [1.25, 1.55, 1.3], lookFrom: [1.05, 1.16, -0.62], fov: 40 },
    Body: B(() => <Room><Desk><Table /></Desk><Resistor pos={[1.05, 1.16, -0.62]} /></Room>),
  },
  17: {
    look: deskLook, focus: 3.4,
    cam: { from: [0, 2.4, 4.6], to: [0, 2.2, 4.2], lookFrom: [0, 1.75, -1.4], fov: 52 },
    Body: B(() => (
      <Room>
        <Desk><Table /></Desk>
        <CodeCard pos={[0, 1.9, -1.6]} highlight={0} />
        {kid({ eyes: "dot", mouth: "smile", armR: "point", look: -1 })}
        {dad({ eyes: "happy", mouth: "grin", armL: "point" }, [1.5, 0, 1.45])}
      </Room>
    )),
  },
  18: {
    look: deskLook, focus: 2.6,
    cam: { from: [0, 2.1, 2.2], to: [0, 2.0, 2.0], lookFrom: [0, 1.9, -1.6], fov: 46 },
    Body: B(() => <Room><Desk><Table /></Desk><CodeCard pos={[0, 1.9, -1.6]} highlight={0} /></Room>),
  },
  19: {
    look: deskLook, focus: 2.6,
    cam: { from: [0, 2.0, 2.0], to: [0.05, 1.98, 1.9], lookFrom: [0, 1.9, -1.6], fov: 46 },
    Body: B(() => <Room><Desk><Table /></Desk><CodeCard pos={[0, 1.9, -1.6]} highlight={1} /></Room>),
  },
  20: {
    look: deskLook, focus: 2.6,
    cam: { from: [0.05, 1.98, 1.9], to: [0.1, 1.95, 1.85], lookFrom: [0, 1.9, -1.6], fov: 46 },
    Body: B(() => <Room><Desk><Table /></Desk><CodeCard pos={[0, 1.9, -1.6]} highlight={2} /></Room>),
  },
  21: {
    look: closeLook, focus: 2.1,
    cam: { from: [2.4, 1.9, 2.6], to: [2.0, 1.75, 2.2], lookFrom: [1.1, 1.2, -0.18], fov: 46 },
    Body: B((t) => (
      <Room>
        <Desk><Circuit pressed={t > 0.45} on={t > 0.5} /></Desk>
        {kid({ eyes: "wide", mouth: "grin", armL: "hold", armR: "down", look: 1 }, [-1.5, 0, 1.5])}
      </Room>
    )),
  },
  22: {
    look: closeLook, focus: 2.1,
    cam: { from: [2.0, 1.75, 2.2], to: [1.9, 1.7, 2.1], lookFrom: [1.1, 1.2, -0.18], fov: 46 },
    Body: B((t) => (
      <Room>
        <Desk><Circuit pressed={t < 0.4} on={t < 0.4} /></Desk>
        {kid({ eyes: "dot", mouth: "smile", look: 1 }, [-1.5, 0, 1.5])}
      </Room>
    )),
  },
  23: {
    look: roomLook, focus: 4.2,
    cam: { from: [0, 2.2, 4.4], to: [0.3, 2.1, 4.1], lookFrom: [0, 1.2, 0], fov: 52 },
    Body: B(() => (
      <Room>
        <Desk><Circuit on /></Desk>
        {kid({ eyes: "happy", mouth: "grin", armR: "up", look: 1 })}
        {dad({ eyes: "happy", mouth: "smile", armL: "point", look: -1 }, [1.5, 0, 1.45])}
      </Room>
    )),
  },
  24: {
    look: roomLook, focus: 6.8,
    cam: { from: [0.3, 2.1, 4.1], to: [1.0, 3.0, 6.0], lookFrom: [0, 1.2, 0], lookTo: [0, 1.35, 0], fov: 54 },
    Body: B(() => (
      <Room>
        <Desk><Circuit on /></Desk>
        {kid({ eyes: "happy", mouth: "grin", armR: "up" })}
        {dad({ eyes: "happy", mouth: "grin", armL: "hips", armR: "point" })}
      </Room>
    )),
  },
};
