'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  ArrowRight, 
  Rocket,
  CheckCircle
} from 'lucide-react';

const SimplifiedCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-neutral-950 py-16 px-4">
      {/* Simple Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-emerald-400/5 via-transparent to-transparent" />
        
        {/* Minimal floating orbs */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-3xl opacity-10"
              style={{
                left: `${20 + (i * 30)}%`,
                top: `${20 + (i * 20)}%`,
                width: `${80 + i * 20}px`,
                height: `${80 + i * 20}px`,
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
                animation: `float ${6 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 1}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div 
        ref={sectionRef}
        className="relative z-10 max-w-4xl mx-auto"
      >
        {/* Main CTA Card */}
        <div
          className={`relative group transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
        >
          {/* Simple Card */}
          <div className="relative overflow-hidden rounded-2xl">
            <div className={`relative rounded-2xl bg-gradient-to-br from-neutral-900/95 to-neutral-800/90 border transition-all duration-500 shadow-xl backdrop-blur-xl ${isHovered ? 'scale-[1.01] shadow-2xl shadow-emerald-400/25 border-emerald-400/60' : 'border-neutral-700/50'}`}>
              
              {/* Sophisticated glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/20 via-emerald-300/30 to-emerald-400/20 blur-2xl transition-all duration-700 ${isHovered ? 'opacity-70 scale-105' : 'opacity-0 scale-95'}`} />
              
              {/* Subtle spotlight following mouse */}
              {isHovered && (
                <div
                  className="absolute inset-0 rounded-2xl opacity-40 pointer-events-none transition-all duration-300"
                  style={{
                    background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.15) 0%, transparent 60%)`,
                  }}
                />
              )}

              {/* Elegant border shimmer */}
              {isHovered && (
                <div className="absolute inset-0 rounded-2xl border border-emerald-400/30 animate-pulse" />
              )}
              
              {/* Content */}
              <div className="relative z-10 p-8 md:p-12 text-center">
                {/* Simple Headline */}
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${isHovered ? 'scale-105' : 'scale-100'}`}>
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r transition-all duration-500 ${isHovered ? 'from-emerald-300 via-white to-emerald-300' : 'from-white to-emerald-400'}`}>
                    BUILD THE FUTURE
                  </span>
                </h1>

                {/* Simple Description */}
                <p className={`text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed mb-8 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${isHovered ? 'text-neutral-200' : ''}`}>
                  Join thousands of developers building amazing projects.
                  <br />
                  <span className={`font-semibold transition-all duration-500 ${isHovered ? 'text-emerald-300' : 'text-white'}`}>Fast. Simple. Powerful.</span>
                </p>

                {/* Action Buttons */}
                <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                  {/* Primary CTA */}
                  <button className={`group relative inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-neutral-900 font-bold text-lg transition-all duration-300 shadow-lg active:scale-95 transform overflow-hidden ${isHovered ? 'hover:scale-110 shadow-emerald-400/50' : 'hover:scale-105 shadow-emerald-400/30'}`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Rocket className="mr-3 h-5 w-5 group-hover:animate-bounce relative z-10" />
                    <span className="relative z-10">GET STARTED</span>
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                  </button>

                  {/* Secondary CTA */}
                  <button className={`group relative inline-flex items-center px-8 py-4 rounded-xl bg-transparent border text-emerald-400 font-semibold text-lg transition-all duration-300 active:scale-95 transform ${isHovered ? 'hover:scale-110 border-emerald-400/80 hover:bg-emerald-400/15' : 'hover:scale-105 border-emerald-400/40 hover:bg-emerald-400/10'}`}>
                    <span className="group-hover:text-emerald-300 transition-colors duration-300">Learn More</span>
                    <div className="absolute inset-0 bg-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  </button>
                </div>

                {/* Simple Trust Indicators */}
                <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 text-neutral-400 text-sm transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                  <div className={`flex items-center transition-all duration-300 ${isHovered ? 'text-neutral-300' : ''}`}>
                    <CheckCircle className={`w-4 h-4 mr-2 transition-all duration-300 ${isHovered ? 'text-emerald-300' : 'text-emerald-400'}`} />
                    <span>Free Forever</span>
                  </div>
                  <div className={`flex items-center transition-all duration-300 ${isHovered ? 'text-neutral-300' : ''}`}>
                    <CheckCircle className={`w-4 h-4 mr-2 transition-all duration-300 ${isHovered ? 'text-emerald-300' : 'text-emerald-400'}`} />
                    <span>No Credit Card</span>
                  </div>
                  <div className={`flex items-center transition-all duration-300 ${isHovered ? 'text-neutral-300' : ''}`}>
                    <CheckCircle className={`w-4 h-4 mr-2 transition-all duration-300 ${isHovered ? 'text-emerald-300' : 'text-emerald-400'}`} />
                    <span>Deploy in 30s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px);
          }
          50% { 
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default SimplifiedCTA;