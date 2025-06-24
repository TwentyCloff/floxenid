import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

function DuckModel() {
  const { scene } = useGLTF('/Duck.glb'); // Otomatis dari folder public
  return <primitive object={scene} scale={2.5} />;
}

export default function Hero() {
  return (
    <section className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full h-[500px]">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 3, 3]} />
          <OrbitControls enableZoom={false} />
          <DuckModel />
        </Canvas>
      </div>
    </section>
  );
}

// Preload model
useGLTF.preload('/Duck.glb');
