import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { CamKeys, Look } from "../engine/Stage";
import { Toon } from "../engine/Toon";
import { Arduino, Card, Circuit, Desk, FlowCard, Led, PartsRow, PushButton, Resistor, Room, closeLook, deskLook, roomLook } from "./sets";
import { C } from "./cast";

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

const kid = (pose: React.ComponentProps<typeof Toon>["pose"] = {}, pos: [number, number, number] = [0, 0, 1.95]) => (
  <Toon spec={C.boy} pose={pose} pos={pos} h={1.7} seed={2} />
);
const dad = (pose: React.ComponentProps<typeof Toon>["pose"] = {}, pos: [number, number, number] = [2.5, 0, 1.9]) => (
  <Toon spec={C.dad} pose={pose} pos={pos} h={1.85} seed={5} />
);

export const SHOTS: Record<number, Shot> = {
  1: {
    look: roomLook, focus: 5.2,
    cam: { from: [4.4, 3.0, 5.2], to: [4.0, 2.6, 4.7], lookFrom: [0, 1.3, 0], fov: 54 },
    Body: B(() => (
      <Room><Desk><Circuit /></Desk>{kid({ eyes: "wide", mouth: "o" })}{dad({ eyes: "happy", mouth: "smile" })}</Room>
    )),
  },
  2: {
    look: roomLook, focus: 4.6,
    cam: { from: [3.8, 2.6, 4.8], to: [3.4, 2.3, 4.3], lookFrom: [-0.2, 1.3, 0], fov: 52 },
    Body: B(() => (
      <Room><Desk><Circuit /></Desk>{kid({ eyes: "wide", mouth: "open", armR: "point", look: 1 })}{dad({ eyes: "happy", mouth: "smile", look: -1 })}</Room>
    )),
  },
  3: {
    look: roomLook, focus: 4.2,
    cam: { from: [3.2, 2.3, 4.2], to: [2.9, 2.1, 3.8], lookFrom: [0.3, 1.35, 0], fov: 50 },
    Body: B(() => (
      <group>
        <Room><Desk><PartsRow highlight={0} /></Desk>{kid({ eyes: "wide", mouth: "o", look: 1 })}{dad({ eyes: "happy", mouth: "grin", armR: "point", look: -1 })}</Room>
        <Card lines={["CEREBRO DE", "PROYECTOS"]} pos={[0, 2.6, -1.7]} w={3.1} h={0.95} />
      </group>
    )),
  },
  4: {
    look: deskLook, focus: 4.2,
    cam: { from: [0.2, 2.4, 4.6], to: [0.2, 2.2, 4.2], lookFrom: [0, 1.75, -1.2], fov: 52 },
    Body: B(() => (
      <group>
        <Room><Desk><PartsRow /></Desk>{kid({ eyes: "dot", mouth: "smile", look: -1 })}{dad({ eyes: "happy", mouth: "smile", armL: "point", look: -1 })}</Room>
        <Card lines={["4 PIEZAS"]} pos={[0, 2.45, -1.7]} w={2.4} h={0.7} />
      </group>
    )),
  },
  5: {
    look: closeLook, focus: 1.8,
    cam: { from: [1.8, 1.8, 2.0], to: [1.6, 1.7, 1.8], lookFrom: [0.5, 1.2, -0.3], fov: 44 },
    Body: B(() => (
      <group>
        <Room><Desk><group position={[-0.4, 1.05, -0.25]} scale={1.15}><Arduino /></group></Desk></Room>
        <Card lines={["ARDUINO", "ENERGÍA"]} pos={[0, 2.05, -1.6]} w={2.2} h={0.95} />
      </group>
    )),
  },
  6: {
    look: closeLook, focus: 1.6,
    cam: { from: [1.25, 1.55, 1.75], to: [1.05, 1.5, 1.6], lookFrom: [0.62, 1.15, -0.18], fov: 42 },
    Body: B(() => (
      <group>
        <Room><Desk><PushButton pos={[0.62, 1.1, -0.18]} /></Desk></Room>
        <Card lines={["BOTÓN", "ORDEN"]} pos={[0, 2.05, -1.6]} w={2.0} h={0.95} />
      </group>
    )),
  },
  7: {
    look: closeLook, focus: 1.6,
    cam: { from: [1.9, 1.85, 1.9], to: [1.6, 1.75, 1.7], lookFrom: [1.05, 1.18, -0.62], fov: 42 },
    Body: B(() => (
      <group>
        <Room><Desk><Resistor pos={[1.05, 1.16, -0.62]} /></Desk></Room>
        <Card lines={["RESISTENCIA", "PROTEGE"]} pos={[0, 2.05, -1.6]} w={3.0} h={0.95} />
      </group>
    )),
  },
  8: {
    look: closeLook, focus: 1.8,
    cam: { from: [2.4, 1.75, 1.9], to: [2.1, 1.65, 1.7], lookFrom: [1.55, 1.2, -0.18], fov: 42 },
    Body: B(() => (
      <group>
        <Room><Desk><Led pos={[1.55, 1.1, -0.18]} size={1.4} /></Desk></Room>
        <Card lines={["LED", "RESULTADO"]} pos={[0, 2.05, -1.6]} w={2.5} h={0.95} />
      </group>
    )),
  },
  9: {
    look: closeLook, focus: 1.9,
    cam: { from: [1.7, 1.8, 2.0], to: [1.5, 1.7, 1.8], lookFrom: [0.5, 1.2, 0.3], fov: 46 },
    Body: B(() => (
      <group>
        <Room><Desk><Circuit flow={0} /></Desk></Room>
        <Card lines={["5V", "AL BOTÓN"]} pos={[0, 2.1, -1.6]} w={2.2} h={0.95} />
      </group>
    )),
  },
  10: {
    look: closeLook, focus: 1.7,
    cam: { from: [0.2, 1.65, 1.5], to: [0.45, 1.6, 1.5], lookFrom: [0.62, 1.15, -0.18], fov: 42 },
    Body: B((t) => (
      <group>
        <Room><Desk><Circuit pressed={t > 0.5 && t < 0.75} flow={1} /></Desk></Room>
        <Card lines={["PUENTE", "LEVADIZO"]} pos={[0, 2.1, -1.6]} w={2.6} h={0.95} />
      </group>
    )),
  },
  11: {
    look: closeLook, focus: 1.6,
    cam: { from: [1.9, 1.85, 1.9], to: [1.6, 1.75, 1.7], lookFrom: [1.05, 1.18, -0.62], fov: 42 },
    Body: B(() => (
      <group>
        <Room><Desk><Circuit flow={2} /></Desk></Room>
        <Card lines={["330 Ω"]} pos={[0, 2.1, -1.6]} w={2.0} h={0.7} />
      </group>
    )),
  },
  12: {
    look: closeLook, focus: 1.5,
    cam: { from: [1.5, 1.55, 1.45], to: [1.35, 1.5, 1.35], lookFrom: [1.05, 1.17, -0.62], fov: 38 },
    Body: B(() => (
      <group>
        <Room><Desk><Resistor pos={[1.05, 1.16, -0.62]} /></Desk></Room>
        <Card lines={["PROTEGE", "EL LED"]} pos={[0, 2.1, -1.6]} w={2.2} h={0.95} />
      </group>
    )),
  },
  13: {
    look: closeLook, focus: 1.9,
    cam: { from: [0.2, 1.7, 2.2], to: [0.45, 1.6, 2.0], lookFrom: [0.5, 1.2, 0.5], fov: 46 },
    Body: B(() => (
      <group>
        <Room><Desk><Circuit flow={4} /></Desk></Room>
        <Card lines={["DE VUELTA", "A TIERRA"]} pos={[0, 2.1, -1.6]} w={2.6} h={0.95} />
      </group>
    )),
  },
  14: {
    look: roomLook, focus: 4.2,
    cam: { from: [3.2, 2.3, 4.2], to: [2.9, 2.1, 3.8], lookFrom: [0, 1.3, 0], fov: 50 },
    Body: B(() => (
      <group>
        <Room><Desk><Circuit /></Desk>{kid({ eyes: "wide", mouth: "o" })}{dad({ eyes: "happy", mouth: "smile", armL: "point", look: -1 })}</Room>
        <Card lines={["MOMENTO DE", "LA VERDAD"]} pos={[0, 2.6, -1.7]} w={3.0} h={0.95} />
      </group>
    )),
  },
  15: {
    look: closeLook, focus: 1.5,
    cam: { from: [1.25, 1.55, 1.75], to: [1.05, 1.5, 1.6], lookFrom: [0.62, 1.15, -0.18], fov: 42 },
    Body: B((t) => (
      <group>
        <Room><Desk><Circuit pressed={t > 0.35} /></Desk>{kid({ eyes: "wide", mouth: "o", armR: "point" }, [0, 0, 1.95])}</Room>
        <Card lines={["¡PULSA!"]} pos={[0, 2.05, -1.6]} w={2.0} h={0.7} />
      </group>
    )),
  },
  16: {
    look: closeLook, focus: 2.0,
    cam: { from: [2.2, 1.8, 2.3], to: [1.9, 1.7, 2.0], lookFrom: [1.1, 1.2, -0.18], fov: 46 },
    Body: B((t) => (
      <group>
        <Room><Desk><Circuit pressed={t > 0.2} on={t > 0.25} flow={2} /></Desk></Room>
        <Card lines={["ELECTRICIDAD", "SIN PELIGRO"]} pos={[0, 2.1, -1.6]} w={3.2} h={0.95} />
      </group>
    )),
  },
  17: {
    look: closeLook, focus: 2.1,
    cam: { from: [2.0, 1.75, 2.2], to: [1.8, 1.65, 2.0], lookFrom: [1.55, 1.2, -0.18], fov: 44 },
    Body: B(() => (
      <group>
        <Room><Desk><Circuit pressed on /></Desk></Room>
        <Card lines={["¡MAGIA!"]} pos={[0, 2.15, -1.6]} w={2.2} h={0.75} bg="#7a2a28" fg="#ffe8b8" />
      </group>
    )),
  },
  18: {
    look: roomLook, focus: 4.4,
    cam: { from: [0.2, 2.2, 4.4], to: [0.4, 2.1, 4.0], lookFrom: [0, 1.25, 0], fov: 52 },
    Body: B(() => (
      <group>
        <Room><Desk><Circuit on /></Desk>{kid({ eyes: "happy", mouth: "grin", armR: "up", look: 1 })}{dad({ eyes: "happy", mouth: "smile", look: -1 })}</Room>
        <Card lines={["¡SE ENCIENDE!"]} pos={[0, 2.6, -1.7]} w={3.2} h={0.75} bg="#1f6a3b" fg="#f7fff5" />
      </group>
    )),
  },
  19: {
    look: roomLook, focus: 4.6,
    cam: { from: [3.0, 2.4, 4.6], to: [2.7, 2.2, 4.2], lookFrom: [0.8, 1.3, 0], fov: 52 },
    Body: B(() => (
      <Room><Desk><Circuit on /></Desk>{kid({ eyes: "happy", mouth: "smile", look: 1 })}{dad({ eyes: "happy", mouth: "smile", armL: "point", look: -1 })}</Room>
    )),
  },
  20: {
    look: roomLook, focus: 4.8,
    cam: { from: [2.6, 2.3, 4.3], to: [2.3, 2.1, 3.9], lookFrom: [0.8, 1.35, 0], fov: 52 },
    Body: B(() => (
      <group>
        <Room><Desk><Circuit on /></Desk>{kid({ eyes: "happy", mouth: "grin", armR: "up" })}{dad({ eyes: "happy", mouth: "grin", armL: "wave", look: -1 })}</Room>
        <Card lines={["CONTROLAS LA", "TECNOLOGÍA"]} pos={[0, 2.6, -1.7]} w={3.4} h={0.95} />
      </group>
    )),
  },
};
