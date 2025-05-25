import { useRef, useState, useEffect, useCallback } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Section from "./Section";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

const Particle = ({ x, y, size, color, delay }) => {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size} ${color}`
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        x: [0, (Math.random() - 0.5) * 10], // Reduced movement
        y: [0, (Math.random() - 0.5) * 10]  // Reduced movement
      }}
      transition={{ 
        duration: 1 + Math.random(), // Shorter duration
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    />
  );
};

const BentoTilt = ({ children, className = "", disableTiltOnMobile = true }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 });
  const [particles, setParticles] = useState([]);
  const particleCount = 8; // Further reduced particle count
  const rafId = useRef(null);

  const cursorX = useMotionValue(50);
  const cursorY = useMotionValue(50);
  const backgroundX = useTransform(cursorX, [0, 100], [-3, 3]); // Further reduced movement
  const backgroundY = useTransform(cursorY, [0, 100], [-3, 3]); // Further reduced movement

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const generateParticles = useCallback((x, y) => {
    const newParticles = Array.from({ length: particleCount }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      x: `${x}%`,
      y: `${y}%`,
      size: `${Math.random() * 2 + 1}px`, // Even smaller particles
      color: `hsl(${Math.random() * 60 + 200}, 100%, 70%)`,
      delay: Math.random() * 0.2 // Shorter delay
    }));
    setParticles(newParticles);
  }, [particleCount]);

  const handleMouseMove = useCallback((e) => {
    if (!itemRef.current || (isMobile && disableTiltOnMobile)) return;

    rafId.current = requestAnimationFrame(() => {
      const { left, top, width, height } = itemRef.current.getBoundingClientRect();
      const relativeX = (e.clientX - left) / width;
      const relativeY = (e.clientY - top) / height;
      const tiltX = (relativeY - 0.5) * 3; // Reduced tilt amount
      const tiltY = (relativeX - 0.5) * -3; // Reduced tilt amount

      const xPos = relativeX * 100;
      const yPos = relativeY * 100;
      
      setCursorPosition({ x: xPos, y: yPos });
      cursorX.set(xPos);
      cursorY.set(yPos);
      
      generateParticles(xPos, yPos);
      
      setTransformStyle(
        `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.99, 0.99, 0.99)`
      );
    });
  }, [isMobile, disableTiltOnMobile, cursorX, cursorY, generateParticles]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransformStyle("");
    setIsHovered(false);
    setParticles([]);
  }, []);

  return (
    <motion.div
      ref={itemRef}
      className={`relative transition-all duration-300 ease-out will-change-transform overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
      onTouchStart={() => isMobile && setTransformStyle("scale(0.97)")}
      onTouchEnd={() => isMobile && setTransformStyle("")}
      whileHover={{ zIndex: 10 }}
    >
      {children}
      {isHovered && !isMobile && (
        <>
          <motion.div 
            className="absolute inset-0 pointer-events-none rounded-2xl md:rounded-3xl"
            style={{
              background: `radial-gradient(circle at ${cursorPosition.x}% ${cursorPosition.y}%, rgba(255,255,255,0.05) 0%, transparent 70%)`, // Less intense gradient
              x: backgroundX,
              y: backgroundY
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }} // Faster transition
          />
          <AnimatePresence>
            {particles.map((particle) => (
              <Particle
                key={particle.id}
                x={particle.x}
                y={particle.y}
                size={particle.size}
                color={particle.color}
                delay={particle.delay}
              />
            ))}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      setIsLoaded(true);
      video.play().catch(e => {
        console.log("Autoplay prevented, trying muted play");
        video.muted = true;
        video.play();
      });
    };

    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(e => console.log("Autoplay prevented:", e));
    };

    video.addEventListener('loadedmetadata', handleLoaded);
    video.addEventListener('ended', handleEnded);
    
    // Set preload attribute
    video.preload = "auto";
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      className="absolute left-0 top-0 w-full h-full object-cover"
      style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
    />
  );
};

