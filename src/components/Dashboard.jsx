import { useEffect, useState } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { FaCopy, FaEdit, FaTrash, FaSearch, FaSave, FaTimes, FaUser, FaShoppingCart, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userPlan, setUserPlan] = useState('Free');
  const [activeTab, setActiveTab] = useState('profile');
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingPlan, setEditingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState('');
  const [editUserId, setEditUserId] = useState('');
  const navigate = useNavigate();

  const availableKeys = [
    'flx-1001', 'flx-1002', 'flx-1003', 'flx-1004', 'flx-1005',
    'flx-1006', 'flx-1007', 'flx-1008', 'flx-1009'
  ];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Check if admin or owner
        if (currentUser.email === 'floxenstaff@gmail.com') {
          setUserPlan('Admin');
        } else if (currentUser.email === 'floxenowner@gmail.com') {
          setUserPlan('Owner');
        } else {
          // Set up real-time listener for user document
          const userDocRef = doc(db, 'users', currentUser.uid);
          const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              setUserPlan(doc.data().plan || 'Free');
            }
          });
          return () => unsubscribeUser();
        }
      } else {
        navigate('/signin');
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    // Set up real-time listener for purchases
    let purchasesQuery;
    if (selectedUser) {
      purchasesQuery = query(collection(db, 'purchases'), where('userId', '==', selectedUser));
    } else {
      purchasesQuery = query(collection(db, 'purchases'), where('userId', '==', user.uid));
    }

    const unsubscribePurchases = onSnapshot(purchasesQuery, (querySnapshot) => {
      const purchases = [];
      querySnapshot.forEach((doc) => {
        purchases.push({ id: doc.id, ...doc.data() });
      });
      setPurchaseHistory(purchases);
      setLoading(false);
    });

    // Set up real-time listener for all users (admin/owner only)
    if (userPlan === 'Admin' || userPlan === 'Owner') {
      const usersQuery = query(collection(db, 'users'));
      const unsubscribeUsers = onSnapshot(usersQuery, (querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        setAllUsers(users);
      });
      return () => {
        unsubscribePurchases();
        unsubscribeUsers();
      };
    }

    return () => unsubscribePurchases();
  }, [user, userPlan, selectedUser]);

  const loadUserPurchaseHistory = (userId) => {
    setSelectedUser(userId);
    setActiveTab('purchases');
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const updatePurchaseStatus = async (purchaseId, newStatus) => {
    try {
      await updateDoc(doc(db, 'purchases', purchaseId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deletePurchase = async (purchaseId) => {
    try {
      await updateDoc(doc(db, 'purchases', purchaseId), {
        status: 'deleted',
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  const copyDownloadLink = (item) => {
    setSelectedItem(item);
    setShowKeyModal(true);
  };

  const handleKeySubmit = (key) => {
    navigator.clipboard.writeText(`https://download.example.com/${selectedItem.id}?key=${key}`);
    setShowKeyModal(false);
    alert('Download link copied to clipboard!');
  };

  const filteredUsers = allUsers.filter(user => 
    user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEditPlan = (userId, currentPlan) => {
    setEditUserId(userId);
    setNewPlan(currentPlan);
    setEditingPlan(true);
  };

  const cancelEditPlan = () => {
    setEditingPlan(false);
    setEditUserId('');
    setNewPlan('');
  };

  const savePlan = async () => {
    if (!editUserId || !newPlan) return;
    
    try {
      await updateDoc(doc(db, 'users', editUserId), {
        plan: newPlan,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state immediately
      setAllUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === editUserId ? { ...u, plan: newPlan } : u
        )
      );
      
      // If editing current user's plan, update their plan state
      if (user?.uid === editUserId) {
        setUserPlan(newPlan);
      }
      
      cancelEditPlan();
    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[4.75rem] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Admin/Owner view
  if (userPlan === 'Admin' || userPlan === 'Owner') {
    return (
      <div className="min-h-screen pt-[4.75rem] lg:pt-[5.25rem] bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Dashboard</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'users' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FaUser className="mr-2" />
                User Management
              </button>
              <button
                onClick={() => {
                  setActiveTab('purchases');
                  setSelectedUser(null);
                }}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'purchases' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FaShoppingCart className="mr-2" />
                All Purchases
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FaHistory className="mr-2" />
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'users' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>
              
              <div className="mb-6 relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.displayName || 'No name'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {editingPlan && editUserId === user.id ? (
                            <select
                              value={newPlan}
                              onChange={(e) => setNewPlan(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                              <option value="Free">Free</option>
                              <option value="Premium">Premium</option>
                              <option value="Ultra">Ultra</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.plan === 'Premium' ? 'bg-purple-100 text-purple-800' :
                              user.plan === 'Ultra' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.plan || 'Free'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {editingPlan && editUserId === user.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={savePlan}
                                className="text-green-600 hover:text-green-800 p-1"
                                title="Save"
                              >
                                <FaSave />
                              </button>
                              <button
                                onClick={cancelEditPlan}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Cancel"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => startEditPlan(user.id, user.plan || 'Free')}
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="Edit Plan"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => loadUserPurchaseHistory(user.id)}
                                className="text-green-600 hover:text-green-800 text-xs px-2 py-1 bg-green-50 rounded"
                                title="View Purchases"
                              >
                                View Purchases
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                {selectedUser ? `Purchases for User: ${allUsers.find(u => u.id === selectedUser)?.displayName || selectedUser}` : 'All Purchases'}
              </h1>
              
              {purchaseHistory.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {purchaseHistory.map((purchase) => (
                        <tr key={purchase.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{purchase.id.substring(0, 6)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.itemName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0
                            }).format(purchase.price || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <select
                              value={purchase.status}
                              onChange={(e) => updatePurchaseStatus(purchase.id, e.target.value)}
                              className={`px-2 py-1 rounded text-xs ${
                                purchase.status === 'done' ? 'bg-green-100 text-green-800' :
                                purchase.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              <option value="done">✅ Done</option>
                              <option value="pending">⏳ Pending</option>
                              <option value="failed">❌ Failed</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => copyDownloadLink(purchase)}
                              className="text-blue-600 hover:text-blue-800 mr-3"
                              title="Copy download link"
                            >
                              <FaCopy />
                            </button>
                            <button
                              onClick={() => deletePurchase(purchase.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">No purchases found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Key Modal */}
        {showKeyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Enter Download Key</h3>
              <p className="mb-4 text-gray-600">Please select a key to copy the download link:</p>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                {availableKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => handleKeySubmit(key)}
                    className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    {key}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setShowKeyModal(false)}
                className="w-full py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Regular user view
  return (
    <div className="min-h-screen pt-[4.75rem] lg:pt-[5.25rem] bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Dashboard</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FaUser className="mr-2" />
              Profile Overview
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'purchases' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FaShoppingCart className="mr-2" />
              Purchase History
            </button>
            
            {(userPlan === 'Premium' || userPlan === 'Ultra') && (
              <button
                onClick={() => setActiveTab('membership')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'membership' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FaHistory className="mr-2" />
                Membership Access
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Overview</h1>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">Name:</span>
                <span className="text-gray-900">{user.displayName || 'Not set'}</span>
              </div>
              
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">Email:</span>
                <span className="text-gray-900">{user.email}</span>
              </div>
              
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">User ID:</span>
                <span className="text-gray-900 font-mono text-sm">{user.uid}</span>
              </div>
              
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">Joined:</span>
                <span className="text-gray-900">
                  {new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="flex items-center">
                <span className="w-32 font-medium text-gray-700">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  userPlan === 'Premium' ? 'bg-purple-100 text-purple-800' :
                  userPlan === 'Ultra' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {userPlan} Plan
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Purchase History</h1>
            
            {purchaseHistory.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchaseHistory.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{purchase.id.substring(0, 6)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.itemName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                          }).format(purchase.price || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {purchase.status === 'done' ? '✅ Done' : 
                           purchase.status === 'pending' ? '⏳ Pending' : 
                           '❌ Failed'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => copyDownloadLink(purchase)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Copy download link"
                          >
                            <FaCopy />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">You haven't made any purchases yet.</p>
                <button
                  onClick={() => navigate('/pricing')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  View Pricing Plans
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'membership' && (userPlan === 'Premium' || userPlan === 'Ultra') && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Membership Access</h1>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Floxen ID Premium Access</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => navigator.clipboard.writeText('flx-premium-access-code-123')}
                        className="text-blue-600 hover:text-blue-800"
                        title="Copy access code"
                      >
                        <FaCopy />
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Gold+ Exclusive Access</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => navigator.clipboard.writeText('gold-plus-access-code-456')}
                        className="text-blue-600 hover:text-blue-800"
                        title="Copy access code"
                      >
                        <FaCopy />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
