import { useMemo, useState } from "react";
import * as THREE from "three";

/*
  Procedural 3D product models. Every bottle is built from code (lathe profiles,
  cylinders and a canvas-drawn label), so there are no 3D files to download.
*/

const v = (pts) => pts.map(([x, y]) => new THREE.Vector2(x, y));

// Lathe profiles (radius, height) for each packaging type
const PROFILES = {
  dropper: v([[0, 0], [0.5, 0], [0.56, 0.06], [0.58, 0.2], [0.58, 1.15], [0.52, 1.3], [0.3, 1.42], [0.22, 1.46], [0.22, 1.5], [0, 1.5]]),
  pump: v([[0, 0], [0.52, 0], [0.6, 0.08], [0.62, 0.25], [0.62, 1.55], [0.55, 1.72], [0.3, 1.82], [0.22, 1.85], [0, 1.85]]),
  jar: v([[0, 0], [0.85, 0], [0.95, 0.08], [0.98, 0.2], [0.98, 0.75], [0.9, 0.82], [0, 0.82]]),
  bottle: v([[0, 0], [0.5, 0], [0.58, 0.08], [0.6, 0.25], [0.6, 1.2], [0.5, 1.45], [0.25, 1.62], [0.2, 1.66], [0, 1.66]]),
};
export const HEIGHTS = { dropper: 2.25, pump: 2.45, jar: 1.19, tube: 2.5, bottle: 2.05 };

const labelCache = new Map();
function labelTexture(p, w = 512, h = 320) {
  const key = `${p.id}-${w}x${h}`;
  if (labelCache.has(key)) return labelCache.get(key);
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d");
  g.fillStyle = "#fffdf9";
  g.fillRect(0, 0, w, h);
  g.strokeStyle = p.c[1];
  g.lineWidth = 4;
  g.strokeRect(14, 14, w - 28, h - 28);
  g.textAlign = "center";
  g.fillStyle = "#1d2a22";
  g.font = `600 ${Math.round(h * 0.3)}px Fraunces, Georgia, serif`;
  g.fillText("mira", w / 2, h * 0.5);
  g.fillStyle = p.c[1];
  g.font = `700 ${Math.round(h * 0.11)}px Inter, Arial, sans-serif`;
  g.letterSpacing = "6px";
  g.fillText(p.label, w / 2, h * 0.7);
  g.fillStyle = "#7a857e";
  g.font = `500 ${Math.round(h * 0.075)}px Inter, Arial, sans-serif`;
  g.fillText(p.size, w / 2, h * 0.85);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  labelCache.set(key, t);
  return t;
}

function Body({ p, profile }) {
  const geo = useMemo(() => new THREE.LatheGeometry(PROFILES[profile], 64), [profile]);
  return (
    <mesh geometry={geo} castShadow>
      <meshPhysicalMaterial color={p.c[0]} roughness={0.18} clearcoat={1} clearcoatRoughness={0.08} envMapIntensity={1.2} />
    </mesh>
  );
}

// A label wrapped round the front of a cylinder
function WrapLabel({ p, r, h, y }) {
  const tex = useMemo(() => labelTexture(p), [p]);
  const arc = (h * 512) / 320; // keep the label's aspect ratio
  const L = Math.min(arc / r, Math.PI * 1.4);
  return (
    <mesh position={[0, y, 0]}>
      <cylinderGeometry args={[r, r, h, 64, 1, true, -L / 2, L]} />
      <meshStandardMaterial map={tex} roughness={0.55} polygonOffset polygonOffsetFactor={-2} />
    </mesh>
  );
}

const Rubber = (props) => <meshStandardMaterial color="#232323" roughness={0.55} {...props} />;
const Gold = () => <meshStandardMaterial color="#cfae72" metalness={0.85} roughness={0.28} />;

