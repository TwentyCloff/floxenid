import { FaCheck, FaTimes, FaCrown, FaStar, FaBolt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const plans = [
  { 
    name: "Origin Qi", 
    price: "25.000",
    icon: <FaBolt className="text-purple-400" size={18} />,
    description: "Perfect for beginners"
  },
  { 
    name: "Half Saint", 
    price: "50.000",
    icon: <FaStar className="text-purple-300" size={18} />,
    description: "Most popular choice",
    recommended: true 
  },
  { 
    name: "Peak Immortal", 
    price: "100.000",
    icon: <FaCrown className="text-purple-200" size={18} />,
    description: "Ultimate experience"
  }
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

  const handleBuy = (planTitle, planPrice) => {
    navigate(`/payment?plan=${encodeURIComponent(planTitle)}&price=${planPrice}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-gray-900 to-purple-900 border border-gray-700 rounded-3xl p-8 text-gray-100 shadow-2xl">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-500">
          Choose Your Plan
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Select the perfect package for your needs. All plans come with a 30-day 
          satisfaction guarantee.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Feature labels - now perfectly aligned */}
        <div className="hidden lg:block w-full lg:w-[30%]">
          <div className="bg-gray-800 rounded-2xl h-full flex flex-col border border-gray-700">
            {/* Header spacer matching exactly with plan cards */}
            <div className="h-[184px] p-6 flex items-end border-b border-gray-700">
              <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Plan Features
              </div>
            </div>
            
            {/* Feature items with perfect vertical alignment */}
            <div className="flex-1">
              {features.map((feature, i) => (
                <div 
                  key={`feature-${i}`}
                  className="h-16 flex items-center px-6 border-b border-gray-700 text-gray-300 text-sm"
                >
                  {feature.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plans container */}
        <div className="w-full lg:w-[70%] grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div 
              key={`plan-${i}`} 
              className={`flex flex-col h-full ${plan.recommended ? "lg:-mt-4" : ""}`}
            >
              <div className={`flex-1 flex flex-col rounded-2xl overflow-hidden border border-gray-700 ${
                plan.recommended 
                  ? "bg-gradient-to-b from-gray-800 to-purple-900 shadow-xl ring-2 ring-purple-500" 
                  : "bg-gray-800 shadow-lg"
              }`}>
                {/* Plan header */}
                <div className={`h-[184px] p-6 flex flex-col items-center justify-center ${
                  plan.recommended ? "pt-10" : ""
                }`}>
                  {plan.recommended && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider flex items-center">
                      <FaStar className="mr-1.5" /> Recommended
                    </div>
                  )}
                  
                  <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                    {plan.icon}
                  </div>
                  <h3 className={`text-xl font-bold text-center ${
                    plan.recommended ? "text-white" : "text-purple-400"
                  }`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mt-2 text-center ${
                    plan.recommended ? "text-gray-300" : "text-gray-400"
                  }`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price section */}
                <div className="h-20 flex flex-col items-center justify-center px-4 border-t border-b border-gray-700">
                  <div className="text-2xl font-bold text-purple-300">
                    Rp {plan.price}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Lifetime Access
                  </div>
                </div>

                {/* Features - perfectly aligned with feature labels */}
                <div className="flex-1">
                  {features.map((feature, j) => (
                    <div 
                      key={`feature-${i}-${j}`}
                      className="h-16 flex items-center justify-center border-b border-gray-700"
                    >
                      {feature.values[i] ? (
                        <FaCheck className="text-purple-400 text-lg" />
                      ) : (
                        <FaTimes className="text-gray-600 text-lg" />
                      )}
                    </div>
                  ))}
                </div>

                {/* CTA button */}
                <div className="p-4">
                  <button
                    onClick={() => handleBuy(plan.name, plan.price)}
                    className={`w-full py-3 rounded-lg font-bold transition-all ${
                      plan.recommended
                        ? "bg-purple-500 text-white hover:bg-purple-600 shadow-md"
                        : "bg-gray-700 text-purple-300 hover:bg-gray-600"
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-400">
        Need help choosing? <button className="text-purple-400 hover:underline">Contact us</button>
      </div>
    </div>
  );
};

export default PricingList;
