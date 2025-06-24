import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Duck() {
  const { scene } = useGLTF('/Duck.glb');
  return <primitive object={scene} scale={2.5} />;
}

export default function Hero() {
  return (
    <section className="w-full h-screen bg-black flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <OrbitControls />
        <Suspense fallback={null}>
          <Duck />
        </Suspense>
      </Canvas>
    </section>
  );
}

useGLTF.preload('/Duck.glb');
