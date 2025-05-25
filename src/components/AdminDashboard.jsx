import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import {
  FiEdit,
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiUser,
  FiMail,
  FiPhone,
  FiCreditCard,
  FiCalendar,
  FiTrash2,
} from "react-icons/fi";
import { FaDiscord } from "react-icons/fa";

const AdminDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const [isEditing, setIsEditing] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "transactions"),
      orderBy("systemInfo.createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().systemInfo?.createdAt?.toDate(),
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
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (payment) =>
          payment.customer.name.toLowerCase().includes(term) ||
          payment.customer.email.toLowerCase().includes(term) ||
          (payment.customer.phone && payment.customer.phone.toLowerCase().includes(term)) ||
          payment.transactionDetails.invoiceNumber.toLowerCase().includes(term) ||
          (payment.discordId && payment.discordId.toLowerCase().includes(term)) ||
          (payment.paymentMethod && payment.paymentMethod.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter(
        (payment) => payment.transactionDetails.status === statusFilter
      );
    }

    // Apply payment method filter
    if (paymentMethodFilter !== "all") {
      results = results.filter(
        (payment) => payment.paymentMethod === paymentMethodFilter
      );
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      results = results.filter((payment) => {
        const paymentDate = new Date(payment.timestamp);
        return (
          paymentDate.getFullYear() === filterDate.getFullYear() &&
          paymentDate.getMonth() === filterDate.getMonth() &&
          paymentDate.getDate() === filterDate.getDate()
        );
      });
    }

    // Apply amount range filter
    if (amountRange.min || amountRange.max) {
      const minAmount = amountRange.min ? parseInt(amountRange.min) : 0;
      const maxAmount = amountRange.max ? parseInt(amountRange.max) : Infinity;
      
      results = results.filter(
        (payment) =>
          payment.transactionDetails.amount >= minAmount &&
          payment.transactionDetails.amount <= maxAmount
      );
    }

    setFilteredPayments(results);
  }, [searchTerm, statusFilter, paymentMethodFilter, dateFilter, amountRange, payments]);

  const handleStatusUpdate = async (paymentId) => {
    if (!editStatus) {
      alert("Please select a valid status before saving.");
      return;
    }

    setIsUpdating(true);
    try {
      const paymentRef = doc(db, "transactions", paymentId);
      await updateDoc(paymentRef, {
        "transactionDetails.status": editStatus,
        "systemInfo.updatedAt": serverTimestamp(),
      });
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating status: ", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    setIsUpdating(true);
    try {
      await deleteDoc(doc(db, "transactions", paymentId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting payment: ", error);
      alert("Failed to delete payment. Please try again.");
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
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Extract unique payment methods for filter dropdown
  const getUniquePaymentMethods = () => {
    const methods = new Set();
    payments.forEach((payment) => {
      if (payment.paymentMethod) {
        methods.add(payment.paymentMethod);
      }
    });
    return Array.from(methods);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPaymentMethodFilter("all");
    setDateFilter("");
    setAmountRange({ min: "", max: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePayment(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
                disabled={isUpdating}
              >
                {isUpdating ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        {/* Dashboard Header */}
        <div className="px-6 py-5 border-b border-gray-800 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Payment Transactions
              </h1>
              <p className="text-gray-400 mt-1">
                Manage all customer payments and subscriptions
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, INV, phone, Discord..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={resetFilters}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Status</label>
              <select
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Payment Method</label>
              <select
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
              >
                <option value="all">All Methods</option>
                {getUniquePaymentMethods().map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-500" />
                </div>
                <input
                  type="date"
                  className="pl-10 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Min Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-500" />
                </div>
                <input
                  type="number"
                  placeholder="Min"
                  className="pl-10 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  value={amountRange.min}
                  onChange={(e) => setAmountRange({...amountRange, min: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Max Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-500" />
                </div>
                <input
                  type="number"
                  placeholder="Max"
                  className="pl-10 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  value={amountRange.max}
                  onChange={(e) => setAmountRange({...amountRange, max: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="overflow-x-auto">
          {filteredPayments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No transactions found</p>
              <button
                onClick={resetFilters}
                className="mt-2 text-blue-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Plan & Invoice
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Payment Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col text-white">
                        <span className="font-semibold text-lg flex items-center gap-2">
                          <FiUser />
                          {payment.customer.name}
                        </span>
                        <a
                          href={`mailto:${payment.customer.email}`}
                          className="text-blue-400 hover:underline flex items-center gap-2 text-sm mt-0.5"
                        >
                          <FiMail />
                          {payment.customer.email}
                        </a>
                        <span className="flex items-center gap-2 text-sm mt-0.5">
                          <FiPhone />
                          {payment.customer.phone || "-"}
                        </span>
                        {payment.discordId && (
                          <span className="flex items-center gap-2 text-sm mt-0.5">
                            <FaDiscord />
                            {payment.discordId}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      <div className="flex flex-col">
                        <span className="font-semibold">{payment.transactionDetails.plan}</span>
                        <span className="text-xs mt-1">
                          Invoice:{" "}
                          <span className="font-mono bg-gray-800 px-2 py-1 rounded">
                            {payment.transactionDetails.invoiceNumber}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {formatCurrency(payment.transactionDetails.amount)}
                        </span>
                        <span className="text-xs mt-1 flex items-center gap-1">
                          <FiCreditCard /> {payment.paymentMethod || "-"}
                        </span>
                        <span className="text-xs mt-1 flex items-center gap-1">
                          <FiClock /> Created: {formatDate(payment.timestamp)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing === payment.id ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isUpdating}
                        >
                          <option value="">Select status</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                        </select>
                      ) : (
                        getStatusBadge(payment.transactionDetails.status)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          {isEditing === payment.id ? (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(payment.id)}
                                disabled={isUpdating}
                                className={`inline-flex items-center px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition ${
                                  isUpdating ? "opacity-60 cursor-not-allowed" : ""
                                }`}
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setIsEditing(null);
                                  setEditStatus("");
                                }}
                                disabled={isUpdating}
                                className="inline-flex items-center px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setIsEditing(payment.id);
                                setEditStatus(payment.transactionDetails.status || "");
                              }}
                              className="inline-flex items-center px-3 py-1 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white transition"
                            >
                              <FiEdit className="mr-1" />
                              Edit
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => setShowDeleteConfirm(payment.id)}
                          className="inline-flex items-center px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white transition"
                        >
                          <FiTrash2 className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
