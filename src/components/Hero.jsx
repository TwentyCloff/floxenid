import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

function Robot({ mouse }) {
  const group = useRef();
  const { scene, nodes } = useGLTF('/cute_robot.glb');
  const head = useRef();

  useEffect(() => {
    // Auto find node yang punya kata 'head' di nama
    const found = scene.getObjectByName('head') || scene.getObjectByName('Head') || Object.values(nodes).find(n => n.name?.toLowerCase().includes('head'));
    if (found) head.current = found;
  }, [nodes, scene]);

  useFrame(() => {
    if (head.current && mouse.current) {
      head.current.rotation.y = mouse.current.x * 0.5;
      head.current.rotation.x = mouse.current.y * 0.3;
    }
  });

  return <primitive object={scene} scale={1.5} position={[0, -1.5, 0]} />;
}

function HeroCanvas() {
  const mouse = useRef({ x: 0, y: 0 });

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <Robot mouse={mouse} />
      <mesh
        onPointerMove={(e) => {
          mouse.current = {
            x: (e.pointer.x / window.innerWidth) * 2 - 1,
            y: -((e.pointer.y / window.innerHeight) * 2 - 1),
          };
        }}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </Canvas>
  );
}

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-6xl px-4">
        <HeroCanvas />
      </div>
    </section>
  );
}

useGLTF.preload('/cute_robot.glb');
