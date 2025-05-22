import gsap from "gsap";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import loginBg from "../assets/login-bg.mp4";

const LoginAdmin = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessLevel, setAccessLevel] = useState(0);
  const navigate = useNavigate();
  const controls = useAnimation();
  const cardRef = useRef();
  const particlesRef = useRef();

  // Initialize particles
  const particlesInit = async (engine) => {
    await loadFull(engine);
    particlesRef.current = engine;
  };

  useEffect(() => {
    // Luxury entrance animation
    gsap.from(cardRef.current, {
      duration: 1.5,
      opacity: 0,
      y: 100,
      ease: "power4.out",
      delay: 0.3
    });
    
    // Particle density increases with access level
    const interval = setInterval(() => {
      if (particlesRef.current && accessLevel > 0) {
        particlesRef.current.loadJSON("particles", getParticleConfig(accessLevel));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [accessLevel]);

  const getParticleConfig = (level) => {
    const baseDensity = 60 + (level * 20);
    return {
      fpsLimit: 120,
      particles: {
        number: {
          value: baseDensity,
          density: { enable: true, area: 800 }
        },
        color: { value: ["#3b82f6", "#8b5cf6", "#ec4899"] },
        move: { 
          speed: 0.5 + (level * 0.2),
          outMode: "bounce" 
        },
        links: { 
          color: "#3b82f6",
          opacity: 0.3 + (level * 0.1)
        }
      }
    };
  };

  const handleLogin = async () => {
    if (!password) {
      setError("Access credentials required");
      await controls.start({ 
        x: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.5 }
      });
      return;
    }

    setIsLoading(true);
    setError("");
    
    // Simulate security check
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (password === "AcaiGayDenganNier") {
      // Luxury success animation
      await gsap.to(cardRef.current, {
        scale: 0.95,
        boxShadow: "0 0 40px rgba(59, 130, 246, 0.7)",
        duration: 0.3
      });
      
      // Create particle explosion effect
      if (particlesRef.current) {
        particlesRef.current.loadJSON("particles", {
          particles: {
            number: { value: 0 },
            move: { speed: 10 }
          }
        });
      }
      
      navigate("/admin/dashboard");
    } else {
      setError("Invalid access credentials");
      setAccessLevel(0);
      await controls.start({
        x: [0, -20, 20, -20, 20, 0],
        transition: { duration: 0.6 }
      });
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Increase access level perception as password length grows
    setAccessLevel(Math.min(Math.floor(e.target.value.length / 3), 3));
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
      {/* Quantum Matrix Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        >
          <source src={loginBg} type="video/mp4" />
        </video>
        
        {/* Animated Quantum Grid */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none">
          {Array.from({ length: 400 }).map((_, i) => (
            <motion.div
              key={i}
              className="border border-gray-800/30"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.1, 0],
                transition: { 
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Quantum Particles */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={getParticleConfig(accessLevel)}
        />
      </div>

      {/* Holographic Interface */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0 }}
        animate={controls}
        className="relative z-10 bg-gray-900/70 backdrop-blur-2xl rounded-3xl shadow-4xl overflow-hidden w-full max-w-md mx-4 border border-gray-700/30 hover:border-blue-500/50 transition-all duration-500"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          borderImage: "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3)) 1"
        }}
      >
        {/* Holographic Header */}
        <div className="relative bg-gradient-to-br from-gray-900 via-blue-900/80 to-indigo-900/90 p-8 text-center overflow-hidden">
          {/* Animated Holographic Lines */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
                style={{
                  top: `${20 + (i * 15)}%`,
                  width: "100%"
                }}
                initial={{ x: "-100%" }}
                animate={{ 
                  x: "100%",
                  transition: {
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              />
            ))}
          </div>
          
          {/* Security Level Indicator */}
          <div className="absolute top-4 right-4 flex items-center">
            <div className="flex space-x-1">
              {[1, 2, 3].map((level) => (
                <motion.div
                  key={level}
                  className={`w-2 h-2 rounded-full ${accessLevel >= level ? 'bg-blue-400' : 'bg-gray-600'}`}
                  animate={{
                    scale: accessLevel >= level ? [1, 1.2, 1] : 1,
                    transition: { duration: 0.5 }
                  }}
                />
              ))}
            </div>
            <span className="ml-2 text-xs font-mono text-blue-300">
              {["BASIC", "ADVANCED", "QUANTUM"][accessLevel] || "LOCKED"}
            </span>
          </div>
          
          <motion.h2 
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            QUANTUM ACCESS
          </motion.h2>
          <motion.p 
            className="text-blue-200/80 mt-3 font-light tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Restricted Executive Portal
          </motion.p>
        </div>

        {/* Quantum Encryption Form */}
        <div className="p-8">
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-mono mb-2 tracking-wider">
              ENCRYPTED ACCESS CODE
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-blue-400/80" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••••"
                className={`w-full pl-10 pr-10 py-3 bg-gray-900/50 backdrop-blur-sm border ${
                  error ? "border-red-500/50" : "border-gray-700/70"
                } rounded-lg text-blue-100 font-mono tracking-wider focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 focus:bg-gray-900/70 transition-all duration-300`}
                value={password}
                onChange={handlePasswordChange}
                onKeyPress={handleKeyPress}
                style={{ letterSpacing: "0.2em" }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="text-blue-400/60 hover:text-blue-300 transition-colors" />
                ) : (
                  <FiEye className="text-blue-400/60 hover:text-blue-300 transition-colors" />
                )}
              </button>
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400/90 text-sm mt-2 font-mono"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            
            {/* Password Strength Indicator */}
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-mono text-gray-500">CRYPTO-STRENGTH</span>
                <span className="text-xs font-mono text-blue-300">
                  {["WEAK", "MODERATE", "STRONG", "QUANTUM"][accessLevel] || "NONE"}
                </span>
              </div>
              <div className="w-full bg-gray-800/30 rounded-full h-1.5">
                <motion.div 
                  className="h-1.5 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${accessLevel * 33}%`,
                    backgroundPosition: accessLevel === 3 ? ["0% 50%", "100% 50%"] : "0% 50%",
                    transition: { 
                      width: { duration: 0.5 },
                      backgroundPosition: accessLevel === 3 ? { duration: 2, repeat: Infinity, ease: "linear" } : {}
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quantum Login Button */}
          <motion.button
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-4 px-6 rounded-xl font-medium ${
              isLoading
                ? "bg-blue-900/70 cursor-not-allowed"
                : "bg-gradient-to-br from-blue-900/80 to-indigo-900/80 hover:from-blue-800/90 hover:to-indigo-800/90"
            } text-white shadow-2xl transition-all duration-300 relative overflow-hidden group`}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
            
            {/* Animated rings */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <motion.div
                className="absolute top-0 left-0 w-full h-full border-2 border-blue-400/30 rounded-xl"
                initial={{ scale: 1, opacity: 0 }}
                animate={{
                  scale: 1.2,
                  opacity: [0, 0.5, 0],
                  transition: isLoading ? { 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  } : {}
                }}
              />
            </div>
            
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="bg-gradient-to-r from-blue-200 to-indigo-100 bg-clip-text text-transparent">
                  DECRYPTING ACCESS...
                </span>
              </>
            ) : (
              <>
                <FiLogIn className="mr-3 text-blue-200" size={20} />
                <span className="bg-gradient-to-r from-blue-200 to-indigo-100 bg-clip-text text-transparent tracking-wider">
                  INITIATE QUANTUM LOGIN
                </span>
              </>
            )}
          </motion.button>
        </div>

        {/* Holographic Footer */}
        <div className="bg-gradient-to-t from-gray-900/90 to-transparent p-6 text-center text-gray-500/80 text-xs font-mono border-t border-gray-800/50">
          <div className="flex justify-center items-center space-x-4">
            <span>SECURITY LEVEL: {accessLevel * 33 || "0"}%</span>
            <span>|</span>
            <span>ENCRYPTION: QUANTUM-256</span>
          </div>
          <div className="mt-2">
            © {new Date().getFullYear()} QUANTUM SYSTEMS • TOP SECRET
          </div>
        </div>
      </motion.div>

      {/* Floating Quantum Orbs */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full filter blur-xl opacity-10 ${i % 2 ? 'bg-blue-500' : 'bg-indigo-500'}`}
          style={{
            width: `${50 + (i * 30)}px`,
            height: `${50 + (i * 30)}px`,
            left: `${10 + (i * 10)}%`,
            top: `${20 + (i * 15)}%`
          }}
          animate={{
            y: [0, i % 2 ? -30 : 30, 0],
            x: [0, i % 2 ? -20 : 20, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Hidden Quantum Signature */}
      <div className="absolute bottom-4 right-4 text-gray-700/30 text-xs font-mono">
        QUANTUM-UI v4.2.0
      </div>
    </div>
  );
};

export default LoginAdmin;