function Dropper({ p }) {
  return (
    <group>
      <Body p={p} profile="dropper" />
      <WrapLabel p={p} r={0.585} h={0.62} y={0.66} />
      <mesh position={[0, 1.61, 0]}><cylinderGeometry args={[0.26, 0.26, 0.22, 48]} /><Gold /></mesh>
      <mesh position={[0, 1.88, 0]}><cylinderGeometry args={[0.19, 0.22, 0.34, 48]} /><Rubber /></mesh>
      <mesh position={[0, 2.05, 0]}><sphereGeometry args={[0.19, 32, 16]} /><Rubber /></mesh>
    </group>
  );
}
function Pump({ p }) {
  return (
    <group>
      <Body p={p} profile="pump" />
      <WrapLabel p={p} r={0.625} h={0.72} y={0.85} />
      <mesh position={[0, 1.94, 0]}><cylinderGeometry args={[0.27, 0.27, 0.2, 48]} /><Rubber /></mesh>
      <mesh position={[0, 2.16, 0]}><cylinderGeometry args={[0.07, 0.07, 0.28, 24]} /><Rubber /></mesh>
      <mesh position={[0, 2.34, 0]}><boxGeometry args={[0.26, 0.16, 0.26]} /><Rubber /></mesh>
      <mesh position={[0.28, 2.37, 0]}><boxGeometry args={[0.36, 0.08, 0.09]} /><Rubber /></mesh>
    </group>
  );
}
function Jar({ p }) {
  return (
    <group>
      <Body p={p} profile="jar" />
      <WrapLabel p={p} r={0.985} h={0.42} y={0.44} />
      <mesh position={[0, 1.0, 0]}><cylinderGeometry args={[1.0, 1.0, 0.38, 64]} /><Rubber roughness={0.4} /></mesh>
      <mesh position={[0, 1.195, 0]}><cylinderGeometry args={[0.8, 0.8, 0.012, 64]} /><Gold /></mesh>
    </group>
  );
}
function Tube({ p }) {
  const tex = useMemo(() => labelTexture(p, 512, 512), [p]);
  return (
    <group>
      <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.3, 0.32, 0.44, 48]} /><Rubber /></mesh>
      <mesh position={[0, 1.39, 0]} scale={[1, 1, 0.55]} castShadow>
        <cylinderGeometry args={[0.6, 0.36, 1.9, 64]} />
        <meshPhysicalMaterial color={p.c[0]} roughness={0.3} clearcoat={0.6} clearcoatRoughness={0.2} />
      </mesh>
      <mesh position={[0, 2.39, 0]}><boxGeometry args={[1.24, 0.14, 0.18]} /><meshStandardMaterial color={p.c[1]} roughness={0.4} /></mesh>
      <mesh position={[0, 1.5, 0.287]} rotation={[0.07, 0, 0]}>
        <planeGeometry args={[0.66, 0.66]} />
        <meshStandardMaterial map={tex} roughness={0.55} polygonOffset polygonOffsetFactor={-2} />
      </mesh>
    </group>
  );
}
function Toner({ p }) {
  return (
    <group>
      <Body p={p} profile="bottle" />
      <WrapLabel p={p} r={0.605} h={0.64} y={0.7} />
      <mesh position={[0, 1.86, 0]}><cylinderGeometry args={[0.22, 0.22, 0.42, 48]} /><Rubber /></mesh>
    </group>
  );
}

const SHAPES = { dropper: Dropper, pump: Pump, jar: Jar, tube: Tube, bottle: Toner };

/**
 * <Bottle p={product} />
 * centre: put the model's middle at the origin (good for spinning)
 * fit:    scale so every product is roughly the same height
 * interactive: hover grow + pointer cursor, onClick handler
 */
export default function Bottle({ p, centre = true, fit, interactive, onClick, ...props }) {
  const [hover, setHover] = useState(false);
  const Shape = SHAPES[p.shape] || Toner;
  const h = HEIGHTS[p.shape];
  const s = fit ? Math.min(fit / h, 1.7) : 1;
  const grow = hover ? 1.07 : 1;
  return (
    <group {...props} scale={[s * grow, s * grow, s * grow]}>
      <group
        position={[0, centre ? -h / 2 : 0, 0]}
        onClick={interactive ? (e) => { e.stopPropagation(); onClick?.(p.id); } : undefined}
        onPointerOver={interactive ? (e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; } : undefined}
        onPointerOut={interactive ? () => { setHover(false); document.body.style.cursor = ""; } : undefined}
      >
        <Shape p={p} />
      </group>
    </group>
  );
}
