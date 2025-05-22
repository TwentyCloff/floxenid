import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { 
  FiCheck, FiLock, FiCreditCard, FiSmartphone, FiX, FiShield,
  FiEye, FiEyeOff, FiGlobe, FiPocket, FiClock, FiAward
} from "react-icons/fi";
import { 
  FaCcVisa, FaCcMastercard, FaCcAmex, FaQrcode, FaBitcoin, FaEthereum,
  FaPaypal
} from "react-icons/fa";
import { SiApplepay, SiGooglepay } from "react-icons/si";
import Button from "./Button";

const PaymentPage = () => {
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [showCvv, setShowCvv] = useState(false);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get('plan');
  const price = searchParams.get('price');

  const navigate = useNavigate();
  const videoRef = useRef(null);

  const paymentPlanData = {
    "Basic": { 
      price: "9.99", 
      features: [
        "Standard encryption", 
        "24/7 customer support",
        "Fraud protection",
        "Instant transfers"
      ]
    },
    "Pro": { 
      price: "29.99", 
      features: [
        "All Basic features",
        "Priority processing",
        "Multi-currency support",
        "Advanced security"
      ]
    },
    "Enterprise": { 
      price: "99.99", 
      features: [
        "All Pro features",
        "Dedicated account manager",
        "Custom payment solutions",
        "Volume discounts"
      ]
    }
  };

  const processPayment = async () => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPaymentComplete(true);
    
    setTimeout(() => {
      navigate("/payment-success");
    }, 3000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/[^0-9]/g, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  const handleCardNumberChange = (e) => {
    setCardDetails({
      ...cardDetails,
      number: formatCardNumber(e.target.value)
    });
  };

  const handleExpiryChange = (e) => {
    setCardDetails({
      ...cardDetails,
      expiry: formatExpiry(e.target.value)
    });
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="fixed inset-0 overflow-y-auto z-[9999]">
        {/* Background (tanpa video) */}
        <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-gray-900/90 via-gray-800/30 to-gray-900/90"></div>
        
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
                  Your transaction has been processed successfully and your receipt has been emailed to you.
                </p>
                
                <div className="bg-gray-700/80 rounded-xl p-6 w-full mb-8 border border-gray-600">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Plan:</p>
                      <p className="text-white font-medium text-lg">{plan}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Amount:</p>
                      <p className="text-white font-bold text-xl">${price}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-600 pt-4">
                    <p className="text-gray-400 text-sm mb-2">Transaction ID:</p>
                    <p className="text-blue-400 font-mono text-xs">
                      {Math.random().toString(36).substr(2, 12).toUpperCase()}
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
                    Secure Payment
                  </h1>
                  <p className="text-gray-400">
                    Complete your purchase for {plan} plan
                  </p>
                </div>
                
                <button 
                  onClick={() => navigate(-1)}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Plan Overview */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-700/80 rounded-xl p-6 border border-gray-600 relative">
                    <h2 className="text-xl font-bold text-white mb-4">
                      {plan} Plan
                    </h2>
                    
                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-bold text-white mr-2">
                        ${price}
                      </span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {paymentPlanData[plan]?.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <FiCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-200">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-400 text-sm">Billing cycle:</span>
                        <span className="text-white text-sm font-medium">
                          Monthly
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Next billing date:</span>
                        <span className="text-white text-sm font-medium">
                          {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Security Assurance */}
                  <div className="mt-6 bg-gray-700/80 rounded-xl p-6 border border-gray-600">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <FiShield className="text-blue-400 mr-2" />
                      Secure Payment
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <FiLock className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-200 font-medium">256-bit Encryption</p>
                          <p className="text-gray-400 text-sm">Bank-level security for all transactions</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FiCreditCard className="text-blue-400 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-200 font-medium">PCI DSS Compliant</p>
                          <p className="text-gray-400 text-sm">We don't store your payment details</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Payment Interface */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-700/80 rounded-xl p-6 border border-gray-600">
                    <h2 className="text-xl font-bold text-white mb-6">
                      Payment Method
                    </h2>
                    
                    {/* Payment Method Selection */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      <button
                        onClick={() => setPaymentMethod("card")}
                        className={`p-3 rounded-lg flex flex-col items-center justify-center border ${paymentMethod === "card" ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500"}`}
                      >
                        <FiCreditCard className={`w-6 h-6 ${paymentMethod === "card" ? "text-blue-400" : "text-gray-400"}`} />
                        <span className={`mt-2 text-sm ${paymentMethod === "card" ? "text-white" : "text-gray-400"}`}>Card</span>
                      </button>
                      
                      <button
                        onClick={() => setPaymentMethod("paypal")}
                        className={`p-3 rounded-lg flex flex-col items-center justify-center border ${paymentMethod === "paypal" ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500"}`}
                      >
                        <FaPaypal className={`w-6 h-6 ${paymentMethod === "paypal" ? "text-blue-400" : "text-gray-400"}`} />
                        <span className={`mt-2 text-sm ${paymentMethod === "paypal" ? "text-white" : "text-gray-400"}`}>PayPal</span>
                      </button>
                      
                      <button
                        onClick={() => setPaymentMethod("applepay")}
                        className={`p-3 rounded-lg flex flex-col items-center justify-center border ${paymentMethod === "applepay" ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500"}`}
                      >
                        <SiApplepay className={`w-6 h-6 ${paymentMethod === "applepay" ? "text-blue-400" : "text-gray-400"}`} />
                        <span className={`mt-2 text-sm ${paymentMethod === "applepay" ? "text-white" : "text-gray-400"}`}>Apple Pay</span>
                      </button>
                      
                      <button
                        onClick={() => setPaymentMethod("googlepay")}
                        className={`p-3 rounded-lg flex flex-col items-center justify-center border ${paymentMethod === "googlepay" ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500"}`}
                      >
                        <SiGooglepay className={`w-6 h-6 ${paymentMethod === "googlepay" ? "text-blue-400" : "text-gray-400"}`} />
                        <span className={`mt-2 text-sm ${paymentMethod === "googlepay" ? "text-white" : "text-gray-400"}`}>Google Pay</span>
                      </button>
                    </div>
                    
                    {/* Payment Form */}
                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Card Number</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={cardDetails.number}
                              onChange={handleCardNumberChange}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              className="w-full bg-gray-800 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <div className="absolute right-3 top-3 flex space-x-2">
                              <FaCcVisa className="text-gray-400 w-6 h-6" />
                              <FaCcMastercard className="text-gray-400 w-6 h-6" />
                              <FaCcAmex className="text-gray-400 w-6 h-6" />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Name on Card</label>
                          <input
                            type="text"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                            placeholder="John Smith"
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-400 text-sm mb-2">Expiry Date</label>
                            <input
                              type="text"
                              value={cardDetails.expiry}
                              onChange={handleExpiryChange}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full bg-gray-800 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-400 text-sm mb-2">CVV</label>
                            <div className="relative">
                              <input
                                type={showCvv ? "text" : "password"}
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/[^0-9]/g, '')})}
                                placeholder="123"
                                maxLength={4}
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button 
                                type="button" 
                                onClick={() => setShowCvv(!showCvv)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                              >
                                {showCvv ? <FiEyeOff /> : <FiEye />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === "paypal" && (
                      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 flex flex-col items-center">
                        <FaPaypal className="w-12 h-12 text-blue-400 mb-4" />
                        <p className="text-gray-400 mb-6 text-center">
                          You'll be redirected to PayPal to complete your payment securely
                        </p>
                        <Button className="w-full max-w-xs">
                          Continue with PayPal
                        </Button>
                      </div>
                    )}
                    
                    {paymentMethod === "applepay" && (
                      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 flex flex-col items-center">
                        <SiApplepay className="w-12 h-12 text-white mb-4" />
                        <p className="text-gray-400 mb-6 text-center">
                          Complete your payment using Apple Pay
                        </p>
                        <Button className="w-full max-w-xs">
                          Pay with Apple Pay
                        </Button>
                      </div>
                    )}
                    
                    {paymentMethod === "googlepay" && (
                      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 flex flex-col items-center">
                        <SiGooglepay className="w-12 h-12 text-white mb-4" />
                        <p className="text-gray-400 mb-6 text-center">
                          Complete your payment using Google Pay
                        </p>
                        <Button className="w-full max-w-xs">
                          Pay with Google Pay
                        </Button>
                      </div>
                    )}
                    
                    {/* Payment Button */}
                    <div className="mt-8 pt-6 border-t border-gray-600">
                      <Button 
                        onClick={processPayment}
                        className="w-full py-4 text-lg"
                      >
                        Pay ${price}
                      </Button>
                      
                      <p className="text-gray-400 text-xs mt-4 text-center">
                        <FiLock className="inline mr-1" />
                        Your payment is secured with 256-bit encryption
                      </p>
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
