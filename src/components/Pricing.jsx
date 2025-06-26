import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  Zap, 
  ShieldCheck, 
  Rocket, 
  Code, 
  Palette, 
  Database, 
  Globe, 
  Smartphone,
  CreditCard,
  DollarSign,
  CheckCircle,
  ChevronRight,
  Copy,
  X,
  Crown,
  Gem,
  Sparkles,
  Shield,
  Key,
  Gift
} from 'lucide-react';

const Pricing = () => {
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('plans');
  const [purchaseId, setPurchaseId] = useState(null);
  const navigate = useNavigate();

  // Membership plans
  const membershipPlans = [
    {
      id: 'premium',
      name: 'Premium',
      price: 199000,
      color: 'purple',
      features: [
        'Access to all scripts',
        'Priority support',
        'Weekly updates',
        'Commercial license'
      ],
      icon: <Zap size={24} />
    },
    {
      id: 'ultra',
      name: 'Ultra',
      price: 499000,
      color: 'red',
      features: [
        'Everything in Premium',
        'Exclusive tools',
        '24/7 VIP support',
        'Source code access'
      ],
      icon: <Rocket size={24} />
    }
  ];

  // Product categories and items
  const categories = [
    {
      id: 'scripts',
      name: 'Scripts',
      items: [
        { id: 'script-1', name: 'Advanced AI Script', price: 150000, icon: <Code size={20} /> },
        { id: 'script-2', name: 'Automation Script', price: 200000, icon: <Rocket size={20} /> },
        { id: 'script-3', name: 'Security Script', price: 250000, icon: <ShieldCheck size={20} /> }
      ]
    },
    {
      id: 'tools',
      name: 'Tools',
      items: [
        { id: 'tool-1', name: 'Design Toolkit', price: 300000, icon: <Palette size={20} /> },
        { id: 'tool-2', name: 'Database Manager', price: 350000, icon: <Database size={20} /> },
        { id: 'tool-3', name: 'Web Analyzer', price: 400000, icon: <Globe size={20} /> }
      ]
    },
    {
      id: 'web-src',
      name: 'Web Sources',
      items: [
        { id: 'web-1', name: 'Responsive Template', price: 450000, icon: <Smartphone size={20} /> },
        { id: 'web-2', name: 'E-commerce Kit', price: 500000, icon: <CreditCard size={20} /> },
        { id: 'web-3', name: 'Admin Dashboard', price: 550000, icon: <DollarSign size={20} /> }
      ]
    }
  ];

  // Payment methods
  const paymentMethods = [
    { id: 'gopay', name: 'Gopay', icon: <CreditCard size={20} />, account: '081234567890', holder: 'Floxen Store' },
    { id: 'dana', name: 'DANA', icon: <CreditCard size={20} />, account: '081234567891', holder: 'Floxen Store' },
    { id: 'qris', name: 'QRIS', icon: <CreditCard size={20} />, account: 'QRIS-CODE-12345', holder: 'Floxen Store' },
    { id: 'paypal', name: 'PayPal', icon: <CreditCard size={20} />, account: 'paypal@floxen.com', holder: 'Floxen Store' }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!purchaseId) return;

    const purchaseRef = doc(db, 'purchases', purchaseId);
    const unsubscribe = onSnapshot(purchaseRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.status === 'done') {
          setPurchaseStatus('success');
          setTimeout(() => {
            navigate('/dashboard?tab=purchases');
          }, 3000);
        } else if (data.status === 'failed') {
          setPurchaseStatus('failed');
        }
      }
    });

    return () => unsubscribe();
  }, [purchaseId, navigate]);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setActiveTab('checkout');
  };

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
  };

  const confirmPurchase = async () => {
    if (!user || !selectedItem || !paymentMethod) return;

    try {
      const purchaseData = {
        userId: user.uid,
        itemName: selectedItem.name,
        itemId: selectedItem.id,
        price: selectedItem.price,
        currency: 'IDR',
        paymentMethod: paymentMethod.id,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'purchases'), purchaseData);
      setPurchaseId(docRef.id);
      setActiveTab('pending');
      setShowPaymentModal(false);
    } catch (error) {
      console.error('Error creating purchase:', error);
      setPurchaseStatus('failed');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen pt-[4.75rem] lg:pt-[5.25rem] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Membership Plans */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Membership Plans</h1>
          <p className="text-gray-600 text-center mb-12">Upgrade your experience with our premium memberships</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Premium Plan */}
            <div 
              className={`relative bg-gradient-to-br from-purple-500 to-purple-800 rounded-xl p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer ${selectedPlan?.id === 'premium' ? 'ring-4 ring-purple-300' : ''}`}
              onClick={() => handlePlanSelect(membershipPlans[0])}
            >
              <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
              <div className="flex items-center mb-4">
                <Zap className="text-white mr-2" size={24} />
                <h2 className="text-2xl font-bold text-white">Premium</h2>
              </div>
              <p className="text-purple-100 mb-6">Perfect for pro user who need advanced features</p>
              
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">{formatCurrency(199000)}</span>
                <span className="text-purple-200">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-purple-100">
                  <CheckCircle className="mr-2" size={18} />
                  Access to all scripts
                </li>
                <li className="flex items-center text-purple-100">
                  <CheckCircle className="mr-2" size={18} />
                  Priority support
                </li>
                <li className="flex items-center text-purple-100">
                  <CheckCircle className="mr-2" size={18} />
                  Weekly updates
                </li>
                <li className="flex items-center text-purple-100">
                  <CheckCircle className="mr-2" size={18} />
                  Commercial license
                </li>
              </ul>
              
              <button className="w-full py-3 bg-white text-purple-700 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                Select Premium
              </button>
            </div>
            
            {/* Ultra Plan */}
            <div 
              className={`relative bg-gradient-to-br from-red-500 to-red-800 rounded-xl p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer ${selectedPlan?.id === 'ultra' ? 'ring-4 ring-red-300' : ''}`}
              onClick={() => handlePlanSelect(membershipPlans[1])}
            >
              <div className="absolute top-4 right-4 bg-white text-red-800 text-xs font-bold px-3 py-1 rounded-full">
                BEST VALUE
              </div>
              <div className="flex items-center mb-4">
                <Rocket className="text-white mr-2" size={24} />
                <h2 className="text-2xl font-bold text-white">Ultra</h2>
              </div>
              <p className="text-red-100 mb-6">For power users who need the ultimate experience</p>
              
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">{formatCurrency(499000)}</span>
                <span className="text-red-200">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-red-100">
                  <CheckCircle className="mr-2" size={18} />
                  Everything in Premium
                </li>
                <li className="flex items-center text-red-100">
                  <CheckCircle className="mr-2" size={18} />
                  Exclusive tools
                </li>
                <li className="flex items-center text-red-100">
                  <CheckCircle className="mr-2" size={18} />
                  24/7 VIP support
                </li>
                <li className="flex items-center text-red-100">
                  <CheckCircle className="mr-2" size={18} />
                  Source code access
                </li>
              </ul>
              
              <button className="w-full py-3 bg-white text-red-700 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                Select Ultra
              </button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Our Products</h1>
          <p className="text-gray-600 text-center mb-12">High-quality digital products for your projects</p>
          
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category.id}>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">{category.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {category.items.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                      onClick={() => handleItemSelect(item)}
                    >
                      <div className="flex items-center mb-4">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600 mr-3">
                          {item.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      </div>
                      <p className="text-gray-600 mb-4">High-quality {category.name.toLowerCase()} for your projects</p>
                      <div className="text-right">
                        <span className="text-xl font-bold text-gray-800">{formatCurrency(item.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Section */}
        {activeTab === 'checkout' && selectedItem && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <button 
                onClick={() => setActiveTab('plans')}
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                <ChevronRight className="rotate-180" size={20} />
              </button>
              <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Summary</h2>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-800 font-medium">{selectedItem.name}</p>
                    <p className="text-gray-600 text-sm">{selectedPlan?.name || 'Standard'}</p>
                  </div>
                  <p className="text-gray-800 font-bold">{formatCurrency(selectedItem.price)}</p>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id}
                      className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${paymentMethod?.id === method.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
                      onClick={() => handlePaymentSelect(method)}
                    >
                      <div className="bg-gray-100 p-3 rounded-full mb-3 text-gray-600">
                        {method.icon}
                      </div>
                      <p className="font-medium text-gray-800">{method.name}</p>
                    </div>
                  ))}
                </div>
                
                {paymentMethod && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-purple-800 font-medium mb-2">Payment via {paymentMethod.name}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Account Holder:</span>
                      <span className="font-medium">{paymentMethod.holder}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Account Number:</span>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">{paymentMethod.account}</span>
                        <button 
                          onClick={() => copyToClipboard(paymentMethod.account)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Copy"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                    {paymentMethod.id === 'qris' && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 flex justify-center">
                        <div className="bg-gray-200 w-32 h-32 flex items-center justify-center text-gray-500">
                          QR Code Image
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <button 
                  onClick={() => {
                    if (paymentMethod) {
                      setShowPaymentModal(true);
                    } else {
                      alert('Please select a payment method');
                    }
                  }}
                  className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Payment Section */}
        {activeTab === 'pending' && (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Waiting for Payment Confirmation</h2>
              <p className="text-gray-600 mb-6">Your purchase is being processed. Please wait while we verify your payment.</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <h3 className="font-medium text-gray-800 mb-2">Order Details</h3>
                <p className="text-gray-600 mb-1">{selectedItem?.name}</p>
                <p className="text-gray-600 mb-1">{formatCurrency(selectedItem?.price)}</p>
                <p className="text-gray-600">Payment: {paymentMethod?.name}</p>
              </div>
              
              <p className="text-sm text-gray-500 mb-6">Transaction ID: {purchaseId?.substring(0, 8)}</p>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Payment Confirmation Modal */}
        {showPaymentModal && paymentMethod && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Confirm Payment</h2>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-medium text-gray-800">{selectedItem?.name}</p>
                  <p className="text-gray-600">{formatCurrency(selectedItem?.price)}</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-800 font-medium mb-2">Payment via {paymentMethod.name}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Account Holder:</span>
                    <span className="font-medium">{paymentMethod.holder}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-medium">{paymentMethod.account}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmPurchase}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success/Failure Modals */}
        {purchaseStatus === 'success' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">Your purchase has been confirmed.</p>
              <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6">
                <p className="font-medium">{selectedItem?.name}</p>
                <p className="text-sm">{formatCurrency(selectedItem?.price)}</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

        {purchaseStatus === 'failed' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
              <X className="text-red-500 mx-auto mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
              <p className="text-gray-600 mb-6">There was an issue processing your payment. Please try again.</p>
              <button 
                onClick={() => {
                  setPurchaseStatus(null);
                  setActiveTab('checkout');
                }}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
