import React, { useState, useEffect } from 'react';
import { db, auth } from '../config/firebaseConfig';
import { doc, collection, query, where, onSnapshot, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, FiShoppingBag, FiClock, FiCheckCircle, 
  FiCopy, FiExternalLink, FiChevronRight, 
  FiCreditCard, FiHome, FiLogOut, FiX,
  FiShield, FiMail, FiSmartphone, FiLoader,
  FiAlertCircle
} from "react-icons/fi";
import { FaDiscord } from "react-icons/fa";
import { signOut, onAuthStateChanged } from 'firebase/auth';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(null);
  const navigate = useNavigate();

  // Check auth state on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

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
            // Create user document if it doesn't exist
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
  }, [navigate]);

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
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
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
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-200">
            <FiCheckCircle className="mr-1" /> Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-900 text-yellow-200">
            <FiClock className="mr-1" /> Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-900 text-red-200">
            <FiX className="mr-1" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-gray-400 hover:text-white"
            >
              <FiHome className="mr-1" /> Home
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-400 hover:text-white"
            >
              <FiLogOut className="mr-1" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
                  <div className="flex items-center">
                    <div className="bg-white/10 p-2 rounded-full mr-3">
                      <FiUser className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">{userData?.name || 'User'}</h2>
                      <p className="text-sm opacity-90">{userData?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="font-medium">Account Information</h3>
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-sm text-gray-400">Discord ID</p>
                    <p className="flex items-center">
                      <FaDiscord className="mr-2 text-blue-400" /> 
                      {userData?.discord || 'Not connected'}
                    </p>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-400">Phone Number</p>
                    <p>
                      {userData?.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-lg font-medium">My Purchases</h2>
                </div>

                {transactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-600"
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
                    <h3 className="mt-2 text-sm font-medium">No purchases yet</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Get started by purchasing one of our products.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Browse Products
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-medium">
                              {transaction.transactionDetails?.plan || 'Unknown Plan'}
                            </h3>
                            <p className="text-sm text-gray-400">
                              Invoice: {transaction.transactionDetails?.invoiceNumber || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              {transaction.transactionDetails?.timestamp ? 
                                formatDate(transaction.transactionDetails.timestamp) : 'N/A'}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-xl font-bold mb-2">
                              Rp{transaction.transactionDetails?.totalAmount?.toLocaleString('id-ID') || '0'}
                            </div>
                            {getStatusBadge(transaction.transactionDetails?.status)}
                          </div>
                        </div>

                        {transaction.transactionDetails?.status === 'completed' && transaction.notes?.link && (
                          <div className="mt-6 bg-gray-700 rounded-lg p-4 border border-gray-600">
                            <div className="flex flex-col space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-green-400">
                                  Download Link Available
                                </h3>
                                <button
                                  onClick={() => copyToClipboard(transaction.notes.link, transaction.id)}
                                  className="flex items-center text-sm text-blue-400 hover:text-blue-300"
                                >
                                  {copiedLink === transaction.id ? (
                                    <>
                                      <FiCheck className="mr-1 text-green-400" /> Copied!
                                    </>
                                  ) : (
                                    <>
                                      <FiCopy className="mr-1" /> Copy Link
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="bg-gray-800 p-3 rounded-md flex items-center justify-between">
                                <p className="text-sm font-mono text-gray-300 truncate">
                                  {transaction.notes.link}
                                </p>
                                <a 
                                  href={transaction.notes.link} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 text-blue-400 hover:text-blue-300"
                                >
                                  <FiExternalLink />
                                </a>
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

      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Qarvo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
