import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, Float } from "@react-three/drei";
import Bottle from "./Bottle";
import Lighting from "./Lighting";

// Drag-to-rotate product viewer used in quick view and on product pages
export default function ViewerScene({ p, still = false }) {
  const [touched, setTouched] = useState(false);
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.35, 5.6], fov: 35 }} gl={{ antialias: true, alpha: true }}>
      <Lighting />
      <Float speed={still ? 0 : 1.4} rotationIntensity={0} floatIntensity={still ? 0 : 0.35}>
        <Bottle key={p.id} p={p} fit={2.4} />
      </Float>
      <ContactShadows position={[0, -1.4, 0]} opacity={0.35} scale={6} blur={2.4} far={3} color="#3b2a1e" />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        autoRotate={!touched && !still}
        autoRotateSpeed={2.2}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.75}
        onStart={() => setTouched(true)}
      />
    </Canvas>
  );
}
