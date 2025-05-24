import { FaCheck, FaTimes, FaCrown, FaStar, FaBolt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const plans = [
  { 
    name: "Origin Qi", 
    price: "25.000",
    icon: <FaBolt className="text-purple-400" size={20} />,
    description: "Perfect for beginners",
    color: "from-gray-800 to-gray-900"
  },
  { 
    name: "Half Saint", 
    price: "50.000",
    icon: <FaStar className="text-purple-300" size={20} />,
    description: "Most popular choice",
    recommended: true,
    color: "from-purple-800 to-gray-900"
  },
  { 
    name: "Peak Immortal", 
    price: "100.000",
    icon: <FaCrown className="text-purple-200" size={20} />,
    description: "Ultimate experience",
    color: "from-gray-900 to-purple-900"
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

  // Calculate exact heights for perfect alignment
  const headerHeight = "h-[180px]";
  const featureHeight = "h-[60px]";

  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-900 border border-gray-700 rounded-3xl p-8 text-gray-100">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
          Choose Your Plan
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Select the perfect package for your needs.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Feature Column - Perfectly Aligned */}
        <div className="hidden lg:block w-[250px]">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            {/* Feature Header */}
            <div className={`${headerHeight} flex items-end p-6 border-b border-gray-700`}>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Feature Comparison
              </h3>
            </div>
            
            {/* Feature List */}
            <div>
              {features.map((feature, i) => (
                <div 
                  key={`feature-${i}`}
                  className={`${featureHeight} flex items-center px-6 border-b border-gray-700 text-gray-300 text-sm`}
                >
                  {feature.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plans - Perfectly Symmetrical */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div 
              key={`plan-${i}`} 
              className={`flex flex-col ${plan.recommended ? "lg:-mt-2" : ""}`}
            >
              <div className={`flex-1 flex flex-col rounded-xl overflow-hidden border border-gray-700 
                bg-gradient-to-b ${plan.color} ${plan.recommended ? "ring-2 ring-purple-500" : ""}`}>
                
                {/* Plan Header */}
                <div className={`${headerHeight} p-6 flex flex-col items-center justify-center relative`}>
                  {plan.recommended && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider flex items-center shadow-lg">
                      <FaStar className="mr-2" /> Recommended
                    </div>
                  )}
                  
                  <div className="w-14 h-14 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                    {plan.icon}
                  </div>
                  <h3 className={`text-xl font-bold ${plan.recommended ? "text-white" : "text-purple-400"}`}>
                    {plan.name}
                  </h3>
                  <p className={`mt-2 text-center ${plan.recommended ? "text-gray-300" : "text-gray-400"}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price Section */}
                <div className="h-20 flex flex-col items-center justify-center border-t border-b border-gray-700">
                  <div className="text-2xl font-bold text-purple-300">
                    Rp {plan.price}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Lifetime Access
                  </div>
                </div>

                {/* Features - Pixel Perfect Alignment */}
                <div>
                  {features.map((feature, j) => (
                    <div 
                      key={`feature-${i}-${j}`}
                      className={`${featureHeight} flex items-center justify-center border-b border-gray-700`}
                    >
                      {feature.values[i] ? (
                        <FaCheck className="text-purple-400 text-lg" />
                      ) : (
                        <FaTimes className="text-gray-600 text-lg" />
                      )}
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="p-6">
                  <button
                    onClick={() => handleBuy(plan.name, plan.price)}
                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                      plan.recommended
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-gray-700 text-purple-400 hover:bg-gray-600"
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

      {/* Footer */}
      <div className="mt-12 text-center text-gray-400">
        <p>Need help choosing? <span className="text-purple-400 cursor-pointer hover:underline">Contact our team</span></p>
      </div>
    </div>
  );
};

export default PricingList;
