import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FiCheck, FiLock, FiCreditCard, FiX, FiShield,
  FiUser, FiMail, FiSmartphone, FiLoader, FiMessageSquare,
  FiCopy, FiExternalLink, FiChevronDown
} from "react-icons/fi";
import { FaQrcode, FaDiscord } from "react-icons/fa";
import { db } from "../config/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import paymentVideo from "../assets/hero/payment-bg.mp4";
import Button from "./Button";
import gopayLogo from "../assets/selectz/gopay.png";
import danaLogo from "../assets/selectz/dana.png";

const PaymentPage = () => {
  const [step, setStep] = useState(1);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    discord: "",
    phone: "",
    game: "",
    category: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [showGameDropdown, setShowGameDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get('plan');
  const price = searchParams.get('price');
  const navigate = useNavigate();

  const games = ["Roblox", "Growtopia"];
  const categories = ["Script", "Item"];

  const paymentMethods = {
    "qris": {
      name: "QRIS",
      icon: <FaQrcode className="w-6 h-6" />,
      instructions: "Scan QR code below to complete payment",
      account: "",
      note: "Payment via QRIS will be processed automatically",
      color: "from-purple-500 to-indigo-600",
      logo: null
    },
    "gopay": {
      name: "Gopay",
      icon: <img src={gopayLogo} alt="Gopay" className="w-6 h-6 object-contain" />,
      instructions: "Transfer to the following number",
      account: "08123456789",
      accountName: "Customer Service",
      note: "Please screenshot the payment proof and send to admin",
      color: "from-green-500 to-teal-600",
      logo: gopayLogo
    },
    "dana": {
      name: "DANA",
      icon: <img src={danaLogo} alt="DANA" className="w-6 h-6 object-contain" />,
      instructions: "Transfer to the following number",
      account: "08198765432",
      accountName: "Customer Service",
      note: "Please screenshot the payment proof and send to admin",
      color: "from-blue-500 to-cyan-600",
      logo: danaLogo
    }
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validatePersonalInfo();
    }
  }, [personalInfo, touched]);

  const generateInvoiceNumber = () => {
    const now = new Date();
    const datePart = now.getFullYear().toString().slice(-2) + 
                    (now.getMonth() + 1).toString().padStart(2, '0') + 
                    now.getDate().toString().padStart(2, '0');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const generatedNumber = `INV-${datePart}${randomPart}`;
    setInvoiceNumber(generatedNumber);
    return generatedNumber;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, '');
      setPersonalInfo(prev => ({ ...prev, [name]: numericValue }));
      return;
    }
    
    if (name === "discord") {
      const numericValue = value.replace(/[^0-9]/g, '');
      setPersonalInfo(prev => ({ ...prev, [name]: numericValue }));
      return;
    }
    
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectGame = (game) => {
    setPersonalInfo(prev => ({ ...prev, game }));
    setShowGameDropdown(false);
  };

  const selectCategory = (category) => {
    setPersonalInfo(prev => ({ ...prev, category }));
    setShowCategoryDropdown(false);
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    const { name, email, discord, phone, game, category } = personalInfo;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const discordRegex = /^\d{17,19}$/;
    const phoneRegex = /^\d{10,15}$/;
    
    // Name validation
    if (!name.trim()) newErrors.name = "Full name is required";
    else if (name.length < 3) newErrors.name = "Name is too short";
    else if (name.length > 50) newErrors.name = "Name is too long";
    else if (!/^[a-zA-Z\s]+$/.test(name)) newErrors.name = "Name can only contain letters and spaces";
    
    // Email validation
    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format";
    else if (email.length > 100) newErrors.email = "Email is too long";
    
    // Discord validation
    if (!discord.trim()) newErrors.discord = "Discord User ID is required";
    else if (!discordRegex.test(discord)) newErrors.discord = "Must be 17-19 digits";
    
    // Phone validation
    if (!phone) newErrors.phone = "WhatsApp number is required";
    else if (!phoneRegex.test(phone)) newErrors.phone = "Invalid phone number format";
    
    // Game validation
    if (!game) newErrors.game = "Game selection is required";
    
    // Category validation
    if (!category) newErrors.category = "Category selection is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setShowCopyNotification(true);
    
    setTimeout(() => {
      setShowCopyNotification(false);
    }, 2000);
    
    setTimeout(() => {
      setCopiedIndex(null);
    }, 3000);
  };

  const handleProceedToPayment = () => {
    if (validatePersonalInfo()) {
      if (!dontShowAgain) {
        setShowConfirmation(true);
      } else {
        setStep(2);
      }
    } else {
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  const submitPayment = async () => {
    if (!validatePersonalInfo()) {
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
      const invoiceNum = generateInvoiceNumber();
      
      const transactionData = {
        customer: {
          name: personalInfo.name,
          email: personalInfo.email,
          discord: personalInfo.discord,
          phone: personalInfo.phone,
          game: personalInfo.game,
          category: personalInfo.category,
          userId: ""
        },
        transactionDetails: {
          plan: plan || "Unknown Plan",
          amount: Number(price) || 0,
          paymentMethod: paymentMethod || "unknown",
          status: "pending",
          invoiceNumber: invoiceNum,
          adminFee: 500,
          currency: "IDR",
          totalAmount: Number(price) + 500
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

      await setDoc(doc(db, "transactions", invoiceNum), transactionData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentComplete(true);
    } catch (error) {
      console.error("Payment processing error:", error);
      alert(`Payment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentComplete) {
    return (
      <div className="fixed inset-0 overflow-y-auto z-[9999] bg-gray-900 flex items-center justify-center">
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

        <div className="relative z-10 bg-gray-800/95 backdrop-blur-xl p-8 rounded-2xl max-w-md w-full mx-4 border border-purple-500/30 shadow-xl shadow-purple-900/20">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <FiCheck className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              Payment Successful!
            </h2>
            
            <p className="text-gray-300 mb-6">
              Thank you for subscribing to <span className="text-purple-300 font-medium">{plan}</span>. Admin will verify your payment shortly.
            </p>
            
            <div className="w-full bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-600">
              <p className="text-sm text-gray-300 mb-1">Invoice Number:</p>
              <p className="text-white font-mono text-lg tracking-wider">{invoiceNumber}</p>
            </div>
            
            <Button 
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="fixed inset-0 overflow-y-auto z-[9999] bg-gray-900 flex items-center justify-center">
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

        <div className="relative z-10 bg-gray-800/95 backdrop-blur-xl p-8 rounded-2xl max-w-md w-full mx-4 text-center border border-purple-500/30 shadow-xl">
          <div className="flex flex-col items-center">
            <FiLoader className="w-20 h-20 mb-6 text-purple-400 animate-spin" />
            
            <h2 className="text-2xl font-bold text-white mb-2">
              Processing Payment
            </h2>
            
            <p className="text-gray-300 mb-6">
              Please wait while we process your transaction...
            </p>
            
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full w-3/4"></div>
            </div>
            
            <div className="text-sm text-gray-400">
              <p>Do not close or refresh this page</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-y-auto z-[9999] bg-gray-900">
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

      {showCopyNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 max-w-xs w-full mx-4 border border-green-500/30 shadow-lg">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-3 border border-green-500/30">
                <FiCheck className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-white font-medium">Copied to clipboard</p>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-purple-500/30 shadow-xl">
            <div className="flex items-start mb-4">
              <div className="bg-purple-500/20 p-2 rounded-lg mr-3">
                <FiShield className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Confirmation</h3>
                <p className="text-gray-300">Please make sure you've read the rules</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <label className="flex items-center text-gray-300 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="mr-2 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                />
                Don't show this again
              </label>
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowConfirmation(false)}
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-700/50 text-gray-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowConfirmation(false);
                    setStep(2);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 bg-gray-800/95 backdrop-blur-xl p-6 rounded-2xl max-w-4xl w-full mx-auto my-8 border border-gray-700 shadow-2xl shadow-purple-900/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {step === 1 ? "Personal Information" : step === 2 ? "Payment Method" : "Payment Confirmation"}
            </h1>
            <p className="text-gray-300">
              Subscription <span className="text-purple-300 font-medium">{plan}</span> - <span className="font-bold text-white">Rp{Number(price).toLocaleString('id-ID')}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-900/50 px-3 py-2 rounded-full border border-gray-700">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium relative transition-all duration-300 ${
                    step === stepNumber
                      ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md transform scale-110"
                      : step > stepNumber
                      ? "bg-gradient-to-br from-green-500 to-teal-600 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {step > stepNumber ? <FiCheck size={14} /> : stepNumber}
                  {step === stepNumber && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-purple-300 rounded-full animate-pulse"></span>
                  )}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-6 h-[2px] rounded-full transition-all duration-300 ${
                    step > stepNumber ? 'bg-green-500' : 'bg-gray-700'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Full Name <span className="text-red-400">*</span>
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
                    placeholder="Your full name"
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
                  Discord User ID <span className="text-red-400">*</span>
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
                    placeholder="1234567890123456789"
                    maxLength={19}
                  />
                </div>
                {errors.discord && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <FiX className="mr-1" /> {errors.discord}
                  </p>
                )}
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <span>How To Get Discord ID ?</span>
                  <a href="https://youtu.be/T2LGHXV5scE?si=wOyIWS7E7A_hCfy-" className="ml-2 text-purple-400 hover:text-purple-300 flex items-center">
                    Click Here <FiExternalLink className="ml-1 w-3 h-3" />
                  </a>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  WhatsApp Number <span className="text-red-400">*</span>
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

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Select Game <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowGameDropdown(!showGameDropdown)}
                    className={`w-full bg-gray-700/70 border ${
                      errors.game ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg py-2.5 px-4 text-white text-left flex justify-between items-center`}
                  >
                    {personalInfo.game || "Select a game"}
                    <FiChevronDown className={`transition-transform ${showGameDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showGameDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
                      {games.map((game) => (
                        <div
                          key={game}
                          onClick={() => selectGame(game)}
                          className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                        >
                          {game}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.game && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <FiX className="mr-1" /> {errors.game}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Select Category <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className={`w-full bg-gray-700/70 border ${
                      errors.category ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg py-2.5 px-4 text-white text-left flex justify-between items-center`}
                  >
                    {personalInfo.category || "Select a category"}
                    <FiChevronDown className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showCategoryDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
                      {categories.map((category) => (
                        <div
                          key={category}
                          onClick={() => selectCategory(category)}
                          className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <FiX className="mr-1" /> {errors.category}
                  </p>
                )}
              </div>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <h3 className="text-lg font-bold text-white mb-2">RULES & TERMS</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  Please fill in your personal data correctly, if there is an error in 1 letter/number the transaction will be void!
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  For mutual comfort, make sure your User ID matches your Discord account, if not your transaction will be void and will not be processed!
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  All transactions are final and non-refundable once processed.
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  We are not responsible for any account bans or suspensions.
                </li>
              </ul>
            </div>
            
            <div className="flex justify-between pt-4 border-t border-gray-700">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="border-gray-600 hover:bg-gray-700/50 text-gray-300 hover:text-white"
              >
                Back
              </Button>
              <Button
                onClick={handleProceedToPayment}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3">Select Payment Method</h3>
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
                  <div className="w-52 h-52 bg-white rounded-xl flex items-center justify-center mb-4 p-4 shadow-lg">
                    <FaQrcode className="w-full h-full text-black" />
                  </div>
                  <p className="text-gray-300 text-center max-w-md">
                    Scan the QR code above using your e-wallet or mobile banking app that supports QRIS
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-800/70 rounded-xl p-5 border border-gray-600">
                    <p className="text-gray-400 text-sm mb-1">{paymentMethods[paymentMethod].name} Number:</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-white font-mono tracking-wide">
                          {paymentMethods[paymentMethod].account}
                        </p>
                        <p className="text-gray-300 text-sm mt-1">
                          Atas Nama: {paymentMethods[paymentMethod].accountName}
                        </p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(paymentMethods[paymentMethod].account, paymentMethod)}
                        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                        title="Copy number"
                      >
                        {copiedIndex === paymentMethod ? (
                          <FiCheck className="w-5 h-5 text-green-400" />
                        ) : (
                          <FiCopy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-800/70 rounded-xl p-5 border border-gray-600">
                    <h4 className="text-lg font-bold text-white mb-3">Shopping Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Price</span>
                        <span className="text-white font-medium">Rp{Number(price).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Game Category</span>
                        <span className="text-white font-medium">{personalInfo.game}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Product</span>
                        <span className="text-white font-medium">{personalInfo.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Service Fee</span>
                        <span className="text-white font-medium">Rp500</span>
                      </div>
                      <div className="border-t border-gray-600 my-2"></div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Shopping Total:</span>
                        <span className="text-white font-bold text-lg">Rp{(Number(price) + 500).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
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
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600 shadow-inner">
              <div className="flex items-center mb-5">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-lg mr-3">
                  <FiShield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Payment Data Confirmation
                </h3>
              </div>
              
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">Full Name</p>
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
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">Game</p>
                    <p className="text-white font-medium text-lg">{personalInfo.game}</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">Category</p>
                    <p className="text-white font-medium text-lg">{personalInfo.category}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-600 pt-5 mt-2">
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br ${paymentMethods[paymentMethod].color} text-white`}>
                      {paymentMethods[paymentMethod].icon}
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Payment Method</p>
                      <p className="text-white font-bold text-lg">
                        {paymentMethods[paymentMethod].name}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/70 rounded-xl p-5 border border-gray-600">
                  <div className="flex justify-between mb-3">
                    <p className="text-gray-400">Subscription Package</p>
                    <p className="text-white font-medium">{plan}</p>
                  </div>
                  <div className="flex justify-between mb-3">
                    <p className="text-gray-400">Service Fee</p>
                    <p className="text-white font-medium">Rp500</p>
                  </div>
                  <div className="border-t border-gray-600 my-3"></div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400">Total Payment</p>
                    <p className="text-white font-bold text-2xl">Rp{(Number(price) + 500).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30 flex items-start">
              <div className="bg-purple-500/20 p-1.5 rounded-lg mr-3">
                <FiLock className="w-4 h-4 text-purple-300" />
              </div>
              <p className="text-gray-300 text-sm">
                Your data is secure and protected. Payment will be processed automatically and securely through our system.
              </p>
            </div>
            
            <div className="flex justify-between pt-4 border-t border-gray-700">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="border-gray-600 hover:bg-gray-700/50 text-gray-300 hover:text-white"
              >
                Back
              </Button>
              <Button
                onClick={submitPayment}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
              >
                Confirm & Pay Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
