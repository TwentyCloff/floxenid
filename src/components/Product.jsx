import React, { useState, useEffect } from 'react';
import { ShoppingCart, CreditCard, Package, Check, X, Clock, AlertCircle } from 'lucide-react';

const TripayEcommerce = () => {
  const [currentPage, setCurrentPage] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Konfigurasi Tripay dari environment variables
  const TRIPAY_CONFIG = {
    apiKey: 'DEV-wulh76xFotCglG9XlNUe2TNCOKhE5da7UPxeV44U',
    privateKey: 'xUb4g-PGq7F-7a0ur-hFFfp-heM9R',
    merchantCode: 'T42963',
    baseUrl: 'https://tripay.co.id/api-sandbox'
  };

  // Sample products
  const products = [
    {
      id: 1,
      name: 'Smartphone Premium',
      price: 2500000,
      image: '/api/placeholder/300/300',
      description: 'Smartphone flagship dengan kamera canggih dan performa tinggi',
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Laptop Gaming',
      price: 12000000,
      image: '/api/placeholder/300/300',
      description: 'Laptop gaming dengan spesifikasi tinggi untuk gaming dan produktivitas',
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Headphone Wireless',
      price: 800000,
      image: '/api/placeholder/300/300',
      description: 'Headphone wireless dengan kualitas suara premium dan noise cancellation',
      category: 'Audio'
    },
    {
      id: 4,
      name: 'Smartwatch',
      price: 1500000,
      image: '/api/placeholder/300/300',
      description: 'Smartwatch dengan fitur fitness tracking dan notifikasi pintar',
      category: 'Wearables'
    }
  ];

  // Fungsi untuk format rupiah
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Fungsi untuk menambah ke cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Fungsi untuk menghitung total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Fungsi untuk create signature Tripay
  const createSignature = (merchantCode, merchantRef, amount) => {
    const data = merchantCode + merchantRef + amount;
    // Untuk demo, kita simulasikan signature (dalam implementasi real, gunakan crypto-js atau server-side)
    return btoa(data + TRIPAY_CONFIG.privateKey).slice(0, 32);
  };

  // Fungsi untuk membuat payment request ke Tripay
  const createPayment = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const merchantRef = 'ORDER-' + Date.now();
      const amount = calculateTotal();
      const signature = createSignature(TRIPAY_CONFIG.merchantCode, merchantRef, amount);

      // Simulasi API call ke Tripay
      // Dalam implementasi real, ini harus dilakukan di server-side untuk keamanan
      const paymentRequest = {
        method: 'BCAVA', // Bank BCA Virtual Account
        merchant_ref: merchantRef,
        amount: amount,
        customer_name: 'Customer Test',
        customer_email: 'test@example.com',
        customer_phone: '081234567890',
        order_items: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        return_url: window.location.href,
        expired_time: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 jam
        signature: signature
      };

      // Simulasi response dari Tripay (dalam implementasi real, gunakan API endpoint yang sebenarnya)
      const mockResponse = {
        success: true,
        data: {
          reference: merchantRef,
          merchant_ref: merchantRef,
          payment_method: 'BCAVA',
          payment_name: 'BCA Virtual Account',
          customer_name: 'Customer Test',
          customer_email: 'test@example.com',
          customer_phone: '081234567890',
          callback_url: '',
          return_url: window.location.href,
          amount: amount,
          fee_merchant: 4000,
          fee_customer: 0,
          total_fee: 4000,
          amount_received: amount - 4000,
          pay_code: '70012' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
          pay_url: 'https://tripay.co.id/checkout/' + merchantRef,
          checkout_url: 'https://tripay.co.id/checkout/' + merchantRef,
          status: 'UNPAID',
          expired_time: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
          order_items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          instructions: [
            {
              title: 'BCA Virtual Account',
              steps: [
                'Masuk ke aplikasi BCA Mobile atau BCA internet banking',
                'Pilih menu Transfer',
                'Pilih Virtual Account',
                'Masukkan nomor Virtual Account: ' + '70012' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
                'Masukkan nominal yang akan dibayar',
                'Konfirmasi pembayaran'
              ]
            }
          ],
          qr_code: null,
          qr_string: null
        }
      };

      setPaymentData(mockResponse.data);
      setCurrentPage('payment');
      setPaymentStatus('pending');

      // Simulasi polling status pembayaran
      setTimeout(() => {
        setPaymentStatus('success');
      }, 10000); // Simulasi pembayaran berhasil setelah 10 detik

    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Terjadi kesalahan saat membuat pembayaran');
    } finally {
      setLoading(false);
    }
  };

  // Komponen halaman produk
  const ProductsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Toko Online</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage('cart')}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart size={20} />
              Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Package size={48} className="text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">{formatRupiah(product.price)}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Komponen halaman cart
  const CartPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Shopping Cart</h1>
          <button
            onClick={() => setCurrentPage('products')}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart size={64} className="text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <Package size={24} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{formatRupiah(item.price * item.quantity)}</p>
                      <p className="text-sm text-gray-500">{formatRupiah(item.price)} each</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h3>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatRupiah(calculateTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">{formatRupiah(calculateTotal())}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={createPayment}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Proceed to Payment
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Komponen halaman payment
  const PaymentPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {paymentStatus === 'success' ? (
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Check size={32} className="text-green-600" />
                  </div>
                ) : paymentStatus === 'pending' ? (
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock size={32} className="text-yellow-600" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard size={32} className="text-blue-600" />
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {paymentStatus === 'success' ? 'Payment Successful!' : 'Payment Instructions'}
              </h1>
              <p className="text-gray-600">
                {paymentStatus === 'success' 
                  ? 'Your payment has been processed successfully' 
                  : 'Please follow the instructions below to complete your payment'}
              </p>
            </div>

            {paymentData && paymentStatus !== 'success' && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-semibold">{paymentData.payment_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold text-lg">{formatRupiah(paymentData.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Virtual Account Number</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-lg font-bold">{paymentData.pay_code}</p>
                        <button
                          onClick={() => navigator.clipboard.writeText(paymentData.pay_code)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expires</p>
                      <p className="font-semibold">{new Date(paymentData.expired_time * 1000).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Instructions</h3>
                  <div className="space-y-3">
                    {paymentData.instructions[0].steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-semibold">Important Note</p>
                    <p className="text-yellow-700 text-sm">This is a sandbox environment for testing. No real money will be charged.</p>
                  </div>
                </div>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="text-center">
                <div className="bg-green-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Order Confirmed</h3>
                  <p className="text-green-700">Your order has been successfully processed and will be shipped soon.</p>
                </div>
                <button
                  onClick={() => {
                    setCurrentPage('products');
                    setCart([]);
                    setPaymentData(null);
                    setPaymentStatus(null);
                  }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render halaman berdasarkan state
  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <ProductsPage />;
      case 'cart':
        return <CartPage />;
      case 'payment':
        return <PaymentPage />;
      default:
        return <ProductsPage />;
    }
  };

  return renderPage();
};

export default TripayEcommerce;
