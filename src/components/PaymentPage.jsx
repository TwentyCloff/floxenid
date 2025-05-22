import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { 
  FiCheck, FiLock, FiCreditCard, FiX, FiShield,
  FiUser, FiMail, FiSmartphone, FiLoader, FiMessageSquare
} from "react-icons/fi";
import { FaQrcode, FaDiscord } from "react-icons/fa";
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
  const [errors, setErrors] = useState({});
  
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
      account: "08123456789 (A/N Aku Nier, Aku Gay, Aku Sigma)",
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
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    const { name, email, discord, phone } = personalInfo;
    
    if (!name.trim()) newErrors.name = "Nama harus diisi";
    if (!email.includes("@")) newErrors.email = "Email harus valid";
    if (!discord.trim()) newErrors.discord = "Discord harus diisi";
    if (phone.length < 10) newErrors.phone = "Nomor telepon minimal 10 digit";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Generate unique invoice number
      const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Prepare transaction data
      const transactionData = {
        customer: {
          name: personalInfo.name,
          email: personalInfo.email,
          discord: personalInfo.discord,
          phone: personalInfo.phone,
          userId: "" // Empty if no auth
        },
        transactionDetails: {
          plan: plan || "Unknown Plan",
          amount: Number(price) || 0,
          paymentMethod: paymentMethod || "unknown",
          status: "pending",
          invoiceNumber: invoiceNumber,
          adminFee: 0,
          currency: "IDR"
        },
        systemInfo: {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ipAddress: "" // Can be filled if you track IP
        },
        notes: {
          adminNotes: "",
          userNotes: "",
          paymentNote: paymentMethods[paymentMethod]?.note || ""
        },
        metadata: {
          appVersion: "1.0.0",
          source: "web"
        }
      };

      // Add document to Firestore
      const docRef = await addDoc(collection(db, "transactions"), transactionData);
      console.log("Transaction saved with ID: ", docRef.id);

      // Simulate processing delay (remove in production)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark payment as complete
      setPaymentComplete(true);
      
    } catch (error) {
      console.error("Payment processing error:", error);
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
                  Terima kasih telah berlangganan <span className="text-emerald-400 font-medium">{plan}</span>. Admin akan segera memverifikasi pembayaran Anda.
                </p>
                
                <div className="w-full bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-600">
                  <p className="text-sm text-gray-300">Nomor Invoice:</p>
                  <p className="text-white font-mono">INV-{Date.now()}</p>
                </div>
                
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
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
                
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full animate-pulse" 
                    style={{ width: "70%" }}
                  ></div>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p>Jangan tutup atau refresh halaman ini</p>
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
                    {step === 1 ? "Data Diri" : step === 2 ? "Metode Pembayaran" : "Konfirmasi Pembayaran"}
                  </h1>
                  <p className="text-gray-400">
                    Langganan <span className="text-emerald-400">{plan}</span> - <span className="font-bold">Rp{Number(price).toLocaleString('id-ID')}</span>
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  {[1, 2, 3].map((stepNumber) => (
                    <div
                      key={stepNumber}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step === stepNumber
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
                          : step > stepNumber
                          ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
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
                      <label className="block text-gray-400 text-sm mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={personalInfo.name}
                          onChange={handlePersonalInfoChange}
                          className={`w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg py-2 px-3 pl-10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          placeholder="Nama Kamu"
                          required
                        />
                        <FiUser className="absolute left-3 top-3 text-gray-400" />
                      </div>
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Email <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          className={`w-full bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg py-2 px-3 pl-10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          placeholder="email@domain.com"
                          required
                        />
                        <FiMail className="absolute left-3 top-3 text-gray-400" />
                      </div>
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Username Discord <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          name="discord"
                          value={personalInfo.discord}
                          onChange={handlePersonalInfoChange}
                          className={`w-full bg-gray-700 border ${errors.discord ? 'border-red-500' : 'border-gray-600'} rounded-lg py-2 px-3 pl-10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          placeholder="username"
                          required
                        />
                        <FaDiscord className="absolute left-3 top-3 text-gray-400" />
                      </div>
                      {errors.discord && <p className="text-red-400 text-xs mt-1">{errors.discord}</p>}
                      <p className="text-gray-500 text-xs mt-1">Masukkan username Discord Anda (tanpa #)</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Nomor WhatsApp <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                          className={`w-full bg-gray-700 border ${errors.phone ? 'border-red-500' : 'border-gray-600'} rounded-lg py-2 px-3 pl-10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          placeholder="08123456789"
                          required
                        />
                        <FiSmartphone className="absolute left-3 top-3 text-gray-400" />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t border-gray-700">
                    <Button
                      onClick={() => navigate(-1)}
                      variant="outline"
                      className="border-gray-600 hover:bg-gray-700/50"
                    >
                      Kembali
                    </Button>
                    <Button
                      onClick={() => {
                        if (validatePersonalInfo()) {
                          setStep(2);
                        }
                      }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    >
                      Lanjut ke Pembayaran
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Pilih Metode Pembayaran</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(paymentMethods).map(([key, method]) => (
                      <button
                        key={key}
                        onClick={() => setPaymentMethod(key)}
                        className={`p-4 rounded-lg border flex flex-col items-center transition-all ${
                          paymentMethod === key
                            ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                            : "border-gray-600 hover:border-gray-500 hover:bg-gray-700/50"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                          paymentMethod === key 
                            ? "bg-blue-500/20 text-blue-400" 
                            : "bg-gray-700 text-gray-400"
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
                  
                  <div className="bg-gray-700/80 rounded-xl p-5 border border-gray-600">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/30">
                        {paymentMethods[paymentMethod].icon}
                      </div>
                      <h3 className="text-lg font-bold text-white ml-3">
                        {paymentMethods[paymentMethod].instructions}
                      </h3>
                    </div>
                    
                    {paymentMethod === "qris" ? (
                      <div className="flex flex-col items-center py-4">
                        <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center mb-4 p-4 shadow-lg">
                          <FaQrcode className="w-full h-full text-black" />
                        </div>
                        <p className="text-gray-400 text-center text-sm max-w-md">
                          Scan QR code di atas menggunakan aplikasi e-wallet atau mobile banking Anda yang mendukung QRIS
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-center">
                          <p className="text-xl font-bold text-white font-mono">
                            {paymentMethods[paymentMethod].account}
                          </p>
                        </div>
                        <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/30">
                          <p className="text-yellow-400 text-center text-sm">
                            {paymentMethods[paymentMethod].note}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t border-gray-700">
                    <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="border-gray-600 hover:bg-gray-700/50"
                    >
                      Kembali
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
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
                    <div className="flex items-center mb-4">
                      <FiShield className="w-6 h-6 text-emerald-500 mr-2" />
                      <h3 className="text-lg font-bold text-white">
                        Konfirmasi Data Pembayaran
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-800/30 p-3 rounded-lg">
                          <p className="text-gray-400 text-sm">Nama Lengkap</p>
                          <p className="text-white font-medium">{personalInfo.name}</p>
                        </div>
                        <div className="bg-gray-800/30 p-3 rounded-lg">
                          <p className="text-gray-400 text-sm">Email</p>
                          <p className="text-white font-medium">{personalInfo.email}</p>
                        </div>
                        <div className="bg-gray-800/30 p-3 rounded-lg">
                          <p className="text-gray-400 text-sm">Discord</p>
                          <p className="text-white font-medium">{personalInfo.discord}</p>
                        </div>
                        <div className="bg-gray-800/30 p-3 rounded-lg">
                          <p className="text-gray-400 text-sm">WhatsApp</p>
                          <p className="text-white font-medium">{personalInfo.phone}</p>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-600 pt-4 mt-4">
                        <div className="flex items-center mb-2">
                          {paymentMethods[paymentMethod].icon}
                          <p className="text-gray-400 ml-2">Metode Pembayaran</p>
                        </div>
                        <p className="text-blue-400 font-medium text-lg">
                          {paymentMethods[paymentMethod].name}
                        </p>
                      </div>
                      
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                        <div className="flex justify-between mb-2">
                          <p className="text-gray-400">Paket Langganan</p>
                          <p className="text-white font-medium">{plan}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-400">Total Pembayaran</p>
                          <p className="text-white font-bold text-xl">Rp{Number(price).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                    <div className="flex items-start">
                      <FiLock className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-gray-300 text-sm">
                        Data Anda aman dan dilindungi. Pembayaran akan diproses secara otomatis dan aman melalui sistem kami.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t border-gray-700">
                    <Button
                      onClick={() => setStep(2)}
                      variant="outline"
                      className="border-gray-600 hover:bg-gray-700/50"
                    >
                      Kembali
                    </Button>
                    <Button
                      onClick={submitPayment}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                    >
                      Konfirmasi & Bayar Sekarang
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
