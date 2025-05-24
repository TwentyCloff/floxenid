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
  FiDownload, FiDollarSign, FiCalendar
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

  // Check auth state on component mount
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

        // User data subscription
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

        // Transactions subscription
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
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <FiCheckCircle className="mr-1.5 h-3.5 w-3.5" /> Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <FiClock className="mr-1.5 h-3.5 w-3.5" /> Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FiX className="mr-1.5 h-3.5 w-3.5" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
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
      
      if (tier === 'basic') {
        return plan.includes('basic') || plan.includes('premium') || plan.includes('rich');
      }
      else if (tier === 'premium') {
        return plan.includes('premium') || plan.includes('rich');
      }
      else if (tier === 'rich') {
        return plan.includes('rich');
      }
      
      return false;
    });
  };

  const handleMenuClick = (menu) => {
    if (menu === 'basic') {
      if (hasAccessToTier('basic')) {
        setActiveMenu(menu);
      } else {
        setShowPremiumAlert(true);
      }
    } 
    else if (menu === 'premium') {
      if (hasAccessToTier('premium')) {
        setActiveMenu(menu);
      } else {
        setShowPremiumAlert(true);
      }
    }
    else if (menu === 'rich') {
      if (hasAccessToTier('rich')) {
        setActiveMenu(menu);
      } else {
        setShowPremiumAlert(true);
      }
    }
  };

  const renderMenuContent = () => {
    switch (activeMenu) {
      case 'basic':
        return (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ContentBox 
                title="Basic Resource 1" 
                link="https://mediafire.com/basic1" 
                onCopy={copyToClipboard}
              />
              <ContentBox 
                title="Basic Resource 2" 
                link="https://mediafire.com/basic2" 
                onCopy={copyToClipboard}
              />
            </div>
          </div>
        );
      case 'premium':
        return (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ContentBox 
                title="Premium Resource 1" 
                link="https://mediafire.com/premium1" 
                onCopy={copyToClipboard}
              />
              <ContentBox 
                title="Premium Resource 2" 
                link="https://mediafire.com/premium2" 
                onCopy={copyToClipboard}
              />
              <ContentBox 
                title="Premium Resource 3" 
                link="https://mediafire.com/premium3" 
                onCopy={copyToClipboard}
              />
            </div>
          </div>
        );
      case 'rich':
        return (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rich Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ContentBox 
                title="Rich Resource 1" 
                link="https://mediafire.com/rich1" 
                onCopy={copyToClipboard}
              />
              <ContentBox 
                title="Rich Resource 2" 
                link="https://mediafire.com/rich2" 
                onCopy={copyToClipboard}
              />
              <ContentBox 
                title="Rich Resource 3" 
                link="https://mediafire.com/rich3" 
                onCopy={copyToClipboard}
              />
              <ContentBox 
                title="Rich Resource 4" 
                link="https://mediafire.com/rich4" 
                onCopy={copyToClipboard}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="mt-6 text-center py-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <FiAward className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-gray-900">Select a tier to view content</h3>
            <p className="mt-2 text-sm text-gray-500">Choose from Basic, Premium, or Rich to access exclusive resources</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FiHome className="mr-2 h-4 w-4" /> Home
            </button>
            <button 
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FiLogOut className="mr-2 h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-700">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-white/10 p-2 rounded-full">
                      <FiUser className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <h2 className="text-lg font-semibold text-white">{userData?.name || 'User'}</h2>
                      <p className="text-sm text-blue-100">{userData?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Discord ID</dt>
                      <dd className="mt-1 flex items-center text-sm text-gray-900">
                        <FaDiscord className="mr-2 h-4 w-4 text-blue-500" />
                        {userData?.discord || 'Not connected'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {userData?.phone || 'Not provided'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Member since</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {userData?.createdAt?.toDate().toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) || 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Content Tiers */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">Content Tiers</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  <button 
                    onClick={() => handleMenuClick('basic')}
                    className={`w-full text-left px-4 py-4 flex items-center justify-between ${activeMenu === 'basic' ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${activeMenu === 'basic' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                        <FiStar className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Basic</span>
                    </div>
                    {!hasAccessToTier('basic') ? (
                      <FiLock className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  <button 
                    onClick={() => handleMenuClick('premium')}
                    className={`w-full text-left px-4 py-4 flex items-center justify-between ${activeMenu === 'premium' ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${activeMenu === 'premium' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                        <FiAward className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Premium</span>
                    </div>
                    {!hasAccessToTier('premium') ? (
                      <FiLock className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  <button 
                    onClick={() => handleMenuClick('rich')}
                    className={`w-full text-left px-4 py-4 flex items-center justify-between ${activeMenu === 'rich' ? 'bg-amber-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${activeMenu === 'rich' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'}`}>
                        <FiAward className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Rich</span>
                    </div>
                    {!hasAccessToTier('rich') ? (
                      <FiLock className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-4 space-y-6">
              {/* Content Section */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {activeMenu ? 
                        `${activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)} Resources` : 
                        'Exclusive Content'}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {activeMenu ? 
                        `Access your ${activeMenu} tier resources below` : 
                        'Select a content tier to view available resources'}
                    </p>
                  </div>
                  {activeMenu && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      activeMenu === 'basic' ? 'bg-blue-100 text-blue-800' :
                      activeMenu === 'premium' ? 'bg-purple-100 text-purple-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {activeMenu.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="px-6 py-5">
                  {renderMenuContent()}
                </div>
              </div>

              {/* Transactions Section */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Purchase History</h2>
                  <p className="mt-1 text-sm text-gray-500">A list of all your recent transactions</p>
                </div>

                {transactions.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No purchases yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by purchasing one of our products.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Browse Products
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="px-6 py-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="text-base font-medium text-gray-900">
                              {transaction.transactionDetails?.plan || 'Unknown Plan'}
                            </h3>
                            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <FiDollarSign className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                                Invoice: {transaction.transactionDetails?.invoiceNumber || 'N/A'}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <FiCalendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                                {transaction.transactionDetails?.timestamp ? 
                                  formatDate(transaction.transactionDetails.timestamp) : 'N/A'}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-xl font-semibold text-gray-900 mb-2">
                              Rp{transaction.transactionDetails?.totalAmount?.toLocaleString('id-ID') || '0'}
                            </div>
                            {getStatusBadge(transaction.transactionDetails?.status)}
                          </div>
                        </div>

                        {transaction.transactionDetails?.status === 'completed' && transaction.notes?.link && (
                          <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-900">
                                  Download Link Available
                                </h3>
                                <button
                                  onClick={() => copyToClipboard(transaction.notes.link, transaction.id)}
                                  className="inline-flex items-center rounded text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                                >
                                  {copiedLink === transaction.id ? (
                                    <>
                                      <FiCheck className="mr-1.5 h-4 w-4 text-green-500" /> Copied!
                                    </>
                                  ) : (
                                    <>
                                      <FiCopy className="mr-1.5 h-4 w-4" /> Copy Link
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="bg-white p-3 rounded-md flex items-center justify-between border border-gray-300">
                                <p className="text-sm font-mono text-gray-700 truncate">
                                  {transaction.notes.link}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                  <a 
                                    href={transaction.notes.link} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-500"
                                  >
                                    <FiExternalLink />
                                  </a>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500">
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Access Restricted</h3>
              <button 
                onClick={() => setShowPremiumAlert(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 pb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                  <FiLock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-center text-gray-700 mb-6">
                You need to purchase the {activeMenu ? activeMenu + ' plan' : 'this plan'} to access this content.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowPremiumAlert(false)}
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowPremiumAlert(false);
                    navigate('/');
                  }}
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
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
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
      <h4 className="text-base font-medium text-gray-900 mb-3">{title}</h4>
      <div className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-300">
        <p className="text-sm font-mono text-gray-700 truncate flex-1">
          {link}
        </p>
        <div className="ml-2 flex-shrink-0 flex space-x-2">
          <button
            onClick={handleCopy}
            className="text-gray-500 hover:text-gray-700 p-1 focus:outline-none"
            title="Copy link"
          >
            {copied ? <FiCheck className="h-4 w-4 text-green-500" /> : <FiCopy className="h-4 w-4" />}
          </button>
          <a 
            href={link} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 p-1 focus:outline-none"
            title="Open link"
          >
            <FiExternalLink className="h-4 w-4" />
          </a>
          <a 
            href={link} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 p-1 focus:outline-none"
            title="Download"
          >
            <FiDownload className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
