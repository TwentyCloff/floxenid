import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
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
} from "react-icons/fi";
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
      results = results.filter(
        (payment) =>
          payment.customer.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.customer.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.transactionDetails.invoiceNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter(
        (payment) => payment.transactionDetails.status === statusFilter
      );
    }

    setFilteredPayments(results);
  }, [searchTerm, statusFilter, payments]);

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
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      <div className="flex flex-col">
                        <span className="font-semibold">{payment.transactionDetails.plan}</span>
                        <span className="text-xs mt-1">
                          Invoice:{" "}
                          <span className="font-mono">{payment.transactionDetails.invoiceNumber}</span>
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
                      {isEditing === payment.id ? (
                        <div className="flex space-x-2">
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
                        </div>
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
