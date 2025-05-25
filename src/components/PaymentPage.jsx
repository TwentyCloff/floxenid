import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FiCheck, FiLock, FiX, FiShield, FiUser, 
  FiMail, FiSmartphone, FiLoader, FiMessageSquare,
  FiCopy, FiExternalLink, FiChevronDown, FiCreditCard
} from "react-icons/fi";
import { FaQrcode, FaDiscord } from "react-icons/fa";
import { db, auth } from "../config/firebaseConfig";
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import paymentVideo from "../assets/hero/payment-bg.mp4";
import Button from "./Button";
import gopayLogo from "../assets/selectz/gopay1.png";
import danaLogo from "../assets/selectz/dana1.png";
import qrisLogo from "../assets/selectz/gopay1.png";
import qrisByr from "../assets/selectz/qrisbayar.webp";
import ovoLogo from "../assets/selectz/gopay1.png";
import shopeePayLogo from "../assets/selectz/gopay1.png";
import linkAjaLogo from "../assets/selectz/gopay1.png";
import bcaLogo from "../assets/selectz/gopay1.png";
import jagoLogo from "../assets/selectz/gopay1.png";

const PaymentPage = () => {
  const [step, setStep] = useState(1);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    discord: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [userHasPlan, setUserHasPlan] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get('plan');
  const price = searchParams.get('price');
  const navigate = useNavigate();

  const serviceFee = 500;

  const paymentMethods = {
    "qris": {
      name: "QRIS",
      icon: <img src={qrisLogo} alt="QRIS" className="w-6 h-6 object-contain" />,
      instructions: "Scan QR code to complete payment",
      account: "QRIS",
      note: "Instant processing • No additional fees",
      color: "from-emerald-500 to-teal-600",
      borderColor: "border-emerald-500/30",
      logo: qrisByr,
      accountName: "AUTOMATIC PROCESSING"
    },
    "gopay": {
      name: "GOPAY",
      icon: <img src={gopayLogo} alt="Gopay" className="w-6 h-6 object-contain" />,
      instructions: "Transfer to following number",
      account: "08123456789",
      note: "Screenshot required • Processing time 5-15 minutes",
      color: "from-blue-500 to-indigo-600",
      borderColor: "border-blue-500/30",
      logo: gopayLogo,
      accountName: "CUSTOMER SERVICE"
    },
    "dana": {
      name: "DANA",
      icon: <img src={danaLogo} alt="DANA" className="w-6 h-6 object-contain" />,
      instructions: "Transfer to following number",
      account: "08198765432",
      note: "Screenshot required • Processing time 5-15 minutes",
      color: "from-purple-500 to-fuchsia-600",
      borderColor: "border-purple-500/30",
      logo: danaLogo,
      accountName: "CUSTOMER SERVICE"
    },
    "ovo": {
      name: "OVO",
      icon: <img src={ovoLogo} alt="OVO" className="w-6 h-6 object-contain" />,
      instructions: "Transfer to following number",
      account: "08123456789",
      note: "Screenshot required • Processing time 5-15 minutes",
      color: "from-violet-500 to-purple-600",
      borderColor: "border-violet-500/30",
      logo: ovoLogo,
      accountName: "CUSTOMER SERVICE"
    },
    "shopeepay": {
      name: "ShopeePay",
      icon: <img src={shopeePayLogo} alt="ShopeePay" className="w-6 h-6 object-contain" />,
      instructions: "Transfer to following number",
      account: "08198765432",
      note: "Screenshot required • Processing time 5-15 minutes",
      color: "from-orange-500 to-red-600",
      borderColor: "border-orange-500/30",
      logo: shopeePayLogo,
      accountName: "CUSTOMER SERVICE"
    },
    "linkaja": {
      name: "LinkAja",
      icon: <img src={linkAjaLogo} alt="LinkAja" className="w-6 h-6 object-contain" />,
      instructions: "Transfer to following number",
      account: "08123456789",
      note: "Screenshot required • Processing time 5-15 minutes",
      color: "from-green-500 to-emerald-600",
      borderColor: "border-green-500/30",
      logo: linkAjaLogo,
      accountName: "CUSTOMER SERVICE"
    },
    "bca": {
      name: "BCA",
      icon: <img src={bcaLogo} alt="BCA" className="w-6 h-6 object-contain" />,
      instructions: "Transfer to following account",
      account: "1234567890",
      note: "Screenshot required • Processing time 5-15 minutes",
      color: "from-blue-600 to-blue-700",
      borderColor: "border-blue-600/30",
      logo: bcaLogo,
      accountName: "CUSTOMER SERVICE"
    },
    "jago": {
      name: "Bank Jago",
      icon: <img src={jagoLogo} alt="Bank Jago" className="w-6 h-6 object-contain" />,
      instructions: "Transfer to following account",
      account: "9876543210",
      note: "Screenshot required • Processing time 5-15 minutes",
      color: "from-teal-500 to-cyan-600",
      borderColor: "border-teal-500/30",
      logo: jagoLogo,
      accountName: "CUSTOMER SERVICE"
    }
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validatePersonalInfo();
    }
  }, [personalInfo, touched]);

  useEffect(() => {
    // Check if user already has this plan
    const checkUserPlan = async () => {
      const user = auth.currentUser;
      if (user && plan) {
        const q = query(
          collection(db, "transactions"),
          where("customer.userId", "==", user.uid),
          where("transactionDetails.plan", "==", plan),
          where("transactionDetails.status", "==", "completed")
        );
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setUserHasPlan(true);
        }
      }
    };

    // Load user's previous info if available
    const loadUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPersonalInfo(prev => ({
            ...prev,
            name: userData.name || "",
            email: user.email || "",
            discord: userData.discord || "",
            phone: userData.phone || ""
          }));
        } else {
          // Check transactions for user info
          const q = query(
            collection(db, "transactions"),
            where("customer.userId", "==", user.uid)
          );
          
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const latestTransaction = querySnapshot.docs[0].data();
            setPersonalInfo(prev => ({
              ...prev,
              name: latestTransaction.customer.name || "",
              email: latestTransaction.customer.email || "",
              discord: latestTransaction.customer.discord || "",
              phone: latestTransaction.customer.phone || ""
            }));
          }
        }
      }
    };

    checkUserPlan();
    loadUserInfo();
  }, [plan]);

  const generateInvoiceNumber = () => {
    const now = new Date();
    const datePart = now.getFullYear().toString().slice(-2) + 
                    (now.getMonth() + 1).toString().padStart(2, '0') + 
                    now.getDate().toString().padStart(2, '0');
    const timePart = now.getHours().toString().padStart(2, '0') + 
                     now.getMinutes().toString().padStart(2, '0');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `INV-${datePart}${timePart}-${randomPart}`;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone" || name === "discord") {
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
    
    if (!name.trim()) newErrors.name = "Full name is required";
    else if (name.length < 3) newErrors.name = "Minimum 3 characters";
    else if (name.length > 50) newErrors.name = "Maximum 50 characters";
    else if (!/^[a-zA-Z\s.'-]+$/.test(name)) newErrors.name = "Invalid characters";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format";
    else if (email.length > 100) newErrors.email = "Email too long";
    
    if (!discord.trim()) newErrors.discord = "Discord ID is required";
    else if (!/^\d{17,19}$/.test(discord)) newErrors.discord = "Must be 17-19 digits";
    
    if (!phone) newErrors.phone = "WhatsApp number is required";
    else if (!/^\d{10,15}$/.test(phone)) newErrors.phone = "Invalid phone number";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setShowCopyNotification(true);
    setTimeout(() => setShowCopyNotification(false), 2000);
    setTimeout(() => setCopiedIndex(null), 3000);
  };

  const handleProceedToPayment = () => {
    if (userHasPlan) {
      alert("Anda Sudah Memiliki Paket Ini, silahkan pilih yang lain");
      return;
    }

    if (validatePersonalInfo()) {
      if (!dontShowAgain) {
        setShowConfirmation(true);
      } else {
        setStep(2);
      }
    } else {
      scrollToFirstError();
    }
  };

  const scrollToFirstError = () => {
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const submitPayment = async () => {
    if (!validatePersonalInfo()) {
      scrollToFirstError();
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const invoiceNum = generateInvoiceNumber();
      setInvoiceNumber(invoiceNum);
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const transactionData = {
        customer: {
          name: personalInfo.name,
          email: personalInfo.email,
          discord: personalInfo.discord,
          phone: personalInfo.phone,
          userId: user.uid
        },
        transactionDetails: {
          plan: plan || "Unknown Plan",
          amount: Number(price) || 0,
          paymentMethod: paymentMethod,
          status: "pending",
          invoiceNumber: invoiceNum,
          adminFee: serviceFee,
          currency: "IDR",
          totalAmount: Number(price) + serviceFee,
          timestamp: serverTimestamp()
        },
        systemInfo: {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ipAddress: "",
          userAgent: navigator.userAgent
        },
        notes: {
          adminNotes: "",
          userNotes: "",
          paymentNote: paymentMethods[paymentMethod]?.note || ""
        },
        metadata: {
          appVersion: "1.0.0",
          source: "web",
          securityLevel: "standard"
        }
      };

      await setDoc(doc(db, "transactions", invoiceNum), transactionData);
      
      // Save user info for future use
      await setDoc(doc(db, "users", user.uid), {
        name: personalInfo.name,
        discord: personalInfo.discord,
        phone: personalInfo.phone,
        lastUpdated: serverTimestamp()
      }, { merge: true });

      setPaymentPending(true);
      startPaymentStatusCheck(invoiceNum);
    } catch (error) {
      console.error("Payment processing error:", error);
      alert(`Payment failed: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const startPaymentStatusCheck = (invoiceNum) => {
    const checkInterval = setInterval(async () => {
      try {
        const docRef = doc(db, "transactions", invoiceNum);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const transaction = docSnap.data();
          if (transaction.transactionDetails.status === "completed") {
            clearInterval(checkInterval);
            setPaymentComplete(true);
            setPaymentPending(false);
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        clearInterval(checkInterval);
      }
    }, 5000); // Check every 5 seconds

    // Cleanup interval when component unmounts
    return () => clearInterval(checkInterval);
  };

  if (paymentComplete) {
    return (
      <div className="fixed inset-0 overflow-y-auto z-[9999] bg-black flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-95">
          <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-10">
            <source src={paymentVideo} type="video/mp4" />
          </video>
        </div>

        <div className="relative z-10 bg-gray-900/95 backdrop-blur-2xl p-8 rounded-xl max-w-md w-full border border-emerald-500/20 shadow-2xl shadow-emerald-900/10">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <FiCheck className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">
                Payment Successful
              </h2>
              <p className="text-gray-400">
                Invoice: <span className="font-mono text-emerald-400">{invoiceNumber}</span>
              </p>
            </div>
            
            <div className="w-full bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
              <p className="text-gray-300">
                Thank you for purchasing <span className="text-emerald-300 font-medium">{plan}</span>.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Your payment has been verified and processed.
              </p>
            </div>
            
            <Button 
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg transition-all duration-300 hover:shadow-emerald-500/20"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentPending) {
    return (
      <div className="fixed inset-0 overflow-y-auto z-[9999] bg-black flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-95">
          <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-10">
            <source src={paymentVideo} type="video/mp4" />
          </video>
        </div>

        <div className="relative z-10 bg-gray-900/95 backdrop-blur-2xl p-8 rounded-xl max-w-md w-full border border-yellow-500/20 shadow-2xl shadow-yellow-900/10">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse"></div>
              <FiLoader className="relative w-20 h-20 text-yellow-400 animate-spin" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                Payment Pending
              </h2>
              <p className="text-gray-400">
                Silahkan Bayar Nomor dibawah ini, dan tunggu sampai admin memverifikasi pembayaran kamu
              </p>
              <p className="text-yellow-300 text-sm mt-2">
                Silahkan tunggu 5-15 menit
              </p>
            </div>
            
            <div className="w-full bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 text-left">
              <h3 className="text-lg font-bold text-white mb-2">Order Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Product:</span>
                  <span className="text-white">{plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Method:</span>
                  <span className="text-white">{paymentMethods[paymentMethod].name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Number:</span>
                  <span className="text-white font-mono">{paymentMethods[paymentMethod].account}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Amount:</span>
                  <span className="text-white font-bold">Rp{(Number(price) + serviceFee).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
            
            <div className="w-full bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
              <p className="text-yellow-300 text-sm">
                Please keep your payment proof. Our admin will verify your payment shortly.
              </p>
            </div>
            
            <p className="text-xs text-gray-500 font-mono tracking-wider">
              STATUS: PENDING • WAITING VERIFICATION
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="fixed inset-0 overflow-y-auto z-[9999] bg-black flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-95">
          <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-10">
            <source src={paymentVideo} type="video/mp4" />
          </video>
        </div>

        <div className="relative z-10 bg-gray-900/95 backdrop-blur-2xl p-8 rounded-xl max-w-md w-full text-center border border-blue-500/20 shadow-2xl">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
              <FiLoader className="relative w-20 h-20 text-blue-400 animate-spin" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                Processing Payment
              </h2>
              <p className="text-gray-400">
                Please wait while we secure your transaction...
              </p>
            </div>
            
            <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-progress"></div>
            </div>
            
            <p className="text-xs text-gray-500 font-mono tracking-wider">
              SECURE CONNECTION • ENCRYPTED TRANSACTION
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-y-auto z-[9999] bg-black">
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        >
          <source src={paymentVideo} type="video/mp4" />
        </video>
      </div>

      {showCopyNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 max-w-xs w-full mx-4 border border-emerald-500/30 shadow-lg">
            <div className="flex items-center justify-center space-x-2">
              <FiCheck className="w-5 h-5 text-emerald-400" />
              <p className="text-white font-medium">Copied to clipboard</p>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-purple-500/30 shadow-2xl">
            <div className="flex items-start space-x-3 mb-4">
              <div className="bg-purple-500/20 p-2 rounded-lg flex-shrink-0">
                <FiShield className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Confirm Submission</h3>
                <p className="text-gray-400">Please verify your information</p>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 mb-5 border border-gray-700/50">
              <h4 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">IMPORTANT NOTICE</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  All transactions are final and non-refundable
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  Double-check your Discord ID and WhatsApp number
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  Invalid information will void your transaction
                </li>
              </ul>
            </div>
            
            <div className="flex justify-between items-center">
              <label className="flex items-center text-gray-400 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="mr-2 rounded bg-gray-800 border-gray-700 text-purple-500 focus:ring-purple-500"
                />
                Don't show again
              </label>
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowConfirmation(false)}
                  variant="outline"
                  className="border-gray-700 hover:bg-gray-800/50 text-gray-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowConfirmation(false);
                    setStep(2);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 bg-gray-900/95 backdrop-blur-2xl p-6 rounded-xl max-w-4xl w-full mx-auto my-8 border border-gray-700/50 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {step === 1 ? "Customer Information" : 
               step === 2 ? "Payment Details" : 
               "Order Confirmation"}
            </h1>
            <p className="text-gray-400">
              Purchasing <span className="text-emerald-300 font-medium">{plan}</span> • 
              <span className="font-bold text-white ml-1">Rp{Number(price).toLocaleString('id-ID')}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-full border border-gray-700/50">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium relative transition-all duration-300 ${
                    step === stepNumber
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md transform scale-110"
                      : step > stepNumber
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {step > stepNumber ? <FiCheck size={14} /> : stepNumber}
                  {step === stepNumber && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-blue-300 rounded-full animate-pulse"></span>
                  )}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-6 h-[2px] rounded-full transition-all duration-300 ${
                    step > stepNumber ? 'bg-emerald-500' : 'bg-gray-700'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-gray-400 text-sm font-medium">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                    errors.name ? 'text-red-400' : 'text-gray-500'
                  }`}>
                    <FiUser className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={personalInfo.name}
                    onChange={handlePersonalInfoChange}
                    onBlur={() => handleBlur('name')}
                    className={`w-full bg-gray-800/70 border ${
                      errors.name ? 'border-red-500/70 focus:ring-red-500/20' : 'border-gray-700/70 focus:ring-blue-500/20'
                    } rounded-lg py-2.5 px-4 pl-10 text-white focus:ring-2 focus:outline-none transition-all placeholder-gray-500`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-400 flex items-center mt-1">
                    <FiX className="mr-1 flex-shrink-0" /> {errors.name}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-gray-400 text-sm font-medium">
                  Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                    errors.email ? 'text-red-400' : 'text-gray-500'
                  }`}>
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    onBlur={() => handleBlur('email')}
                    className={`w-full bg-gray-800/70 border ${
                      errors.email ? 'border-red-500/70 focus:ring-red-500/20' : 'border-gray-700/70 focus:ring-blue-500/20'
                    } rounded-lg py-2.5 px-4 pl-10 text-white focus:ring-2 focus:outline-none transition-all placeholder-gray-500`}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-400 flex items-center mt-1">
                    <FiX className="mr-1 flex-shrink-0" /> {errors.email}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-gray-400 text-sm font-medium">
                  Discord User ID <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                    errors.discord ? 'text-red-400' : 'text-gray-500'
                  }`}>
                    <FaDiscord className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="discord"
                    value={personalInfo.discord}
                    onChange={handlePersonalInfoChange}
                    onBlur={() => handleBlur('discord')}
                    className={`w-full bg-gray-800/70 border ${
                      errors.discord ? 'border-red-500/70 focus:ring-red-500/20' : 'border-gray-700/70 focus:ring-blue-500/20'
                    } rounded-lg py-2.5 px-4 pl-10 text-white focus:ring-2 focus:outline-none transition-all placeholder-gray-500`}
                    placeholder="1234567890123456789"
                    maxLength={19}
                  />
                </div>
                {errors.discord && (
                  <p className="text-sm text-red-400 flex items-center mt-1">
                    <FiX className="mr-1 flex-shrink-0" /> {errors.discord}
                  </p>
                )}
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span>How to find your Discord ID?</span>
                  <a href="#" className="ml-2 text-blue-400 hover:text-blue-300 flex items-center">
                    Guide <FiExternalLink className="ml-1 w-3 h-3" />
                  </a>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-gray-400 text-sm font-medium">
                  WhatsApp Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                    errors.phone ? 'text-red-400' : 'text-gray-500'
                  }`}>
                    <FiSmartphone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    onBlur={() => handleBlur('phone')}
                    className={`w-full bg-gray-800/70 border ${
                      errors.phone ? 'border-red-500/70 focus:ring-red-500/20' : 'border-gray-700/70 focus:ring-blue-500/20'
                    } rounded-lg py-2.5 px-4 pl-10 text-white focus:ring-2 focus:outline-none transition-all placeholder-gray-500`}
                    placeholder="08123456789"
                    maxLength={15}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-400 flex items-center mt-1">
                    <FiX className="mr-1 flex-shrink-0" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/50">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <FiShield className="text-purple-400 mr-2" />
                Terms & Conditions
              </h3>
              <ul className="text-gray-400 text-sm space-y-3">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 mt-0.5">•</span>
                  All information must be accurate. Transactions with incorrect data will be voided without refund.
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 mt-0.5">•</span>
                  Your Discord User ID must match your account exactly. We cannot assist with deliveries to incorrect accounts.
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 mt-0.5">•</span>
                  Payments are processed within 1-15 minutes during business hours (9AM-10PM WIB).
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2 mt=0.5">•</span>
                  For payments, you must send payment proof to our admin via WhatsApp.
                </li>
              </ul>
            </div>
            
            <div className="flex justify-between pt-5 border-t border-gray-700/50">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="border-gray-700 hover:bg-gray-800/50 text-gray-300 hover:text-white"
              >
                Back
              </Button>
              <Button
                onClick={handleProceedToPayment}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/20"
                disabled={Object.keys(errors).length > 0}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-white">Select Payment Method</h3>
              
              {/* Modified Payment Method Selector - Dropdown Style */}
              <div className="relative">
                <button
                  onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                    showPaymentDropdown 
                      ? `border-transparent bg-gradient-to-br ${paymentMethods[paymentMethod].color} shadow-lg`
                      : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/30"
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      showPaymentDropdown ? "bg-white/10 text-white" : "bg-gray-800 text-gray-400"
                    }`}>
                      {paymentMethods[paymentMethod].icon}
                    </div>
                    <span className="font-semibold text-white">
                      {paymentMethods[paymentMethod].name}
                    </span>
                  </div>
                  <FiChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                    showPaymentDropdown ? 'transform rotate-180 text-white' : 'text-gray-400'
                  }`} />
                </button>
                
                {showPaymentDropdown && (
                  <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
                    <div className="max-h-60 overflow-y-auto">
                      {Object.entries(paymentMethods).map(([key, method]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setPaymentMethod(key);
                            setShowPaymentDropdown(false);
                          }}
                          className={`w-full flex items-center p-3 hover:bg-gray-700/50 transition-colors ${
                            paymentMethod === key ? 'bg-gray-700/70' : ''
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-gray-800/50">
                            {method.icon}
                          </div>
                          <span className="font-medium text-white">{method.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
              <div className="flex flex-col items-center text-center mb-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 bg-gradient-to-br ${paymentMethods[paymentMethod].color} text-white shadow-md`}>
                  {paymentMethods[paymentMethod].icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {paymentMethods[paymentMethod].instructions}
                </h3>
                <p className="text-gray-400 text-sm">
                  {paymentMethods[paymentMethod].note}
                </p>
              </div>
              
              {paymentMethod === "qris" ? (
                <div className="flex flex-col items-center py-4">
                  <div className="w-52 h-52 bg-white rounded-xl flex items-center justify-center mb-4 p-4 shadow-lg">
                    <FaQrcode className="w-full h-full text-black" />
                  </div>
                  <p className="text-gray-400 text-center max-w-md text-sm">
                    Scan using your mobile banking or e-wallet app that supports QRIS
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="bg-gray-800 rounded-xl p-5 border border-gray-700/50">
                    <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">
                      {paymentMethods[paymentMethod].name} Number
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-white font-mono tracking-wide">
                          {paymentMethods[paymentMethod].account}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Atas Nama: {paymentMethods[paymentMethod].accountName}
                        </p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(paymentMethods[paymentMethod].account, paymentMethod)}
                        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-colors border border-gray-600/50"
                        title="Copy number"
                      >
                        {copiedIndex === paymentMethod ? (
                          <FiCheck className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <FiCopy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-5 border border-gray-700/50">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                      <FiCreditCard className="text-blue-400 mr-2" />
                      Order Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Product</span>
                        <span className="text-white font-medium">{plan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Service Fee</span>
                        <span className="text-white font-medium">Rp{serviceFee.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="border-t border-gray-700/50 my-2"></div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Payment</span>
                        <span className="text-white font-bold text-lg">Rp{(Number(price) + serviceFee).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20 flex items-start">
                    <FiMessageSquare className="flex-shrink-0 mt-0.5 mr-3 text-yellow-400" />
                    <p className="text-yellow-300 text-sm">
                      {paymentMethods[paymentMethod].note} Please save your payment proof.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between pt-5 border-t border-gray-700/50">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="border-gray-700 hover:bg-gray-800/50 text-gray-300 hover:text-white"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/20"
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg mr-3">
                  <FiShield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Confirm Your Order
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-white flex items-center">
                    <FiUser className="text-blue-400 mr-2" />
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700/50">
                      <p className="text-gray-400 text-sm mb-1">Full Name</p>
                      <p className="text-white font-medium">{personalInfo.name}</p>
                    </div>
                    <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700/50">
                      <p className="text-gray-400 text-sm mb-1">Email</p>
                      <p className="text-white font-medium">{personalInfo.email}</p>
                    </div>
                    <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700/50">
                      <p className="text-gray-400 text-sm mb-1">Discord ID</p>
                      <p className="text-white font-medium">{personalInfo.discord}</p>
                    </div>
                    <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700/50">
                      <p className="text-gray-400 text-sm mb-1">WhatsApp</p>
                      <p className="text-white font-medium">{personalInfo.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-white flex items-center">
                    <FiCreditCard className="text-blue-400 mr-2" />
                    Payment Information
                  </h4>
                  <div className="bg-gray-800/70 rounded-xl p-5 border border-gray-700/50">
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br ${paymentMethods[paymentMethod].color} text-white`}>
                        {paymentMethods[paymentMethod].icon}
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Payment Method</p>
                        <p className="text-white font-bold">
                          {paymentMethods[paymentMethod].name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Product</span>
                        <span className="text-white">{plan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Service Fee</span>
                        <span className="text-white">Rp{serviceFee.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="border-t border-gray-700/50 my-2"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Amount</span>
                        <span className="text-white font-bold text-xl">Rp{(Number(price) + serviceFee).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20 flex items-start">
                  <div className="bg-blue-500/20 p-1.5 rounded-lg mr-3 flex-shrink-0">
                    <FiLock className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-gray-300 text-sm">
                    Your transaction is secured with 256-bit encryption. By confirming, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-5 border-t border-gray-700/50">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="border-gray-700 hover:bg-gray-800/50 text-gray-300 hover:text-white"
              >
                Back
              </Button>
              <Button
                onClick={submitPayment}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-emerald-500/20"
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
