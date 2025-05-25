import { FaCheck, FaTimes, FaCrown, FaStar, FaBolt, FaListUl } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PricingList = () => {
  const navigate = useNavigate();

  const plans = [
    { 
      name: "Origin Qi", 
      price: "0",
      icon: <FaBolt className="text-purple-400" size={20} />,
      description: "Perfect for beginners",
      color: "from-gray-800 to-gray-900",
      recommended: false
    },
    { 
      name: "Half Saint", 
      price: "125000",
      icon: <FaStar className="text-purple-300" size={20} />,
      description: "Most popular choice",
      recommended: true,
      color: "from-purple-800 to-gray-900"
    },
    { 
      name: "Peak Immortal", 
      price: "325000",
      icon: <FaCrown className="text-purple-200" size={20} />,
      description: "Ultimate experience",
      recommended: false,
      color: "from-gray-900 to-purple-900"
    }
  ];

  const features = [
    "Unlimited Script Access",
    "Priority Support",
    "Private Build Request",
    "Multi-Device Login",
    "Early Feature Access",
    "Advanced UI Customization",
    "Encrypted API Key"
  ];

  const featureAvailability = [
    [true, true, true],
    [false, true, true],
    [false, false, true],
    [true, true, true],
    [false, true, true],
    [false, false, true],
    [true, true, true]
  ];

  const handleBuy = (planName, planPrice) => {
    navigate(`/payment?plan=${encodeURIComponent(planName)}&price=${planPrice}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-900 border border-gray-700 rounded-3xl p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
          Choose Your Plan
        </h2>
        <p className="text-gray-400 text-base md:text-lg">
          Select the perfect package for your needs.
        </p>
      </div>

      {/* Mobile Feature Legend */}
      <div className="lg:hidden mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <FaCheck className="text-purple-400" />
            <span className="text-sm text-gray-300">Included</span>
          </div>
          <div className="flex items-center gap-2">
            <FaTimes className="text-gray-600" />
            <span className="text-sm text-gray-300">Not Included</span>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Feature Column - Hidden on mobile */}
        <div className="hidden lg:block">
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden h-full">
            <div className="h-[180px] border-b border-gray-700 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                <FaListUl className="text-purple-400" size={20} />
              </div>
              <h3 className="text-xl font-bold text-purple-400">Features</h3>
              <p className="mt-2 text-sm text-gray-400">All plan comparisons</p>
            </div>
            
            <div className="h-20 border-t border-b border-gray-700 flex flex-col items-center justify-center bg-gray-800/30">
              <div className="text-2xl font-bold text-purple-300">Price</div>
              <div className="text-xs text-gray-400 mt-1">(Lifetime Access)</div>
            </div>
            
            <div>
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="h-[60px] border-b border-gray-700 flex items-center px-6"
                >
                  <span className="text-gray-300 text-sm font-medium whitespace-nowrap">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Columns */}
        {plans.map((plan, planIndex) => (
          <div 
            key={planIndex}
            className="relative"
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider flex items-center z-10 shadow-lg">
                <FaStar className="mr-2 animate-pulse" /> Recommended
              </div>
            )}
            
            <div className={`h-full flex flex-col rounded-xl overflow-hidden border border-gray-700 bg-gradient-to-b ${plan.color} ${plan.recommended ? "ring-2 ring-purple-500" : ""}`}>
              {/* Plan Header */}
              <div className="h-[160px] md:h-[180px] flex flex-col items-center justify-center p-4 md:p-6 text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-700/50 flex items-center justify-center mb-3 md:mb-4">
                  {plan.icon}
                </div>
                <h3 className={`text-lg md:text-xl font-bold ${plan.recommended ? "text-white" : "text-purple-400"}`}>
                  {plan.name}
                </h3>
                <p className={`mt-1 md:mt-2 text-xs md:text-sm ${plan.recommended ? "text-gray-300" : "text-gray-400"}`}>
                  {plan.description}
                </p>
              </div>

              {/* Price Section */}
              <div className="h-16 md:h-20 flex flex-col items-center justify-center border-t border-b border-gray-700 bg-gray-800/30">
                <div className="text-xl md:text-2xl font-bold text-purple-300">
                  Rp {plan.price}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Lifetime Access
                </div>
              </div>

              {/* Features - Mobile version shows feature names */}
              <div>
                {features.map((feature, featureIndex) => (
                  <div 
                    key={featureIndex}
                    className="h-[50px] md:h-[60px] flex items-center justify-between md:justify-center px-4 md:px-0 border-b border-gray-700"
                  >
                    {/* Show feature name on mobile */}
                    <span className="text-xs md:hidden text-gray-300 truncate pr-2">
                      {feature}
                    </span>
                    
                    {featureAvailability[featureIndex][planIndex] ? (
                      <FaCheck className="text-purple-400 text-lg" />
                    ) : (
                      <FaTimes className="text-gray-600 text-lg" />
                    )}
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="relative p-4 md:p-6 overflow-hidden">
                {/* Background shape */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                <button
                  onClick={() => handleBuy(plan.name, plan.price)}
                  className={`relative w-full py-2 md:py-3 rounded-lg font-medium transition-all duration-300 group ${
                    plan.recommended
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-700 hover:bg-gray-600 text-purple-400 hover:text-white"
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${
                        plan.recommended ? "text-white" : "text-purple-400 group-hover:text-white"
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 md:mt-12 text-center text-gray-400 text-sm md:text-base">
        <p>Need help choosing? <span className="text-purple-400 cursor-pointer hover:underline">Contact our team</span></p>
      </div>
    </div>
  );
};

export default PricingList;
