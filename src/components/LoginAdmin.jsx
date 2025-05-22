import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import loginBg from "../assets/login-bg.mp4";

const LoginAdmin = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const handleLogin = () => {
    if (!password) {
      setError("Password tidak boleh kosong");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (password === "AcaiGayDenganNier") {
        localStorage.setItem("isAdminLoggedIn", "true");
        navigate("/admin/dashboard");
      } else {
        setError("Password salah! Coba lagi");
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      >
        <source src={loginBg} type="video/mp4" />
      </video>

      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fpsLimit: 60,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#3b82f6",
              },
              links: {
                color: "#3b82f6",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: "none",
                enable: true,
                outMode: "bounce",
                random: false,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 60,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                random: true,
                value: 3,
              },
            },
            detectRetina: true,
          }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden w-full max-w-md mx-4 border border-gray-700/50"
      >
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">Admin Portal</h2>
          <p className="text-blue-100 mt-2">Masukkan kredensial Anda</p>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                className={`w-full pl-10 pr-10 py-3 bg-gray-700 border ${
                  error ? "border-red-500" : "border-gray-600"
                } rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
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
                  <FiEyeOff className="text-gray-400 hover:text-gray-300" />
                ) : (
                  <FiEye className="text-gray-400 hover:text-gray-300" />
                )}
              </button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium ${
              isLoading
                ? "bg-blue-700 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
                Memproses...
              </>
            ) : (
              <>
                <FiLogIn className="mr-2" />
                Masuk
              </>
            )}
          </motion.button>
        </div>

        {/* Footer */}
        <div className="bg-gray-900/50 p-4 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Admin Dashboard • Strictly Confidential
        </div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-10 left-10 w-16 h-16 rounded-full bg-blue-500/10 blur-xl"
      />
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute top-10 right-10 w-20 h-20 rounded-full bg-indigo-500/10 blur-xl"
      />
    </div>
  );
};

export default LoginAdmin;
