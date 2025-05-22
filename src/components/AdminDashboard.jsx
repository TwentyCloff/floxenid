import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
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
} from "react-icons/fi";
import { FaDiscord } from "react-icons/fa";

const AdminDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(null);
  const [editStatus, setEditStatus] = useState("");

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

    if (searchTerm) {
      results = results.filter(
        (payment) =>
          payment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.transactionDetails.invoiceNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      results = results.filter(
        (payment) => payment.transactionDetails.status === statusFilter
      );
    }

    setFilteredPayments(results);
  }, [searchTerm, statusFilter, payments]);

  const handleStatusUpdate = async (paymentId) => {
    try {
      await updateDoc(doc(db, "transactions", paymentId), {
        "transactionDetails.status": editStatus,
        "systemInfo.updatedAt": new Date(),
      });
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating status: ", error);
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-800 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Payment Transactions</h1>
              <p className="text-gray-400 mt-1">Manage all customer payments</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
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

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredPayments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Plan & Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Payment Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 text-sm text-white">
                      <div className="font-medium">{payment.customer.name}</div>
                      <div className="text-gray-400">{payment.customer.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {payment.transactionDetails.plan}
                      <div className="text-xs text-gray-400">{payment.transactionDetails.invoiceNumber}</div>
                      <div className="text-sm">{formatCurrency(payment.transactionDetails.amount)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {payment.transactionDetails.paymentMethod}
                      <div className="text-gray-400 text-xs">{formatDate(payment.timestamp)}</div>
                    </td>
                    <td className="px-6 py-4">
                      {isEditing === payment.id ? (
                        <select
                          className="bg-gray-800 border border-gray-700 text-white px-2 py-1 rounded-md text-sm"
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                        </select>
                      ) : (
                        getStatusBadge(payment.transactionDetails.status)
                      )}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      {isEditing === payment.id ? (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(payment.id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditing(null)}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setIsEditing(payment.id);
                            setEditStatus(payment.transactionDetails.status);
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md flex items-center"
                        >
                          <FiEdit className="mr-1" /> Edit
                        </button>
                      )}
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
