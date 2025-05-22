import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { 
  FiCheck, FiLock, FiCreditCard, FiX, FiShield,
  FiEye, FiEyeOff, FiUser, FiMail, FiSmartphone, FiUpload, FiCamera
} from "react-icons/fi";
import { FaQrcode } from "react-icons/fa";
import { db, storage } from "../config/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import paymentVideo from "../assets/hero/payment-bg.mp4";
import Button from "./Button";

const PaymentPage = () => {
  const [step, setStep] = useState(1); // 1: Personal info, 2: Payment, 3: Upload proof
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    discord: "",
    phone: "",
  });
  const [paymentProof, setPaymentProof] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get('plan');
  const price = searchParams.get('price');
  const navigate = useNavigate();

  const paymentPlanData = {
    "Basic": { 
      price: "9.99", 
      features: [
        "Standard features", 
        "Email support",
        "Basic resources",
        "Community access"
      ]
    },
    "Pro": { 
      price: "29.99", 
      features: [
        "All Basic features",
        "Priority support",
        "Enhanced resources",
        "Exclusive content"
      ]
    },
    "Enterprise": { 
      price: "99.99", 
      features: [
        "All Pro features",
        "24/7 dedicated support",
        "Custom solutions",
        "Premium resources"
      ]
    }
  };

  const paymentMethods = {
    "qris": {
      name: "QRIS",
      icon: <FaQrcode className="w-6 h-6" />,
      instructions: "Scan QR code below to complete payment"
    },
    "gopay": {
      name: "Gopay",
      icon: <FiSmartphone className="w-6 h-6" />,
      instructions: "SILAHKAN TRANSFER KE NOMOR DIBAWAH INI",
      account: "08123456789 (A/N Nier Automata)",
      note: "*Jangan lupa screenshot bukti pembayaran*"
    },
    "dana": {
      name: "DANA",
      icon: <FiSmartphone className="w-6 h-6" />,
      instructions: "SILAHKAN TRANSFER KE NOMOR DIBAWAH INI",
      account: "08123456789 (A/N Nier Automata)",
      note: "*Jangan lupa screenshot bukti pembayaran*"
    }
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePersonalInfo = () => {
    const { name, email, discord, phone } = personalInfo;
    if (!name.trim()) return "Nama harus diisi";
    if (!email.includes("@")) return "Email harus valid";
    if (!discord.includes("#")) return "Format Discord salah (contoh: username#1234)";
    if (phone.length < 10) return "Nomor telepon minimal 10 digit";
    return null;
  };

  const handlePaymentProofChange = (e) => {
    if (e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const submitPayment = async () => {
    setIsSubmitting(true);
    
    try {
      // 1. Upload payment proof
      let proofUrl = "";
      if (paymentProof) {
        const storageRef = ref(storage, `payment-proofs/${Date.now()}_${paymentProof.name}`);
        const uploadTask = uploadBytes(storageRef, paymentProof);
        
        await uploadTask;
        proofUrl = await getDownloadURL(storageRef);
      }

      // 2. Save transaction to Firestore
      const transactionData = {
        customer: personalInfo,
        plan,
        price,
        paymentMethod,
        paymentProof: proofUrl,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "transactions"), transactionData);

      setPaymentComplete(true);
      setTimeout(() => navigate("/payment-success"), 3000);
    } catch (error) {
      console.error("Payment submission error:", error);
      alert("Terjadi kesalahan saat memproses pembayaran");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="fixed inset-0 overflow-y-auto z-[9999]">
        {/* Background */}
        <div className="fixed inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover opacity-20"
          >
            <source src={paymentVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-800/30 to-gray-900/90"></div>
        </div>

        <AnimatePresence>
          {paymentComplete ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="relative z-10 bg-gray-800/95 backdrop-blur-xl p-10 rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-700 mx-auto my-16"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-28 h-28 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/30"
                >
                  <FiCheck className="w-16 h-16 text-green-500" />
                </motion.div>
                
                <h2 className="text-4xl font-bold text-white mb-4">
                  Payment Complete
                </h2>
                
                <p className="text-gray-400 mb-8 max-w-md">
                  Pembayaran Anda telah berhasil diproses. Terima kasih telah berlangganan!
                </p>
                
                <div className="bg-gray-700/80 rounded-xl p-6 w-full mb-8 border border-gray-600">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Plan:</p>
                      <p className="text-white font-medium text-lg">{plan}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Amount:</p>
                      <p className="text-white font-bold text-xl">Rp{price}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-600 pt-4">
                    <p className="text-gray-400 text-sm mb-2">Payment Method:</p>
                    <p className="text-blue-400 font-medium">
                      {paymentMethods[paymentMethod].name}
                    </p>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-2" 
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="relative z-10 bg-gray-800/95 backdrop-blur-xl p-8 rounded-2xl max-w-6xl w-full shadow-2xl border border-gray-700 mx-auto my-8"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {step === 1 ? "Data Diri" : step === 2 ? "Metode Pembayaran" : "Upload Bukti Pembayaran"}
                  </h1>
                  <p className="text-gray-400">
                    Langganan {plan} - Rp{price}
                  </p>
                </div>
                
                <button 
                  onClick={() => navigate(-1)}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center">
                  {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${step === stepNumber ? "bg-blue-500 text-white" : step > stepNumber ? "bg-green-500 text-white" : "bg-gray-700 text-gray-400"}`}
                      >
                        {step > stepNumber ? <FiCheck /> : stepNumber}
                      </div>
                      {stepNumber < 3 && (
                        <div className={`w-16 h-1 ${step > stepNumber ? "bg-green-500" : "bg-gray-700"}`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Nama Lengkap</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={personalInfo.name}
                          onChange={handlePersonalInfoChange}
                          placeholder="Masukkan nama lengkap"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <FiUser className="absolute right-3 top-3 text-gray-400" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Email</label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          placeholder="contoh@email.com"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <FiMail className="absolute right-3 top-3 text-gray-400" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Discord Username</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="discord"
                          value={personalInfo.discord}
                          onChange={handlePersonalInfoChange}
                          placeholder="username#1234"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Nomor Telepon</label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                          placeholder="08123456789"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <FiSmartphone className="absolute right-3 top-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-8">
                    <Button 
                      onClick={() => {
                        const error = validatePersonalInfo();
                        if (error) {
                          alert(error);
                        } else {
                          setStep(2);
                        }
                      }}
                      className="px-8 py-3"
                    >
                      Lanjut ke Pembayaran
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(paymentMethods).map(([key, method]) => (
                      <button
                        key={key}
                        onClick={() => setPaymentMethod(key)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center ${paymentMethod === key ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500"}`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${paymentMethod === key ? "text-blue-400" : "text-gray-400"}`}>
                          {method.icon}
                        </div>
                        <span className={`font-medium ${paymentMethod === key ? "text-white" : "text-gray-400"}`}>
                          {method.name}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Payment Instructions */}
                  <div className="bg-gray-700/80 rounded-xl p-6 border border-gray-600">
                    <h3 className="text-lg font-bold text-white mb-4">
                      {paymentMethods[paymentMethod].instructions}
                    </h3>
                    
                    {paymentMethod === "qris" ? (
                      <div className="flex flex-col items-center">
                        <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mb-4">
                          <FaQrcode className="w-32 h-32 text-black" />
                        </div>
                        <p className="text-gray-400 text-center">
                          Scan QR code di atas menggunakan aplikasi mobile banking atau e-wallet Anda
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 text-center">
                          <p className="text-2xl font-bold text-white">
                            {paymentMethods[paymentMethod].account}
                          </p>
                        </div>
                        <p className="text-yellow-400 text-center">
                          {paymentMethods[paymentMethod].note}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <Button 
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="px-8 py-3"
                    >
                      Kembali
                    </Button>
                    <Button 
                      onClick={() => setStep(3)}
                      className="px-8 py-3"
                    >
                      Saya Sudah Transfer
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Upload Payment Proof */}
              {step === 3 && (
                <div className="space-y-8">
                  <div className="bg-gray-700/80 rounded-xl p-6 border border-gray-600">
                    <h3 className="text-lg font-bold text-white mb-4">
                      Upload Bukti Pembayaran
                    </h3>
                    
                    <div className="flex flex-col items-center">
                      {paymentProof ? (
                        <div className="relative w-full max-w-md">
                          <img 
                            src={URL.createObjectURL(paymentProof)} 
                            alt="Payment Proof" 
                            className="w-full h-auto rounded-lg border border-gray-600"
                          />
                          <button
                            onClick={() => setPaymentProof(null)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FiUpload className="w-12 h-12 text-gray-400 mb-3" />
                            <p className="mb-2 text-sm text-gray-400">
                              <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              Format PNG, JPG, atau JPEG (MAX. 5MB)
                            </p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handlePaymentProofChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <Button 
                      onClick={() => setStep(2)}
                      variant="outline"
                      className="px-8 py-3"
                    >
                      Kembali
                    </Button>
                    <Button 
                      onClick={submitPayment}
                      disabled={!paymentProof || isSubmitting}
                      isLoading={isSubmitting}
                      className="px-8 py-3"
                    >
                      {isSubmitting ? "Memproses..." : "Selesaikan Pembayaran"}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
};

export default PaymentPage;
