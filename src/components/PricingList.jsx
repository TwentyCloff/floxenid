import { FaCheck, FaTimes } from "react-icons/fa";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const plans = ["Origin Qi", "Half Saint", "Peak Immortal"];
const prices = ["0", "125000", "325.000"];
const recommendedIndex = 1;

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

  const handleBuy = (planTitle, planPrice) => {
    navigate(`/payment?plan=${encodeURIComponent(planTitle)}&price=${planPrice}`);
  };

  return (
    <div className="w-full overflow-x-auto bg-n-8 border border-n-6 rounded-2xl p-6 text-n-1">
      <div className="grid grid-cols-[16rem_repeat(3,minmax(0,1fr))] gap-4 max-lg:grid-cols-1">
        {/* Header Row */}
        <div />
        {plans.map((plan, index) => {
          const isRecommended = index === recommendedIndex;
          return (
            <div
              key={`header-${index}`}
              className={`relative rounded-2xl transition-all p-4 pt-8 text-center border ${
                isRecommended
                  ? "border-color-2 bg-n-7 scale-[1.03] shadow-lg"
                  : "border-n-6 bg-n-7 hover:bg-n-6"
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-color-2 text-n-6 text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                  RECOMMENDED
                </div>
              )}
              <h4 className="text-lg font-semibold text-color-2">{plan}</h4>
              <p className="text-2xl font-bold mt-2 mb-4">Rp {prices[index]}</p>
              <button
                onClick={() => handleBuy(plan, prices[index])}
                className="w-full rounded-xl bg-color-2 text-n-7 font-bold py-2 mt-2 hover:brightness-110 transition-all"
              >
                Buy Now
              </button>
            </div>
          );
        })}

        {/* Features Rows */}
        {features.map((feature, fIndex) => {
          return (
            <React.Fragment key={`feature-${fIndex}`}>
              {/* Feature Name */}
              <div className="flex items-center h-14 border-t border-n-6 pl-2 text-sm text-n-2 font-medium">
                {feature.label}
              </div>

              {/* Feature values for each plan */}
              {feature.values.map((hasFeature, pIndex) => (
                <div
                  key={`feature-${fIndex}-plan-${pIndex}`}
                  className="h-14 border-t border-n-6 flex items-center justify-center text-xl"
                >
                  {hasFeature ? (
                    <FaCheck className="text-color-4" />
                  ) : (
                    <FaTimes className="text-color-3" />
                  )}
                </div>
              ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PricingList;