const Services = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4, // Slightly faster
        ease: "easeOut"
      }
    }
  };

  return (
    <Section id="how-to-use">
      <div className="bg-black pb-20 md:pb-32 circular-font">
        <div className="container mx-auto px-4 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {/* Hero Section */}
            <motion.div variants={itemVariants}>
              <BentoTilt className="border-hsla relative mb-6 h-64 w-full overflow-hidden rounded-2xl md:h-[55vh] md:rounded-3xl md:mb-10">
                <div className="relative w-full h-full">
                  <VideoPlayer src="/videos/feature-1.mp4" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  <div className="relative z-10 flex flex-col justify-between w-full h-full p-5 md:p-8">
                    <div>
                      <motion.h1 
                        className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg"
                        whileHover={{ scale: 1.02 }}
                      >
                        radia<b className="font-semibold">n</b>t
                      </motion.h1>
                      <motion.p 
                        className="mt-3 text-sm md:text-lg text-gray-300 max-w-[200px] md:max-w-[280px] leading-snug md:leading-normal"
                        whileHover={{ x: 5 }}
                      >
                        Cross-platform metagame app turning Web2/Web3 activities into rewards
                      </motion.p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
                      <motion.span 
                        className="inline-block w-2 h-2 rounded-full bg-purple-500"
                        animate={{ scale: [1, 1.3, 1] }} // Reduced scale
                        transition={{ repeat: Infinity, duration: 1.2 }} // Faster
                      />
                      Hover to interact
                    </div>
                  </div>
                </div>
              </BentoTilt>
            </motion.div>

            {/* Desktop Bento Grid */}
            <div className="hidden md:block">
              <motion.div 
                className="grid grid-cols-12 gap-6 mb-6"
                variants={containerVariants}
              >
                {/* Zigma - Left (6 columns) */}
                <motion.div 
                  variants={itemVariants} 
                  className="col-span-6 row-span-2 h-[400px]"
                >
                  <BentoTilt className="h-full w-full">
                    <div className="relative w-full h-full rounded-3xl overflow-hidden">
                      <VideoPlayer src="/videos/feature-2.mp4" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="relative z-10 flex flex-col justify-between w-full h-full p-6">
                        <div>
                          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                            zig<b className="font-semibold">m</b>a
                          </h1>
                          <p className="mt-3 text-base text-gray-300 max-w-[240px] leading-snug">
                            Anime-inspired NFT collection with expansion potential
                          </p>
                        </div>
                      </div>
                    </div>
                  </BentoTilt>
                </motion.div>

                {/* More Features - Right (6 columns) */}
                <motion.div 
                  variants={itemVariants} 
                  className="col-span-6 row-span-2 h-[400px]"
                >
                  <BentoTilt className="h-full w-full">
                    <div className="relative w-full h-full rounded-3xl overflow-hidden">
                      <VideoPlayer src="/videos/feature-5.mp4" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="relative z-10 p-6">
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                          More Features
                        </h1>
                        <motion.div 
                          className="mt-4 flex flex-wrap gap-3"
                          initial="hidden"
                          whileInView="visible"
                          variants={{
                            hidden: {},
                            visible: {
                              transition: {
                                staggerChildren: 0.05 // Faster stagger
                              }
                            }
                          }}
                        >
                          {['Leaderboards', 'Quests', 'Marketplace', 'Rewards', 'Achievements', 'Social'].map((feature) => (
                            <motion.span
                              key={feature}
                              className="text-sm bg-white/10 text-white px-3 py-1.5 rounded-full"
                              variants={{
                                hidden: { opacity: 0, y: 5 }, // Reduced movement
                                visible: { opacity: 1, y: 0 }
                              }}
                            >
                              {feature}
                            </motion.span>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </BentoTilt>
                </motion.div>
              </motion.div>

              {/* Second Row - Squares */}
              <motion.div 
                className="grid grid-cols-12 gap-6 mb-6"
                variants={containerVariants}
              >
                {/* Azul - Left Square (6 columns) */}
                <motion.div 
                  variants={itemVariants}
                  className="col-span-6 h-[300px]"
                >
                  <BentoTilt className="h-full w-full">
                    <div className="relative w-full h-full rounded-3xl overflow-hidden">
                      <VideoPlayer src="/videos/feature-4.mp4" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="relative z-10 flex flex-col justify-between w-full h-full p-6">
                        <div>
                          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                            az<b className="font-semibold">u</b>l
                          </h1>
                          <p className="mt-2 text-base text-gray-300 max-w-[240px] leading-snug">
                            Cross-world AI Agent for enhanced gameplay
                          </p>
                        </div>
                      </div>
                    </div>
                  </BentoTilt>
                </motion.div>

                {/* Nexus - Right Square (6 columns) */}
                <motion.div 
                  variants={itemVariants}
                  className="col-span-6 h-[300px]"
                >
                  <BentoTilt className="h-full w-full">
                    <div className="relative w-full h-full rounded-3xl overflow-hidden">
                      <VideoPlayer src="/videos/feature-3.mp4" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="relative z-10 flex flex-col justify-between w-full h-full p-6">
                        <div>
                          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                            n<b className="font-semibold">e</b>xus
                          </h1>
                          <p className="mt-2 text-base text-gray-300 max-w-[240px] leading-snug">
                            Gamified social hub for Web3 communities
                          </p>
                        </div>
                      </div>
                    </div>
                  </BentoTilt>
                </motion.div>
              </motion.div>

              {/* Coming Soon - Full Width */}
              <motion.div 
                variants={itemVariants} 
                className="h-[500px]"
              >
                <BentoTilt className="h-full w-full">
                  <div className="relative w-full h-full rounded-3xl overflow-hidden">
                    <VideoPlayer src="/videos/feature-6.mp4" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="relative z-10 flex flex-col justify-between w-full h-full p-6">
                      <div>
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                          M<b className="font-semibold">o</b>re co<b className="font-semibold">m</b>ing!
                        </h1>
                        <p className="mt-2 text-lg text-white/90 max-w-[400px]">
                          Exciting updates and new features launching soon
                        </p>
                      </div>
                      <div className="flex justify-between items-end">
                        <motion.div 
                          className="flex gap-3 text-2xl"
                          animate={{
                            x: [0, 3, 0], // Reduced movement
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5, // Faster
                            ease: "easeInOut"
                          }}
                        >
                          {['🎮', '✨', '🚀'].map((emoji, i) => (
                            <motion.span
                              key={i}
                              animate={{
                                y: [0, -5, 0], // Reduced movement
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 1.5 + i * 0.3, // Faster
                                ease: "easeInOut",
                                delay: i * 0.2 // Shorter delay
                              }}
                            >
                              {emoji}
                            </motion.span>
                          ))}
                        </motion.div>
                        <TiLocationArrow className="scale-[2.5] text-white/90 animate-bounce" />
                      </div>
                    </div>
                  </div>
                </BentoTilt>
              </motion.div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              <motion.div 
                className="grid grid-cols-1 gap-4"
                variants={containerVariants}
              >
                {/* Zigma */}
                <motion.div variants={itemVariants}>
                  <BentoTilt className="h-64 w-full">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      <VideoPlayer src="/videos/feature-2.mp4" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="relative z-10 flex flex-col justify-between w-full h-full p-5">
                        <div>
                          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                            zig<b className="font-semibold">m</b>a
                          </h1>
                          <p className="mt-2 text-sm text-gray-300 max-w-[180px] leading-snug">
                            Anime-inspired NFT collection with expansion potential
                          </p>
                        </div>
                      </div>
                    </div>
                  </BentoTilt>
                </motion.div>

                {/* Nexus */}
                <motion.div variants={itemVariants}>
                  <BentoTilt className="h-64 w-full">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      <VideoPlayer src="/videos/feature-3.mp4" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="relative z-10 flex flex-col justify-between w-full h-full p-5">
                        <div>
                          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                            n<b className="font-semibold">e</b>xus
                          </h1>
                          <p className="mt-2 text-sm text-gray-300 max-w-[180px] leading-snug">
                            Gamified social hub for Web3 communities
                          </p>
                        </div>
                      </div>
                    </div>
                  </BentoTilt>
                </motion.div>

                {/* Azul */}
                <motion.div variants={itemVariants}>
                  <BentoTilt className="h-64 w-full">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      <VideoPlayer src="/videos/feature-4.mp4" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="relative z-10 flex flex-col justify-between w-full h-full p-5">
                        <div>
                          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                            az<b className="font-semibold">u</b>l
                          </h1>
                          <p className="mt-2 text-sm text-gray-300 max-w-[180px] leading-snug">
                            Cross-world AI Agent for enhanced gameplay
                          </p>
                        </div>
                      </div>
                    </div>
                  </BentoTilt>
                </motion.div>

                {/* More Features */}
                <motion.div variants={itemVariants}>
                  <BentoTilt className="h-64 w-full">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      <VideoPlayer src="/videos/feature-5.mp4" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="relative z-10 p-5">
                        <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                          More Features
                        </h1>
                        <motion.div 
                          className="mt-2 flex flex-wrap gap-2"
                          initial="hidden"
                          whileInView="visible"
                          variants={{
                            hidden: {},
                            visible: {
                              transition: {
                                staggerChildren: 0.05 // Faster stagger
                              }
                            }
                          }}
                        >
                          {['Leaderboards', 'Quests', 'Marketplace', 'Rewards'].map((feature) => (
                            <motion.span
                              key={feature}
                              className="text-xs bg-white/10 text-white px-2 py-1 rounded-full"
                              variants={{
                                hidden: { opacity: 0, y: 5 }, // Reduced movement
                                visible: { opacity: 1, y: 0 }
                              }}
                            >
                              {feature}
                            </motion.span>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </BentoTilt>
                </motion.div>

                {/* Coming Soon */}
                <motion.div variants={itemVariants}>
                  <BentoTilt className="h-64 w-full">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      <VideoPlayer src="/videos/feature-6.mp4" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="relative z-10 flex flex-col justify-between w-full h-full p-5">
                        <div>
                          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                            M<b className="font-semibold">o</b>re co<b className="font-semibold">m</b>ing!
                          </h1>
                          <p className="mt-2 text-sm text-white/90 max-w-[200px]">
                            Exciting updates launching soon
                          </p>
                        </div>
                        <div className="flex justify-between items-end">
                          <motion.div 
                            className="flex gap-2"
                            animate={{
                              x: [0, 3, 0], // Reduced movement
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.5, // Faster
                              ease: "easeInOut"
                            }}
                          >
                            {['🎮', '✨', '🚀'].map((emoji, i) => (
                              <motion.span
                                key={i}
                                animate={{
                                  y: [0, -5, 0], // Reduced movement
                                }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1.5 + i * 0.3, // Faster
                                  ease: "easeInOut",
                                  delay: i * 0.2 // Shorter delay
                                }}
                              >
                                {emoji}
                              </motion.span>
                            ))}
                          </motion.div>
                          <TiLocationArrow className="scale-[1.8] text-white/90 animate-bounce" />
                        </div>
                      </div>
                    </div>
                  </BentoTilt>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default Services;
