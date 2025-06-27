import React from "react";

const CallToAction = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#0f0f0f] rounded-xl py-24 px-6 sm:px-12 text-center">
      {/* Glow Background Gradient */}
      <div
        className="absolute inset-0 z-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-br from-orange-500 via-yellow-400 to-red-500 opacity-20 blur-3xl rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto">
        <button className="text-xs mb-4 border border-white/20 text-white/60 px-4 py-1.5 rounded-full hover:bg-white/10 transition">
          Get started
        </button>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
          Start building with Launch UI
        </h1>
        <p className="text-sm text-white/50 mb-8">
          Get started with Launch UI and build your landing page in no time.
        </p>
        <button className="inline-block bg-white text-black font-medium px-6 py-2.5 rounded-md hover:bg-gray-200 transition shadow-md">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default CallToAction;
