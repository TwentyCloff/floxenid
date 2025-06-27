'use client';

import React, { useState } from 'react';
import Tilt from 'react-parallax-tilt';

const HeroLanding = () => {
  const [activeTab, setActiveTab] = useState('Product');
  const [hoveredTab, setHoveredTab] = useState(null);

  const tabs = ['Product', 'Docs', 'Resource', 'Pricing'];
  const menuItems = ['Dashboard', 'Product', 'History', 'Settings'];

  return (
    <div className="min-h-screen bg-white">
      {/* Dot pattern background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
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

      {/* Main content container */}
      <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side - Hero Section */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-sm font-medium mb-6">
              Get Pro – Limited time offer
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Build faster than AI with Once UI for Next.js
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              The most complete UI kit for Next.js with 150+ components, templates, and design system. 
              Accelerate your development process with our carefully crafted components.
            </p>
            <div className="flex items-center mb-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div 
                    key={item}
                    className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
                    style={{ zIndex: 5 - item }}
                  />
                ))}
              </div>
              <span className="ml-3 text-gray-600 text-sm">Used by 3k+ people</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                Get Started
              </button>
              <button className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md">
                Our Community
              </button>
            </div>
          </div>

          {/* Right Side - UI Preview Board */}
          <div className="lg:w-1/2">
            <Tilt
              tiltEnable={true}
              tiltMaxAngleX={8}
              tiltMaxAngleY={8}
              glareEnable={true}
              glareMaxOpacity={0.1}
              glareColor="#ffffff"
              glarePosition="all"
              scale={1.02}
              transitionSpeed={2000}
              className="w-full perspective-[1000px]"
            >
              <div className="transform scale-[0.95] rotate-x-[2deg] rotate-y-[-6deg] transition-all duration-700 hover:rotate-x-0 hover:rotate-y-0 hover:scale-100 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xl">
                <div className="flex border-b border-gray-200">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      onMouseEnter={() => setHoveredTab(tab)}
                      onMouseLeave={() => setHoveredTab(null)}
                      className={`px-4 py-3 text-sm font-medium relative 
                        ${activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {tab}
                      {(activeTab === tab || hoveredTab === tab) && (
                        <div 
                          className={`absolute bottom-0 left-0 right-0 h-0.5 
                            ${activeTab === tab ? 'bg-blue-600' : 'bg-gray-200'}`}
                        />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex">
                  <div className="w-16 md:w-20 bg-gray-50 border-r border-gray-200">
                    <div className="py-4 flex flex-col items-center">
                      {menuItems.map((item, index) => (
                        <button
                          key={item}
                          className={`w-full py-3 flex flex-col items-center text-xs 
                            ${index === 1 ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          <div className="w-6 h-6 mb-1 bg-gray-200 rounded"></div>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="text-sm text-gray-500">{activeTab} content goes here...</div>
                  </div>
                </div>
              </div>
            </Tilt>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroLanding;
