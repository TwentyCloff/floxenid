import { useLocation } from "react-router-dom"; 
import { useState } from "react";
import Button from "./Button";

const paymentMethods = [
  { id: "gopay", name: "Gopay", icon: "🟢" },
  { id: "dana", name: "Dana", icon: "🔵" },
  { id: "qris", name: "QRIS", icon: "⬛" },
  { id: "card", name: "Credit/Debit Card", icon: "💳" },
];

const PaymentPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get("plan");
  const price = searchParams.get("price");

  const [selectedMethod, setSelectedMethod] = useState("card");

  return (
    <div className="min-h-screen flex items-center justify-center bg-n-8 p-4">
      <div className="bg-n-7 p-8 rounded-[2rem] max-w-md w-full shadow-lg">
        <h2 className="h2 mb-6 text-center">Complete Your Payment</h2>
        <div className="mb-6 text-center">
          <p className="body-2 text-n-4">
            Plan: <span className="text-n-1 font-semibold">{plan}</span>
          </p>
          <p className="body-2 text-n-4">
            Amount: <span className="text-n-1 font-semibold">${price}</span>
          </p>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="body-1 mb-3 font-semibold text-n-1">Select Payment Method</h3>
          <div className="flex gap-4 justify-center">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  selectedMethod === method.id
                    ? "border-blue-600 bg-blue-100 text-blue-700"
                    : "border-n-5 bg-n-6 text-n-3 hover:bg-n-5"
                }`}
                type="button"
              >
                <span className="text-xl">{method.icon}</span>
                <span>{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conditional Form */}
        {selectedMethod === "card" ? (
          <form className="space-y-4">
            <div>
              <label className="block body-2 mb-2 text-n-1">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full p-3 bg-n-6 border border-n-5 rounded-lg body-2 text-n-1"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block body-2 mb-2 text-n-1">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full p-3 bg-n-6 border border-n-5 rounded-lg body-2 text-n-1"
                />
              </div>
              <div className="flex-1">
                <label className="block body-2 mb-2 text-n-1">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full p-3 bg-n-6 border border-n-5 rounded-lg body-2 text-n-1"
                />
              </div>
            </div>

            <Button className="w-full mt-6" white>
              Pay ${price}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <p className="body-2 text-n-4 mb-2">
              Please scan the QR code with your {paymentMethods.find(m => m.id === selectedMethod)?.name} app to complete the payment.
            </p>
            <div className="w-48 h-48 bg-n-6 rounded-lg flex items-center justify-center text-n-3 font-bold text-xl select-none">
              QR CODE
            </div>
            <Button className="w-full mt-6" white>
              I have completed payment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
