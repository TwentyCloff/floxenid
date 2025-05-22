import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  const [touched, setTouched] = useState({});
  
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
      note: "Pembayaran via QRIS akan diproses otomatis",
      color: "from-purple-500 to-indigo-600"
    },
    "gopay": {
      name: "Gopay",
      icon: <FiSmartphone className="w-6 h-6" />,
      instructions: "Transfer ke nomor berikut",
      account: "08123456789 (A/N Customer Service)",
      note: "Harap screenshot bukti transfer dan kirim ke admin",
      color: "from-green-500 to-teal-600"
    },
    "dana": {
      name: "DANA",
      icon: <FiSmartphone className="w-6 h-6" />,
      instructions: "Transfer ke nomor berikut",
      account: "08198765432 (A/N Customer Service)",
      note: "Harap screenshot bukti transfer dan kirim ke admin",
      color: "from-blue-500 to-cyan-600"
    }
  };

  useEffect(() => {
    // Validate fields when they lose focus
    if (Object.keys(touched).length > 0) {
      validatePersonalInfo();
    }
  }, [personalInfo, touched]);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    
    // Phone number validation - only allow numbers
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, '');
      setPersonalInfo(prev => ({ ...prev, [name]: numericValue }));
      return;
    }
    
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    const { name, email, discord, phone } = personalInfo;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name.trim()) newErrors.name = "Nama lengkap wajib diisi";
    else if (name.length < 3) newErrors.name = "Nama terlalu pendek";
    
    if (!email) newErrors.email = "Email wajib diisi";
    else if (!emailRegex.test(email)) newErrors.email = "Format email tidak valid";
    
    if (!discord.trim()) newErrors.discord = "Username Discord wajib diisi";
    else if (!/^[a-zA-Z0-9_.-]+$/.test(discord)) newErrors.discord = "Username tidak valid";
    
    if (!phone) newErrors.phone = "Nomor WhatsApp wajib diisi";
    else if (phone.length < 10) newErrors.phone = "Nomor terlalu pendek";
    else if (phone.length > 15) newErrors.phone = "Nomor terlalu panjang";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitPayment = async () => {
    if (!validatePersonalInfo()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const transactionData = {
        customer: {
          name: personalInfo.name,
          email: personalInfo.email,
          discord: personalInfo.discord,
          phone: personalInfo.phone,
          userId: ""
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
          ipAddress: ""
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

      const docRef = await addDoc(collection(db, "transactions"), transactionData);
      console.log("Transaction saved with ID: ", docRef.id);

      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
        {/* Enhanced Background with Purple Overlay */}
        <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-900/80 to-gray-900/90">
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          >
            <source src={paymentVideo} type="video/mp4" />
          </video>
        </div>

        <AnimatePresence>
          {paymentComplete ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="relative z-10 bg-gray-800/95 backdrop-blur-xl p-8 rounded-2xl max-w-md w-full mx-auto my-16 border border-purple-500/30 shadow-xl shadow-purple-900/20"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <FiCheck className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4">
                  Pembayaran Berhasil!
                </h2>
                
                <p className="text-gray-300 mb-6">
                  Terima kasih telah berlangganan <span className="text-purple-300 font-medium">{plan}</span>. Admin akan segera memverifikasi pembayaran Anda.
                </p>
                
                <div className="w-full bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-600">
                  <p className="text-sm text-gray-300 mb-1">Nomor Invoice:</p>
                  <p className="text-white font-mono text-lg tracking-wider">INV-{Date.now()}</p>
                </div>
                
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                >
                  Ke Dashboard
                </Button>
              </div>
            </motion.div>
          ) : isProcessing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 bg-gray-800/95 backdrop-blur-xl p-8 rounded-2xl max-w-md w-full mx-auto my-16 text-center border border-purple-500/30 shadow-xl"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-20 h-20 mb-6 text-purple-400"
                >
                  <FiLoader className="w-full h-full" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-white mb-2">
                  Memproses Pembayaran
                </h2>
                
                <p className="text-gray-300 mb-6">
                  Harap tunggu sebentar, sistem sedang memproses transaksi Anda...
                </p>
                
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6 overflow-hidden">
                  <motion.div 
                    initial={{ width: "10%" }}
                    animate={{ width: ["10%", "70%", "90%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full" 
                  ></motion.div>
                </div>
                
                <div className="text-sm text-gray-400">
                  <p>Jangan tutup atau refresh halaman ini</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 bg-gray-800/95 backdrop-blur-xl p-6 rounded-2xl max-w-4xl w-full mx-auto my-8 border border-gray-700 shadow-2xl shadow-purple-900/20"
            >
              {/* Header with improved design */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {step === 1 ? "Data Diri" : step === 2 ? "Metode Pembayaran" : "Konfirmasi Pembayaran"}
                  </h1>
                  <p className="text-gray-300">
                    Langganan <span className="text-purple-300 font-medium">{plan}</span> - <span className="font-bold text-white">Rp{Number(price).toLocaleString('id-ID')}</span>
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 bg-gray-900/50 px-3 py-2 rounded-full border border-gray-700">
                  {[1, 2, 3].map((stepNumber) => (
                    <React.Fragment key={stepNumber}>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                          step === stepNumber
                            ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md"
                            : step > stepNumber
                            ? "bg-gradient-to-br from-green-500 to-teal-600 text-white"
                            : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {step > stepNumber ? <FiCheck size={14} /> : stepNumber}
                      </div>
                      {stepNumber < 3 && (
                        <div className={`w-6 h-[2px] rounded-full ${
                          step > stepNumber ? 'bg-green-500' : 'bg-gray-700'
                        }`}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Nama Lengkap <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                          errors.name ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          <FiUser className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={personalInfo.name}
                          onChange={handlePersonalInfoChange}
                          onBlur={() => handleBlur('name')}
                          className={`w-full bg-gray-700/70 border ${
                            errors.name ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-600 focus:ring-purple-500/30'
                          } rounded-lg py-2.5 px-4 pl-10 text-white focus:ring-2 focus:outline-none transition-all`}
                          placeholder="Nama lengkap Anda"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-400 flex items-center">
                          <FiX className="mr-1" /> {errors.name}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                          errors.email ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          <FiMail className="w-5 h-5" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          onBlur={() => handleBlur('email')}
                          className={`w-full bg-gray-700/70 border ${
                            errors.email ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-600 focus:ring-purple-500/30'
                          } rounded-lg py-2.5 px-4 pl-10 text-white focus:ring-2 focus:outline-none transition-all`}
                          placeholder="email@domain.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-400 flex items-center">
                          <FiX className="mr-1" /> {errors.email}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Username Discord <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                          errors.discord ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          <FaDiscord className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          name="discord"
                          value={personalInfo.discord}
                          onChange={handlePersonalInfoChange}
                          onBlur={() => handleBlur('discord')}
                          className={`w-full bg-gray-700/70 border ${
                            errors.discord ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-600 focus:ring-purple-500/30'
                          } rounded-lg py-2.5 px-4 pl-10 text-white focus:ring-2 focus:outline-none transition-all`}
                          placeholder="username"
                        />
                      </div>
                      {errors.discord && (
                        <p className="mt-1 text-sm text-red-400 flex items-center">
                          <FiX className="mr-1" /> {errors.discord}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">Contoh: nierautomata</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Nomor WhatsApp <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                          errors.phone ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          <FiSmartphone className="w-5 h-5" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                          onBlur={() => handleBlur('phone')}
                          className={`w-full bg-gray-700/70 border ${
                            errors.phone ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-600 focus:ring-purple-500/30'
                          } rounded-lg py-2.5 px-4 pl-10 text-white focus:ring-2 focus:outline-none transition-all`}
                          placeholder="08123456789"
                          maxLength={15}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-400 flex items-center">
                          <FiX className="mr-1" /> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t border-gray-700">
                    <Button
                      onClick={() => navigate(-1)}
                      variant="outline"
                      className="border-gray-600 hover:bg-gray-700/50 text-gray-300 hover:text-white"
                    >
                      Kembali
                    </Button>
                    <Button
                      onClick={() => {
                        if (validatePersonalInfo()) {
                          setStep(2);
                        }
                      }}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                    >
                      Lanjut ke Pembayaran
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method - Improved Design */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Pilih Metode Pembayaran</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.entries(paymentMethods).map(([key, method]) => (
                        <button
                          key={key}
                          onClick={() => setPaymentMethod(key)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center ${
                            paymentMethod === key
                              ? `border-transparent bg-gradient-to-br ${method.color} shadow-lg`
                              : "border-gray-600 hover:border-gray-500 hover:bg-gray-700/30"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                            paymentMethod === key 
                              ? "bg-white/20 text-white" 
                              : "bg-gray-700 text-gray-400"
                          }`}>
                            {method.icon}
                          </div>
                          <span className={`font-semibold ${
                            paymentMethod === key ? "text-white" : "text-gray-300"
                          }`}>
                            {method.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-xl p-5 border border-gray-600 shadow-inner">
                    <div className="flex flex-col items-center text-center mb-5">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 bg-gradient-to-br ${paymentMethods[paymentMethod].color} text-white shadow-md`}>
                        {paymentMethods[paymentMethod].icon}
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {paymentMethods[paymentMethod].instructions}
                      </h3>
                    </div>
                    
                    {paymentMethod === "qris" ? (
                      <div className="flex flex-col items-center py-4">
                        <div className="w-52 h-52 bg-white rounded-xl flex items-center justify-center mb-4 p-4 shadow-lg relative overflow-hidden">
                          <FaQrcode className="w-full h-full text-black" />
                          <div className="absolute inset-0 border-2 border-dashed border-purple-400 rounded-xl animate-pulse pointer-events-none"></div>
                        </div>
                        <p className="text-gray-300 text-center max-w-md">
                          Scan QR code di atas menggunakan aplikasi e-wallet atau mobile banking Anda yang mendukung QRIS
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-gray-800/70 rounded-xl p-5 border border-gray-600 text-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-indigo-900/10 pointer-events-none"></div>
                          <p className="text-gray-400 text-sm mb-1">Nomor {paymentMethods[paymentMethod].name}</p>
                          <p className="text-xl font-bold text-white font-mono tracking-wide">
                            {paymentMethods[paymentMethod].account}
                          </p>
                        </div>
                        <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/30 flex items-start">
                          <FiMessageSquare className="flex-shrink-0 mt-0.5 mr-2 text-yellow-400" />
                          <p className="text-yellow-300 text-sm">
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
                      className="border-gray-600 hover:bg-gray-700/50 text-gray-300 hover:text-white"
                    >
                      Kembali
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                    >
                      Konfirmasi Pembayaran
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation - Enhanced Design */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600 shadow-inner">
                    <div className="flex items-center mb-5">
                      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-lg mr-3">
                        <FiShield className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        Konfirmasi Data Pembayaran
                      </h3>
                    </div>
                    
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                          <p className="text-gray-400 text-sm mb-1">Nama Lengkap</p>
                          <p className="text-white font-medium text-lg">{personalInfo.name}</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                          <p className="text-gray-400 text-sm mb-1">Email</p>
                          <p className="text-white font-medium text-lg">{personalInfo.email}</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                          <p className="text-gray-400 text-sm mb-1">Discord</p>
                          <p className="text-white font-medium text-lg">{personalInfo.discord}</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                          <p className="text-gray-400 text-sm mb-1">WhatsApp</p>
                          <p className="text-white font-medium text-lg">{personalInfo.phone}</p>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-600 pt-5 mt-2">
                        <div className="flex items-center mb-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br ${paymentMethods[paymentMethod].color} text-white`}>
                            {paymentMethods[paymentMethod].icon}
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Metode Pembayaran</p>
                            <p className="text-white font-bold text-lg">
                              {paymentMethods[paymentMethod].name}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/70 rounded-xl p-5 border border-gray-600">
                        <div className="flex justify-between mb-3">
                          <p className="text-gray-400">Paket Langganan</p>
                          <p className="text-white font-medium">{plan}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-400">Total Pembayaran</p>
                          <p className="text-white font-bold text-2xl">Rp{Number(price).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30 flex items-start">
                    <div className="bg-purple-500/20 p-1.5 rounded-lg mr-3">
                      <FiLock className="w-4 h-4 text-purple-300" />
                    </div>
                    <p className="text-gray-300 text-sm">
                      Data Anda aman dan dilindungi. Pembayaran akan diproses secara otomatis dan aman melalui sistem kami.
                    </p>
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t border-gray-700">
                    <Button
                      onClick={() => setStep(2)}
                      variant="outline"
                      className="border-gray-600 hover:bg-gray-700/50 text-gray-300 hover:text-white"
                    >
                      Kembali
                    </Button>
                    <Button
                      onClick={submitPayment}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
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
