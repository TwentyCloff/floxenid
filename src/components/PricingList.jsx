import { FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const plans = [
  { name: "Origin Qi", price: "25.000", tagline: "Basic Access" },
  { name: "Half Saint", price: "50.000", tagline: "Popular Choice", recommended: true },
  { name: "Peak Immortal", price: "100.000", tagline: "Premium Experience" }
];

const features = [
  { label: "Unlimited Script Access", values: [true, true, true] },
  { label: "Priority Support", values: [false, true, true] },
  { label: "Private Build Request", values: [false, false, true] },
  { label: "Multi-Device Login", values: [true, true, true] },
  { label: "Early Feature Access", values: [false, true, true] },
  { label: "Advanced UI Customization", values: [false, false, true] },
  { label: "Encrypted API Key", values: [true, true, true] },
];

const PricingList = () => {
  const navigate = useNavigate();

  const handleBuy = (planName, planPrice) => {
    navigate(`/payment?plan=${encodeURIComponent(planName)}&price=${planPrice}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-n-8 border border-n-6 rounded-2xl p-6 text-n-1">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Features Column */}
        <div className="min-w-[14rem] lg:sticky lg:top-0 lg:h-fit">
          <div className="pb-6">
            <h3 className="text-2xl font-bold mb-2">Pricing & Features</h3>
            <p className="text-n-3 text-sm">Choose the plan that fits your needs</p>
          </div>
          
          <div className="space-y-1">
            {features.map((feature, i) => (
              <div
                key={i}
                className="min-h-[3.5rem] flex items-center border-t border-n-6/50 text-n-2 px-4 py-3"
              >
                <span className="leading-snug">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Columns */}
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl transition-all p-6 flex flex-col ${
              plan.recommended
                ? "border-2 border-color-2 bg-n-7 scale-[1.02] shadow-lg"
                : "border border-n-6 bg-n-7 hover:bg-n-6/50"
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-color-2 text-n-8 text-xs font-bold px-4 py-1.5 rounded-full shadow-md z-10 uppercase tracking-wide">
                Recommended
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-6">
              <h4 className="text-xl font-bold text-color-2">{plan.name}</h4>
              <p className="text-n-3 text-sm mt-1">{plan.tagline}</p>
              <p className="text-[1.75rem] font-bold mt-3">
                Rp <span className="text-3xl">{plan.price}</span>
              </p>
              <p className="text-n-4 text-xs mt-1">per month</p>
              
              <button
                onClick={() => handleBuy(plan.name, plan.price)}
                className={`mt-6 w-full text-center font-bold py-3 rounded-xl cursor-pointer transition-all ${
                  plan.recommended
                    ? "bg-color-2 text-n-8 hover:bg-color-2/90"
                    : "bg-n-6 text-n-1 hover:bg-n-5"
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-n-6/50 flex-grow flex flex-col">
              {features.map((feature, fIndex) => (
                <div
                  key={fIndex}
                  className="min-h-[3.5rem] flex items-center justify-center border-t border-n-6/50"
                >
                  {feature.values[index] ? (
                    <FaCheck className="text-color-4 text-lg" />
                  ) : (
                    <FaTimes className="text-color-3 text-lg opacity-70" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingList;
