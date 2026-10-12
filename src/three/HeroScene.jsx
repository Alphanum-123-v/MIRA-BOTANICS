import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import Bottle from "./Bottle";
import Lighting from "./Lighting";
import { byId } from "../data/products";

const scroll = { y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener("scroll", () => { scroll.y = window.scrollY; }, { passive: true });
}

// Tilts the whole product group towards the mouse / finger
function PointerRig({ children, still }) {
  const ref = useRef();
  const { size } = useThree();
  const narrow = size.width / size.height < 1;
  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    const tx = still ? 0 : state.pointer.x * 0.45;
    const ty = still ? 0 : -state.pointer.y * 0.15;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, tx, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, ty, 3, dt);
    // drift up a little as the page scrolls
    g.position.y = THREE.MathUtils.damp(g.position.y, Math.min(scroll.y, 800) * 0.0015, 4, dt);
  });
  return <group ref={ref} scale={narrow ? 0.78 : 1}>{children}</group>;
}

// Floating pollen particles that swirl as you scroll
function Particles({ count = 260, still }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 14;
      a[i * 3 + 1] = (Math.random() - 0.5) * 9;
      a[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    return a;
  }, [count]);
  useFrame((state, dt) => {
    if (!ref.current || still) return;
    ref.current.rotation.y += dt * 0.03;
    ref.current.rotation.z = THREE.MathUtils.damp(ref.current.rotation.z, scroll.y * 0.0006, 3, dt);
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#fff6ec" transparent opacity={0.85} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// Soft, wobbling colour blobs behind the products
function Blobs({ still }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, -Math.min(scroll.y, 800) * 0.003, 3, dt);
  });
  const speed = still ? 0 : 1.4;
  return (
    <group ref={ref}>
      <mesh position={[-3.4, 1.6, -6]}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <MeshDistortMaterial color="#fbd8bf" distort={0.35} speed={speed} roughness={0.6} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh position={[3.6, -1.2, -7]}>
        <sphereGeometry args={[2.6, 64, 64]} />
        <MeshDistortMaterial color="#2f5a40" distort={0.3} speed={speed} roughness={0.6} transparent opacity={0.14} depthWrite={false} />
      </mesh>
      <mesh position={[1.2, 2.6, -8]}>
        <sphereGeometry args={[1.8, 48, 48]} />
        <MeshDistortMaterial color="#fff3e6" distort={0.4} speed={speed} roughness={0.5} transparent opacity={0.6} depthWrite={false} />
      </mesh>
    </group>
  );
}

const LAYOUT = [
  { id: "spf", position: [-1.35, -0.15, 0.2], rotation: [0, 0.35, 0.06], fit: 2.5 },
  { id: "vitc", position: [0.15, 0.25, -0.7], rotation: [0, -0.25, 0], fit: 2.85 },
  { id: "shea", position: [1.25, -0.8, 0.55], rotation: [0.12, -0.45, 0], fit: 1.2 },
];

export default function HeroScene({ active = true, onSelect, still = false }) {
  return (
    <Canvas
      className="hero-canvas"
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.3, 7.6], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Lighting />
      <Blobs still={still} />
      <Particles still={still} />
      <PointerRig still={still}>
        {LAYOUT.map((l, i) => (
          <Float key={l.id} speed={still ? 0 : 1.6 + i * 0.3} rotationIntensity={still ? 0 : 0.35} floatIntensity={still ? 0 : 0.7}>
            <Bottle p={byId(l.id)} position={l.position} rotation={l.rotation} fit={l.fit} interactive onClick={onSelect} />
          </Float>
        ))}
      </PointerRig>
      <ContactShadows position={[0, -1.75, 0]} opacity={0.32} scale={9} blur={2.6} far={3.5} color="#5a3a25" />
    </Canvas>
  );
}
