'use client';

import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';

const HeroLanding = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Golden reflection background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-50 blur-3xl"
          style={{ transform: 'translate(-50%, -50%)' }}
        ></div>
        <div 
          className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-yellow-50 to-amber-50 blur-3xl"
          style={{ transform: 'translate(50%, -50%)' }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium mb-6 backdrop-blur-md bg-white/30 border border-white/20 shadow-sm">
          <span className="mr-2">✨</span> Get Pro – Limited time offer
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900">
          Build smarter, faster than AI — <br className="hidden md:block" />
          powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Floxen</span>.
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          The open-source stack for providing ready-to-use game scripts and premium tools with zero setup.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="relative inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
            <span className="relative z-10">Get started</span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
          </button>
          <button className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 text-gray-800 font-medium shadow-sm hover:shadow-md transition-all duration-300">
            <MessageSquare className="mr-2 h-4 w-4" />
            Our Community
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroLanding;
