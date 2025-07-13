import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Copy, 
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { 
  createTransaction, 
  getPaymentMethods, 
  checkTransactionStatus 
} from '../services/tripayService';

const PaymentSystem = ({ product, onBack }) => {
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 jam dalam detik
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Load payment methods
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const methods = await getPaymentMethods();
        setPaymentMethods(methods);
        if (methods.length > 0) {
          setSelectedMethod(methods[0].code);
        }
      } catch (error) {
        console.error('Error loading payment methods:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPaymentMethods();
  }, []);

  // Create transaction when method is selected
  useEffect(() => {
    if (selectedMethod && product) {
      createPaymentTransaction();
    }
  }, [selectedMethod]);

  const createPaymentTransaction = async () => {
    setIsLoading(true);
    try {
      const transaction = await createTransaction(product, selectedMethod);
      setPaymentData(transaction.data);
    } catch (error) {
      console.error('Error creating transaction:', error);
      setPaymentStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkPayment = async () => {
    setIsLoading(true);
    try {
      if (paymentData?.reference) {
        const transaction = await checkTransactionStatus(paymentData.reference);
        if (transaction.status === 'PAID') {
          setPaymentStatus('success');
        } else {
          // In a real app, you might want to poll the status
          alert('Payment not completed yet. Status: ' + transaction.status);
        }
      }
    } catch (error) {
      console.error('Error checking payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (paymentStatus === 'pending' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setPaymentStatus('failed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentStatus, timeLeft]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Loading Payment...</h2>
          <p className="text-gray-600">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // Success State
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Thank you for your purchase.</p>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Product:</span>
              <span className="font-medium">{product.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-green-600">{formatCurrency(product.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">PAID</span>
            </div>
          </div>
          
          <button
            onClick={onBack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Back to Product
          </button>
        </div>
      </div>
    );
  }

  // Failed State
  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6">Payment time has expired. Please try again.</p>
          
          <button
            onClick={onBack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main Payment Page
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Complete Payment</h1>
            <div className="w-5"></div> {/* Spacer for alignment */}
          </div>
        </div>

        {/* Payment Content */}
        <div className="p-6">
          {/* Product Info */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h2>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <div className="text-xl font-bold text-blue-600">{formatCurrency(product.price)}</div>
          </div>

          {/* Timer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="font-medium text-yellow-700">Time Remaining: {formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
              <CreditCard className="w-5 h-5 mr-2 text-blue-500" />
              Payment Methods
            </h3>

            <div className="space-y-3">
              {paymentMethods.map(method => (
                <button
                  key={method.code}
                  onClick={() => setSelectedMethod(method.code)}
                  className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center ${
                    selectedMethod === method.code
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={method.icon_url} 
                    alt={method.name} 
                    className="w-8 h-8 mr-3 object-contain"
                  />
                  <span className="font-medium">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Instructions */}
          {paymentData && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Payment Instructions</h4>
              
              {paymentData.payment_method === 'QRIS' && (
                <div className="text-center">
                  <img 
                    src={paymentData.qr_url} 
                    alt="QR Code" 
                    className="w-48 h-48 mx-auto mb-4"
                  />
                  <p className="text-gray-600 mb-2">Scan the QR code above to pay</p>
                </div>
              )}

              {(paymentData.payment_method === 'Virtual Account' || 
                paymentData.payment_method.includes('Transfer')) && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Virtual Account Number:</p>
                    <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-300">
                      <span className="font-mono font-bold">{paymentData.pay_code || paymentData.account_number}</span>
                      <button
                        onClick={() => copyToClipboard(paymentData.pay_code || paymentData.account_number)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Amount:</p>
                    <p className="font-bold">{formatCurrency(paymentData.amount)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Expired:</p>
                    <p className="font-medium">{new Date(paymentData.expired_time * 1000).toLocaleString()}</p>
                  </div>
                </div>
              )}

              {copied && (
                <div className="mt-3 text-center text-sm text-green-600">
                  Copied to clipboard!
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={checkPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              I Have Paid
            </button>
            
            <button
              onClick={onBack}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSystem;