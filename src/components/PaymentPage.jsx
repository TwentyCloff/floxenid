import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { 
  FiCheck, FiLock, FiCreditCard, FiX, FiShield,
  FiUser, FiMail, FiSmartphone, FiLoader
} from "react-icons/fi";
import { FaQrcode } from "react-icons/fa";
import { db } from "../config/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import paymentVideo from "../assets/hero/payment-bg.mp4";
import Button from "./Button";

const PaymentPage = () => {
  const [step, setStep] = useState(1); // 1: Personal info, 2: Payment, 3: Confirm
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    discord: "",
    phone: "",
  });
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get('plan');
  const price = searchParams.get('price');
  const navigate = useNavigate();

  const paymentMethods = {
    "qris": {
      name: "QRIS",
      icon: <FaQrcode className="w-6 h-6" />,
      instructions: "Scan QR code below to complete payment",
      account: "",
      note: ""
    },
    "gopay": {
      name: "Gopay",
      icon: <FiSmartphone className="w-6 h-6" />,
      instructions: "SILAHKAN TRANSFER KE NOMOR DIBAWAH INI",
      account: "08123456789 (A/N Gween Learn)",
      note: "*Jangan lupa screenshot bukti pembayaran*"
    },
    "dana": {
      name: "DANA",
      icon: <FiSmartphone className="w-6 h-6" />,
      instructions: "SILAHKAN TRANSFER KE NOMOR DIBAWAH INI",
      account: "08198765432 (A/N Gween Learn)",
      note: "*Harap screenshot bukti transfer*"
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

  const submitPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Save transaction to Firestore
      const transactionData = {
        customer: {
          name: personalInfo.name,
          email: personalInfo.email,
          discord: personalInfo.discord,
          phone: personalInfo.phone,
          userId: "" // Empty if no auth
        },
        transactionDetails: {
          plan,
          amount: Number(price),
          paymentMethod,
          status: "pending",
          invoiceNumber: `INV-${Date.now()}`,
          adminFee: 0
        },
        systemInfo: {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ipAddress: "" // Empty string
        },
        notes: {
          adminNotes: "",
          userNotes: ""
        }
      };

      await addDoc(collection(db, "transactions"), transactionData);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setPaymentComplete(true);
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Pembayaran gagal: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="fixed inset-0 overflow-y-auto z-[9999] bg-gray-900">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          className="fixed inset-0 w-full h-full object-cover opacity-20"
        >
          <source src={paymentVideo} type="video/mp4" />
        </video>

        <AnimatePresence>
          {paymentComplete ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="relative z-10 bg-gray-800/95 backdrop-blur-xl p-8 rounded-2xl max-w-md w-full mx-auto my-16 border border-emerald-500/30"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
                  <FiCheck className="w-12 h-12 text-emerald-500" />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4">
                  Pembayaran Berhasil!
                </h2>
                
                <p className="text-gray-400 mb-6">
                  Terima kasih telah berlangganan {plan}. Admin akan segera memverifikasi pembayaran Anda.
                </p>
                
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="w-full"
                >
                  Ke Dashboard
                </Button>
              </div>
            </motion.div>
          ) : isProcessing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 bg-gray-800/95 backdrop-blur-xl p-8 rounded-2xl max-w-md w-full mx-auto my-16 text-center"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-20 h-20 mb-6 text-blue-400"
                >
                  <FiLoader className="w-full h-full" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-white mb-2">
                  Memproses Pembayaran
                </h2>
                
                <p className="text-gray-400 mb-6">
                  Harap tunggu sebentar, sistem sedang memproses transaksi Anda...
                </p>
                
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full animate-pulse" 
                  ></div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 bg-gray-800/95 backdrop-blur-xl p-6 rounded-2xl max-w-4xl w-full mx-auto my-8 border border-gray-700"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {step === 1 ? "Data Diri" : step === 2 ? "Pembayaran" : "Konfirmasi"}
                  </h1>
                  <p className="text-gray-400">
                    Langganan {plan} - Rp{price}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  {[1, 2, 3].map((stepNumber) => (
                    <div
                      key={stepNumber}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step === stepNumber
                          ? "bg-blue-500 text-white"
                          : step > stepNumber
                          ? "bg-green-500 text-white"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {step > stepNumber ? <FiCheck size={14} /> : stepNumber}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Nama Lengkap</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={personalInfo.name}
                          onChange={handlePersonalInfoChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nama sesuai KTP"
                          required
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
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="email@domain.com"
                          required
                        />
                        <FiMail className="absolute right-3 top-3 text-gray-400" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Discord</label>
                      <input
                        type="text"
                        name="discord"
                        value={personalInfo.discord}
                        onChange={handlePersonalInfoChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="username#1234"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">WhatsApp</label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="08123456789"
                          required
                        />
                        <FiSmartphone className="absolute right-3 top-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => {
                        const error = validatePersonalInfo();
                        error ? alert(error) : setStep(2);
                      }}
                    >
                      Lanjut ke Pembayaran
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(paymentMethods).map(([key, method]) => (
                      <button
                        key={key}
                        onClick={() => setPaymentMethod(key)}
                        className={`p-4 rounded-lg border flex flex-col items-center transition-colors ${
                          paymentMethod === key
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-600 hover:border-gray-500"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          paymentMethod === key ? "text-blue-400" : "text-gray-400"
                        }`}>
                          {method.icon}
                        </div>
                        <span className={`font-medium ${
                          paymentMethod === key ? "text-white" : "text-gray-400"
                        }`}>
                          {method.name}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="bg-gray-700/80 rounded-lg p-5 border border-gray-600">
                    <h3 className="text-lg font-bold text-white mb-3 text-center">
                      {paymentMethods[paymentMethod].instructions}
                    </h3>
                    
                    {paymentMethod === "qris" ? (
                      <div className="flex flex-col items-center py-4">
                        <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center mb-4">
                          <FaQrcode className="w-28 h-28 text-black" />
                        </div>
                        <p className="text-gray-400 text-center text-sm">
                          Scan QR code di atas menggunakan aplikasi e-wallet atau mobile banking Anda
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 text-center">
                          <p className="text-xl font-bold text-white">
                            {paymentMethods[paymentMethod].account}
                          </p>
                        </div>
                        <p className="text-yellow-400 text-center text-sm">
                          {paymentMethods[paymentMethod].note}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                    >
                      Kembali
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                    >
                      Konfirmasi Pembayaran
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-700/80 rounded-xl p-6 border border-gray-600">
                    <h3 className="text-lg font-bold text-white mb-4">
                      Konfirmasi Data Pembayaran
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Nama Lengkap</p>
                          <p className="text-white font-medium">{personalInfo.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Email</p>
                          <p className="text-white font-medium">{personalInfo.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Discord</p>
                          <p className="text-white font-medium">{personalInfo.discord}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">WhatsApp</p>
                          <p className="text-white font-medium">{personalInfo.phone}</p>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-600 pt-4 mt-4">
                        <p className="text-gray-400 text-sm">Metode Pembayaran</p>
                        <p className="text-blue-400 font-medium">
                          {paymentMethods[paymentMethod].name}
                        </p>
                      </div>
                      
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="flex justify-between">
                          <p className="text-gray-400">Paket</p>
                          <p className="text-white font-medium">{plan}</p>
                        </div>
                        <div className="flex justify-between mt-2">
                          <p className="text-gray-400">Total Pembayaran</p>
                          <p className="text-white font-bold">Rp{price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button
                      onClick={() => setStep(2)}
                      variant="outline"
                    >
                      Kembali
                    </Button>
                    <Button
                      onClick={submitPayment}
                    >
                      Konfirmasi & Bayar
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
