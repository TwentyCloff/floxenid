'use client';

import React from 'react';
import Typewriter from 'typewriter-effect';
import Section from './Section';
import Spline from '@splinetool/react-spline'; // langsung import tanpa lazy

const Hero = () => {
  const ROBOT_SCENE_URL = 'https://prod.spline.design/zK6boI3lfAHoTjb4/scene.splinecode';

  return (
    <Section
      id="hero"
      customPaddings
      className="pt-[12rem] -mt-[5.25rem] relative overflow-hidden"
    >
      {/* White background */}
      <div className="absolute inset-0 z-[-20] bg-white" />

      {/* Dot pattern background with fade effects */}
      <div className="absolute inset-0 z-[-15] overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-10" />
        <svg className="w-full h-full" aria-hidden="true">
          <defs>
            <pattern
              id="dot-pattern"
              width="20.4"
              height="20.4"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(1)"
            >
              <circle cx="10.2" cy="10.2" r="1" fill="rgba(160, 160, 160, 0.2)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" opacity="1" />
        </svg>
      </div>

      {/* === 🚀 3D Robot Whobee Layer === */}
      <div 
        className="absolute left-0 right-0 z-[-10]" 
        style={{ top: '20rem', height: 'calc(100% - 6rem)' }}
      >
        <Spline scene={ROBOT_SCENE_URL} />
      </div>

      {/* Main content */}
      <div className="container relative z-10">
        <div className="relative max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
          <h1 className="h1 mb-6 text-gray-800">
            Empower Your Scripts With
            <br />
            <span className="text-[1.4rem] sm:text-[1.75rem] md:text-[2rem] leading-snug block">
              <Typewriter
                options={{
                  strings: [
                    'Fast Execution',
                    'Continuous Improvement',
                    '24/7 Support',
                    'User-Friendly Interface',
                    'Optimized Performance',
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  deleteSpeed: 30,
                }}
              />
            </span>
          </h1>

          <p className="body-1 max-w-3xl mx-auto mb-6 text-gray-600 lg:mb-8">
            Unlock the next level of game scripting with{' '}
            <span className="inline-block relative font-semibold text-gray-800">
              Qarvo
            </span>
            .network
          </p>

          <a
            href="#pricing"
            className="inline-block px-7 py-3 rounded-full border border-gray-300 text-gray-800 font-semibold
                       bg-white hover:bg-gray-50 transition-all duration-300 shadow-md
                       focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            aria-label="Get started with Qarvo"
          >
            Get started
          </a>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
