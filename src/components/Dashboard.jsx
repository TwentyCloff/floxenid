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
  FiDollarSign, FiGift, FiDownload
} from "react-icons/fi";
import { FaDiscord, FaWeixin, FaQq } from "react-icons/fa";
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1" /> Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FiClock className="mr-1" /> Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FiX className="mr-1" /> Failed
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
            <h3 className="text-lg font-medium mb-4 text-gray-800">Basic Resources</h3>
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
            <h3 className="text-lg font-medium mb-4 text-gray-800">Premium Resources</h3>
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
            <h3 className="text-lg font-medium mb-4 text-gray-800">Rich Resources</h3>
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
            <FiGift className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800">Select a tier to view content</h3>
            <p className="text-gray-500 mt-2">Choose from Basic, Premium, or Rich to access exclusive resources</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-red-600">VIP会员中心</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-red-600 text-sm"
              >
                <FiHome className="mr-1" /> 首页
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-600 text-sm"
              >
                <FiLogOut className="mr-1" /> 退出
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* User Profile Card */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
                <div className="p-6 bg-gradient-to-r from-red-600 to-red-700">
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-full mr-3">
                      <FiUser className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-white">{userData?.name || '用户'}</h2>
                      <p className="text-sm text-white opacity-90">{userData?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">会员等级</span>
                    <span className="font-medium">
                      {hasAccessToTier('rich') ? '高级VIP' : 
                       hasAccessToTier('premium') ? 'VIP会员' : 
                       hasAccessToTier('basic') ? '普通会员' : '非会员'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
                <div className="p-4 border-b">
                  <h3 className="font-medium text-gray-900">账户信息</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Discord ID</p>
                    <p className="flex items-center text-gray-800">
                      <FaDiscord className="mr-2 text-blue-500" /> 
                      {userData?.discord || '未连接'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">手机号码</p>
                    <p className="text-gray-800">
                      {userData?.phone || '未提供'}
                    </p>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button className="p-2 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100">
                      <FaWeixin className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100">
                      <FaQq className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Navigation */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
                <div className="p-4 border-b">
                  <h3 className="font-medium text-gray-900">专属内容</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  <button 
                    onClick={() => handleMenuClick('basic')}
                    className={`w-full text-left p-4 flex items-center justify-between ${activeMenu === 'basic' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FiStar className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>基础资源</span>
                    </div>
                    {!hasAccessToTier('basic') ? (
                      <FiLock className="text-gray-400" />
                    ) : (
                      <FiChevronRight className="text-gray-400" />
                    )}
                  </button>
                  
                  <button 
                    onClick={() => handleMenuClick('premium')}
                    className={`w-full text-left p-4 flex items-center justify-between ${activeMenu === 'premium' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-full mr-3">
                        <FiAward className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>高级资源</span>
                    </div>
                    {!hasAccessToTier('premium') ? (
                      <FiLock className="text-gray-400" />
                    ) : (
                      <FiChevronRight className="text-gray-400" />
                    )}
                  </button>
                  
                  <button 
                    onClick={() => handleMenuClick('rich')}
                    className={`w-full text-left p-4 flex items-center justify-between ${activeMenu === 'rich' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    <div className="flex items-center">
                      <div className="bg-yellow-100 p-2 rounded-full mr-3">
                        <FiAward className="w-4 h-4 text-yellow-600" />
                      </div>
                      <span>尊享资源</span>
                    </div>
                    {!hasAccessToTier('rich') ? (
                      <FiLock className="text-gray-400" />
                    ) : (
                      <FiChevronRight className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-4 space-y-6">
              {/* Content Section */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    {activeMenu ? 
                      `${activeMenu === 'basic' ? '基础资源' : activeMenu === 'premium' ? '高级资源' : '尊享资源'}` : 
                      '专属内容'}
                  </h2>
                  {activeMenu && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      activeMenu === 'basic' ? 'bg-blue-100 text-blue-800' :
                      activeMenu === 'premium' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activeMenu === 'basic' ? '基础版' : activeMenu === 'premium' ? '高级版' : '尊享版'}
                    </span>
                  )}
                </div>

                {renderMenuContent()}
              </div>

              {/* Purchases Section */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-medium text-gray-900">我的购买记录</h2>
                </div>

                {transactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">暂无购买记录</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      您还没有购买任何产品
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        浏览产品
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-medium text-gray-900">
                              {transaction.transactionDetails?.plan || '未知套餐'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              订单号: {transaction.transactionDetails?.invoiceNumber || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {transaction.transactionDetails?.timestamp ? 
                                formatDate(transaction.transactionDetails.timestamp) : 'N/A'}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-xl font-bold mb-2 text-gray-900">
                              ¥{transaction.transactionDetails?.totalAmount?.toLocaleString('zh-CN') || '0'}
                            </div>
                            {getStatusBadge(transaction.transactionDetails?.status)}
                          </div>
                        </div>

                        {transaction.transactionDetails?.status === 'completed' && transaction.notes?.link && (
                          <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex flex-col space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-green-600">
                                  下载链接可用
                                </h3>
                                <button
                                  onClick={() => copyToClipboard(transaction.notes.link, transaction.id)}
                                  className="flex items-center text-sm text-blue-600 hover:text-blue-500"
                                >
                                  {copiedLink === transaction.id ? (
                                    <>
                                      <FiCheck className="mr-1 text-green-500" /> 已复制!
                                    </>
                                  ) : (
                                    <>
                                      <FiCopy className="mr-1" /> 复制链接
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="bg-white p-3 rounded-md border border-gray-200 flex items-center justify-between">
                                <p className="text-sm font-mono text-gray-700 truncate">
                                  {transaction.notes.link}
                                </p>
                                <a 
                                  href={transaction.notes.link} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 text-blue-600 hover:text-blue-500"
                                >
                                  <FiExternalLink />
                                </a>
                              </div>
                              <p className="text-xs text-gray-500">
                                链接7天后失效
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">访问受限</h3>
              <button 
                onClick={() => setShowPremiumAlert(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <FiLock className="w-12 h-12 text-yellow-500" />
              </div>
              <p className="text-center text-gray-700">
                您需要购买{activeMenu ? `${activeMenu === 'basic' ? '基础版' : activeMenu === 'premium' ? '高级版' : '尊享版'}套餐` : '此套餐'}才能访问此内容
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowPremiumAlert(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowPremiumAlert(false);
                  navigate('/');
                }}
                className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 text-white"
              >
                浏览套餐
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} 版权所有
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">服务条款</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">隐私政策</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">联系我们</a>
            </div>
          </div>
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
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-red-300 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
          <div className="flex items-center text-sm text-gray-500">
            <FiDownload className="mr-1" /> 下载资源
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="text-blue-600 hover:text-blue-500 p-1"
            title="复制链接"
          >
            {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
          </button>
          <a 
            href={link} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-500 p-1"
            title="打开链接"
          >
            <FiExternalLink />
          </a>
        </div>
      </div>
      <div className="mt-3 bg-gray-50 p-2 rounded text-sm font-mono text-gray-700 truncate">
        {link}
      </div>
    </div>
  );
};

export default Dashboard;
