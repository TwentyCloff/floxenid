import { useLocation } from "react-router-dom";
import Button from "./Button";

const PaymentPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get('plan');
  const price = searchParams.get('price');

  return (
    <div className="min-h-screen flex items-center justify-center bg-n-8 p-4">
      <div className="bg-n-7 p-8 rounded-[2rem] max-w-md w-full">
        <h2 className="h2 mb-6">Payment</h2>
        <div className="mb-6">
          <p className="body-2 text-n-4">Plan: <span className="text-n-1">{plan}</span></p>
          <p className="body-2 text-n-4">Amount: <span className="text-n-1">${price}</span></p>
        </div>
        
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
      </div>
    </div>
  );
};

export default PaymentPage;
