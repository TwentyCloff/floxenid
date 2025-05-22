import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "./Button";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiLock, FiCreditCard, FiSmartphone, FiQrCode } from "react-icons/fi";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";

const paymentMethods = [
  { id: "gopay", name: "Gopay", icon: <FiSmartphone className="w-5 h-5" /> },
  { id: "dana", name: "Dana", icon: <FiSmartphone className="w-5 h-5" /> },
  { id: "qris", name: "QRIS", icon: <FiQrCode className="w-5 h-5" /> },
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

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get("plan") || "Pro";
  const price = searchParams.get("price") || "29.99";
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeCardType, setActiveCardType] = useState(null);

  useEffect(() => {
    // Detect card type based on first digit
    if (cardNumber.length > 0) {
      const firstDigit = cardNumber[0];
      if (firstDigit === '4') setActiveCardType('visa');
      else if (firstDigit === '5') setActiveCardType('mastercard');
      else if (firstDigit === '3') setActiveCardType('amex');
      else setActiveCardType(null);
    } else {
      setActiveCardType(null);
    }
  }, [cardNumber]);

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
    } else {
      return value;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate("/success");
      }, 2000);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-n-8 to-n-9 p-4">
      <AnimatePresence>
        {paymentSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-n-7 p-8 rounded-3xl max-w-lg w-full shadow-2xl border border-green-500/20"
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
            className="bg-n-7 p-8 rounded-3xl max-w-lg w-full shadow-2xl border border-n-6"
          >
            <div className="flex items-center justify-center mb-6">
              <FiLock className="w-5 h-5 text-blue-500 mr-2" />
              <h2 className="text-3xl font-bold text-center text-white">Secure Payment</h2>
            </div>

            {/* Plan Info */}
            <div className="bg-n-6 rounded-xl p-6 text-center mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <p className="text-n-4 text-sm mb-1">You're subscribing to</p>
              <p className="text-white text-xl font-semibold mb-3">{plan} Plan</p>
              <div className="flex justify-center items-baseline">
                <span className="text-4xl font-bold text-white mr-2">${price}</span>
                <span className="text-n-4">/month</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
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

            {/* Payment Form */}
            {selectedMethod === "card" ? (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm text-white mb-2 font-medium">
                    Cardholder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-n-6 border border-n-5 rounded-xl text-white placeholder:text-n-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-white mb-2 font-medium">
                    Card Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formatCardNumber(cardNumber)}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s+/g, ''))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-n-6 border border-n-5 rounded-xl text-white placeholder:text-n-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all pl-12"
                      maxLength={19}
                      required
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <FiCreditCard className="w-5 h-5 text-n-4" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-white mb-2 font-medium">
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (value.length === 2 && !value.includes('/')) {
                          value = value + '/';
                        }
                        setExpiry(value.replace(/[^0-9/]/g, '').slice(0, 5));
                      }}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 bg-n-6 border border-n-5 rounded-xl text-white placeholder:text-n-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm text-white mb-2 font-medium">
                      CVV <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="•••"
                        className="w-full px-4 py-3 bg-n-6 border border-n-5 rounded-xl text-white placeholder:text-n-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <FiLock className="w-4 h-4 text-n-4" />
                      </div>
                    </div>
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
                  <FiQrCode className="w-24 h-24 text-black mb-3" />
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentPage;
