import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FiCheck, FiLock, FiX, FiShield, FiUser, 
  FiMail, FiSmartphone, FiLoader, FiMessageSquare,
  FiCopy, FiExternalLink, FiChevronDown, FiCreditCard
} from "react-icons/fi";
import { FaDiscord, FaBitcoin, FaPaypal, FaUniversity } from "react-icons/fa";
import { SiBankofamerica } from "react-icons/si";
import { db, auth } from "../config/firebaseConfig";
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import Button from "./Button";

const PaymentPage = () => {
  const [step, setStep] = useState(1);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);
  const [paymentDeclined, setPaymentDeclined] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("crypto");
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
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [currency, setCurrency] = useState("usd");
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get('plan');
  const price = searchParams.get('price');
  const navigate = useNavigate();

  const serviceFee = 500;

  const paymentMethods = {
    "crypto": {
      name: "Crypto",
      icon: <FaBitcoin className="text-yellow-500" size={24} />,
      instructions: "Send crypto to the following address",
      account: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      note: "Instant processing • No additional fees",
      color: "from-yellow-500 to-yellow-600",
      borderColor: "border-yellow-500/30",
      accountName: "CRYPTO WALLET"
    },
    "paypal": {
      name: "PayPal",
      icon: <FaPaypal className="text-blue-500" size={24} />,
      instructions: "You will be redirected to PayPal",
      account: "paypal@example.com",
      note: "Processing time 5-15 minutes",
      color: "from-blue-500 to-blue-600",
      borderColor: "border-blue-500/30",
      accountName: "PAYPAL ACCOUNT"
    },
    "credit": {
      name: "Credit Card",
      icon: <FiCreditCard className="text-purple-500" size={24} />,
      instructions: "Enter your card details",
      account: "VISA/MASTERCARD",
      note: "Secure payment processing",
      color: "from-purple-500 to-purple-600",
      borderColor: "border-purple-500/30",
      accountName: "CREDIT CARD"
    },
    "bank": {
      name: "Bank Transfer",
      icon: <FaUniversity className="text-green-500" size={24} />,
      instructions: "Transfer to following account",
      account: "1234567890",
      note: "Processing time 1-3 business days",
      color: "from-green-500 to-green-600",
      borderColor: "border-green-500/30",
      accountName: "BANK ACCOUNT"
    }
  };

  const currencies = {
    "usd": {
      symbol: "$",
      name: "USD"
    },
    "idr": {
      symbol: "Rp",
      name: "IDR"
    },
    "sgd": {
      symbol: "S$",
      name: "SGD"
    },
    "btc": {
      symbol: "₿",
      name: "BTC"
    },
    "eth": {
      symbol: "Ξ",
      name: "ETH"
    }
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validatePersonalInfo();
    }
  }, [personalInfo, touched]);

  useEffect(() => {
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
      alert("You already have this plan, please choose another one");
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

  const sendDiscordWebhook = async (transactionData) => {
    try {
      const webhookURL = "https://discord.com/api/webhooks/1375016590499909713/XvxOACsbD8RnClBMmTRCZ43lMvcH9WCW70kTm3TcXq0vF4Nfo98yIjX_G4azV1j-raYW";
      
      const embed = {
        title: "New Payment Pending",
        description: `A new payment is pending verification for ${transactionData.customer.name}`,
        color: 0xffcc00,
        fields: [
          {
            name: "Customer Info",
            value: `**Name:** ${transactionData.customer.name}\n**Email:** ${transactionData.customer.email}\n**Discord ID:** ${transactionData.customer.discord}\n**WhatsApp:** ${transactionData.customer.phone}`,
            inline: false
          },
          {
            name: "Transaction Details",
            value: `**Plan:** ${transactionData.transactionDetails.plan}\n**Amount:** ${currency === 'usd' ? '$' : currency === 'idr' ? 'Rp' : currency === 'sgd' ? 'S$' : currency === 'btc' ? '₿' : 'Ξ'}${transactionData.transactionDetails.totalAmount.toLocaleString('id-ID')}\n**Method:** ${transactionData.transactionDetails.paymentMethod}\n**Invoice:** ${transactionData.transactionDetails.invoiceNumber}`,
            inline: false
          }
        ],
        timestamp: new Date().toISOString()
      };

      await fetch(webhookURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: "<@&1376170954115387392> New payment pending verification",
          embeds: [embed]
        })
      });
    } catch (error) {
      console.error("Failed to send Discord webhook:", error);
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
          currency: currency.toUpperCase(),
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
      
      await setDoc(doc(db, "users", user.uid), {
        name: personalInfo.name,
        discord: personalInfo.discord,
        phone: personalInfo.phone,
        lastUpdated: serverTimestamp()
      }, { merge: true });

      await sendDiscordWebhook(transactionData);

      setPaymentPending(true);
      startPaymentStatusCheck(invoiceNum);
    } catch (error) {
      console.error("Payment processing error:", error);
      alert(`Payment failed: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const startPaymentStatusCheck = (invoiceNum) => {
    const docRef = doc(db, "transactions", invoiceNum);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const transaction = docSnap.data();
        const status = transaction.transactionDetails.status;
        
        if (status === "completed") {
          setPaymentComplete(true);
          setPaymentPending(false);
          unsubscribe();
        } else if (status === "failed") {
          setPaymentDeclined(true);
          setPaymentPending(false);
          unsubscribe();
        }
      }
    });

    return () => unsubscribe();
  };

  if (paymentComplete) {
    return (
      <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
        <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 border border-purple-500/30 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <FiCheck className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">
                Payment Successful
              </h2>
              <p className="text-gray-400">
                Invoice: <span className="font-mono text-purple-400">{invoiceNumber}</span>
              </p>
            </div>
            
            <div className="w-full bg-gray-700/30 rounded-lg p-4 border border-gray-600">
              <p className="text-gray-300">
                Thank you for purchasing <span className="text-purple-300 font-medium">{plan}</span>.
              </p>
            </div>
            
            <Button 
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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
      <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
        <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 border border-purple-500/30 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse"></div>
              <FiLoader className="relative w-20 h-20 text-purple-400 animate-spin" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                Payment Pending
              </h2>
              <p className="text-gray-400 text-sm">
                Please complete your payment and wait for verification
              </p>
            </div>
            
            <Button
              onClick={() => setShowPaymentDetails(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Show Payment Details
            </Button>
            
            <p className="text-xs text-gray-500 font-mono tracking-wider">
              STATUS: PENDING • WAITING VERIFICATION
            </p>

            <Button 
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gray-700 hover:bg-gray-600"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>

        {/* Payment Details Modal */}
        {showPaymentDetails && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="max-w-md w-full bg-gray-800 rounded-xl p-6 border border-purple-500/30 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {paymentMethods[paymentMethod].name} Payment
                </h3>
                <button 
                  onClick={() => setShowPaymentDetails(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-gray-400 text-sm uppercase tracking-wider">
                        {paymentMethods[paymentMethod].name} {paymentMethod === 'crypto' ? 'Address' : paymentMethod === 'bank' ? 'Account' : paymentMethod === 'credit' ? 'Card' : 'Email'}
                      </p>
                      <p className="text-lg font-bold text-white font-mono tracking-wide mt-1">
                        {paymentMethods[paymentMethod].account}
                      </p>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(paymentMethods[paymentMethod].account, paymentMethod)}
                      className="p-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-gray-300 hover:text-white transition-colors border border-gray-500"
                      title="Copy"
                    >
                      {copiedIndex === paymentMethod ? (
                        <FiCheck className="w-5 h-5 text-purple-400" />
                      ) : (
                        <FiCopy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Account Name: {paymentMethods[paymentMethod].accountName}
                  </p>
                </div>
                
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                  <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                    <FiCreditCard className="text-purple-400 mr-2" />
                    Order Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Product</span>
                      <span className="text-white font-medium">{plan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Service Fee</span>
                      <span className="text-white font-medium">{currencies[currency].symbol}{serviceFee.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="border-t border-gray-600 my-2"></div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Payment</span>
                      <span className="text-white font-bold text-lg">{currencies[currency].symbol}{(Number(price) + serviceFee).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20 flex items-start">
                  <FiMessageSquare className="flex-shrink-0 mt-0.5 mr-3 text-purple-400" />
                  <p className="text-purple-300 text-sm">
                    {paymentMethods[paymentMethod].note}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (paymentDeclined) {
    return (
      <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
        <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 border border-purple-500/30 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <FiX className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">
                Payment Declined
              </h2>
              <p className="text-gray-400">
                Invoice: <span className="font-mono text-purple-400">{invoiceNumber}</span>
              </p>
            </div>
            
            <div className="w-full bg-gray-700/30 rounded-lg p-4 border border-gray-600">
              <p className="text-purple-300">
                Your payment was declined. Please try again.
              </p>
            </div>
            
            <Button 
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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
      <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
        <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 text-center border border-purple-500/30 shadow-2xl">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse"></div>
              <FiLoader className="relative w-20 h-20 text-purple-400 animate-spin" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                Processing Payment
              </h2>
              <p className="text-gray-400">
                Please wait while we secure your transaction...
              </p>
            </div>
            
            <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full animate-progress"></div>
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
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Cyberpunk decorative elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(188,19,254,0.15)_0%,transparent_25%),radial-gradient(circle_at_80%_70%,rgba(15,240,252,0.15)_0%,transparent_25%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(188,19,254,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(188,19,254,0.05)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(188,19,254,0.05)_50%,transparent_100%)] bg-[length:100%_8px] animate-scanline"></div>
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 font-orbitron tracking-wider mb-2">
            PAYMENT GATEWAY
          </h1>
          <p className="text-gray-400">
            Complete your subscription to unlock premium features
          </p>
        </header>

        <div className="bg-gray-800/80 backdrop-blur-md rounded-xl border border-purple-500/30 shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <div className="text-2xl font-bold text-blue-400 font-orbitron">{plan}</div>
              <div className="text-gray-500">Premium Membership</div>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mt-4 md:mt-0">
              {currencies[currency].symbol}{Number(price).toLocaleString('id-ID')}
              <span className="text-lg text-gray-400 ml-1">/month</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center font-orbitron">
                  <FiUser className="mr-2" />
                  CUSTOMER INFORMATION
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      Full Name <span className="text-purple-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={personalInfo.name}
                        onChange={handlePersonalInfoChange}
                        onBlur={() => handleBlur('name')}
                        className={`w-full bg-gray-700 border ${
                          errors.name ? 'border-purple-500 focus:ring-purple-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                        } rounded-lg py-3 px-4 text-white focus:ring-2 focus:outline-none transition-all placeholder-gray-500`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-purple-400 flex items-center mt-1">
                        <FiX className="mr-1 flex-shrink-0" /> {errors.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      Email <span className="text-purple-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        onBlur={() => handleBlur('email')}
                        className={`w-full bg-gray-700 border ${
                          errors.email ? 'border-purple-500 focus:ring-purple-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                        } rounded-lg py-3 px-4 text-white focus:ring-2 focus:outline-none transition-all placeholder-gray-500`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-purple-400 flex items-center mt-1">
                        <FiX className="mr-1 flex-shrink-0" /> {errors.email}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      Discord User ID <span className="text-purple-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="discord"
                        value={personalInfo.discord}
                        onChange={handlePersonalInfoChange}
                        onBlur={() => handleBlur('discord')}
                        className={`w-full bg-gray-700 border ${
                          errors.discord ? 'border-purple-500 focus:ring-purple-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                        } rounded-lg py-3 px-4 text-white focus:ring-2 focus:outline-none transition-all placeholder-gray-500`}
                        placeholder="1234567890123456789"
                        maxLength={19}
                      />
                    </div>
                    {errors.discord && (
                      <p className="text-sm text-purple-400 flex items-center mt-1">
                        <FiX className="mr-1 flex-shrink-0" /> {errors.discord}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      WhatsApp Number <span className="text-purple-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                        onBlur={() => handleBlur('phone')}
                        className={`w-full bg-gray-700 border ${
                          errors.phone ? 'border-purple-500 focus:ring-purple-500/20' : 'border-gray-600 focus:ring-blue-500/20'
                        } rounded-lg py-3 px-4 text-white focus:ring-2 focus:outline-none transition-all placeholder-gray-500`}
                        placeholder="08123456789"
                        maxLength={15}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-purple-400 flex items-center mt-1">
                        <FiX className="mr-1 flex-shrink-0" /> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <FiShield className="text-purple-400 mr-2" />
                  Terms & Conditions
                </h3>
                <ul className="text-gray-400 space-y-3">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2 mt-0.5">•</span>
                    All information must be accurate. Transactions with incorrect data will be voided without refund.
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2 mt-0.5">•</span>
                    Your Discord User ID must match your account exactly.
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2 mt-0.5">•</span>
                    Payments are processed within 1-15 minutes during business hours.
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-between pt-6 border-t border-gray-700">
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white"
                >
                  Back
                </Button>
                <Button
                  onClick={handleProceedToPayment}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={Object.keys(errors).length > 0}
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center font-orbitron">
                  <FiCreditCard className="mr-2" />
                  PAYMENT METHOD
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(paymentMethods).map(([key, method]) => (
                    <button
                      key={key}
                      onClick={() => setPaymentMethod(key)}
                      className={`p-4 rounded-lg border transition-all duration-200 flex flex-col items-center ${
                        paymentMethod === key
                          ? `bg-gradient-to-br ${method.color} border-transparent shadow-lg`
                          : "border-gray-600 hover:border-purple-500 hover:bg-gray-700/30"
                      }`}
                    >
                      <div className="mb-2">
                        {method.icon}
                      </div>
                      <span className="font-semibold text-white">
                        {method.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center font-orbitron">
                  <FiCreditCard className="mr-2" />
                  CURRENCY
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {Object.entries(currencies).map(([key, curr]) => (
                    <button
                      key={key}
                      onClick={() => setCurrency(key)}
                      className={`px-4 py-2 rounded-md transition-all ${
                        currency === key
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-700 border border-gray-600 hover:border-purple-500'
                      }`}
                    >
                      {curr.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br ${paymentMethods[paymentMethod].color} text-white shadow-md`}>
                    {paymentMethods[paymentMethod].icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-orbitron">
                    {paymentMethods[paymentMethod].instructions}
                  </h3>
                  <p className="text-gray-400">
                    {paymentMethods[paymentMethod].note}
                  </p>
                </div>
                
                <div className="space-y-6">
                  {paymentMethod === 'credit' ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">
                          Card Number <span className="text-purple-400">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full bg-gray-700 border border-gray-600 focus:ring-blue-500/20 rounded-lg py-3 px-4 text-white focus:ring-2 focus:outline-none transition-all placeholder-gray-500"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-400">
                            Expiry Date <span className="text-purple-400">*</span>
                          </label>
                          <input
                            type="text"
                            className="w-full bg-gray-700 border border-gray-600 focus:ring-blue-500/20 rounded-lg py-3 px-4 text-white focus:ring-2 focus:outline-none transition-all placeholder-gray-500"
                            placeholder="MM/YY"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-400">
                            CVV <span className="text-purple-400">*</span>
                          </label>
                          <input
                            type="text"
                            className="w-full bg-gray-700 border border-gray-600 focus:ring-blue-500/20 rounded-lg py-3 px-4 text-white focus:ring-2 focus:outline-none transition-all placeholder-gray-500"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  ) : paymentMethod === 'paypal' ? (
                    <div className="bg-gray-700/70 rounded-lg p-5 border border-gray-600">
                      <p className="text-gray-400 mb-2">You will be redirected to PayPal to complete your payment</p>
                      <input
                        type="email"
                        className="w-full bg-gray-700 border border-gray-600 focus:ring-blue-500/20 rounded-lg py-3 px-4 text-white focus:ring-2 focus:outline-none transition-all placeholder-gray-500"
                        placeholder="PayPal email"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-700/70 rounded-lg p-5 border border-gray-600">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <p className="text-gray-400 text-sm uppercase tracking-wider">
                            {paymentMethods[paymentMethod].name} {paymentMethod === 'crypto' ? 'Address' : 'Account'}
                          </p>
                          <p className="text-lg font-bold text-white font-mono tracking-wide mt-1">
                            {paymentMethods[paymentMethod].account}
                          </p>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(paymentMethods[paymentMethod].account, paymentMethod)}
                          className="p-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-gray-300 hover:text-white transition-colors border border-gray-500"
                          title="Copy"
                        >
                          {copiedIndex === paymentMethod ? (
                            <FiCheck className="w-5 h-5 text-purple-400" />
                          ) : (
                            <FiCopy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Account Name: {paymentMethods[paymentMethod].accountName}
                      </p>
                    </div>
                  )}

                  <div className="bg-gray-700/70 rounded-lg p-5 border border-gray-600">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                      <FiCreditCard className="text-purple-400 mr-2" />
                      Order Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Product</span>
                        <span className="text-white">{plan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Service Fee</span>
                        <span className="text-white">{currencies[currency].symbol}{serviceFee.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="border-t border-gray-600 my-2"></div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Payment</span>
                        <span className="text-white font-bold text-lg">{currencies[currency].symbol}{(Number(price) + serviceFee).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20 flex items-start">
                    <FiMessageSquare className="flex-shrink-0 mt-0.5 mr-3 text-purple-400" />
                    <p className="text-purple-300 text-sm">
                      {paymentMethods[paymentMethod].note}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between pt-6 border-t border-gray-700">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white"
                >
                  Back
                </Button>
                <Button
                  onClick={submitPayment}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Confirm & Pay Now
                </Button>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center text-gray-500 text-sm">
          <p className="mb-1">Secured with <FiLock className="inline" /> SSL Encryption | <a href="#" className="text-blue-400 hover:underline">Terms of Service</a></p>
          <p>Need help? <a href="#" className="text-blue-400 hover:underline">Contact Support</a></p>
        </footer>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-purple-500/30 shadow-lg">
            <div className="flex items-start space-x-3 mb-4">
              <div className="bg-purple-500/20 p-2 rounded-lg flex-shrink-0">
                <FiShield className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Confirm Submission</h3>
                <p className="text-gray-400">Please verify your information</p>
              </div>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-4 mb-5 border border-gray-600/50">
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
              </ul>
            </div>
            
            <div className="flex justify-between items-center">
              <label className="flex items-center text-gray-400 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="mr-2 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                />
                Don't show again
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
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copy Notification */}
      {showCopyNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 max-w-xs w-full mx-4 border border-purple-500/30 shadow-lg">
            <div className="flex items-center justify-center space-x-2">
              <FiCheck className="w-5 h-5 text-purple-400" />
              <p className="text-white font-medium">Copied to clipboard</p>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Rajdhani:wght@400;500;600&display=swap');
        
        .font-orbitron {
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 1px;
        }
        
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
        
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
          background-size: 200% 100%;
          background-image: linear-gradient(to right, #8A2BE2, #6D329D, #8A2BE2);
        }
        
        @keyframes progress {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;
