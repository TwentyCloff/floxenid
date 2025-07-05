'use client';

import { useEffect, useRef } from 'react';
import { Zap, Terminal, Sparkles, ArrowRight, Code, Rocket } from 'lucide-react';
import { motion, useAnimation, useInView } from 'framer-motion';

const HeroDeveloper = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-neutral-950 px-4">
      {/* Enhanced Grid Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Main Grid Structure */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-px opacity-5 pointer-events-none">
          {Array.from({ length: 144 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-neutral-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              transition={{ delay: i * 0.002, duration: 0.5 }}
            />
          ))}
        </div>

        {/* Animated Grid Highlights */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Horizontal highlight lines */}
          {[3, 6, 9].map((row) => (
            <motion.div
              key={`row-${row}`}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent"
              style={{ top: `${(row / 12) * 100}%` }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%']
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          ))}

          {/* Vertical highlight lines */}
          {[2, 5, 8, 11].map((col) => (
            <motion.div
              key={`col-${col}`}
              className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-400/20 to-transparent"
              style={{ left: `${(col / 12) * 100}%` }}
              animate={{
                backgroundPosition: ['50% 0%', '50% 100%']
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          ))}
        </motion.div>

        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -window.innerHeight - 100],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 8,
                ease: "linear"
              }}
            />
          ))}
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={`blue-${i}`}
              className="absolute w-0.5 h-0.5 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -window.innerHeight - 100],
                opacity: [0, 0.8, 0.8, 0]
              }}
              transition={{
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: "linear"
              }}
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`purple-${i}`}
              className="absolute w-1.5 h-1.5 bg-purple-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -window.innerHeight - 100],
                opacity: [0, 0.6, 0.6, 0]
              }}
              transition={{
                duration: 12 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 12,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <motion.div 
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
      >
        {/* Elite Badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-900 border border-emerald-400/20 text-emerald-400 font-mono text-xs mb-8 shadow-lg shadow-emerald-400/5 hover:shadow-emerald-400/20 transition-all duration-500 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.8 }}
          />
          <Sparkles className="mr-2 h-3 w-3 group-hover:scale-110 transition-transform duration-300" />
          <span className="relative z-10">⚡ PREMIUM DEVELOPER TOOLS</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-300"
        >
          <span className="block text-emerald-400 mb-4">Code Beyond Limits</span>
          <span className="block">Built for Speed</span>
        </motion.h1>

        {/* Enhanced Subtext */}
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-neutral-400 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Build faster with our <span className="text-white font-medium">battle-tested scripts</span> and 
          <span className="text-emerald-400 font-medium"> premium automation tools</span>. 
          <span className="text-blue-400 font-medium"> Deploy instantly</span> with zero configuration.
        </motion.p>

        {/* Enhanced CTA Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          {/* Premium Button */}
          <motion.button 
            whileHover={{ 
              scale: 1.05,
              rotateX: 5,
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="relative inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-neutral-900 font-bold hover:from-emerald-300 hover:to-emerald-500 transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-emerald-400/25"
          >
            {/* Animated background layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%', skewX: 45 }}
              whileHover={{ x: '200%' }}
              transition={{ duration: 0.8 }}
            />
            
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-xl bg-emerald-400/20 opacity-0 group-hover:opacity-100 animate-pulse" />
            
            <span className="relative z-10 flex items-center">
              <Rocket className="mr-3 h-5 w-5 group-hover:animate-bounce" />
              Get Premium Access
              <motion.div
                className="ml-3"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </span>
          </motion.button>
          
          {/* Open Source Button */}
          <motion.button 
            whileHover={{ 
              scale: 1.05,
              rotateX: -5,
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="relative px-8 py-4 rounded-xl border border-neutral-700 bg-neutral-900/50 text-white font-semibold hover:border-blue-400/50 transition-all duration-300 backdrop-blur-md group overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-400/20"
          >
            {/* Animated border */}
            <div className="absolute inset-0 rounded-xl border border-blue-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-cyan-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Sweep effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
              initial={{ x: '-100%', skewX: 45 }}
              whileHover={{ x: '200%' }}
              transition={{ duration: 0.8 }}
            />
            
            <span className="relative z-10 flex items-center">
              <Code className="mr-3 h-5 w-5 group-hover:text-blue-400 group-hover:rotate-12 transition-all duration-300" />
              Explore Open Source
              <motion.div
                className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroDeveloper;