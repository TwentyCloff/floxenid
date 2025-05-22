import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Engine } from "tsparticles-engine";

const LoginAdmin = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const particlesInit = async (engine: Engine) => await loadFull(engine);

  const handleLogin = async () => {
    if (!password) {
      setError("Access credentials required");
      return;
    }

    setIsLoading(true);
    setError("");
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (password === "AcaiGayDenganNier") {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid access credentials");
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fpsLimit: 120,
            particles: {
              number: { value: 40, density: { enable: true, area: 800 } },
              color: { value: ["#3b82f6", "#8b5cf6", "#ec4899"] },
              move: { speed: 0.5, outMode: "bounce" },
              links: { color: "#3b82f6", opacity: 0.3 }
            }
          }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden w-full max-w-md mx-4 border border-gray-700/50"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 p-8 text-center">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
            ADMIN PORTAL
          </h2>
          <p className="text-blue-200/80 mt-2 font-light">
            Restricted Access Only
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-medium mb-2">
              ACCESS CODE
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-blue-400/80" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-10 py-3 bg-gray-900/50 border ${
                  error ? "border-red-500/50" : "border-gray-700/70"
                } rounded-lg text-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="text-blue-400/60 hover:text-blue-300" />
                ) : (
                  <FiEye className="text-blue-400/60 hover:text-blue-300" />
                )}
              </button>
            </div>
            
            {error && (
              <p className="text-red-400/90 text-sm mt-2">
                {error}
              </p>
            )}
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-3 px-6 rounded-lg font-medium ${
              isLoading
                ? "bg-blue-800 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
            } text-white shadow-lg transition-all`}
          >
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
                AUTHENTICATING...
              </>
            ) : (
              <>
                <FiLogIn className="mr-3" />
                LOGIN
              </>
            )}
          </motion.button>
        </div>

        {/* Footer */}
        <div className="bg-gray-900/70 p-4 text-center text-gray-500 text-xs border-t border-gray-800/50">
          © {new Date().getFullYear()} SECURE ADMIN PORTAL
        </div>
      </motion.div>
    </div>
  );
};

export default LoginAdmin;
