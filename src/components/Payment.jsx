import React, { useState, useEffect } from 'react';
import { Clock, CreditCard, CheckCircle, XCircle, Copy, Smartphone, Building, Wallet, AlertCircle, ArrowLeft, Zap, Sparkles, ShoppingCart, Coffee } from 'lucide-react';

const TrakteerPaymentSystem = () => {
  const [currentPage, setCurrentPage] = useState('product'); // 'product', 'payment', 'loading', 'success', 'failed'
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 menit dalam detik
  const [orderData, setOrderData] = useState(null);
  const [trakteerData, setTrakteerData] = useState(null);
  const [copied, setCopied] = useState(false);

  // Data produk
  const product = {
    id: 1,
    name: 'Premium Coffee',
    description: 'Kopi premium berkualitas tinggi dengan cita rasa yang istimewa',
    price: 5000,
    image: '☕',
    category: 'Beverage'
  };

  // Trakteer API Configuration
  const TRAKTEER_API_KEY = 'trapi-QeOcwup0wXgvWLlcUk11jOyG';
  const TRAKTEER_BASE_URL = 'https://api.trakteer.id/v1';

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

  // Fungsi untuk membuat order via Trakteer API
  const createTrakteerOrder = async (productData) => {
    try {
      setCurrentPage('loading');
      
      // Generate unique order ID
      const orderId = `ORD-${Date.now()}`;
      
      // Simulasi API call ke Trakteer
      const response = await fetch(`${TRAKTEER_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TRAKTEER_API_KEY}`
        },
        body: JSON.stringify({
          order_id: orderId,
          amount: productData.price,
          description: productData.description,
          customer_name: 'Customer',
          customer_email: 'customer@example.com',
          callback_url: 'https://yoursite.com/callback',
          redirect_url: 'https://yoursite.com/success'
        })
      });

      // Simulasi response karena kita tidak tahu format exact API Trakteer
      // Di implementasi nyata, gunakan response.json()
      
      // Simulasi data response
      const mockTrakteerResponse = {
        order_id: orderId,
        amount: productData.price,
        description: productData.description,
        status: 'pending',
        payment_url: 'https://pay.trakteer.id/xxx',
        virtual_account: {
          bank: 'BCA',
          number: '1234567890123456'
        },
        qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
      };

      setOrderData({
        orderId: orderId,
        amount: productData.price,
        description: productData.description,
        product: productData
      });

      setTrakteerData(mockTrakteerResponse);
      setCurrentPage('payment');
      
    } catch (error) {
      console.error('Error creating Trakteer order:', error);
      alert('Gagal membuat order. Silakan coba lagi.');
      setCurrentPage('product');
    }
  };

  // Timer untuk countdown
  useEffect(() => {
    if (currentPage === 'payment' && paymentStatus === 'pending' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setPaymentStatus('failed');
            setCurrentPage('failed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentPage, paymentStatus, timeLeft]);

  // Simulasi pengecekan status pembayaran
  const checkPaymentStatus = async () => {
    try {
      setCurrentPage('loading');
      
      // Simulasi API call untuk check status
      setTimeout(() => {
        // Simulasi pembayaran berhasil
        setPaymentStatus('success');
        setCurrentPage('success');
      }, 2000);
      
    } catch (error) {
      console.error('Error checking payment status:', error);
      setCurrentPage('payment');
    }
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
  if (currentPage === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <EnhancedBackground />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Memproses Pembayaran</h2>
          <p className="text-neutral-400">Menghubungkan dengan Trakteer...</p>
        </div>
      </div>
    );
  }

  // Success State
  if (currentPage === 'success') {
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
            <p className="text-neutral-400 mb-6">Terima kasih, pembayaran Anda telah berhasil diproses via Trakteer.</p>
            
            <div className="bg-neutral-800/50 rounded-2xl p-6 mb-6 border border-neutral-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-neutral-400">Order ID:</span>
                <span className="font-mono font-semibold text-white">{orderData?.orderId}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-neutral-400">Produk:</span>
                <span className="font-semibold text-white">{orderData?.product.name}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-neutral-400">Total:</span>
                <span className="font-bold text-xl text-emerald-400">{formatCurrency(orderData?.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Status:</span>
                <span className="bg-emerald-400/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-semibold border border-emerald-400/30">BERHASIL</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                setCurrentPage('product');
                setPaymentStatus('pending');
                setTimeLeft(15 * 60);
                setOrderData(null);
                setTrakteerData(null);
              }}
              className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 text-neutral-900 font-bold py-3 px-6 rounded-xl hover:from-emerald-300 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Kembali ke Produk
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Failed State
  if (currentPage === 'failed') {
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
                <span className="font-mono font-semibold text-white">{orderData?.orderId}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-neutral-400">Total:</span>
                <span className="font-bold text-xl text-red-400">{formatCurrency(orderData?.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Status:</span>
                <span className="bg-red-400/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold border border-red-400/30">GAGAL</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                setCurrentPage('product');
                setPaymentStatus('pending');
                setTimeLeft(15 * 60);
                setOrderData(null);
                setTrakteerData(null);
              }}
              className="w-full bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:from-red-300 hover:to-pink-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Product Page
  if (currentPage === 'product') {
    return (
      <div className="min-h-screen p-4 relative">
        <EnhancedBackground />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-900/50 border border-emerald-400/20 text-emerald-400 font-mono text-xs mb-4 backdrop-blur-md">
              <Coffee className="mr-2 h-3 w-3" />
              PREMIUM STORE
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Coffee Shop
              </span>
            </h1>
            <p className="text-neutral-400 text-lg">Premium coffee experience powered by Trakteer</p>
          </div>

          {/* Product Card */}
          <div className="bg-neutral-900/50 backdrop-blur-xl rounded-3xl border border-neutral-700 p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">{product.image}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
              <p className="text-neutral-400 mb-4">{product.description}</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-400/20 text-blue-400 text-sm font-semibold border border-blue-400/30">
                {product.category}
              </div>
            </div>

            <div className="bg-neutral-800/50 rounded-2xl p-6 mb-6 border border-neutral-700">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Harga:</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  {formatCurrency(product.price)}
                </span>
              </div>
            </div>

            <button
              onClick={() => createTrakteerOrder(product)}
              className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 text-neutral-900 font-bold py-4 px-6 rounded-xl hover:from-emerald-300 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Payment Page
  return (
    <div className="min-h-screen p-4 relative">
      <EnhancedBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-900/50 border border-emerald-400/20 text-emerald-400 font-mono text-xs mb-4 backdrop-blur-md">
            <Zap className="mr-2 h-3 w-3" />
            TRAKTEER PAYMENT
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Complete Payment
            </span>
          </h1>
          <p className="text-neutral-400 text-lg">Secure payment via Trakteer.id</p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => setCurrentPage('product')}
          className="mb-6 flex items-center text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Produk
        </button>

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
                <span className="font-mono font-semibold text-white">{orderData?.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Produk:</span>
                <span className="font-semibold text-white">{orderData?.product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Gateway:</span>
                <span className="font-semibold text-emerald-400">Trakteer.id</span>
              </div>
              <div className="border-t border-neutral-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">Total:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    {formatCurrency(orderData?.amount)}
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
              Payment via Trakteer
            </h3>
            
            {/* Trakteer Payment Details */}
            <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 mb-6">
              <h4 className="font-bold mb-4 text-white flex items-center">
                <Coffee className="mr-2 h-5 w-5 text-emerald-400" />
                Virtual Account
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-neutral-400">Bank:</label>
                  <p className="font-semibold text-white">{trakteerData?.virtual_account?.bank}</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-400">Virtual Account Number:</label>
                  <div className="flex items-center justify-between bg-neutral-700 p-3 rounded-lg border border-neutral-600">
                    <span className="font-mono font-semibold text-white">{trakteerData?.virtual_account?.number}</span>
                    <button
                      onClick={() => copyToClipboard(trakteerData?.virtual_account?.number)}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-neutral-400">Amount:</label>
                  <p className="font-bold text-xl text-emerald-400">{formatCurrency(orderData?.amount)}</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/10 rounded-xl p-4 mb-6 border border-blue-400/30">
              <h5 className="font-semibold text-blue-400 mb-2">Cara Pembayaran:</h5>
              <ol className="text-sm text-blue-200 space-y-1">
                <li>1. Salin nomor Virtual Account di atas</li>
                <li>2. Buka aplikasi mobile banking Anda</li>
                <li>3. Pilih transfer ke Virtual Account</li>
                <li>4. Masukkan nomor VA dan jumlah pembayaran</li>
                <li>5. Konfirmasi pembayaran</li>
              </ol>
            </div>

            {/* Copy Notification */}
            {copied && (
              <div className="mb-4 p-3 bg-emerald-400/20 text-emerald-400 rounded-lg text-center border border-emerald-400/30">
                ✓ Successfully copied to clipboard!
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={checkPaymentStatus}
                className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 text-neutral-900 font-bold py-3 px-6 rounded-xl hover:from-emerald-300 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Saya Sudah Bayar
              </button>
              
              <button
                onClick={() => setCurrentPage('product')}
                className="w-full bg-neutral-800 text-white font-bold py-3 px-6 rounded-xl hover:bg-neutral-700 transition-all duration-300 border border-neutral-700"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrakteerPaymentSystem;
