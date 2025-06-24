// src/components/Hero.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { Verified } from 'lucide-react';
import * as THREE from 'three';

// Robot 3D model
function Robot({ mouse }) {
  const group = useRef();
  const headRef = useRef();
  const { scene, nodes } = useGLTF('/cute_robot.glb');

  // Cari node "head"
  useEffect(() => {
    const possibleHead = Object.values(nodes).find(
      (node) =>
        node.name.toLowerCase().includes('head') ||
        node.name.toLowerCase().includes('face')
    );
    if (possibleHead) {
      headRef.current = possibleHead;
    } else {
      headRef.current = group.current;
    }
  }, [nodes]);

  // Gerakkan kepala
  useFrame(() => {
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        mouse.current.x * 0.5,
        0.1
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        -mouse.current.y * 0.3,
        0.1
      );
    }
  });

  return <primitive ref={group} object={scene} scale={1.5} position={[0, -1.5, 0]} />;
}

// Main Hero component
export default function Hero() {
  const mouse = useRef({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    mouse.current = {
      x: (e.clientX / innerWidth) * 2 - 1,
      y: (e.clientY / innerHeight) * 2 - 1,
    };
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-gray-900 to-black"
      onMouseMove={handleMouseMove}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
              <Verified className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="font-medium text-white">
                Get Pro – Limited time offer
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Build smarter, faster than AI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                powered by Floxen
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
              The open-source stack for providing ready-to-use game scripts and
              premium tools with zero setup.
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

          {/* Right Content - 3D Canvas */}
          <div className="h-[400px] lg:h-[500px] relative">
            <Canvas
              gl={{ antialias: true }}
              camera={{ position: [0, 0, 5], fov: 50 }}
              className="rounded-xl overflow-hidden"
            >
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <OrbitControls enableZoom={false} enablePan={false} />
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

// Preload GLB
useGLTF.preload('/cute_robot.glb');
