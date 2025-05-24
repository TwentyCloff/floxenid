import { FaCheck, FaTimes } from "react-icons/fa";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const plans = ["Origin Qi", "Half Saint", "Peak Immortal"];
const prices = ["25.000", "50.000", "100.000"];
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

  const handleGetStarted = (planTitle, planPrice) => {
    navigate(`/payment?plan=${encodeURIComponent(planTitle)}&price=${planPrice}`);
  };

  return (
    <div className="w-full overflow-x-auto bg-n-8 border border-n-6 rounded-2xl p-6 text-n-1">
      <div className="grid grid-cols-[1fr_repeat(3,minmax(10rem,1fr))]">
        {/* Header Row */}
        <div className="h-14" /> {/* Empty top-left cell */}
        {plans.map((plan, index) => {
          const isRecommended = index === recommendedIndex;
          return (
            <div
              key={index}
              className={`relative flex flex-col items-center justify-between border-l border-n-6 p-4 ${
                isRecommended
                  ? "bg-n-7 scale-[1.03] border-2 border-color-2 shadow-lg z-10"
                  : "bg-n-7 hover:bg-n-6"
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-color-2 text-n-6 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  RECOMMENDED
                </div>
              )}
              <h4 className="text-lg font-semibold text-color-2">{plan}</h4>
              <p className="text-2xl font-bold mt-1 mb-2">Rp {prices[index]}</p>
              <Button
                className="w-full rounded-xl bg-color-2 text-n-7 hover:bg-color-1 transition"
                onClick={() => handleGetStarted(plan, prices[index])}
              >
                Buy Now
              </Button>
            </div>
          );
        })}

        {/* Feature Rows */}
        {features.map((feature, rowIdx) => (
          <React.Fragment key={rowIdx}>
            {/* Feature label */}
            <div className="h-14 flex items-center px-2 border-t border-n-6 text-sm text-n-2">
              {feature.label}
            </div>

            {/* Each plan's check/X */}
            {feature.values.map((val, colIdx) => (
              <div
                key={colIdx}
                className="h-14 flex items-center justify-center border-t border-l border-n-6 text-xl"
              >
                {val ? (
                  <FaCheck className="text-color-4" />
                ) : (
                  <FaTimes className="text-color-3" />
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PricingList;
