import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Particle effect for the background
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.3';
    document.body.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 50 : 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        color: `rgba(${Math.floor(Math.random() * 100 + 155)}, 
                ${Math.floor(Math.random() * 50)}, 
                ${Math.floor(Math.random() * 100 + 155)}, 
                ${Math.random() * 0.5 + 0.2})`
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw black hole gradient center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0, 
        centerX, centerY, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, 'rgba(40, 0, 80, 0.8)');
      gradient.addColorStop(0.5, 'rgba(20, 0, 40, 0.5)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Reset particles that go off screen
        if (particle.x < 0 || particle.x > canvas.width || 
            particle.y < 0 || particle.y > canvas.height) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.removeChild(canvas);
    };
  }, []);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Save user data to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: email,
          createdAt: new Date(),
          name: "",
          phone: "",
          discord: "",
          role: "user"
        });
      }
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message.includes("auth/email-already-in-use")
          ? "Email already in use"
          : err.message.includes("auth/invalid-credential")
          ? "Invalid email or password"
          : "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-purple-300/80 font-light tracking-wider">
            {isLogin
              ? "Sign in to access your dashboard"
              : "Join us to get started"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900/70 backdrop-blur-xl p-8 rounded-xl border border-purple-900/30 shadow-lg hover:shadow-purple-900/20 transition-all duration-500 hover:border-purple-900/50 relative overflow-hidden"
        >
          {/* Multiverse effect overlay */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-800 rounded-full filter blur-3xl opacity-20"></div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm flex items-center backdrop-blur-sm">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-5 relative z-10">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400 group-hover:text-purple-300 transition-colors">
                <FiMail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-transparent group-hover:border-purple-900/50 transition-all duration-300"
                placeholder="Email address"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400 group-hover:text-purple-300 transition-colors">
                <FiLock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-transparent group-hover:border-purple-900/50 transition-all duration-300"
                placeholder="Password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all duration-500 relative overflow-hidden group ${
                isLoading
                  ? "bg-purple-900/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-900/80 to-indigo-900/80 hover:from-purple-800 hover:to-indigo-800"
              } text-white shadow-lg border border-purple-900/50 hover:border-purple-700/50`}
            >
              {/* Button hover effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              
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
                  Processing...
                </>
              ) : isLogin ? (
                <>
                  Sign In <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <>
                  Create Account <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-purple-300/80">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-purple-400 hover:text-purple-300 font-medium hover:underline underline-offset-4 decoration-purple-500/50 transition-all duration-300"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-purple-900/80">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
