import { FaCheck, FaTimes } from "react-icons/fa";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const plans = ["Origin Qi", "Half Saint", "Peak Immortal"];
const prices = ["25.000", "50.000", "100.000"];
const recommendedIndex = 1; // Highlight 'Half Saint'

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

  const handleGetStarted = (planTitle, planPrice) => {
    navigate(`/payment?plan=${encodeURIComponent(planTitle)}&price=${planPrice}`);
  };

  return (
    <div className="w-full overflow-x-auto bg-n-8 border border-n-6 rounded-2xl p-6 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Feature Column */}
        <div className="min-w-[12rem]">
          <h3 className="text-xl font-bold mb-6">Pricing & Features</h3>
          {features.map((feature, i) => (
            <div key={i} className="h-14 flex items-center border-t border-n-6 text-sm text-white/80">
              {feature.label}
            </div>
          ))}
        </div>

        {/* Plan Columns */}
        {plans.map((plan, index) => {
          const isRecommended = index === recommendedIndex;
          return (
            <div
              key={index}
              className={`relative bg-n-7 rounded-xl shadow-md transition duration-300 ease-in-out ${
                isRecommended
                  ? "border-2 border-color-2 bg-opacity-100 scale-[1.03]"
                  : "border border-n-6 hover:shadow-lg"
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-color-2 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  RECOMMENDED
                </div>
              )}

              <div className="text-center px-4 pt-6 pb-2">
                <h4 className="text-lg font-semibold text-color-2">{plan}</h4>
                <div className="text-[1.5rem] font-bold mt-2">Rp {prices[index]}</div>
                <Button
                  className="mt-3 w-full"
                  onClick={() => handleGetStarted(plan, prices[index])}
                >
                  Get Started
                </Button>
              </div>

              <div className="border-t border-n-6 mt-4">
                {features.map((feature, fIndex) => (
                  <div
                    key={fIndex}
                    className="h-14 flex items-center justify-center border-t border-n-6 text-xl"
                  >
                    {feature.values[index] ? (
                      <FaCheck className="text-green-400" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingList;
