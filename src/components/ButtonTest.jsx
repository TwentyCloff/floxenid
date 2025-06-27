import React from 'react';

const CallToAction = () => {
  return (
    <div className="relative bg-black text-white py-24 px-6 rounded-lg overflow-hidden isolate">

      {/* Left glow */}
      <div className="absolute left-[-150px] top-0 h-full w-[300px] bg-orange-500 opacity-30 blur-3xl rounded-full" />
      {/* Right glow */}
      <div className="absolute right-[-150px] top-0 h-full w-[300px] bg-orange-500 opacity-30 blur-3xl rounded-full" />
      {/* Bottom glow */}
      <div className="absolute bottom-0 left-0 w-full h-[100px] bg-orange-500 opacity-20 blur-2xl" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <button className="text-sm px-3 py-1 rounded-full border border-gray-600 mb-4 text-gray-300 hover:bg-gray-800 transition">
          Get started
        </button>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start building with Launch UI
        </h2>
        <p className="text-gray-400 mb-6">
          Get started with Launch UI and build your landing page in no time
        </p>
        <button className="bg-white text-black font-medium px-5 py-2 rounded-md shadow-md hover:bg-gray-200 transition">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
