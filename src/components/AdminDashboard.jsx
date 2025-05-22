import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { FiEdit, FiSearch, FiClock, FiCheckCircle, FiXCircle, FiDollarSign, FiUser, FiMail, FiPhone, FiCreditCard } from "react-icons/fi";
import { FaDiscord } from "react-icons/fa";

const AdminDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("systemInfo.createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data(),
        timestamp: doc.data().systemInfo?.createdAt?.toDate() 
      }));
      setPayments(data);
      setFilteredPayments(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let results = payments;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(payment => 
        payment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionDetails.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter(payment => 
        payment.transactionDetails.status === statusFilter
      );
    }
    
    setFilteredPayments(results);
  }, [searchTerm, statusFilter, payments]);

  const handleStatusUpdate = async (paymentId) => {
    if (!editStatus) return;
    
    setIsUpdating(true);
    try {
      const paymentRef = doc(db, "transactions", paymentId);
      await updateDoc(paymentRef, {
        "transactionDetails.status": editStatus,
        "systemInfo.updatedAt": new Date()
      });
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating status: ", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400">
            <FiClock className="mr-1" /> Pending
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
            <FiCheckCircle className="mr-1" /> Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400">
            <FiXCircle className="mr-1" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-500/20 text-gray-400">
            Unknown
          </span>
        );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        {/* Dashboard Header */}
        <div className="px-6 py-5 border-b border-gray-800 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Payment Transactions</h1>
              <p className="text-gray-400 mt-1">Manage all customer payments and subscriptions</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="overflow-x-auto">
          {filteredPayments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Plan & Invoice
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Payment Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                          <FiUser size={18} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{payment.customer.name}</div>
                          <div className="text-sm text-gray-400 flex items-center mt-1">
                            <FiMail className="mr-1.5" size={14} />
                            {payment.customer.email}
                          </div>
                          <div className="text-sm text-gray-400 flex items-center mt-1">
                            <FiPhone className="mr-1.5" size={14} />
                            {payment.customer.phone}
                          </div>
                          <div className="text-sm text-gray-400 flex items-center mt-1">
                            <FaDiscord className="mr-1.5" size={14} />
                            {payment.customer.discord}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{payment.transactionDetails.plan}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        {formatCurrency(payment.transactionDetails.amount)}
                      </div>
                      <div className="text-xs text-gray-500 mt-2 font-mono">
                        {payment.transactionDetails.invoiceNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mr-3">
                          {payment.transactionDetails.paymentMethod === "qris" ? (
                            <FiCreditCard size={16} />
                          ) : (
                            <FiDollarSign size={16} />
                          )}
                        </div>
                        <div>
                          <div className="text-sm text-white capitalize">
                            {payment.transactionDetails.paymentMethod}
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatDate(payment.timestamp)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === payment.id ? (
                        <select
                          className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          autoFocus
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                        </select>
                      ) : (
                        getStatusBadge(payment.transactionDetails.status)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isEditing === payment.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(payment.id)}
                            disabled={isUpdating}
                            className={`${isUpdating ? 'opacity-70 cursor-not-allowed' : ''} text-green-400 hover:text-green-300 bg-green-500/10 px-3 py-1 rounded-md text-sm flex items-center`}
                          >
                            {isUpdating ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                              </>
                            ) : 'Save'}
                          </button>
                          <button
                            onClick={() => setIsEditing(null)}
                            disabled={isUpdating}
                            className={`${isUpdating ? 'opacity-70 cursor-not-allowed' : ''} text-gray-400 hover:text-gray-300 bg-gray-500/10 px-3 py-1 rounded-md text-sm`}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setIsEditing(payment.id);
                            setEditStatus(payment.transactionDetails.status);
                          }}
                          className="text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded-md text-sm flex items-center"
                        >
                          <FiEdit className="mr-1" size={14} /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Dashboard Footer */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/50 text-right">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredPayments.length}</span> of{' '}
            <span className="font-medium">{payments.length}</span> transactions
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
