'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  Quote, 
  Star, 
  Users, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  Heart,
  TrendingUp
} from 'lucide-react';

const Testimoni = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

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

  // Auto-rotate testimonials
  useEffect(() => {
    if (isVisible && isAutoPlay) {
      intervalRef.current = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isVisible, isAutoPlay]);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "CTO",
      company: "TechVision Inc.",
      avatar: "SC",
      content: "This platform transformed our entire development workflow. The performance gains are absolutely incredible - our deployment time went from hours to minutes.",
      rating: 5,
      gradient: "from-emerald-400 to-emerald-600",
      textColor: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
      stats: "500% Faster",
      industry: "Enterprise Software"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Lead Developer",
      company: "InnovateX Labs",
      avatar: "MR",
      content: "The security features are unmatched. We've processed over 10 million transactions with zero breaches. The peace of mind is priceless.",
      rating: 5,
      gradient: "from-blue-400 to-blue-600",
      textColor: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
      stats: "Zero Breaches",
      industry: "Financial Technology"
    },
    {
      id: 3,
      name: "Dr. Emily Watson",
      role: "Head of Engineering",
      company: "MediCore Solutions",
      avatar: "EW",
      content: "The scalability is phenomenal. We went from 1K to 1M users seamlessly. The platform handled our growth without missing a beat.",
      rating: 5,
      gradient: "from-purple-400 to-purple-600",
      textColor: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20",
      stats: "1000x Scale",
      industry: "Healthcare Tech"
    },
    {
      id: 4,
      name: "Alex Thompson",
      role: "Founder & CEO",
      company: "StartupRocket",
      avatar: "AT",
      content: "Game-changing platform! Our team productivity increased by 300%. The intuitive design makes complex tasks feel effortless.",
      rating: 5,
      gradient: "from-cyan-400 to-cyan-600",
      textColor: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
      borderColor: "border-cyan-400/20",
      stats: "+300% Productivity",
      industry: "E-commerce"
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Clients", icon: Users },
    { number: "99.9%", label: "Uptime", icon: CheckCircle },
    { number: "24/7", label: "Support", icon: Heart },
    { number: "500%", label: "Growth", icon: TrendingUp }
  ];

  const handleMouseMove = (e) => {
    if (e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  const nextTestimonial = () => {
    setIsAutoPlay(false);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAutoPlay(true), 10000); // Resume auto-play after 10 seconds
  };

  const prevTestimonial = () => {
    setIsAutoPlay(false);
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAutoPlay(true), 10000); // Resume auto-play after 10 seconds
  };

  const selectTestimonial = (index) => {
    setIsAutoPlay(false);
    setCurrentTestimonial(index);
    setTimeout(() => setIsAutoPlay(true), 10000); // Resume auto-play after 10 seconds
  };

  const currentData = testimonials[currentTestimonial];

  return (
    <div className="min-h-screen relative overflow-hidden bg-neutral-950 py-8 md:py-12 lg:py-20 px-4">
      {/* Custom CSS for smooth animations */}
      <style jsx>{`
        @keyframes smoothFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.08;
          }
          25% { 
            transform: translateY(-15px) translateX(8px) scale(1.03);
            opacity: 0.12;
          }
          50% { 
            transform: translateY(-10px) translateX(-3px) scale(1.06);
            opacity: 0.15;
          }
          75% { 
            transform: translateY(-18px) translateX(12px) scale(1.03);
            opacity: 0.12;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .testimonial-enter {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .testimonial-slide {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-400/3 via-transparent to-emerald-400/3" />
        
        {/* Smooth Animated orbs */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-3xl opacity-10"
              style={{
                left: `${15 + (i * 18)}%`,
                top: `${10 + (i * 15)}%`,
                width: `${60 + Math.random() * 40}px`,
                height: `${60 + Math.random() * 40}px`,
                background: `linear-gradient(135deg, 
                  ${i % 4 === 0 ? '#8b5cf6' : i % 4 === 1 ? '#06b6d4' : i % 4 === 2 ? '#3b82f6' : '#10b981'} 0%, 
                  transparent 70%)`,
                animation: `smoothFloat ${8 + i * 1.2}s ease-in-out infinite`,
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
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <div 
            className={`inline-flex items-center px-4 py-2 rounded-full bg-neutral-900/80 border border-emerald-400/30 text-emerald-400 font-mono text-sm mb-4 md:mb-6 shadow-lg shadow-emerald-400/10 backdrop-blur-sm transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <Quote className="mr-2 h-4 w-4 animate-pulse" />
            <span>Client Testimonials</span>
          </div>

          <h2 
            className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-emerald-400 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            Loved by <span className="text-emerald-400 animate-pulse">Thousands</span> Worldwide
          </h2>

          <p 
            className={`text-sm md:text-base lg:text-lg xl:text-xl text-neutral-400 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            Discover why <span className="text-white font-medium">industry leaders</span> trust our platform. 
            Real stories from <span className="text-emerald-400 font-medium">real innovators</span>.
          </p>
        </div>

        {/* Stats Section */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-8 md:mb-12 lg:mb-16 transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`group relative cursor-pointer transform transition-all duration-300 hover:scale-105`}
                onMouseEnter={() => setHoveredCard(`stat-${index}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl bg-neutral-900/50 border border-neutral-700/50 backdrop-blur-sm hover:border-neutral-600 transition-all duration-300">
                  <div className="flex items-center justify-center mb-2">
                    <Icon className={`h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 transition-all duration-300 ${hoveredCard === `stat-${index}` ? 'text-purple-400 scale-110' : 'text-neutral-400'}`} />
                  </div>
                  <div className="text-center">
                    <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-xs md:text-sm text-neutral-400">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Testimonial Card */}
        <div 
          className={`relative max-w-5xl mx-auto mb-8 md:mb-12 lg:mb-16 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <div
            className="relative testimonial-enter testimonial-slide"
            key={currentTestimonial}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
          >
            {/* Enhanced Card Background */}
            <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-br from-neutral-900/90 via-neutral-800/50 to-neutral-900/90 border border-neutral-700/50 backdrop-blur-sm" />
            
            {/* Dynamic Glow Effect */}
            <div
              className={`absolute inset-0 rounded-2xl md:rounded-3xl opacity-15 blur-2xl bg-gradient-to-r ${currentData.gradient} transition-all duration-500`}
            />

            {/* Spotlight Effect */}
            <div
              className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-20 pointer-events-none transition-all duration-300"
              style={{
                background: mousePosition.x > 0 ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${
                  currentData.textColor.includes('emerald') ? 'rgba(16, 185, 129, 0.2)' : 
                  currentData.textColor.includes('blue') ? 'rgba(59, 130, 246, 0.2)' : 
                  currentData.textColor.includes('purple') ? 'rgba(139, 92, 246, 0.2)' : 
                  'rgba(6, 182, 212, 0.2)'
                } 0%, transparent 60%)` : 'transparent'
              }}
            />

            {/* Card Content */}
            <div className="relative z-10 p-6 md:p-8 lg:p-12">
              {/* Quote Icon */}
              <div className="flex justify-center mb-4 md:mb-6">
                <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-r ${currentData.gradient} shadow-lg`}>
                  <Quote className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-white" />
                </div>
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-center mb-6 md:mb-8">
                <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-white leading-relaxed mb-4 md:mb-6 font-medium max-w-4xl mx-auto">
                  "{currentData.content}"
                </p>
                
                {/* Star Rating */}
                <div className="flex justify-center mb-4 md:mb-6">
                  {[...Array(currentData.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 ${currentData.textColor} fill-current mx-0.5 md:mx-1 animate-pulse`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </blockquote>

              {/* Author Info */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center">
                  {/* Avatar */}
                  <div className={`relative w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r ${currentData.gradient} flex items-center justify-center text-white font-bold text-base md:text-lg lg:text-xl shadow-lg mr-3 md:mr-4`}>
                    {currentData.avatar}
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse"></div>
                  </div>

                  {/* Author Details */}
                  <div className="text-left">
                    <div className="text-white font-bold text-base md:text-lg lg:text-xl">{currentData.name}</div>
                    <div className={`${currentData.textColor} text-sm md:text-base font-medium`}>{currentData.role}</div>
                    <div className="text-neutral-400 text-xs md:text-sm">{currentData.company}</div>
                  </div>
                </div>

                {/* Stats Badge */}
                <div className="flex flex-col items-center">
                  <div className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full ${currentData.bgColor} ${currentData.textColor} font-mono text-xs md:text-sm border ${currentData.borderColor} backdrop-blur-sm`}>
                    <CheckCircle className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                    {currentData.stats}
                  </div>
                  <div className="text-neutral-500 text-xs mt-1 text-center">{currentData.industry}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className={`flex items-center justify-center space-x-4 md:space-x-6 mb-6 md:mb-8 transform transition-all duration-700 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <button
            onClick={prevTestimonial}
            className="group p-2 md:p-3 rounded-full bg-neutral-900/50 border border-neutral-700/50 backdrop-blur-sm hover:border-neutral-600 transition-all duration-300 hover:scale-110"
            aria-label="Previous testimonial"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 text-neutral-400 group-hover:text-white transition-colors duration-300" />
          </button>

          {/* Dots Indicator */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => selectTestimonial(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 hover:scale-110 ${
                  index === currentTestimonial 
                    ? `${currentData.textColor.replace('text-', 'bg-')} scale-125` 
                    : 'bg-neutral-600 hover:bg-neutral-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="group p-2 md:p-3 rounded-full bg-neutral-900/50 border border-neutral-700/50 backdrop-blur-sm hover:border-neutral-600 transition-all duration-300 hover:scale-110"
            aria-label="Next testimonial"
          >
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-neutral-400 group-hover:text-white transition-colors duration-300" />
          </button>
        </div>


      </div>
    </div>
  );
};

export default Testimoni;