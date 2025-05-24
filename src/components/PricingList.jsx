import { FaCheck, FaTimes, FaCrown, FaStar, FaBolt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const plans = [
  { 
    name: "Origin Qi", 
    price: "25.000",
    icon: <FaBolt className="text-amber-400" size={20} />,
    description: "Perfect for beginners"
  },
  { 
    name: "Half Saint", 
    price: "50.000",
    icon: <FaStar className="text-yellow-300" size={20} />,
    description: "Most popular choice",
    recommended: true 
  },
  { 
    name: "Peak Immortal", 
    price: "100.000",
    icon: <FaCrown className="text-purple-400" size={20} />,
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
    <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-n-8 to-n-9 border border-n-6 rounded-3xl p-8 text-n-1 shadow-2xl">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-color-2 to-color-4">
          Choose Your Plan
        </h2>
        <p className="text-n-3 max-w-2xl mx-auto">
          Select the perfect package for your needs. All plans come with a 30-day 
          satisfaction guarantee.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Feature labels column - now matches plan card styling */}
        <div className="hidden md:block w-full md:w-1/4">
          <div className="bg-n-7 rounded-2xl h-full flex flex-col">
            {/* Header spacer matching plan cards */}
            <div className="h-48 p-6 flex flex-col justify-end border-b border-n-6/50">
              <div className="text-sm font-medium text-n-3 uppercase tracking-wider">
                Features
              </div>
            </div>
            
            {/* Feature items */}
            <div className="flex-1">
              {features.map((feature, i) => (
                <div 
                  key={`feature-${i}`}
                  className="h-16 flex items-center px-6 border-b border-n-6/50 text-n-2 group"
                >
                  <span className="text-sm transition-all group-hover:text-color-2">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full md:w-3/4">
          {plans.map((plan, i) => (
            <div 
              key={`plan-${i}`} 
              className={`flex-1 flex flex-col transition-all hover:scale-[1.02] ${
                plan.recommended ? "transform md:-translate-y-4" : ""
              }`}
            >
              {/* Plan card container */}
              <div className={`flex-1 flex flex-col rounded-2xl overflow-hidden ${
                plan.recommended ? "shadow-2xl ring-2 ring-color-2" : "shadow-lg bg-n-7"
              }`}>
                {/* Plan header */}
                <div className={`h-48 p-6 flex flex-col items-center justify-center ${
                  plan.recommended 
                    ? "bg-gradient-to-br from-color-2/90 to-color-4/80" 
                    : "bg-n-7"
                }`}>
                  {plan.recommended && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-color-2 text-n-8 text-xs font-bold px-4 py-1.5 rounded-full shadow-md z-20 uppercase tracking-wider flex items-center">
                      <FaStar className="mr-1" /> Recommended
                    </div>
                  )}
                  
                  <div className="w-12 h-12 rounded-full bg-n-8/20 flex items-center justify-center mb-4">
                    {plan.icon}
                  </div>
                  <h3 className={`text-xl font-bold text-center ${
                    plan.recommended ? "text-n-8" : "text-color-2"
                  }`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mt-2 text-center ${
                    plan.recommended ? "text-n-8/90" : "text-n-3"
                  }`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price section */}
                <div className={`h-20 flex flex-col items-center justify-center px-4 ${
                  plan.recommended ? "bg-n-8" : "bg-n-7"
                }`}>
                  <div className="text-2xl font-bold text-color-2">
                    Rp {plan.price}
                  </div>
                  <div className="text-xs text-n-3 mt-1">
                    Lifetime Access
                  </div>
                </div>

                {/* CTA button */}
                <div className={`p-4 ${
                  plan.recommended ? "bg-n-8" : "bg-n-7"
                }`}>
                  <button
                    onClick={() => handleBuy(plan.name, plan.price)}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      plan.recommended
                        ? "bg-n-1 text-n-8 hover:bg-n-1/90 shadow-md"
                        : "bg-color-2 text-n-8 hover:bg-color-2/90"
                    }`}
                  >
                    Get Started
                  </button>
                </div>

                {/* Features */}
                <div className={`flex-1 ${
                  plan.recommended ? "bg-n-8" : "bg-n-7"
                }`}>
                  {features.map((feature, j) => (
                    <div 
                      key={`feature-${i}-${j}`}
                      className="h-16 flex items-center justify-center border-t border-n-6/50"
                    >
                      {feature.values[i] ? (
                        <FaCheck className="text-color-4 text-lg" />
                      ) : (
                        <FaTimes className="text-n-5 text-lg" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-n-4">
        Need help choosing? <button className="text-color-2 hover:underline">Contact us</button>
      </div>
    </div>
  );
};

export default PricingList;
