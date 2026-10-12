import { Environment, Lightformer } from "@react-three/drei";

// Studio lighting made from light panels, so no HDR image has to be downloaded.
export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} color="#fff4ea" />
      <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#ffd9c2" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 4, 4]} scale={[10, 2, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.4} position={[-5, 1, 2]} scale={[4, 6, 1]} color="#ffe2cc" target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1} position={[5, 0, 1]} scale={[4, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={0.6} position={[0, -3, 3]} scale={3} color="#f3e0d6" target={[0, 0, 0]} />
      </Environment>
    </>
  );
}
