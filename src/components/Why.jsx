'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  Shield, 
  Zap, 
  Trophy, 
  Sparkles, 
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

const WhyChooseUs = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
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

  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and security protocols to protect your code and data with zero vulnerabilities.",
      color: "emerald",
      gradient: "from-emerald-400 to-emerald-600",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-400/20",
      bgColor: "bg-emerald-400/10",
      stats: "99.9% Uptime",
      hoverColor: "hover:shadow-emerald-400/25"
    },
    {
      icon: Zap,
      title: "Lightning Performance",
      description: "Optimized for speed with cutting-edge caching and CDN integration for instant global deployment.",
      color: "blue",
      gradient: "from-blue-400 to-blue-600",
      textColor: "text-blue-400",
      borderColor: "border-blue-400/20",
      bgColor: "bg-blue-400/10",
      stats: "< 100ms Response",
      hoverColor: "hover:shadow-blue-400/25"
    },
    {
      icon: Trophy,
      title: "Industry Leader",
      description: "Trusted by Fortune 500 companies and top developers worldwide for mission-critical applications.",
      color: "purple",
      gradient: "from-purple-400 to-purple-600",
      textColor: "text-purple-400",
      borderColor: "border-purple-400/20",
      bgColor: "bg-purple-400/10",
      stats: "500K+ Developers",
      hoverColor: "hover:shadow-purple-400/25"
    }
  ];

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-neutral-950 py-12 md:py-20 px-4">
      {/* Custom CSS for smooth animations */}
      <style jsx>{`
        @keyframes smoothFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.1;
          }
          25% { 
            transform: translateY(-20px) translateX(10px) scale(1.05);
            opacity: 0.15;
          }
          50% { 
            transform: translateY(-15px) translateX(-5px) scale(1.1);
            opacity: 0.2;
          }
          75% { 
            transform: translateY(-25px) translateX(15px) scale(1.05);
            opacity: 0.15;
          }
        }
      `}</style>

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-emerald-400/5 via-transparent to-blue-400/5" />
        
        {/* Smooth Animated orbs - responsive count */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-3xl opacity-15"
              style={{
                left: `${15 + (i * 12)}%`,
                top: `${10 + (i * 15)}%`,
                width: `${100 + Math.random() * 40}px`,
                height: `${100 + Math.random() * 40}px`,
                background: `linear-gradient(135deg, 
                  ${i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#3b82f6' : '#8b5cf6'} 0%, 
                  transparent 70%)`,
                animation: `smoothFloat ${8 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 1.5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div 
        ref={sectionRef}
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div 
            className={`inline-flex items-center px-4 py-2 rounded-full bg-neutral-900/80 border border-emerald-400/30 text-emerald-400 font-mono text-sm mb-6 shadow-lg shadow-emerald-400/10 backdrop-blur-sm transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <Star className="mr-2 h-4 w-4 animate-pulse" />
            <span>Why Choose Our Platform</span>
          </div>

          <h2 
            className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-emerald-400 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            Where Innovation <span className="text-emerald-400 animate-pulse">Meets</span> Excellence
          </h2>

          <p 
            className={`text-base md:text-lg lg:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            Discover the <span className="text-white font-medium">future of technology</span> with our cutting-edge platform. 
            Engineered for <span className="text-emerald-400 font-medium">performance and reliability</span>.
          </p>
        </div>

        {/* Enhanced Features Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredCard === index;
            
            return (
              <div
                key={index}
                className={`relative group cursor-pointer transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onMouseMove={(e) => handleMouseMove(e, index)}
              >
                <div className="relative h-full min-h-[320px] md:min-h-[350px]">
                  {/* Enhanced Card Background */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-neutral-900/90 via-neutral-800/50 to-neutral-900/90 border border-neutral-700/50 backdrop-blur-sm transition-all duration-500 ${isHovered ? 'scale-105 border-neutral-600 shadow-2xl ' + feature.hoverColor : 'scale-100'}`}
                  />
                  
                  {/* Dynamic Glow Effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 blur-xl bg-gradient-to-r ${feature.gradient} ${isHovered ? 'opacity-20' : 'opacity-0'}`}
                    style={{
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.5s ease-out'
                    }}
                  />

                  {/* Spotlight Effect */}
                  {isHovered && (
                    <div
                      className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${feature.color === 'emerald' ? 'rgba(16, 185, 129, 0.3)' : feature.color === 'blue' ? 'rgba(59, 130, 246, 0.3)' : feature.color === 'purple' ? 'rgba(139, 92, 246, 0.3)' : feature.color === 'cyan' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(249, 115, 22, 0.3)'} 0%, transparent 50%)`,
                        transition: 'all 0.3s ease-out'
                      }}
                    />
                  )}

                  {/* Card Content */}
                  <div className="relative z-10 p-6 md:p-8 h-full flex flex-col">
                    {/* Enhanced Icon */}
                    <div
                      className={`relative mb-6 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg transition-all duration-500 ${isHovered ? 'scale-110 rotate-6 shadow-2xl' : 'scale-100 rotate-0'}`}
                    >
                      <Icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                      
                      {/* Animated Ring */}
                      <div
                        className={`absolute inset-0 rounded-2xl border-2 transition-all duration-500 ${isHovered ? 'border-white/50 scale-125 opacity-100' : 'border-transparent scale-100 opacity-0'}`}
                      />
                      
                      {/* Pulse Effect */}
                      {isHovered && (
                        <div className="absolute inset-0 rounded-2xl border border-white/30 animate-ping" />
                      )}
                    </div>

                    {/* Enhanced Content */}
                    <div className="flex-1">
                      <h3 
                        className={`text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 transition-all duration-300 ${isHovered ? feature.textColor + ' transform translate-x-2' : ''}`}
                      >
                        {feature.title}
                      </h3>
                      
                      <p 
                        className={`text-sm md:text-base text-neutral-400 leading-relaxed mb-6 transition-all duration-300 ${isHovered ? 'text-neutral-300 transform translate-x-2' : ''}`}
                      >
                        {feature.description}
                      </p>

                      {/* Enhanced Stats Badge */}
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full ${feature.bgColor} ${feature.textColor} font-mono text-xs border backdrop-blur-sm transition-all duration-300 ${isHovered ? 'scale-105 border-white/20 shadow-lg' : feature.borderColor}`}
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {feature.stats}
                      </div>
                    </div>

                    {/* Enhanced Hover Arrow */}
                    <div
                      className={`absolute bottom-6 right-6 transition-all duration-300 ${isHovered ? 'opacity-100 transform translate-x-2' : 'opacity-0 transform translate-x-0'}`}
                    >
                      <ArrowRight className={`h-5 w-5 ${feature.textColor}`} />
                    </div>

                    {/* Corner Accent */}
                    <div
                      className={`absolute top-4 right-4 w-2 h-2 rounded-full transition-all duration-300 ${isHovered ? 'bg-white/50 scale-150' : 'bg-transparent scale-100'}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Bottom CTA */}
        <div 
          className={`text-center mt-12 md:mt-16 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <button
            className="group relative inline-flex items-center px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-neutral-900 font-bold hover:from-emerald-300 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-emerald-400/30 hover:scale-105 active:scale-95 transform"
          >
            <Sparkles className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 group-hover:animate-spin" />
            <span className="text-sm md:text-base">Experience the Difference</span>
            <div className="ml-2 md:ml-3 group-hover:translate-x-1 transition-transform duration-300">
              <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
            </div>
            
            {/* Button Glow Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;