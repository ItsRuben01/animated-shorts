import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";

export type V3 = [number, number, number];
export type CamKeys = {
  from: V3;
  to: V3;
  lookFrom: V3;
  lookTo?: V3;
  fov?: number;
  roll?: number;
  ease?: string;
};
export type Look = {
  sky?: THREE.Texture;
  fog?: string;
  fogNear?: number;
  fogFar?: number;
  sun: { pos: V3; color: string; intensity: number; shadow?: number };
  hemi: { sky: string; ground: string; intensity: number };
  ambient?: number;
  exposure?: number;
  aperture?: number;
  ink?: number;
  warm?: string;
  cool?: string;
  vignette?: number;
  saturation?: number;
  bloom?: number;
  contrast?: number;
  grain?: number;
  grade?: number;
};

export const LAYER_CHAR = 1;
export const LAYER_FX = 2;
export const LAYER_INK = 3;
const SS = 1.5;

const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

const fsVert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const inkFrag = `
uniform sampler2D tMain;
uniform sampler2D tChar;
uniform float px;
uniform float strength;
varying vec2 vUv;

float silhouette(vec2 uv) {
  return texture2D(tChar, uv).a;
}

void main() {
  vec4 base = texture2D(tMain, vUv);
  float a = silhouette(vUv);
  float edge = 0.0;
  vec2 x = vec2(px, 0.0);
  vec2 y = vec2(0.0, px);
  edge = max(edge, abs(silhouette(vUv + x) - a));
  edge = max(edge, abs(silhouette(vUv - x) - a));
  edge = max(edge, abs(silhouette(vUv + y) - a));
  edge = max(edge, abs(silhouette(vUv - y) - a));
  edge = max(edge, abs(silhouette(vUv + (x + y) * 0.72) - a));
  edge = max(edge, abs(silhouette(vUv + (-x + y) * 0.72) - a));
  edge = max(edge, abs(silhouette(vUv + (x - y) * 0.72) - a));
  edge = max(edge, abs(silhouette(vUv - (x + y) * 0.72) - a));
  float ink = smoothstep(0.15, 0.48, edge) * strength;
  vec3 inkc = vec3(0.06, 0.04, 0.07);
  gl_FragColor = vec4(mix(base.rgb, inkc, ink), base.a);
}
`;

const blurFrag = `
uniform sampler2D tDiffuse;
uniform vec2 dir;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(tDiffuse, vUv).rgb * 0.227027;
  c += texture2D(tDiffuse, vUv + dir * 1.384615).rgb * 0.316216;
  c += texture2D(tDiffuse, vUv - dir * 1.384615).rgb * 0.316216;
  c += texture2D(tDiffuse, vUv + dir * 3.230769).rgb * 0.070270;
  c += texture2D(tDiffuse, vUv - dir * 3.230769).rgb * 0.070270;
  gl_FragColor = vec4(c, 1.0);
}
`;

const bloomFrag = `
uniform sampler2D tDiffuse;
uniform vec2 texel;
uniform float amount;
uniform float threshold;
varying vec2 vUv;

vec3 bright(vec2 uv) {
  vec3 c = texture2D(tDiffuse, uv).rgb;
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  return c * smoothstep(threshold, threshold + 0.35, l);
}

void main() {
  vec3 c = bright(vUv) * 0.22;
  c += bright(vUv + vec2(texel.x * 2.2, 0.0)) * 0.11;
  c += bright(vUv - vec2(texel.x * 2.2, 0.0)) * 0.11;
  c += bright(vUv + vec2(0.0, texel.y * 2.2)) * 0.11;
  c += bright(vUv - vec2(0.0, texel.y * 2.2)) * 0.11;
  c += bright(vUv + texel * 1.8) * 0.085;
  c += bright(vUv - texel * 1.8) * 0.085;
  c += bright(vUv + vec2(texel.x * 1.8, -texel.y * 1.8)) * 0.085;
  c += bright(vUv + vec2(-texel.x * 1.8, texel.y * 1.8)) * 0.085;
  gl_FragColor = vec4(c * amount, 1.0);
}
`;

