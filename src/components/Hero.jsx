import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

function DuckModel() {
  const { scene } = useGLTF("/Duck.glb");
  return <primitive object={scene} scale={2} />;
}
useGLTF.preload("/Duck.glb");

export default function Hero() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1} />
        <OrbitControls />
        <Suspense fallback={null}>
          <DuckModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
