import { FaCheck, FaTimes } from "react-icons/fa";
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

  const handleBuy = (planTitle, planPrice) => {
    navigate(`/payment?plan=${encodeURIComponent(planTitle)}&price=${planPrice}`);
  };

  return (
    <div className="w-full overflow-x-auto bg-n-8 border border-n-6 rounded-2xl p-6 text-n-1">
      {/* Grid container with 4 columns: 1 for feature labels, 3 for plans */}
      <div className="grid grid-cols-4 gap-4">
        {/* Header Titles */}
        <div></div>
        {plans.map((plan, i) => (
          <div
            key={`header-${i}`}
            className="text-center font-bold text-lg text-color-2 pb-4"
          >
            {plan}
          </div>
        ))}

        {/* Price Row */}
        <div className="font-semibold text-sm text-n-2 self-center">Price</div>
        {prices.map((price, i) => (
          <div
            key={`price-${i}`}
            className="text-center font-bold text-xl text-color-2"
          >
            Rp {price}
          </div>
        ))}

        {/* Buy Now Button Row */}
        <div></div>
        {plans.map((plan, i) => (
          <div key={`btn-${i}`} className="text-center">
            <div
              onClick={() => handleBuy(plan, prices[i])}
              className="inline-block bg-color-2 text-n-7 font-bold py-2 px-6 rounded-xl cursor-pointer hover:brightness-110 transition-all select-none"
            >
              Buy Now
            </div>
          </div>
        ))}

        {/* Divider */}
        <div className="col-span-4 border-t border-n-6 my-4"></div>

        {/* Features + Checks */}
        {features.map((feature, i) => (
          <React.Fragment key={`feature-${i}`}>
            {/* Feature label */}
            <div className="flex items-center h-14 border-t border-n-6 px-4 text-sm text-n-2">
              {feature.label}
            </div>
            {/* Feature values per plan */}
            {feature.values.map((val, j) => (
              <div
                key={`val-${i}-${j}`}
                className="flex items-center justify-center h-14 border-t border-n-6 text-xl"
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
