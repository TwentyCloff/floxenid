import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { Crown, Zap, Verified } from 'lucide-react';

// 3D Robot Component
function Robot({ mouse }) {
  const group = useRef();
  const head = useRef();
  const { nodes, materials } = useGLTF('/cute_robot.glb');
  
  useFrame(() => {
    if (head.current) {
      // Smooth head follow for mouse movement
      head.current.rotation.y = mouse.current.x * 0.2;
      head.current.rotation.x = mouse.current.y * 0.1;
    }
  });

  // Fallback if no specific head node found
  useEffect(() => {
    if (!nodes.Head && group.current) {
      // Try to find head by common naming patterns
      const headNode = Object.values(nodes).find(node => 
        node.name.toLowerCase().includes('head') || 
        node.name.toLowerCase().includes('face')
      );
      if (headNode) {
        head.current = headNode;
      } else {
        // Use the whole model if no head found
        head.current = group.current;
      }
    }
  }, [nodes]);

  return (
    <group ref={group} dispose={null}>
      <primitive 
        object={nodes.Scene} 
        scale={1.5}
        position={[0, -1.5, 0]}
      />
    </group>
  );
}

// Mouse Tracker Component
function Scene({ setMouse }) {
  const { viewport } = useThree();
  const handlePointerMove = (e) => {
    setMouse({
      x: (e.intersections[0]?.uv?.x || 0.5) * 2 - 1,
      y: (e.intersections[0]?.uv?.y || 0.5) * 2 - 1
    });
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <mesh onPointerMove={handlePointerMove}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

// Main Hero Component
export default function Hero() {
  const mouse = useRef({ x: 0, y: 0 });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            {/* Glassmorphism Label */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
              <Verified className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="font-medium text-white">Get Pro – Limited time offer</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Build smarter, faster than AI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                powered by Floxen
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
              The open-source stack for providing ready-to-use game scripts and premium tools with zero setup.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#pricing"
                className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:shadow-lg transition-all"
              >
                Get Started
              </a>
              <a
                href="#features"
                className="px-8 py-3 rounded-full border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 transition-all"
              >
                Explore Features
              </a>
            </div>

            {/* Trust badges can be added here */}
          </div>

          {/* Right Content - 3D Robot */}
          <div className="h-[400px] lg:h-[500px] relative">
            <Canvas
              gl={{ antialias: true }}
              camera={{ position: [0, 0, 5], fov: 50 }}
              className="rounded-xl overflow-hidden"
            >
              <Scene setMouse={(pos) => { mouse.current = pos; }} />
              <Robot mouse={mouse} />
            </Canvas>
          </div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-0" />
    </section>
  );
}

// Preload the model
useGLTF.preload('/cute_robot.glb');
