import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { 
  FiCheck, FiLock, FiCreditCard, FiSmartphone, FiX, FiShield,
  FiEye, FiEyeOff
} from "react-icons/fi";
import { 
  FaCcVisa, FaCcMastercard, FaCcAmex, FaPaypal
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
  const plan = searchParams.get('plan') || "Basic";
  const price = searchParams.get('price') || "9.99";

  const navigate = useNavigate();

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
    // Simulasi proses pembayaran 2 detik
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
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/[^0-9]/g, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  const handleCardNumberChange = (e) => {
    setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) });
  };

  const handleExpiryChange = (e) => {
    setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) });
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="fixed inset-0 overflow-y-auto z-[9999]">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-gradient-to-b from-gray-900/90 via-gray-800/30 to-gray-900/90"></div>
        
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
                  aria-label="Close payment page"
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
                </div>

                {/* Payment Form */}
                <div className="lg:col-span-2 bg-gray-700/90 rounded-xl p-8 border border-gray-600">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Select Payment Method
                    </h3>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setPaymentMethod("card")}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md border 
                          ${paymentMethod === "card" ? "border-blue-500 bg-blue-600/40" : "border-gray-600 hover:border-blue-500"} 
                          transition-colors`}
                        aria-pressed={paymentMethod === "card"}
                      >
                        <FiCreditCard className="w-5 h-5" />
                        <span className="text-white">Credit/Debit Card</span>
                      </button>
                      
                      <button
                        onClick={() => setPaymentMethod("mobile")}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md border 
                          ${paymentMethod === "mobile" ? "border-blue-500 bg-blue-600/40" : "border-gray-600 hover:border-blue-500"} 
                          transition-colors`}
                        aria-pressed={paymentMethod === "mobile"}
                      >
                        <FiSmartphone className="w-5 h-5" />
                        <span className="text-white">Mobile Payment</span>
                      </button>
                    </div>
                  </div>

                  {paymentMethod === "card" && (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        processPayment();
                      }}
                      className="space-y-6"
                    >
                      <div>
                        <label htmlFor="cardNumber" className="block text-gray-300 mb-1 font-medium">
                          Card Number
                        </label>
                        <input
                          id="cardNumber"
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          maxLength={19}
                          value={cardDetails.number}
                          onChange={handleCardNumberChange}
                          required
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                        />
                      </div>

                      <div>
                        <label htmlFor="cardName" className="block text-gray-300 mb-1 font-medium">
                          Cardholder Name
                        </label>
                        <input
                          id="cardName"
                          type="text"
                          autoComplete="cc-name"
                          value={cardDetails.name}
                          onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })}
                          required
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="expiry" className="block text-gray-300 mb-1 font-medium">
                            Expiry Date
                          </label>
                          <input
                            id="expiry"
                            type="text"
                            inputMode="numeric"
                            maxLength={5}
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={handleExpiryChange}
                            required
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                          />
                        </div>

                        <div className="relative">
                          <label htmlFor="cvv" className="block text-gray-300 mb-1 font-medium">
                            CVV
                          </label>
                          <input
                            id="cvv"
                            type={showCvv ? "text" : "password"}
                            maxLength={4}
                            inputMode="numeric"
                            value={cardDetails.cvv}
                            onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            required
                            placeholder="123"
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCvv(!showCvv)}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                            aria-label={showCvv ? "Hide CVV" : "Show CVV"}
                          >
                            {showCvv ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                          </button>
                        </div>

                        <div className="flex items-end justify-center text-sm text-gray-400">
                          <FiLock className="mr-1" /> Secure
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg py-3 text-white font-semibold transition"
                      >
                        Pay ${price}
                      </button>
                    </form>
                  )}

                  {paymentMethod === "mobile" && (
                    <div>
                      <h4 className="text-white font-semibold mb-4">Mobile Payment Options</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <button className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg border border-gray-600 transition">
                          <SiApplepay className="w-6 h-6" />
                          <span>Apple Pay</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg border border-gray-600 transition">
                          <SiGooglepay className="w-6 h-6" />
                          <span>Google Pay</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg border border-gray-600 transition">
                          <FaPaypal className="w-6 h-6" />
                          <span>PayPal</span>
                        </button>
                      </div>
                      <p className="mt-4 text-gray-400 text-sm">
                        Mobile payments will redirect you to the provider's app or website.
                      </p>
                    </div>
                  )}
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
