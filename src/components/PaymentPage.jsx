import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiLock, FiCreditCard, FiSmartphone, FiX } from "react-icons/fi";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaQrcode } from "react-icons/fa";
import blackholeVideo from "../assets/hero/blackhole.webm";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const searchParams = new URLSearchParams(location.search);
  
  // Enhanced plan data with features
  const planData = {
    "Basic": { price: "9.99", features: ["Standard Support", "Basic Features"] },
    "Pro": { price: "29.99", features: ["Priority Support", "Advanced Features", "API Access"] },
    "Enterprise": { price: "99.99", features: ["24/7 Support", "All Features", "Dedicated Manager"] }
  };

  const plan = searchParams.get("plan") || "Pro";
  const price = planData[plan]?.price || "29.99";
  const features = planData[plan]?.features || [];
  
  // State management
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeCardType, setActiveCardType] = useState(null);
  const [showCardBack, setShowCardBack] = useState(false);

  // Video background setup
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  // Card type detection
  useEffect(() => {
    const number = cardData.number.replace(/\s+/g, '');
    if (number.length > 0) {
      const firstDigit = number[0];
      if (firstDigit === '4') setActiveCardType('visa');
      else if (firstDigit === '5') setActiveCardType('mastercard');
      else if (firstDigit === '3') setActiveCardType('amex');
      else setActiveCardType(null);
    } else {
      setActiveCardType(null);
    }
  }, [cardData.number]);

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  // Auto-insert slash in expiry date
  const formatExpiry = (value) => {
    let v = value.replace(/[^0-9]/g, '');
    if (v.length >= 3) {
      v = v.substring(0, 2) + '/' + v.substring(2);
    }
    return v.substring(0, 5);
  };

  // Validate expiry date (MM/YY)
  const validateExpiry = (value) => {
    if (!value || value.length < 5) return false;
    
    const [month, year] = value.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    // Validate month (1-12)
    if (month < 1 || month > 12) return false;
    
    // Validate year (not in past)
    if (year < currentYear) return false;
    if (year == currentYear && month < currentMonth) return false;
    
    return true;
  };

  // Validate card number using Luhn algorithm
  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s+/g, '');
    if (!/^\d+$/.test(cleaned)) return false;
    
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  };

  // Handle input changes with validation
  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, activeCardType === 'amex' ? 4 : 3);
    }
    
    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
    
    // Clear error when typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Validate all fields before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!cardData.name.trim()) {
      newErrors.name = "Cardholder name is required";
    }
    
    if (!cardData.number || !validateCardNumber(cardData.number)) {
      newErrors.number = "Invalid card number";
    }
    
    if (!cardData.expiry || !validateExpiry(cardData.expiry)) {
      newErrors.expiry = "Invalid expiry date";
    }
    
    if (!cardData.cvv || (activeCardType === 'amex' ? cardData.cvv.length !== 4 : cardData.cvv.length !== 3)) {
      newErrors.cvv = activeCardType === 'amex' ? "4-digit CVV required" : "3-digit CVV required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsProcessing(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsProcessing(false);
        setPaymentSuccess(true);
        
        setTimeout(() => {
          navigate("/success");
        }, 2000);
      }, 3000);
    }
  };

  // Payment methods data
  const paymentMethods = [
    { id: "gopay", name: "Gopay", icon: <FiSmartphone className="w-5 h-5" /> },
    { id: "dana", name: "Dana", icon: <FiSmartphone className="w-5 h-5" /> },
    { id: "qris", name: "QRIS", icon: <FaQrcode className="w-5 h-5" /> },
    { 
      id: "card", 
      name: "Credit Card", 
      icon: <FiCreditCard className="w-5 h-5" />,
      supportedCards: [
        { type: "visa", icon: <FaCcVisa className="w-8 h-5" /> },
        { type: "mastercard", icon: <FaCcMastercard className="w-8 h-5" /> },
        { type: "amex", icon: <FaCcAmex className="w-8 h-5" /> }
      ]
    },
  ];

  return (
    <div className="fixed inset-0 overflow-y-auto bg-black z-50">
      {/* Blackhole video background */}
      <div className="fixed inset-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          className="w-full h-full object-cover opacity-20"
        >
          <source src={blackholeVideo} type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/60"></div>
      </div>

      <AnimatePresence>
        {paymentSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 bg-n-7 p-8 rounded-3xl max-w-lg w-full shadow-2xl border border-green-500/20 mx-auto my-16"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <FiCheck className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Payment Successful</h2>
              <p className="text-n-4 mb-6">Thank you for your purchase!</p>
              <div className="bg-n-6 rounded-xl p-4 w-full mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-n-4">Plan:</span>
                  <span className="text-white font-medium">{plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-n-4">Amount:</span>
                  <span className="text-white font-bold">${price}</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 bg-n-7 p-8 rounded-3xl max-w-4xl w-full shadow-2xl border border-n-6 mx-auto my-8"
          >
            {/* Close button */}
            <button 
              onClick={() => navigate(-1)}
              className="absolute top-4 right-4 text-n-4 hover:text-white transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Left side - Plan details */}
              <div className="md:w-1/3">
                <div className="flex items-center mb-6">
                  <FiLock className="w-5 h-5 text-blue-500 mr-2" />
                  <h2 className="text-3xl font-bold text-white">Secure Payment</h2>
                </div>

                {/* Plan Info */}
                <div className="bg-n-6 rounded-xl p-6 mb-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <p className="text-n-4 text-sm mb-1">You're subscribing to</p>
                  <p className="text-white text-xl font-semibold mb-3">{plan} Plan</p>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-white mr-2">${price}</span>
                    <span className="text-n-4">/month</span>
                  </div>
                  
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <FiCheck className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-n-2">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="text-white text-sm font-medium mb-4">Payment Method</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <motion.button
                        key={method.id}
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`flex flex-col items-center px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          selectedMethod === method.id
                            ? "border-blue-500 bg-blue-900/20 text-white shadow-lg shadow-blue-500/10"
                            : "border-n-5 text-n-2 hover:border-blue-400"
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          {method.icon}
                          <span className="ml-2 font-medium">{method.name}</span>
                        </div>
                        {method.id === "card" && (
                          <div className="flex mt-2 space-x-1">
                            {method.supportedCards.map(card => (
                              <div 
                                key={card.type} 
                                className={`p-1 rounded ${activeCardType === card.type ? 'bg-white/10' : 'opacity-30'}`}
                              >
                                {card.icon}
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side - Payment form */}
              <div className="md:w-2/3">
                {selectedMethod === "card" ? (
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Animated credit card preview */}
                    <motion.div 
                      className="relative h-48 bg-gradient-to-br from-n-6 to-n-7 rounded-2xl p-6 shadow-lg overflow-hidden cursor-pointer"
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setShowCardBack(!showCardBack)}
                      animate={{ rotateY: showCardBack ? 180 : 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      {/* Front of card */}
                      {!showCardBack && (
                        <div className="h-full flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div className="text-white font-bold text-xl">Premium Card</div>
                            {activeCardType && (
                              <div className="bg-white/10 p-1 rounded">
                                {paymentMethods.find(m => m.id === 'card').supportedCards.find(c => c.type === activeCardType).icon}
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4">
                            <div className="text-white text-xl font-mono tracking-wider">
                              {cardData.number ? cardData.number : '•••• •••• •••• ••••'}
                            </div>
                          </div>
                          
                          <div className="flex justify-between mt-6">
                            <div>
                              <div className="text-n-4 text-xs">Card Holder</div>
                              <div className="text-white text-sm font-medium">
                                {cardData.name || 'YOUR NAME'}
                              </div>
                            </div>
                            <div>
                              <div className="text-n-4 text-xs">Expires</div>
                              <div className="text-white text-sm font-medium">
                                {cardData.expiry || '••/••'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Back of card */}
                      {showCardBack && (
                        <div className="h-full flex flex-col justify-between transform rotate-y-180">
                          <div className="h-8 bg-black w-full"></div>
                          <div className="bg-n-5 h-10 flex items-center px-4">
                            <div className="bg-n-8 h-8 w-full rounded-sm flex items-center justify-end pr-2">
                              <span className="text-white font-mono text-sm">
                                {cardData.cvv || '•••'}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            {activeCardType && (
                              <div className="bg-white/10 p-1 rounded">
                                {paymentMethods.find(m => m.id === 'card').supportedCards.find(c => c.type === activeCardType).icon}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-sm text-white mb-2 font-medium">
                        Cardholder Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 bg-n-6 border rounded-xl text-white placeholder:text-n-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all ${
                          errors.name ? 'border-red-500' : 'border-n-5'
                        }`}
                        required
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Card Number */}
                    <div>
                      <label className="block text-sm text-white mb-2 font-medium">
                        Card Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardData.number}
                          onChange={(e) => handleInputChange('number', e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className={`w-full px-4 py-3 bg-n-6 border rounded-xl text-white placeholder:text-n-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all pl-12 ${
                            errors.number ? 'border-red-500' : 'border-n-5'
                          }`}
                          maxLength={19}
                          required
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <FiCreditCard className="w-5 h-5 text-n-4" />
                        </div>
                      </div>
                      {errors.number && (
                        <p className="text-red-500 text-xs mt-1">{errors.number}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Expiry Date */}
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">
                          Expiry Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => handleInputChange('expiry', e.target.value)}
                          placeholder="MM/YY"
                          className={`w-full px-4 py-3 bg-n-6 border rounded-xl text-white placeholder:text-n-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all ${
                            errors.expiry ? 'border-red-500' : 'border-n-5'
                          }`}
                          required
                        />
                        {errors.expiry && (
                          <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
                        )}
                      </div>

                      {/* CVV */}
                      <div>
                        <label className="block text-sm text-white mb-2 font-medium">
                          CVV <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value)}
                            placeholder={activeCardType === 'amex' ? '4 digits' : '3 digits'}
                            className={`w-full px-4 py-3 bg-n-6 border rounded-xl text-white placeholder:text-n-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all ${
                              errors.cvv ? 'border-red-500' : 'border-n-5'
                            }`}
                            onFocus={() => setShowCardBack(true)}
                            onBlur={() => setShowCardBack(false)}
                            required
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <FiLock className="w-4 h-4 text-n-4" />
                          </div>
                        </div>
                        {errors.cvv && (
                          <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-6" 
                      white
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        `Pay $${price}`
                      )}
                    </Button>

                    <div className="flex items-center justify-center mt-4">
                      <FiLock className="w-4 h-4 text-n-4 mr-2" />
                      <span className="text-xs text-n-4">Payments are secure and encrypted</span>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-5 mt-6">
                    <p className="text-white text-sm">
                      Scan the QR code using your <strong className="text-blue-400">{selectedMethod.toUpperCase()}</strong> app to complete payment.
                    </p>
                    
                    <motion.div 
                      className="w-56 h-56 bg-white rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      <FaQrcode className="w-24 h-24 text-black mb-3" />
                      <div className="text-black font-semibold">{selectedMethod.toUpperCase()}</div>
                      <div className="text-xs text-n-7 mt-1">${price}</div>
                    </motion.div>
                    
                    <div className="bg-n-6 rounded-xl p-4 w-full text-left">
                      <div className="flex justify-between mb-1">
                        <span className="text-n-4 text-sm">Plan:</span>
                        <span className="text-white text-sm font-medium">{plan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-n-4 text-sm">Amount:</span>
                        <span className="text-white text-sm font-bold">${price}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-2" 
                      white
                      onClick={() => {
                        setIsProcessing(true);
                        setTimeout(() => {
                          setPaymentSuccess(true);
                        }, 1500);
                      }}
                    >
                      I've Completed the Payment
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentPage;
