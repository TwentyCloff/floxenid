import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Robot({ mouse }) {
  const robotRef = useRef();
  const headRef = useRef();
  const { scene } = useGLTF('/cute_robot.glb');

  useEffect(() => {
    // Cari node kepala otomatis
    scene.traverse((child) => {
      if (child.name.toLowerCase().includes('head') || child.name.toLowerCase().includes('face')) {
        headRef.current = child;
      }
    });

    robotRef.current.add(scene);
  }, [scene]);

  useFrame(() => {
    if (headRef.current && mouse.current) {
      headRef.current.rotation.y = mouse.current.x * 0.4;
      headRef.current.rotation.x = mouse.current.y * 0.2;
    }
  });

  return <group ref={robotRef} scale={1.5} position={[0, -1.5, 0]} />;
}

function RobotScene({ mouse }) {
  const { size } = useThree();

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 2]} intensity={1} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <Robot mouse={mouse} />
      <mesh
        onPointerMove={(e) => {
          mouse.current = {
            x: (e.pointer.x / size.width) * 2 - 1,
            y: -((e.pointer.y / size.height) * 2 - 1),
          };
        }}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

export default function Hero() {
  const mouse = useRef({ x: 0, y: 0 });

  return (
    <section className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full h-[500px]">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <RobotScene mouse={mouse} />
        </Canvas>
      </div>
    </section>
  );
}

useGLTF.preload('/cute_robot.glb');
