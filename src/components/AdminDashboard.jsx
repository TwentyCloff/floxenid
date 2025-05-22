import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { FiEdit, FiCheck, FiX, FiLoader } from "react-icons/fi";

const AdminDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("systemInfo.createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().systemInfo?.createdAt?.toDate(),
        updatedAt: doc.data().systemInfo?.updatedAt?.toDate()
      }));
      setPayments(data);
    });
    return () => unsub();
  }, []);

  const handleEditClick = (payment) => {
    setEditingId(payment.id);
    setNewStatus(payment.transactionDetails.status);
  };

  const handleStatusUpdate = async (paymentId) => {
    try {
      const paymentRef = doc(db, "transactions", paymentId);
      await updateDoc(paymentRef, {
        "transactionDetails.status": newStatus,
        "systemInfo.updatedAt": serverTimestamp()
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "failed":
        return "bg-red-500/20 text-red-400";
      case "refunded":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-900 rounded-lg min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-white">Admin Dashboard</h1>
        <div className="text-gray-400">
          Total Transactions: {payments.length}
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FiLoader className="w-12 h-12 text-gray-400 animate-spin mb-4" />
          <p className="text-gray-400">Loading transactions...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse table-auto">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Customer</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Plan</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Amount</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Method</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Date</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Status</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition">
                  <td className="py-4 px-4">
                    <div className="font-medium text-white">{payment.customer.name}</div>
                    <div className="text-sm text-gray-400">{payment.customer.email}</div>
                    <div className="text-xs text-gray-500 mt-1">{payment.customer.phone}</div>
                  </td>
                  <td className="py-4 px-4 text-white">{payment.transactionDetails.plan}</td>
                  <td className="py-4 px-4 text-white">Rp{payment.transactionDetails.amount.toLocaleString()}</td>
                  <td className="py-4 px-4 text-white capitalize">{payment.transactionDetails.paymentMethod}</td>
                  <td className="py-4 px-4 text-gray-400 text-sm">
                    {payment.createdAt?.toLocaleDateString()}
                    <br />
                    {payment.createdAt?.toLocaleTimeString()}
                  </td>
                  <td className="py-4 px-4">
                    {editingId === payment.id ? (
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.transactionDetails.status)}`}>
                        {payment.transactionDetails.status}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {editingId === payment.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(payment.id)}
                          className="p-1 text-green-400 hover:text-green-300"
                        >
                          <FiCheck size={18} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(payment)}
                        className="p-1 text-blue-400 hover:text-blue-300"
                      >
                        <FiEdit size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
