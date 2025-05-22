import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db, storage } from "../config/firebaseConfig";

const AdminDashboard = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "payments"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPayments(data);
    });
    return () => unsub();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-900 rounded-lg min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard - Payments</h1>

      {payments.length === 0 ? (
        <p className="text-gray-400">No payments yet.</p>
      ) : (
        <table className="min-w-full border-collapse table-auto text-white">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Plan</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Payment Method</th>
              <th className="py-3 px-4 text-left">Timestamp</th>
              <th className="py-3 px-4 text-left">Proof</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-800 transition">
                <td className="py-3 px-4">
                  {p.customerInfo?.name} <br />
                  <small className="text-gray-400">{p.customerInfo?.email}</small>
                </td>
                <td className="py-3 px-4">{p.plan}</td>
                <td className="py-3 px-4">${p.price}</td>
                <td className="py-3 px-4 capitalize">{p.paymentMethod}</td>
                <td className="py-3 px-4">{p.timestamp?.toDate().toLocaleString()}</td>
                <td className="py-3 px-4">
                  {p.proofUrl ? (
                    <a
                      href={p.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      View Proof
                    </a>
                  ) : (
                    "No Proof"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
