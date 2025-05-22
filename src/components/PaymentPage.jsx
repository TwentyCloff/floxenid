import React, { useState } from "react";
import { FiCreditCard, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { FaPaypal } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { db, storage } from "../config/firebaseConfig";
import {
  collection,
  addDoc,
  Timestamp
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

const paymentPlanData = {
  Basic: { price: 10, features: ["Feature A", "Feature B"] },
  Premium: { price: 25, features: ["Feature A", "Feature B", "Feature C"] },
};

const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
  >
    {children}
  </button>
);

const PaymentPage = ({ plan = "Basic" }) => {
  const [stage, setStage] = useState("info");
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Customer info
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    discord: "",
    phone: "",
  });

  // Payment method & card data
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [showCvv, setShowCvv] = useState(false);

  // Proof upload
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const price = paymentPlanData[plan]?.price || 0;

  // Helper untuk update customer info
  const updateCustomerInfo = (field, val) => {
    setCustomerInfo(prev => ({ ...prev, [field]: val }));
  };

  // Format kartu dan expiry sederhana
  const handleCardNumberChange = e => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16);
    val = val.match(/.{1,4}/g)?.join(" ") || "";
    setCardDetails(prev => ({ ...prev, number: val }));
  };
  const handleExpiryChange = e => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
    setCardDetails(prev => ({ ...prev, expiry: val }));
  };

  // Simulasi proses payment (tanpa API payment asli)
  const processPayment = () =>
    new Promise(resolve => setTimeout(resolve, 1500));

  // Submit info customer dan lanjut ke pembayaran
  const confirmCustomerInfo = () => {
    const { name, email, discord, phone } = customerInfo;
    if (!name || !email) {
      alert("Please enter your name and email");
      return;
    }
    setStage("payment");
  };

  // Submit pembayaran (simulasi), lanjut upload bukti
  const confirmPayment = async () => {
    await processPayment();
    setStage("upload");
  };

  // Upload bukti transfer ke Firebase Storage dan simpan data transaksi ke Firestore
  const confirmWithProof = async () => {
    if (!proofFile) {
      alert("Please select a proof of payment file");
      return;
    }
    setUploading(true);
    try {
      // Upload file ke storage dengan path unik timestamp + nama file
      const storageRef = ref(storage, `paymentProofs/${Date.now()}_${proofFile.name}`);
      await uploadBytes(storageRef, proofFile);

      // Dapatkan URL file
      const url = await getDownloadURL(storageRef);

      // Simpan data pembayaran ke Firestore
      await addDoc(collection(db, "payments"), {
        customerInfo,
        plan,
        price,
        paymentMethod,
        cardDetails: paymentMethod === "card" ? cardDetails : null,
        proofUrl: url,
        timestamp: Timestamp.now(),
      });

      setPaymentComplete(true);

      // Optional redirect setelah 5 detik
      setTimeout(() => {
        // Redirect ke halaman lain atau reset
        setStage("info");
        setPaymentComplete(false);
        setCustomerInfo({ name: "", email: "", discord: "", phone: "" });
        setPaymentMethod("card");
        setCardDetails({ number: "", name: "", expiry: "", cvv: "" });
        setProofFile(null);
      }, 5000);
    } catch (e) {
      alert("Upload failed: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  // Render form info customer
  const renderCustomerInfoForm = () => (
    <form
      onSubmit={e => {
        e.preventDefault();
        confirmCustomerInfo();
      }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-white mb-6">Customer Information</h2>

      <input
        type="text"
        placeholder="Full Name"
        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
        value={customerInfo.name}
        onChange={e => updateCustomerInfo("name", e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
        value={customerInfo.email}
        onChange={e => updateCustomerInfo("email", e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Discord Username"
        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
        value={customerInfo.discord}
        onChange={e => updateCustomerInfo("discord", e.target.value)}
      />
      <input
        type="tel"
        placeholder="Phone Number"
        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
        value={customerInfo.phone}
        onChange={e => updateCustomerInfo("phone", e.target.value)}
      />

      <Button type="submit" className="w-full mt-6">
        Confirm
      </Button>
    </form>
  );

  // Render form pembayaran
  const renderPaymentForm = () => (
    <form
      onSubmit={async e => {
        e.preventDefault();
        if (paymentMethod === "card") {
          const { number, name, expiry, cvv } = cardDetails;
          if (!number || !name || !expiry || !cvv) {
            alert("Please complete all card details");
            return;
          }
        }
        await confirmPayment();
      }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-white mb-6">Payment Details</h2>

      <div>
        <label className="block text-gray-300 mb-1 font-medium">Select Payment Method</label>
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${
              paymentMethod === "card" ? "border-blue-500 bg-blue-600" : "border-gray-600"
            } text-white transition`}
          >
            <FiCreditCard />
            Credit Card
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("paypal")}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${
              paymentMethod === "paypal" ? "border-blue-500 bg-blue-600" : "border-gray-600"
            } text-white transition`}
          >
            <FaPaypal />
            PayPal
          </button>
        </div>
      </div>

      {paymentMethod === "card" && (
        <>
          <div>
            <label className="block text-gray-300 mb-1 font-medium">Card Number</label>
            <input
              type="text"
              value={cardDetails.number}
              onChange={handleCardNumberChange}
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1 font-medium">Cardholder Name</label>
            <input
              type="text"
              value={cardDetails.name}
              onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-300 mb-1 font-medium">Expiry (MM/YY)</label>
              <input
                type="text"
                value={cardDetails.expiry}
                onChange={handleExpiryChange}
                maxLength={5}
                placeholder="MM/YY"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                required
              />
            </div>

            <div className="flex-1 relative">
              <label className="block text-gray-300 mb-1 font-medium">CVV</label>
              <input
                type={showCvv ? "text" : "password"}
                value={cardDetails.cvv}
                onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                maxLength={4}
                placeholder="123"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
                onClick={() => setShowCvv(!showCvv)}
                tabIndex={-1}
              >
                {showCvv ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
        </>
      )}

      {paymentMethod === "paypal" && (
        <p className="text-gray-300 italic">You will be redirected to PayPal after clicking confirm.</p>
      )}

      <Button type="submit" className="w-full mt-6">
        Pay ${price}
      </Button>
    </form>
  );

  // Upload bukti transfer (gambar)
  const renderProofUpload = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white mb-6">Upload Proof of Payment</h2>
      <input
        type="file"
        accept="image/*"
        onChange={e => setProofFile(e.target.files[0])}
        className="text-white"
      />
      <Button
        onClick={confirmWithProof}
        disabled={uploading}
        className="w-full mt-6"
      >
        {uploading ? "Uploading..." : "Submit Proof"}
      </Button>
      {proofFile && (
        <p className="text-gray-300 mt-2">Selected file: {proofFile.name}</p>
      )}
    </div>
  );

  // Success screen
  const renderSuccess = () => (
    <div className="flex flex-col items-center gap-4">
      <FiCheck className="text-green-400 text-6xl" />
      <h2 className="text-3xl font-semibold text-white">Payment Successful!</h2>
      <p className="text-gray-300 text-center">
        Thank you for your payment. You will be redirected shortly.
      </p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-xl mx-auto p-8 bg-gray-900 rounded-lg shadow-lg min-h-[600px]"
    >
      <h1 className="text-4xl font-bold text-white mb-8">Payment for {plan} Plan</h1>

      {stage === "info" && renderCustomerInfoForm()}
      {stage === "payment" && renderPaymentForm()}
      {stage === "upload" && renderProofUpload()}
      {paymentComplete && renderSuccess()}
    </motion.div>
  );
};

export default PaymentPage;
