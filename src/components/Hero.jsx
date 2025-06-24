import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

function Robot() {
  const { scene } = useGLTF('/cute_robot.glb');
  return <primitive object={scene} scale={1.5} position={[0, -1.5, 0]} />;
}

export default function Hero() {
  return (
    <section className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full h-[500px]">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} />
          <OrbitControls enableZoom={false} enablePan={false} />
          <Robot />
        </Canvas>
      </div>
    </section>
  );
}

useGLTF.preload('/cute_robot.glb');
