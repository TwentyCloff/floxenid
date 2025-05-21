import { useLocation } from "react-router-dom";
import { useState } from "react";
import Button from "./Button";

const paymentMethods = [
  { id: "gopay", name: "Gopay" },
  { id: "dana", name: "Dana" },
  { id: "qris", name: "QRIS" },
  { id: "card", name: "Credit Card" },
];

const PaymentPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get("plan") || "Pro";
  const price = searchParams.get("price") || "29.99";

  const [selectedMethod, setSelectedMethod] = useState("card");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-n-8 p-4">
      <div className="bg-n-7 p-8 rounded-[2rem] max-w-lg w-full shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Secure Payment</h2>

        {/* Plan Info */}
        <div className="text-center mb-8">
          <p className="text-n-4 text-sm">Selected Plan:</p>
          <p className="text-white text-xl font-semibold">{plan}</p>
          <p className="text-n-4 text-sm mt-1">Total:</p>
          <p className="text-white text-2xl font-bold">${price}</p>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <h3 className="text-white text-sm mb-2">Choose a payment method:</h3>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center justify-center px-4 py-3 rounded-xl border font-medium transition-colors duration-300 ${
                  selectedMethod === method.id
                    ? "border-blue-500 bg-blue-900/30 text-white"
                    : "border-n-5 text-n-2 hover:border-blue-400"
                }`}
              >
                {method.name}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        {selectedMethod === "card" ? (
          <form className="space-y-5">
            <div>
              <label className="block text-sm text-white mb-1">
                Card Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 bg-n-6 border border-n-5 rounded-lg text-white placeholder:text-n-4"
              />
              <p className="text-xs text-n-4 mt-1">16-digit number, numbers only</p>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-white mb-1">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value.replace(/[^0-9/]/g, "").slice(0, 5))}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 bg-n-6 border border-n-5 rounded-lg text-white placeholder:text-n-4"
                />
                <p className="text-xs text-n-4 mt-1">Example: 08/26</p>
              </div>

              <div className="flex-1">
                <label className="block text-sm text-white mb-1">
                  CVV <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="123"
                  className="w-full px-4 py-3 bg-n-6 border border-n-5 rounded-lg text-white placeholder:text-n-4"
                />
                <p className="text-xs text-n-4 mt-1">3 or 4-digit security code</p>
              </div>
            </div>

            <Button className="w-full mt-4" white>
              Pay ${price}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center text-center space-y-5 mt-6">
            <p className="text-white text-sm">
              Scan the code using your <strong>{selectedMethod.toUpperCase()}</strong> app to proceed.
            </p>
            <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center text-black font-semibold text-lg">
              QR {selectedMethod.toUpperCase()}
            </div>
            <Button className="w-full mt-4" white>
              I've Completed the Payment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
