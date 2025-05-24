import React, { useState, useEffect } from 'react';
import { db, auth } from '../config/firebaseConfig';
import { doc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, FiShoppingBag, FiClock, FiCheckCircle, 
  FiDownload, FiExternalLink, FiChevronRight, 
  FiCreditCard, FiHome, FiLogOut, FiX,
  FiShield, FiMail, FiSmartphone, FiLoader,
  FiAlertCircle, FiInfo
} from "react-icons/fi";
import { FaDiscord, FaQrcode } from "react-icons/fa";
import { signOut } from 'firebase/auth';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/auth');
          return;
        }

        // User data subscription
        const userDocRef = doc(db, 'users', user.uid);
        const userUnsubscribe = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUserData({ id: doc.id, ...doc.data() });
          } else {
            setError("User data not found");
          }
        });

        // Transactions subscription
        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('customer.userId', '==', user.uid),
          where('transactionDetails.status', 'in', ['pending', 'completed', 'failed'])
        );

        const transactionsUnsubscribe = onSnapshot(transactionsQuery, 
          (snapshot) => {
            const transactionsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setTransactions(transactionsData.sort((a, b) => 
              b.transactionDetails?.timestamp?.toDate() - 
              a.transactionDetails?.timestamp?.toDate()
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1" /> Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <FiClock className="mr-1" /> Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <FiX className="mr-1" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiHome className="mr-1" /> Home
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900"
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-full mr-3">
                      <FiUser className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">{userData?.name || 'User'}</h2>
                      <p className="text-sm opacity-90">{userData?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>
                <nav className="p-4">
                  <ul className="space-y-2">
                    <li>
                      <button className="w-full flex items-center justify-between px-4 py-2 text-left text-blue-600 bg-blue-50 rounded-lg">
                        <span className="flex items-center">
                          <FiShoppingBag className="mr-2" /> My Purchases
                        </span>
                        <FiChevronRight />
                      </button>
                    </li>
                    <li>
                      <button className="w-full flex items-center justify-between px-4 py-2 text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                        <span className="flex items-center">
                          <FiCreditCard className="mr-2" /> Payment Methods
                        </span>
                        <FiChevronRight />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">Account Information</h3>
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-sm text-gray-500">Discord ID</p>
                    <p className="flex items-center text-gray-900">
                      <FaDiscord className="mr-2 text-blue-600" /> 
                      {userData?.discord || 'Not connected'}
                    </p>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-900">{userData?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registered Date</p>
                    <p className="text-gray-900">
                      {userData?.createdAt ? formatDate(userData.createdAt) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">My Purchases</h2>
                </div>

                {transactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
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
                      <div key={transaction.id} className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-medium text-gray-900">
                              {transaction.transactionDetails?.plan || 'Unknown Plan'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Invoice: {transaction.transactionDetails?.invoiceNumber || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {transaction.transactionDetails?.timestamp ? 
                                formatDate(transaction.transactionDetails.timestamp) : 'N/A'}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-xl font-bold text-gray-900 mb-2">
                              Rp{transaction.transactionDetails?.totalAmount?.toLocaleString('id-ID') || '0'}
                            </div>
                            {getStatusBadge(transaction.transactionDetails?.status)}
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Game Details</h4>
                            <p className="text-gray-900">
                              <span className="font-medium">Game:</span> {transaction.customer?.game || 'N/A'}
                            </p>
                            <p className="text-gray-900">
                              <span className="font-medium">Category:</span> {transaction.customer?.category || 'N/A'}
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Method</h4>
                            <p className="text-gray-900">
                              <span className="font-medium">Method:</span> {transaction.transactionDetails?.paymentMethod || 'N/A'}
                            </p>
                            <p className="text-gray-900">
                              <span className="font-medium">Status:</span> {transaction.transactionDetails?.status || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {transaction.transactionDetails?.status === 'completed' && transaction.notes?.adminNotes && (
                          <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-100">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <FiCheckCircle className="h-5 w-5 text-green-500" />
                              </div>
                              <div className="ml-3 flex-1">
                                <h3 className="text-sm font-medium text-green-800">
                                  Your product is ready!
                                </h3>
                                <div className="mt-2">
                                  <p className="text-sm text-green-700">
                                    {transaction.notes.adminNotes}
                                  </p>
                                  {transaction.notes.link && (
                                    <a
                                      href={transaction.notes.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-600 mt-2"
                                    >
                                      Click here to access your product
                                      <FiExternalLink className="ml-1" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {transaction.transactionDetails?.status !== 'completed' && transaction.notes?.adminNotes && (
                          <div className={`mt-6 rounded-lg p-4 border ${
                            transaction.transactionDetails?.status === 'pending' ? 
                              'bg-yellow-50 border-yellow-100' : 
                              'bg-red-50 border-red-100'
                          }`}>
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                {transaction.transactionDetails?.status === 'pending' ? 
                                  <FiClock className="h-5 w-5 text-yellow-500" /> : 
                                  <FiX className="h-5 w-5 text-red-500" />
                                }
                              </div>
                              <div className="ml-3 flex-1">
                                <h3 className={`text-sm font-medium ${
                                  transaction.transactionDetails?.status === 'pending' ? 
                                    'text-yellow-800' : 'text-red-800'
                                }`}>
                                  {transaction.transactionDetails?.status === 'pending' ? 
                                    'Payment in progress' : 'Payment failed'}
                                </h3>
                                <div className="mt-2">
                                  <p className={`text-sm ${
                                    transaction.transactionDetails?.status === 'pending' ? 
                                      'text-yellow-700' : 'text-red-700'
                                  }`}>
                                    {transaction.notes.adminNotes}
                                  </p>
                                </div>
                              </div>
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

export default Dashboard;
