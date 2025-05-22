import React, { useState, useRef, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiLogIn, FiKey } from "react-icons/fi";
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

  // Particle density increases with access level
  useEffect(() => {
    // Simple fade-in animation on card using framer-motion controls
    controls.start({ opacity: 1, y: 0, transition: { duration: 1.5, ease: "easeOut" } });

    // Update particles config every second based on accessLevel
    const interval = setInterval(() => {
      if (particlesRef.current && accessLevel > 0) {
        particlesRef.current.loadJSON("particles", getParticleConfig(accessLevel));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [accessLevel, controls]);

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
    
    // Simulate quantum-level security check
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (password === "AcaiGayDenganNier") {
      // Luxury success animation
      await controls.start({ scale: 0.95, transition: { duration: 0.3 } });

      // No authenticate function anymore; simulate success by navigating
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
    setAccessLevel(Math.min(Math.floor(e.target.value.length / 3), 3));
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
      {/* Background Video */}
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
                transition: { duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }
              }}
            />
          ))}
        </div>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={getParticleConfig(accessLevel)}
        />
      </div>

      {/* Login Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 100 }}
        animate={controls}
        className="relative z-10 bg-gray-900/70 backdrop-blur-2xl rounded-3xl shadow-4xl overflow-hidden w-full max-w-md mx-4 border border-gray-700/30 hover:border-blue-500/50 transition-all duration-500"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          borderImage: "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3)) 1"
        }}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-gray-900 via-blue-900/80 to-indigo-900/90 p-8 text-center overflow-hidden">
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

        {/* Security Level Indicator */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
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
          <span className="text-xs font-mono text-blue-300">
            {["BASIC", "ADVANCED", "QUANTUM"][accessLevel] || "LOCKED"}
          </span>
        </div>

        {/* Login Form */}
        <div className="px-8 pt-6 pb-8">
          {error && (
            <div className="mb-4 text-red-500 font-mono text-sm">{error}</div>
          )}

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Access Password"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-blue-200 placeholder-blue-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={handleKeyPress}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-blue-400 hover:text-blue-300 focus:outline-none"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
            <FiLock
              className="absolute left-3 top-3 text-blue-400"
              size={20}
            />
          </div>

          {/* Biometric login button (dummy) */}
          <button
            type="button"
            onClick={() => alert("Biometric login currently unavailable")}
            className="w-full mb-4 flex justify-center items-center space-x-2 bg-blue-700 hover:bg-blue-800 rounded-lg py-3 font-semibold text-blue-200 transition"
          >
            <FiKey size={20} />
            <span>Biometric Access</span>
          </button>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold flex justify-center items-center space-x-2
              ${isLoading ? "opacity-60 cursor-not-allowed" : "hover:scale-105 hover:shadow-xl transition-transform duration-300"}
            `}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : (
              <>
                <FiLogIn size={20} />
                <span>Access Quantum Vault</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginAdmin;
