import React, { useState, useEffect } from 'react';
import { db, auth } from '../config/firebaseConfig';
import { doc, collection, query, where, onSnapshot, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, FiShoppingBag, FiClock, FiCheckCircle, 
  FiCopy, FiExternalLink, FiChevronRight, 
  FiCreditCard, FiHome, FiLogOut, FiX,
  FiShield, FiMail, FiSmartphone, FiLoader,
  FiAlertCircle, FiLock, FiStar, FiAward, FiCheck,
  FiDownload, FiDollarSign, FiCalendar, FiBox
} from "react-icons/fi";
import { FaDiscord } from "react-icons/fa";
import { signOut, onAuthStateChanged } from 'firebase/auth';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showPremiumAlert, setShowPremiumAlert] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthChecked(true);
      if (!user) {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!authChecked) return;

    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userDocRef = doc(db, 'users', user.uid);
        const userUnsubscribe = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setUserData({ 
              id: doc.id,
              email: data.email || user.email,
              name: data.name || user.displayName || '',
              phone: data.phone || '',
              discord: data.discord || '',
              createdAt: data.createdAt || new Date(),
              role: data.role || 'user'
            });
          } else {
            const newUserData = {
              email: user.email,
              name: user.displayName || '',
              phone: '',
              discord: '',
              createdAt: new Date(),
              role: 'user'
            };
            setDoc(userDocRef, newUserData);
          }
        });

        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('customer.userId', '==', user.uid)
        );

        const transactionsUnsubscribe = onSnapshot(transactionsQuery, 
          (snapshot) => {
            const transactionsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setTransactions(transactionsData.sort((a, b) => 
              (b.transactionDetails?.timestamp?.toDate() || 0) - 
              (a.transactionDetails?.timestamp?.toDate() || 0)
            ));
            setLoading(false);
          }, 
          (err) => {
            console.error("Transaction error:", err);
            setError("Failed to load transactions");
            setLoading(false);
          }
        );

        return () => {
          userUnsubscribe();
          transactionsUnsubscribe();
        };

      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, authChecked]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to logout");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text, transactionId) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(transactionId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'completed':
        return <span className={`${baseClasses} bg-gradient-to-r from-green-500 to-emerald-600 text-white`}><FiCheckCircle className="mr-1" /> Completed</span>;
      case 'pending':
        return <span className={`${baseClasses} bg-gradient-to-r from-amber-500 to-yellow-600 text-white`}><FiClock className="mr-1" /> Pending</span>;
      case 'failed':
        return <span className={`${baseClasses} bg-gradient-to-r from-red-500 to-rose-600 text-white`}><FiX className="mr-1" /> Failed</span>;
      default:
        return <span className={`${baseClasses} bg-gradient-to-r from-gray-500 to-gray-600 text-white`}>Unknown</span>;
    }
  };

  const hasAccessToTier = (tier) => {
    if (!transactions || transactions.length === 0) return false;
    
    const completedTransactions = transactions.filter(
      t => t.transactionDetails?.status === 'completed'
    );
    
    return completedTransactions.some(t => {
      const plan = t.transactionDetails?.plan?.toLowerCase();
      if (!plan) return false;
      
      if (tier === 'Origin Qi') return plan.includes('origin qi') || plan.includes('half saint') || plan.includes('peak immortal');
      if (tier === 'Half Saint') return plan.includes('half saint') || plan.includes('peak immortal');
      if (tier === 'Peak Immortal') return plan.includes('peak immortal');
      
      return false;
    });
  };

  const handleMenuClick = (menu) => {
    if (menu === 'Origin Qi' && !hasAccessToTier('Origin Qi')) {
      setShowPremiumAlert(true);
      return;
    }
    if (menu === 'Half Saint' && !hasAccessToTier('Half Saint')) {
      setShowPremiumAlert(true);
      return;
    }
    if (menu === 'Peak Immortal' && !hasAccessToTier('Peak Immortal')) {
      setShowPremiumAlert(true);
      return;
    }
    setActiveMenu(menu);
  };

  const renderMenuContent = () => {
    const resources = {
      'Origin Qi': [
        { title: "Origin Qi Resource 1", link: "https://mediafire.com/OriginQi1" },
        { title: "Origin Qi Resource 2", link: "https://mediafire.com/OriginQi2" }
      ],
      'Half Saint': [
        { title: "Half Saint Resource 1", link: "https://mediafire.com/HalfSaint1" },
        { title: "Half Saint Resource 2", link: "https://mediafire.com/HalfSaint2" },
        { title: "Half Saint Resource 3", link: "https://mediafire.com/HalfSaint3" }
      ],
      'Peak Immortal': [
        { title: "Peak Immortal Resource 1", link: "https://mediafire.com/PeakImmortal1" },
        { title: "Peak Immortal Resource 2", link: "https://mediafire.com/PeakImmortal2" },
        { title: "Peak Immortal Resource 3", link: "https://mediafire.com/PeakImmortal3" },
        { title: "Peak Immortal Resource 4", link: "https://mediafire.com/PeakImmortal4" }
      ]
    };

    if (!activeMenu) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-900 to-black rounded-full flex items-center justify-center mb-4">
            <FiBox className="h-8 w-8 text-purple-400" />
          </div>
          <h3 className="text-lg font-medium text-white">Select a content tier</h3>
          <p className="mt-1 text-sm text-purple-200">Choose from the available tiers to access exclusive resources</p>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium text-white mb-4">{activeMenu} Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources[activeMenu].map((resource, index) => (
            <ContentBox 
              key={index}
              title={resource.title} 
              link={resource.link} 
              onCopy={copyToClipboard}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-black to-purple-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">
              Dashboard
            </h1>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center text-purple-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <FiHome className="mr-2" /> Home
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center text-purple-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <FiLogOut className="mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-900/50 p-4 mb-6 border border-red-700">
            <div className="flex items-start">
              <FiAlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-white">Error loading data</h3>
                <p className="text-sm text-red-200 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="space-y-6">
              {/* User Profile Card */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                <div className="bg-gradient-to-r from-purple-900 to-purple-700 px-4 py-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-white/10 p-2 rounded-full backdrop-blur-sm">
                      <FiUser className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <h2 className="text-lg font-semibold text-white">{userData?.name || 'User'}</h2>
                      <p className="text-sm text-purple-100">{userData?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-purple-300 uppercase tracking-wider">Discord</p>
                      <p className="flex items-center mt-1 text-sm text-white">
                        <FaDiscord className="mr-2 text-purple-400" />
                        {userData?.discord || 'Not connected'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-purple-300 uppercase tracking-wider">Phone</p>
                      <p className="mt-1 text-sm text-white">
                        {userData?.phone || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-purple-300 uppercase tracking-wider">Member Since</p>
                      <p className="mt-1 text-sm text-white">
                        {userData?.createdAt?.toDate().toLocaleDateString('en-US') || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Tiers */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                <div className="px-4 py-3 border-b border-gray-700">
                  <h3 className="text-base font-medium text-white">Content Tiers</h3>
                </div>
                <div className="divide-y divide-gray-700">
                  <button 
                    onClick={() => handleMenuClick('Origin Qi')}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                      activeMenu === 'Origin Qi' ? 'bg-purple-900/30' : 'hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${
                        activeMenu === 'Origin Qi' ? 
                        'bg-gradient-to-br from-purple-500 to-purple-700 text-white' : 
                        'bg-gray-700 text-purple-400'
                      }`}>
                        <FiStar className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-white">Origin Qi</span>
                    </div>
                    {!hasAccessToTier('Origin Qi') ? (
                      <FiLock className="h-5 w-5 text-purple-400" />
                    ) : (
                      <FiChevronRight className="h-5 w-5 text-purple-400" />
                    )}
                  </button>
                  
                  <button 
                    onClick={() => handleMenuClick('Half Saint')}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                      activeMenu === 'Half Saint' ? 'bg-purple-900/30' : 'hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${
                        activeMenu === 'Half Saint' ? 
                        'bg-gradient-to-br from-purple-500 to-purple-700 text-white' : 
                        'bg-gray-700 text-purple-400'
                      }`}>
                        <FiAward className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-white">Half Saint</span>
                    </div>
                    {!hasAccessToTier('Half Saint') ? (
                      <FiLock className="h-5 w-5 text-purple-400" />
                    ) : (
                      <FiChevronRight className="h-5 w-5 text-purple-400" />
                    )}
                  </button>
                  
                  <button 
                    onClick={() => handleMenuClick('Peak Immortal')}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                      activeMenu === 'Peak Immortal' ? 'bg-purple-900/30' : 'hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${
                        activeMenu === 'Peak Immortal' ? 
                        'bg-gradient-to-br from-purple-500 to-purple-700 text-white' : 
                        'bg-gray-700 text-purple-400'
                      }`}>
                        <FiAward className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-white">Peak Immortal</span>
                    </div>
                    {!hasAccessToTier('Peak Immortal') ? (
                      <FiLock className="h-5 w-5 text-purple-400" />
                    ) : (
                      <FiChevronRight className="h-5 w-5 text-purple-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Content Section */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-medium text-white">
                      {activeMenu ? `${activeMenu} Content` : 'Your Content'}
                    </h2>
                    <p className="mt-1 text-sm text-purple-200">
                      {activeMenu ? `Access your ${activeMenu} tier resources` : 'Select a content tier to get started'}
                    </p>
                  </div>
                  {activeMenu && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeMenu === 'Origin Qi' ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white' :
                      activeMenu === 'Half Saint' ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white' :
                      'bg-gradient-to-r from-purple-700 to-purple-900 text-white'
                    }`}>
                      {activeMenu.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  {renderMenuContent()}
                </div>
              </div>

              {/* Transactions Section */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h2 className="text-lg font-medium text-white">Purchase History</h2>
                  <p className="mt-1 text-sm text-purple-200">Your recent transactions</p>
                </div>
                
                {transactions.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="mx-auto h-16 w-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <FiShoppingBag className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-sm font-medium text-white">No purchases yet</h3>
                    <p className="mt-1 text-sm text-purple-200">
                      Get started by purchasing one of our products.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all"
                      >
                        Browse Products
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="px-6 py-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-3 md:mb-0">
                            <h3 className="text-base font-medium text-white">
                              {transaction.transactionDetails?.plan || 'Unknown Plan'}
                            </h3>
                            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                              <div className="flex items-center text-sm text-purple-200">
                                <FiDollarSign className="mr-1.5 h-4 w-4 text-purple-400" />
                                Invoice: {transaction.transactionDetails?.invoiceNumber || 'N/A'}
                              </div>
                              <div className="flex items-center text-sm text-purple-200">
                                <FiCalendar className="mr-1.5 h-4 w-4 text-purple-400" />
                                {formatDate(transaction.transactionDetails?.timestamp)}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-lg font-semibold text-white mb-2">
                              Rp{transaction.transactionDetails?.totalAmount?.toLocaleString('id-ID') || '0'}
                            </div>
                            {getStatusBadge(transaction.transactionDetails?.status)}
                          </div>
                        </div>

                        {transaction.transactionDetails?.status === 'completed' && transaction.notes?.link && (
                          <div className="mt-4 bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-white">
                                  Download Available
                                </h3>
                                <button
                                  onClick={() => copyToClipboard(transaction.notes.link, transaction.id)}
                                  className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                  {copiedLink === transaction.id ? (
                                    <>
                                      <FiCheck className="mr-1.5 h-4 w-4 text-green-400" /> Copied!
                                    </>
                                  ) : (
                                    <>
                                      <FiCopy className="mr-1.5 h-4 w-4" /> Copy Link
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="bg-gray-800 p-2 rounded-md flex items-center justify-between border border-gray-600">
                                <p className="text-sm font-mono text-purple-100 truncate">
                                  {transaction.notes.link}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                  <a 
                                    href={transaction.notes.link} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 transition-colors"
                                  >
                                    <FiExternalLink />
                                  </a>
                                </div>
                              </div>
                              <p className="text-xs text-purple-300">
                                Link expires in 7 days
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Premium Access Modal */}
      {showPremiumAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl overflow-hidden max-w-md w-full border border-purple-700/50">
            <div className="px-5 py-4 flex justify-between items-center border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Premium Access Required</h3>
              <button 
                onClick={() => setShowPremiumAlert(false)}
                className="text-purple-400 hover:text-white transition-colors"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="px-5 py-6">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-900/50 flex items-center justify-center border border-purple-700">
                  <FiLock className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <p className="text-center text-purple-200 mb-6">
                You need to upgrade to the {activeMenu} plan to access this content.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowPremiumAlert(false)}
                  className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-700/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowPremiumAlert(false);
                    navigate('/#pricing');
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-black to-purple-900 border-t border-gray-800 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-purple-300">
            &copy; {new Date().getFullYear()} Qarvo API team. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const ContentBox = ({ title, link, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(link, title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-900/20">
      <h4 className="text-base font-medium text-white mb-2">{title}</h4>
      <div className="flex items-center justify-between bg-gray-700/50 p-2 rounded border border-gray-600">
        <p className="text-sm font-mono text-purple-100 truncate flex-1">
          {link}
        </p>
        <div className="ml-2 flex space-x-1">
          <button
            onClick={handleCopy}
            className="p-1 text-purple-400 hover:text-white transition-colors"
            title="Copy link"
          >
            {copied ? <FiCheck className="h-4 w-4 text-green-400" /> : <FiCopy className="h-4 w-4" />}
          </button>
          <a 
            href={link} 
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-purple-400 hover:text-white transition-colors"
            title="Open link"
          >
            <FiExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