const finalFrag = `
uniform sampler2D tDiffuse;
uniform sampler2D tSmall;
uniform sampler2D tBloom;
uniform sampler2D tDepth;
uniform float focus;
uniform float aperture;
uniform float near;
uniform float far;
uniform float exposure;
uniform float vignette;
uniform float saturation;
uniform float contrast;
uniform float grade;
uniform float bloom;
uniform float grain;
uniform float time;
uniform vec3 warm;
uniform vec3 cool;
varying vec2 vUv;

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

float lum(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

// Decodificación exacta del logarithmicDepthBuffer de Three.js
float linearDepth(vec2 uv) {
  float z = texture2D(tDepth, uv).x;
  return pow(2.0, z * log2(far + 1.0)) - 1.0;
}

void main() {
  vec3 sharp = texture2D(tDiffuse, vUv).rgb;
  vec3 soft = texture2D(tSmall, vUv).rgb;
  float sceneDepth = linearDepth(vUv);
  float distRatio = abs(sceneDepth - focus) / max(focus, 0.5);
  float coc = clamp(smoothstep(0.25, 1.25, distRatio) * aperture * 0.85, 0.0, 0.48);
  vec3 col = mix(sharp, soft, coc);
  col += texture2D(tBloom, vUv).rgb * bloom;

  col = aces(col * exposure);
  col = pow(max(col, 0.0), vec3(1.0 / 2.2));
  col = mix(vec3(lum(col)), col, saturation);

  float l = lum(col);
  float shadowMask = pow(1.0 - l, 1.75);
  float highlightMask = smoothstep(0.45, 1.0, l);
  vec3 shadowed = mix(col, col * cool * 1.28, shadowMask * 0.85 * grade);
  vec3 lifted = mix(shadowed, shadowed * warm * vec3(1.04, 1.02, 0.96), highlightMask * 0.26 * grade);
  col = clamp((lifted - 0.5) * contrast + 0.5, 0.0, 1.0);

  vec2 centered = vUv - 0.5;
  float radial = 1.0 - dot(centered, centered) * 1.35 * vignette;
  col *= clamp(radial, 0.62, 1.0);

  float n = fract(sin(dot(vUv * vec2(1920.0, 1080.0) + time, vec2(12.9898, 78.233))) * 43758.5453);
  col += (n - 0.5) * grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

function Rig({ cam, dur }: { cam: CamKeys; dur: number }) {
  const frame = useCurrentFrame();
  const { camera } = useThree();
  const from = useMemo(() => new THREE.Vector3(), []);
  const to = useMemo(() => new THREE.Vector3(), []);
  const lookA = useMemo(() => new THREE.Vector3(), []);
  const lookB = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useFrame(() => {
    const t = ease(Math.min(1, frame / Math.max(1, dur - 1)));
    from.fromArray(cam.from);
    to.fromArray(cam.to ?? cam.from);
    camera.position.lerpVectors(from, to, t);
    camera.position.x += Math.sin(frame * 0.021) * 0.04;
    camera.position.y += Math.sin(frame * 0.017 + 1.1) * 0.025;
    lookA.fromArray(cam.lookFrom);
    lookB.fromArray(cam.lookTo ?? cam.lookFrom);
    look.lerpVectors(lookA, lookB, t);
    up.set(Math.sin(frame * 0.013) * 0.01, 1, 0).normalize();
    camera.up.copy(up);
    camera.lookAt(look);
    if (cam.roll) camera.rotateZ(cam.roll);
    const fov = cam.fov ?? 48;
    if ((camera as THREE.PerspectiveCamera).fov !== fov) {
      (camera as THREE.PerspectiveCamera).fov = fov;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    }
  });
  return null;
}

function Post({
  look,
  cam,
  dur,
  focusOverride,
  focusTarget,
}: {
  look: Look;
  cam: CamKeys;
  dur: number;
  focusOverride?: number;
  focusTarget?: V3;
}) {
  const frame = useCurrentFrame();
  const { gl, scene, camera, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const targetFrom = useMemo(() => new THREE.Vector3(), []);
  const targetTo = useMemo(() => new THREE.Vector3(), []);
  const oldColor = useMemo(() => new THREE.Color(), []);

  const pass = useMemo(() => {
    const geo = new THREE.PlaneGeometry(2, 2);
    const inkMat = new THREE.ShaderMaterial({
      vertexShader: fsVert,
      fragmentShader: inkFrag,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        tMain: { value: null },
        tChar: { value: null },
        px: { value: 0.002 },
        strength: { value: 1 },
      },
    });
    const blurMat = new THREE.ShaderMaterial({
      vertexShader: fsVert,
      fragmentShader: blurFrag,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        tDiffuse: { value: null },
        dir: { value: new THREE.Vector2(0.002, 0) },
      },
    });
    const bloomMat = new THREE.ShaderMaterial({
      vertexShader: fsVert,
      fragmentShader: bloomFrag,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        tDiffuse: { value: null },
        texel: { value: new THREE.Vector2(0.002, 0.002) },
        amount: { value: 0.32 },
        threshold: { value: 0.85 },
      },
    });
    const finalMat = new THREE.ShaderMaterial({
      vertexShader: fsVert,
      fragmentShader: finalFrag,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        tDiffuse: { value: null },
        tSmall: { value: null },
        tBloom: { value: null },
        tDepth: { value: null },
        focus: { value: 6 },
        aperture: { value: 0.48 },
        near: { value: 0.1 },
        far: { value: 400 },
        exposure: { value: 1.12 },
        vignette: { value: 0.35 },
        saturation: { value: 1.14 },
        contrast: { value: 1.14 },
        grade: { value: 1 },
        bloom: { value: 0.32 },
        grain: { value: 0.01 },
        time: { value: 0 },
        warm: { value: new THREE.Color("#ffb870") },
        cool: { value: new THREE.Color("#4e46c8") },
      },
    });
    const quad = new THREE.Mesh(geo, inkMat);
    const postScene = new THREE.Scene();
    const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    postScene.add(quad);

    const hdrOpts: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
    };
    const main = new THREE.WebGLRenderTarget(2, 2, { ...hdrOpts, depthBuffer: true });
    main.depthTexture = new THREE.DepthTexture(2, 2);
    main.depthTexture.type = THREE.UnsignedShortType;
    const char = new THREE.WebGLRenderTarget(2, 2, {
      ...hdrOpts,
      type: THREE.UnsignedByteType,
    });
    const ink = new THREE.WebGLRenderTarget(2, 2, hdrOpts);
    const smallA = new THREE.WebGLRenderTarget(2, 2, hdrOpts);
    const smallB = new THREE.WebGLRenderTarget(2, 2, hdrOpts);
    const glow = new THREE.WebGLRenderTarget(2, 2, hdrOpts);
    return {
      geo,
      quad,
      postScene,
      postCam,
      inkMat,
      blurMat,
      bloomMat,
      finalMat,
      main,
      char,
      ink,
      smallA,
      smallB,
      glow,
    };
  }, []);

  useEffect(
    () => () => {
      pass.geo.dispose();
      pass.inkMat.dispose();
      pass.blurMat.dispose();
      pass.bloomMat.dispose();
      pass.finalMat.dispose();
      pass.main.dispose();
      pass.char.dispose();
      pass.ink.dispose();
      pass.smallA.dispose();
      pass.smallB.dispose();
      pass.glow.dispose();
    },
    [pass]
  );

  useFrame(() => {
    const w = Math.max(2, Math.floor(size.width * SS));
    const h = Math.max(2, Math.floor(size.height * SS));
    if (pass.main.width !== w || pass.main.height !== h) {
      pass.main.setSize(w, h);
      pass.char.setSize(w, h);
      pass.ink.setSize(w, h);
      const sw = Math.max(2, Math.floor(w / 3));
      const sh = Math.max(2, Math.floor(h / 3));
      pass.smallA.setSize(sw, sh);
      pass.smallB.setSize(sw, sh);
      pass.glow.setSize(sw, sh);
    }

    const t = ease(Math.min(1, frame / Math.max(1, dur - 1)));
    targetFrom.fromArray(cam.lookFrom);
    targetTo.fromArray(cam.lookTo ?? cam.lookFrom);
    target.lerpVectors(targetFrom, targetTo, t);
    if (focusTarget) target.fromArray(focusTarget);
    const wanted = focusOverride ?? camera.position.distanceTo(target);
    const f = pass.finalMat.uniforms;
    f.focus.value = wanted;
    f.aperture.value = look.aperture ?? 0.48;
    f.exposure.value = look.exposure ?? 1.12;
    f.vignette.value = look.vignette ?? 0.35;
    f.saturation.value = look.saturation ?? 1.14;
    f.contrast.value = look.contrast ?? 1.14;
    f.grade.value = look.grade ?? 1;
    f.bloom.value = look.bloom ?? 0.32;
    f.grain.value = look.grain ?? 0.01;
    f.time.value = frame * 0.013;
    (f.warm.value as THREE.Color).set(look.warm ?? "#ffb870");
    (f.cool.value as THREE.Color).set(look.cool ?? "#4e46c8");
    pass.inkMat.uniforms.strength.value = look.ink ?? 0.85;
    pass.inkMat.uniforms.px.value = (2.0 * SS) / w;
    pass.bloomMat.uniforms.amount.value = look.bloom ?? 0.32;
    (pass.bloomMat.uniforms.texel.value as THREE.Vector2).set(1 / pass.glow.width, 1 / pass.glow.height);

    gl.setRenderTarget(pass.main);
    gl.clear(true, true, true);
    gl.render(scene, camera);

    const bg = scene.background;
    const fog = scene.fog;
    gl.getClearColor(oldColor);
    const oldAlpha = gl.getClearAlpha();
    scene.background = null;
    scene.fog = null;
    gl.setClearColor(0x000000, 0);
    camera.layers.set(LAYER_CHAR);
    camera.layers.enable(LAYER_INK);
    gl.setRenderTarget(pass.char);
    gl.clear(true, true, true);
    gl.render(scene, camera);
    camera.layers.enableAll();
    scene.background = bg;
    scene.fog = fog;
    gl.setClearColor(oldColor, oldAlpha);

    pass.quad.material = pass.inkMat;
    pass.inkMat.uniforms.tMain.value = pass.main.texture;
    pass.inkMat.uniforms.tChar.value = pass.char.texture;
    gl.setRenderTarget(pass.ink);
    gl.clear(true, false, false);
    gl.render(pass.postScene, pass.postCam);

    pass.quad.material = pass.bloomMat;
    pass.bloomMat.uniforms.tDiffuse.value = pass.ink.texture;
    gl.setRenderTarget(pass.glow);
    gl.clear(true, false, false);
    gl.render(pass.postScene, pass.postCam);

    pass.quad.material = pass.blurMat;
    pass.blurMat.uniforms.tDiffuse.value = pass.ink.texture;
    (pass.blurMat.uniforms.dir.value as THREE.Vector2).set(1.1 / pass.smallA.width, 0);
    gl.setRenderTarget(pass.smallA);
    gl.clear(true, false, false);
    gl.render(pass.postScene, pass.postCam);

    pass.blurMat.uniforms.tDiffuse.value = pass.smallA.texture;
    (pass.blurMat.uniforms.dir.value as THREE.Vector2).set(0, 1.1 / pass.smallB.height);
    gl.setRenderTarget(pass.smallB);
    gl.clear(true, false, false);
    gl.render(pass.postScene, pass.postCam);

    pass.quad.material = pass.finalMat;
    f.tDiffuse.value = pass.ink.texture;
    f.tSmall.value = pass.smallB.texture;
    f.tBloom.value = pass.glow.texture;
    f.tDepth.value = pass.main.depthTexture;
    f.near.value = (camera as THREE.PerspectiveCamera).near;
    f.far.value = (camera as THREE.PerspectiveCamera).far;
    gl.setRenderTarget(null);
    gl.render(pass.postScene, pass.postCam);
  }, 1);

  return null;
}

function Sky({ tex }: { tex: THREE.Texture }) {
  return (
    <mesh layers={LAYER_FX} scale={[-1, 1, 1]}>
      <sphereGeometry args={[1, 32, 16]} />
      <meshBasicMaterial map={tex} side={THREE.BackSide} depthWrite={false} fog={false} toneMapped={false} />
    </mesh>
  );
}

export type StageProps = {
  look: Look;
  cam: CamKeys;
  dur: number;
  focus?: number;
  focusTarget?: V3;
  children?: React.ReactNode;
};

export const Stage: React.FC<StageProps> = ({ look, cam, dur, focus, focusTarget, children }) => {
  const { width, height } = useVideoConfig();
  const hemiGround = useMemo(
    () => new THREE.Color(look.hemi.ground).lerp(new THREE.Color("#2e2d82"), 0.42).getStyle(),
    [look.hemi.ground]
  );
  return (
    <ThreeCanvas
      width={width}
      height={height}
      gl={{ antialias: false, alpha: false, preserveDrawingBuffer: true, logarithmicDepthBuffer: true }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.LinearSRGBColorSpace;
        gl.autoClear = true;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.toneMapping = THREE.NoToneMapping;
        gl.toneMappingExposure = 1;
      }}
      style={{ position: "absolute", inset: 0, width, height }}
      camera={{ fov: cam.fov ?? 48, near: 0.1, far: 400 }}
    >
      <color attach="background" args={[look.fog ?? "#dce8f2"]} />
      {look.fog && <fog attach="fog" args={[look.fog, look.fogNear ?? 18, look.fogFar ?? 66]} />}
      <ambientLight intensity={(look.ambient ?? 0.2) * 0.55} />
      <hemisphereLight args={[look.hemi.sky, hemiGround, look.hemi.intensity * 1.15]} />
      <directionalLight
        position={look.sun.pos}
        color={look.sun.color}
        intensity={look.sun.intensity * 1.3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-(look.sun.shadow ?? 22)}
        shadow-camera-right={look.sun.shadow ?? 22}
        shadow-camera-top={look.sun.shadow ?? 22}
        shadow-camera-bottom={-(look.sun.shadow ?? 22)}
        shadow-bias={-0.0005}
      />
      {look.sky && <Sky tex={look.sky} />}
      {children}
      <Rig cam={cam} dur={dur} />
      <Post look={look} cam={cam} dur={dur} focusOverride={focus} focusTarget={focusTarget} />
    </ThreeCanvas>
  );
};