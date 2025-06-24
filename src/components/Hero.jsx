import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Verified } from "lucide-react";

// 3D Robot
function Robot({ mouse }) {
  const group = useRef();
  const { scene } = useGLTF("/cute_robot.glb");

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = mouse.current.x * 0.5;
      group.current.rotation.x = mouse.current.y * 0.3;
    }
  });

  return (
    <primitive ref={group} object={scene} scale={1.5} position={[0, -1.5, 0]} />
  );
}

export default function Hero() {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    mouse.current = {
      x: (e.clientX / innerWidth - 0.5) * 2,
      y: (e.clientY / innerHeight - 0.5) * 2,
    };
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Side */}
          <div className="z-10">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
              <Verified className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="font-medium text-white">Get Pro – Limited time</span>
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
          </div>

          {/* 3D Robot Side */}
          <div className="h-[400px] lg:h-[500px] relative">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[0, 5, 5]} intensity={1} />
              <Robot mouse={mouse} />
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
}

// Preload the robot model
useGLTF.preload("/cute_robot.glb");
