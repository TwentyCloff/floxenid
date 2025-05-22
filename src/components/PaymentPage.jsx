import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { 
  FiCheck, FiLock, FiCreditCard, FiSmartphone, FiX, FiShield, FiZap,
  FiEye, FiEyeOff, FiGlobe, FiPocket, FiClock, FiAward, FiServer
} from "react-icons/fi";
import { 
  FaCcVisa, FaCcMastercard, FaCcAmex, FaQrcode, FaBitcoin, FaEthereum,
  FaFingerprint, FaRobot, FaSatelliteDish
} from "react-icons/fa";
import { SiDogecoin, SiLitecoin, SiRipple } from "react-icons/si";
import blackholeVideo from "../assets/hero/blackhole.webm";
import quantumFieldAudio from "../assets/audio/quantum-field.mp3";
import Button from "./Button";

// Quantum Encryption Module
const QuantumEncryption = {
  generateEntanglement: () => {
    const particles = ['photon', 'electron', 'quark'];
    return particles[Math.floor(Math.random() * particles.length)] + 
           '-' + Math.random().toString(36).substr(2, 9);
  },
  createQubitSignature: (data) => {
    return btoa(data).split('').reverse().join('') + 
           '::qbit::' + Date.now();
  }
};

const PaymentPage = () => {
  // State for payment completion
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  // Get plan and price from URL params
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get('plan');
  const price = searchParams.get('price');

  // Quantum State Variables
  const [quantumState, setQuantumState] = useState({
    entanglementId: '',
    qubitSignature: '',
    superposition: false,
    coherenceTime: 0
  });

  // Biometric State
  const [biometrics, setBiometrics] = useState({
    fingerprintVerified: false,
    facialScanComplete: false,
    neuralPatternMatch: false
  });

  // Payment State
  const [paymentStatus, setPaymentStatus] = useState({
    quantumEncrypted: false,
    blockchainConfirmed: false,
    aiVerified: false
  });

  // Refs
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const quantumTimerRef = useRef(null);

  // Quantum Plan Data
  const quantumPlanData = {
    "Stellar": { 
      price: "299.99", 
      features: [
        "Quantum Encryption", 
        "Neural Biometrics",
        "AI Fraud Detection",
        "Interstellar Transfer"
      ],
      qbits: 1000
    },
    "Galactic": { 
      price: "999.99", 
      features: [
        "All Stellar Features",
        "Quantum Entanglement",
        "Blockchain Settlement",
        "Temporal Security"
      ],
      qbits: 5000
    },
    "Singularity": { 
      price: "4999.99", 
      features: [
        "All Galactic Features",
        "Neural Network Shield",
        "Dark Web Monitoring",
        "AI Personal Butler"
      ],
      qbits: 25000
    }
  };

  // Initialize Quantum Payment
  const initQuantumPayment = () => {
    const entanglementId = QuantumEncryption.generateEntanglement();
    const qubitSignature = QuantumEncryption.createQubitSignature(
      `${plan}|${price}|${Date.now()}`
    );

    setQuantumState({
      entanglementId,
      qubitSignature,
      superposition: true,
      coherenceTime: 0
    });

    // Start quantum coherence timer
    quantumTimerRef.current = setInterval(() => {
      setQuantumState(prev => ({
        ...prev,
        coherenceTime: prev.coherenceTime + 1
      }));
    }, 1000);

    // Play quantum field audio
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(e => console.log("Audio play error:", e));
    }
  };

  // Verify Biometrics
  const verifyBiometrics = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        setBiometrics({
          fingerprintVerified: true,
          facialScanComplete: true,
          neuralPatternMatch: true
        });
        resolve(true);
      }, 2000);
    });
  };

  // Process Quantum Payment
  const processQuantumPayment = async () => {
    try {
      await verifyBiometrics();
      
      setPaymentStatus(prev => ({
        ...prev,
        quantumEncrypted: true
      }));
      
      setTimeout(() => {
        setPaymentStatus(prev => ({
          ...prev,
          blockchainConfirmed: true
        }));
      }, 1500);
      
      setTimeout(() => {
        setPaymentStatus(prev => ({
          ...prev,
          aiVerified: true
        }));
        
        setTimeout(() => {
          setPaymentComplete(true);
          clearInterval(quantumTimerRef.current);
          
          setTimeout(() => {
            navigate("/quantum-success");
          }, 3000);
        }, 2000);
      }, 3000);
    } catch (error) {
      console.error("Quantum payment error:", error);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      clearInterval(quantumTimerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <div className="fixed inset-0 overflow-y-auto z-[9999]">
        {/* Quantum Tunnel Background */}
        <div className="fixed inset-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover opacity-80"
          >
            <source src={blackholeVideo} type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-purple-900/30 to-black/90"></div>
        </div>

        {/* Quantum Audio Field */}
        <audio ref={audioRef} loop>
          <source src={quantumFieldAudio} type="audio/mpeg" />
        </audio>

        <AnimatePresence>
          {paymentComplete ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="relative z-10 bg-n-8/95 backdrop-blur-xl p-10 rounded-4xl max-w-2xl w-full shadow-2xl border-2 border-emerald-500/30 mx-auto my-16"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-28 h-28 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border-2 border-emerald-500/30"
                >
                  <FiCheck className="w-16 h-16 text-emerald-500" />
                </motion.div>
                
                <h2 className="text-4xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Quantum Payment Complete
                </h2>
                
                <p className="text-n-3 mb-8 max-w-md">
                  Your transaction has been secured across multiple quantum dimensions and verified by our AI network.
                </p>
                
                <div className="bg-n-7/80 rounded-2xl p-6 w-full mb-8 border border-n-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-n-4 text-sm">Plan:</p>
                      <p className="text-white font-medium text-lg">{plan}</p>
                    </div>
                    <div>
                      <p className="text-n-4 text-sm">Amount:</p>
                      <p className="text-white font-bold text-xl">${price}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-n-6 pt-4">
                    <p className="text-n-4 text-sm mb-2">Quantum Signature:</p>
                    <p className="text-cyan-400 font-mono text-xs truncate">
                      {quantumState.qubitSignature}
                    </p>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-2" 
                  gradient
                  onClick={() => navigate("/quantum-dashboard")}
                >
                  Access Quantum Dashboard
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="relative z-10 bg-n-8/95 backdrop-blur-xl p-10 rounded-4xl max-w-6xl w-full shadow-2xl border-2 border-purple-500/30 mx-auto my-8"
            >
              {/* Quantum Header */}
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                    <FiZap className="text-purple-500 mr-3" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                      Quantum Payment Portal
                    </span>
                  </h1>
                  <p className="text-n-3">
                    Secure cross-dimensional transaction interface
                  </p>
                </div>
                
                <button 
                  onClick={() => navigate(-1)}
                  className="text-n-3 hover:text-white transition-colors p-2 rounded-full hover:bg-n-7"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Quantum Plan Overview */}
                <div className="lg:col-span-1">
                  <div className="bg-n-7/80 rounded-3xl p-8 border-2 border-purple-500/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    
                    <h2 className="text-2xl font-bold text-white mb-6">
                      <FiAward className="inline mr-2 text-purple-400" />
                      {plan} Quantum Plan
                    </h2>
                    
                    <div className="flex items-baseline mb-8">
                      <span className="text-5xl font-bold text-white mr-2">
                        ${price}
                      </span>
                      <span className="text-n-3">/quantum cycle</span>
                    </div>
                    
                    <ul className="space-y-4 mb-8">
                      {quantumPlanData[plan]?.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <FiCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-n-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="bg-n-8/50 rounded-xl p-4 border border-n-7">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-n-3">Quantum Bits:</span>
                        <span className="text-purple-400 font-bold">
                          {quantumPlanData[plan]?.qbits.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-n-3">Temporal Security:</span>
                        <span className="text-green-400 font-bold">Active</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quantum Security Status */}
                  <div className="mt-6 bg-n-7/80 rounded-3xl p-6 border-2 border-cyan-500/20">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <FiShield className="text-cyan-400 mr-2" />
                      Quantum Security
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-n-3">Entanglement ID:</span>
                        <span className="text-cyan-400 font-mono text-xs">
                          {quantumState.entanglementId || "Not established"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-n-3">Coherence Time:</span>
                        <span className="text-white">
                          {quantumState.coherenceTime}s
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-n-3">Superposition:</span>
                        <span className={quantumState.superposition ? "text-green-400" : "text-red-400"}>
                          {quantumState.superposition ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quantum Payment Interface */}
                <div className="lg:col-span-2">
                  <div className="bg-n-7/80 rounded-3xl p-8 border-2 border-blue-500/20">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <FiCreditCard className="text-blue-400 mr-2" />
                      Quantum Payment Channel
                    </h2>
                    
                    {/* Biometric Verification */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <FaFingerprint className="text-pink-400 mr-2" />
                        Biometric Verification
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className={`p-4 rounded-xl border-2 ${biometrics.fingerprintVerified ? "border-green-500/30 bg-green-500/10" : "border-n-6"}`}>
                          <div className="flex items-center mb-2">
                            <FaFingerprint className={`mr-2 ${biometrics.fingerprintVerified ? "text-green-400" : "text-n-4"}`} />
                            <span className={`font-medium ${biometrics.fingerprintVerified ? "text-white" : "text-n-3"}`}>
                              Fingerprint
                            </span>
                          </div>
                          <div className="text-xs text-n-4">
                            {biometrics.fingerprintVerified ? "Quantum verified" : "Pending scan"}
                          </div>
                        </div>
                        
                        <div className={`p-4 rounded-xl border-2 ${biometrics.facialScanComplete ? "border-blue-500/30 bg-blue-500/10" : "border-n-6"}`}>
                          <div className="flex items-center mb-2">
                            <FiEye className={`mr-2 ${biometrics.facialScanComplete ? "text-blue-400" : "text-n-4"}`} />
                            <span className={`font-medium ${biometrics.facialScanComplete ? "text-white" : "text-n-3"}`}>
                              Facial Scan
                            </span>
                          </div>
                          <div className="text-xs text-n-4">
                            {biometrics.facialScanComplete ? "Multidimensional match" : "Awaiting scan"}
                          </div>
                        </div>
                        
                        <div className={`p-4 rounded-xl border-2 ${biometrics.neuralPatternMatch ? "border-purple-500/30 bg-purple-500/10" : "border-n-6"}`}>
                          <div className="flex items-center mb-2">
                            <FaRobot className={`mr-2 ${biometrics.neuralPatternMatch ? "text-purple-400" : "text-n-4"}`} />
                            <span className={`font-medium ${biometrics.neuralPatternMatch ? "text-white" : "text-n-3"}`}>
                              Neural Pattern
                            </span>
                          </div>
                          <div className="text-xs text-n-4">
                            {biometrics.neuralPatternMatch ? "Quantum entangled" : "Calibrating"}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quantum Payment Progress */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <FiServer className="text-amber-400 mr-2" />
                        Quantum Transaction Process
                      </h3>
                      
                      <div className="space-y-6">
                        <div className={`p-4 rounded-xl border-2 ${paymentStatus.quantumEncrypted ? "border-green-500/30 bg-green-500/10" : "border-n-6"}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${paymentStatus.quantumEncrypted ? "bg-green-500/20 text-green-400" : "bg-n-7 text-n-4"}`}>
                                {paymentStatus.quantumEncrypted ? <FiCheck className="w-4 h-4" /> : <FiClock className="w-4 h-4" />}
                              </div>
                              <div>
                                <h4 className={`font-medium ${paymentStatus.quantumEncrypted ? "text-white" : "text-n-3"}`}>
                                  Quantum Encryption
                                </h4>
                                <p className="text-xs text-n-4">
                                  {paymentStatus.quantumEncrypted ? "Entangled across dimensions" : "Initializing qubits"}
                                </p>
                              </div>
                            </div>
                            {paymentStatus.quantumEncrypted && (
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                                Secure
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className={`p-4 rounded-xl border-2 ${paymentStatus.blockchainConfirmed ? "border-blue-500/30 bg-blue-500/10" : "border-n-6"}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${paymentStatus.blockchainConfirmed ? "bg-blue-500/20 text-blue-400" : "bg-n-7 text-n-4"}`}>
                                {paymentStatus.blockchainConfirmed ? <FiCheck className="w-4 h-4" /> : <FiClock className="w-4 h-4" />}
                              </div>
                              <div>
                                <h4 className={`font-medium ${paymentStatus.blockchainConfirmed ? "text-white" : "text-n-3"}`}>
                                  Blockchain Settlement
                                </h4>
                                <p className="text-xs text-n-4">
                                  {paymentStatus.blockchainConfirmed ? "Interstellar ledger updated" : "Connecting to quantum nodes"}
                                </p>
                              </div>
                            </div>
                            {paymentStatus.blockchainConfirmed && (
                              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                                Immutable
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className={`p-4 rounded-xl border-2 ${paymentStatus.aiVerified ? "border-purple-500/30 bg-purple-500/10" : "border-n-6"}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${paymentStatus.aiVerified ? "bg-purple-500/20 text-purple-400" : "bg-n-7 text-n-4"}`}>
                                {paymentStatus.aiVerified ? <FiCheck className="w-4 h-4" /> : <FiClock className="w-4 h-4" />}
                              </div>
                              <div>
                                <h4 className={`font-medium ${paymentStatus.aiVerified ? "text-white" : "text-n-3"}`}>
                                  AI Verification
                                </h4>
                                <p className="text-xs text-n-4">
                                  {paymentStatus.aiVerified ? "Neural network confirmed" : "Analyzing quantum patterns"}
                                </p>
                              </div>
                            </div>
                            {paymentStatus.aiVerified && (
                              <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quantum Initiation */}
                    <div className="flex justify-end">
                      {!quantumState.entanglementId ? (
                        <Button 
                          gradient
                          onClick={initQuantumPayment}
                          className="flex items-center"
                        >
                          <FiZap className="mr-2" />
                          Initialize Quantum Payment
                        </Button>
                      ) : (
                        <Button 
                          gradient
                          onClick={processQuantumPayment}
                          disabled={paymentStatus.aiVerified}
                          className="flex items-center"
                        >
                          {paymentStatus.aiVerified ? (
                            "Payment Complete"
                          ) : (
                            <>
                              <FaSatelliteDish className="mr-2" />
                              {paymentStatus.quantumEncrypted ? "Confirm Transaction" : "Engage Quantum Lock"}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
};

export default PaymentPage;
