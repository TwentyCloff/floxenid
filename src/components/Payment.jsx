import React, { useState, useEffect } from 'react';
import { Clock, CreditCard, CheckCircle, XCircle, Copy, Smartphone, Building, Wallet, AlertCircle, ArrowLeft, Zap, Sparkles } from 'lucide-react';

const PaymentSystem = () => {
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 menit dalam detik
  const [selectedMethod, setSelectedMethod] = useState('bank_transfer');
  const [copied, setCopied] = useState(false);

  const paymentData = {
    orderId: 'ORD-2025-001',
    amount: 2500000,
    description: 'Premium Package - Web Development',
    methods: {
      bank_transfer: {
        name: 'Bank Transfer',
        icon: Building,
        account: '1234567890',
        accountName: 'PT. Digital Solutions',
        bank: 'Bank Central Asia (BCA)'
      },
      e_wallet: {
        name: 'E-Wallet',
        icon: Smartphone,
        number: '081234567890',
        name_display: 'GoPay / OVO / DANA'
      },
      virtual_account: {
        name: 'Virtual Account',
        icon: CreditCard,
        number: '8001234567890123',
        bank: 'Bank Mandiri'
      }
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
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const simulatePayment = () => {
    setPaymentStatus('loading');
    setTimeout(() => {
      setPaymentStatus('success');
    }, 3000);
  };

  // Enhanced Background Component
  const EnhancedBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-neutral-950" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-px opacity-5 pointer-events-none">
        {Array.from({ length: 144 }).map((_, i) => (
          <div key={i} className="bg-neutral-800" />
        ))}
      </div>

      {/* Animated Grid Lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[3, 6, 9].map((row) => (
          <div
            key={`row-${row}`}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent animate-pulse"
            style={{ top: `${(row / 12) * 100}%` }}
          />
        ))}
        {[2, 5, 8, 11].map((col) => (
          <div
            key={`col-${col}`}
            className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-pulse"
            style={{ left: `${(col / 12) * 100}%` }}
          />
        ))}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );

  // Loading State
  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <EnhancedBackground />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Memproses Pembayaran</h2>
          <p className="text-neutral-400">Harap tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  // Success State
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <EnhancedBackground />
        <div className="relative z-10 bg-neutral-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-emerald-400/20">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-blue-400/10 rounded-3xl"></div>
          
          <div className="relative z-10">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto animate-bounce" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">Pembayaran Berhasil!</h1>
            <p className="text-neutral-400 mb-6">Terima kasih, pembayaran Anda telah berhasil diproses.</p>
            
            <div className="bg-neutral-800/50 rounded-2xl p-6 mb-6 border border-neutral-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-neutral-400">Order ID:</span>
                <span className="font-mono font-semibold text-white">{paymentData.orderId}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-neutral-400">Total:</span>
                <span className="font-bold text-xl text-emerald-400">{formatCurrency(paymentData.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Status:</span>
                <span className="bg-emerald-400/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-semibold border border-emerald-400/30">BERHASIL</span>
              </div>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 text-neutral-900 font-bold py-3 px-6 rounded-xl hover:from-emerald-300 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Failed State
  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <EnhancedBackground />
        <div className="relative z-10 bg-neutral-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-red-400/20">
          <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 via-transparent to-pink-400/10 rounded-3xl"></div>
          
          <div className="relative z-10">
            <div className="mb-6">
              <XCircle className="w-20 h-20 text-red-400 mx-auto animate-bounce" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">Pembayaran Gagal!</h1>
            <p className="text-neutral-400 mb-6">Maaf, waktu pembayaran telah habis. Silakan coba lagi.</p>
            
            <div className="bg-neutral-800/50 rounded-2xl p-6 mb-6 border border-neutral-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-neutral-400">Order ID:</span>
                <span className="font-mono font-semibold text-white">{paymentData.orderId}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-neutral-400">Total:</span>
                <span className="font-bold text-xl text-red-400">{formatCurrency(paymentData.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Status:</span>
                <span className="bg-red-400/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold border border-red-400/30">GAGAL</span>
              </div>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:from-red-300 hover:to-pink-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Payment Page
  return (
    <div className="min-h-screen p-4 relative">
      <EnhancedBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-900/50 border border-emerald-400/20 text-emerald-400 font-mono text-xs mb-4 backdrop-blur-md">
            <Zap className="mr-2 h-3 w-3" />
            SECURE PAYMENT
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Complete Payment
            </span>
          </h1>
          <p className="text-neutral-400 text-lg">Secure and fast payment processing</p>
        </div>

        {/* Alert Banner */}
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl p-6 mb-8 border border-yellow-400/30 backdrop-blur-md">
          <div className="flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-yellow-400 mr-3 animate-pulse" />
            <div className="text-center">
              <h2 className="text-xl font-bold text-yellow-400">Payment Pending</h2>
              <p className="text-yellow-200">Complete your payment before time expires</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Summary */}
          <div className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl border border-neutral-700 p-6">
            <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
              <Sparkles className="mr-3 h-6 w-6 text-emerald-400" />
              Payment Summary
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-neutral-400">Order ID:</span>
                <span className="font-mono font-semibold text-white">{paymentData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Product:</span>
                <span className="font-semibold text-white">{paymentData.description}</span>
              </div>
              <div className="border-t border-neutral-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">Total:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    {formatCurrency(paymentData.amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl p-4 text-center border border-red-400/30">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 mr-2 text-red-400" />
                <span className="font-semibold text-red-400">Time Remaining:</span>
              </div>
              <div className="text-3xl font-mono font-bold text-red-400 animate-pulse">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl border border-neutral-700 p-6">
            <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
              <CreditCard className="mr-3 h-6 w-6 text-blue-400" />
              Payment Methods
            </h3>
            
            {/* Method Selection */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {Object.entries(paymentData.methods).map(([key, method]) => {
                const Icon = method.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedMethod(key)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedMethod === key
                        ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400'
                        : 'border-neutral-700 hover:border-neutral-600 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-semibold">{method.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Payment Details */}
            <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
              <h4 className="font-bold mb-4 text-white">
                {paymentData.methods[selectedMethod].name}
              </h4>
              
              {selectedMethod === 'bank_transfer' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-neutral-400">Bank:</label>
                    <p className="font-semibold text-white">{paymentData.methods[selectedMethod].bank}</p>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-400">Account Number:</label>
                    <div className="flex items-center justify-between bg-neutral-700 p-3 rounded-lg border border-neutral-600">
                      <span className="font-mono font-semibold text-white">{paymentData.methods[selectedMethod].account}</span>
                      <button
                        onClick={() => copyToClipboard(paymentData.methods[selectedMethod].account)}
                        className="text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-400">Account Name:</label>
                    <p className="font-semibold text-white">{paymentData.methods[selectedMethod].accountName}</p>
                  </div>
                </div>
              )}

              {selectedMethod === 'e_wallet' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-neutral-400">Number:</label>
                    <div className="flex items-center justify-between bg-neutral-700 p-3 rounded-lg border border-neutral-600">
                      <span className="font-mono font-semibold text-white">{paymentData.methods[selectedMethod].number}</span>
                      <button
                        onClick={() => copyToClipboard(paymentData.methods[selectedMethod].number)}
                        className="text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-400">Platform:</label>
                    <p className="font-semibold text-white">{paymentData.methods[selectedMethod].name_display}</p>
                  </div>
                </div>
              )}

              {selectedMethod === 'virtual_account' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-neutral-400">Virtual Account:</label>
                    <div className="flex items-center justify-between bg-neutral-700 p-3 rounded-lg border border-neutral-600">
                      <span className="font-mono font-semibold text-white">{paymentData.methods[selectedMethod].number}</span>
                      <button
                        onClick={() => copyToClipboard(paymentData.methods[selectedMethod].number)}
                        className="text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-400">Bank:</label>
                    <p className="font-semibold text-white">{paymentData.methods[selectedMethod].bank}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Copy Notification */}
            {copied && (
              <div className="mt-4 p-3 bg-emerald-400/20 text-emerald-400 rounded-lg text-center border border-emerald-400/30">
                ✓ Successfully copied to clipboard!
              </div>
            )}

            {/* Action Buttonss */}
            <div className="mt-6 space-y-3">
              <button
                onClick={simulatePayment}
                className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 text-neutral-900 font-bold py-3 px-6 rounded-xl hover:from-emerald-300 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                I Have Paid
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-neutral-800 text-white font-bold py-3 px-6 rounded-xl hover:bg-neutral-700 transition-all duration-300 border border-neutral-700"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSystem;