// Drawn characters placed in the 3D world: a camera-facing card, lit by the world's lights, casting a real shadow.
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { drawToon, drawHorse, ToonSpec, ToonPose } from "./draw";
import { ContactShadow } from "./kit";
import { LAYER_CHAR, V3 } from "./Stage";

type Path = { from: V3; to: V3; start?: number; end?: number };

const toonRamp = (() => {
  // Rampa de 4 bandas suaves para evitar cortes duros en la cara blanca del personaje
  const t = new THREE.DataTexture(new Uint8Array([155, 195, 232, 255]), 4, 1, THREE.RedFormat);
  t.minFilter = THREE.LinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  return t;
})();

const useCard = (w: number, h: number) =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const depth = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
      map: tex,
      alphaTest: 0.5,
    });
    return { c, g: c.getContext("2d")!, tex, depth };
  }, [w, h]);

export const Toon: React.FC<{
  spec: ToonSpec;
  pose?: Omit<ToonPose, "t">;
  pos: V3;
  h?: number;
  path?: Path;
  flip?: boolean;
  seed?: number;
  yaw?: number;
  light?: number;
  groundShadow?: boolean;
}> = ({
  spec,
  pose = {},
  pos,
  h = 1.75,
  path,
  flip,
  seed = 0,
  yaw,
  light = 0.22,
  groundShadow = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const card = useCard(768, 1024);
  const grp = useRef<THREE.Group>(null);
  let p = pos,
    walking = pose.walk ?? 0;
  if (path) {
    const s = path.start ?? 0,
      e = path.end ?? s + 3;
    const k = Math.min(1, Math.max(0, (t - s) / (e - s)));
    p = [
      path.from[0] + (path.to[0] - path.from[0]) * k,
      path.from[1] + (path.to[1] - path.from[1]) * k,
      path.from[2] + (path.to[2] - path.from[2]) * k,
    ];
    walking = k > 0 && k < 1 ? walking || 1 : 0;
  }
  drawToon(card.g, spec, { ...pose, walk: walking, t: t + seed * 1.37 });
  card.tex.needsUpdate = true;
  useFrame(({ camera }) => {
    if (!grp.current) return;
    if (yaw !== undefined) {
      grp.current.rotation.y = yaw;
      return;
    }
    grp.current.rotation.y = Math.atan2(
      camera.position.x - grp.current.position.x,
      camera.position.z - grp.current.position.z
    );
  });
  const W = h * 0.75,
    feet = (24 / 1024) * h * 1.0;
  return (
    <group ref={grp} position={[p[0], p[1] - feet, p[2]]}>
      {groundShadow ? <ContactShadow pos={[0, feet + 0.012, 0]} size={h * 0.72} opacity={0.62} /> : null}
      <mesh
        layers={LAYER_CHAR}
        position={[0, h / 2, 0]}
        scale={[flip ? -1 : 1, 1, 1]}
        castShadow
        receiveShadow
        customDepthMaterial={card.depth}
      >
        <planeGeometry args={[W, h]} />
        <meshToonMaterial
          gradientMap={toonRamp}
          map={card.tex}
          alphaTest={0.5}
          side={THREE.DoubleSide}
          emissive="#ffffff"
          emissiveMap={card.tex}
          emissiveIntensity={light}
        />
      </mesh>
    </group>
  );
};

export const Horse: React.FC<{
  pos: V3;
  rotY?: number;
  size?: number;
  walk?: number;
  color?: string;
  blanket?: string;
  flip?: boolean;
}> = ({ pos, rotY = 0, size = 2.3, walk = 0, color, blanket, flip }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = useCard(1024, 1024);
  drawHorse(card.g, frame / fps, walk, color, blanket);
  card.tex.needsUpdate = true;
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <ContactShadow pos={[0, 0.015, 0]} size={size * 1.15} opacity={0.58} />
      <mesh
        layers={LAYER_CHAR}
        position={[0, size / 2 - size * 0.012, 0]}
        scale={[flip ? -1 : 1, 1, 1]}
        castShadow
        receiveShadow
        customDepthMaterial={card.depth}
      >
        <planeGeometry args={[size, size]} />
        <meshToonMaterial
          gradientMap={toonRamp}
          map={card.tex}
          alphaTest={0.5}
          side={THREE.DoubleSide}
          emissive="#ffffff"
          emissiveMap={card.tex}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
};