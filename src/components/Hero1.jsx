'use client';

import React, { useState } from 'react';
import Tilt from 'react-parallax-tilt';

const HeroLanding = () => {
  const [activeTab, setActiveTab] = useState('Productivity');
  const tabs = ['Productivity', 'Ecommerce', 'Social', 'AI'];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        {/* Left: Hero Content */}
        <div className="lg:w-1/2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-950 text-blue-400 text-sm font-medium mb-6">
            Get Pro – Limited time offer
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Build faster than AI<br /> with Once UI for Next.js
          </h1>
          <p className="text-gray-400 mb-6">
            The open-source stack that helps you ship faster than VC-backed startups
          </p>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-black bg-gray-300"
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">Used by 1k+ indie creators</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-zinc-800 text-white text-sm px-4 py-2 rounded-md font-mono flex items-center">
              npx create-once-ui-app@latest
              <span className="ml-2">📋</span>
            </div>
            <button className="bg-white text-black px-5 py-2 rounded-md shadow hover:bg-gray-100 transition">
              Start building
            </button>
          </div>
        </div>

        {/* Right: Preview Tilted Board */}
        <div className="lg:w-1/2">
          <Tilt
            tiltEnable={true}
            tiltMaxAngleX={8}
            tiltMaxAngleY={8}
            perspective={1000}
            scale={1.02}
            transitionSpeed={2000}
            className="w-full"
          >
            <div className="transform rotate-x-[4deg] rotate-y-[-8deg] scale-[0.95] hover:rotate-x-0 hover:rotate-y-0 hover:scale-100 transition-all duration-700 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-6">
              <div className="flex gap-2 mb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1 text-sm rounded-full transition-all border border-zinc-600 ${
                      activeTab === tab ? 'bg-white text-black' : 'bg-zinc-800 text-white/60 hover:bg-zinc-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="bg-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Platform Squad</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['To do', 'In progress', 'Done'].map((column) => (
                    <div key={column}>
                      <h4 className="text-sm font-medium text-white/80 mb-2">{column}</h4>
                      <div className="space-y-3">
                        {[1, 2].map((i) => (
                          <div
                            key={i}
                            className="bg-zinc-700 p-4 rounded-lg shadow hover:shadow-xl transition border border-zinc-600"
                          >
                            <h5 className="text-sm font-semibold mb-1">Task #{i}</h5>
                            <p className="text-xs text-white/60 mb-2">Description of task #{i}</p>
                            <span className="text-xs bg-zinc-600 px-2 py-1 rounded-full">Frontend</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Tilt>
        </div>
      </div>
    </div>
  );
};

export default HeroLanding;
