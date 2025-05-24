import { check } from "../assets";
import { pricing } from "../constants";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const PricingList = () => {
  const navigate = useNavigate();

  const handleGetStarted = (planTitle, planPrice) => {
    navigate(`/payment?plan=${encodeURIComponent(planTitle)}&price=${planPrice}`);
  };

  // Custom features for each tier
  const features = [
    {
      name: "AI Chatbot Access",
      basic: true,
      premium: true,
      rich: true
    },
    {
      name: "Personalized Recommendations",
      basic: true,
      premium: true,
      rich: true
    },
    {
      name: "Basic Support",
      basic: true,
      premium: true,
      rich: true
    },
    {
      name: "Priority Support",
      basic: false,
      premium: true,
      rich: true
    },
    {
      name: "Analytics Dashboard",
      basic: false,
      premium: true,
      rich: true
    },
    {
      name: "Advanced Query Understanding",
      basic: false,
      premium: true,
      rich: true
    },
    {
      name: "Beta Feature Access",
      basic: false,
      premium: false,
      rich: true
    },
    {
      name: "Custom Avatar",
      basic: false,
      premium: false,
      rich: true
    },
    {
      name: "Early Updates",
      basic: false,
      premium: false,
      rich: true
    }
  ];

  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row gap-8 bg-n-8 rounded-[2rem] p-8 border border-n-6">
        {/* Features Column */}
        <div className="lg:w-1/2">
          <h2 className="h2 mb-8">Pricing & Features</h2>
          <ul className="space-y-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center justify-between py-4 border-b border-n-6">
                <span className="body-1 text-n-1">{feature.name}</span>
                <div className="flex gap-8">
                  <span className="w-6 text-center">
                    {feature.basic ? (
                      <img src={check} alt="Included" width={20} height={20} />
                    ) : (
                      <span className="text-n-4">✗</span>
                    )}
                  </span>
                  <span className="w-6 text-center">
                    {feature.premium ? (
                      <img src={check} alt="Included" width={20} height={20} />
                    ) : (
                      <span className="text-n-4">✗</span>
                    )}
                  </span>
                  <span className="w-6 text-center">
                    {feature.rich ? (
                      <img src={check} alt="Included" width={20} height={20} />
                    ) : (
                      <span className="text-n-4">✗</span>
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Packages Column */}
        <div className="lg:w-1/2 flex flex-col lg:flex-row gap-4">
          {pricing.map((plan, i) => (
            <div
              key={plan.id}
              className={`
                flex-1 px-6 py-8 bg-n-7 border rounded-[1.5rem] 
                ${i === 1 ? "border-color-1" : "border-n-6"}
                transition duration-300 hover:bg-n-6
                ${i === 1 ? "hover:border-color-1" : "hover:border-n-5"}
                flex flex-col
              `}
            >
              <div className="flex flex-col h-full">
                <h4 className={`h4 mb-2 ${i === 0 ? "text-color-2" : i === 1 ? "text-color-1" : "text-color-3"}`}>
                  {plan.title}
                </h4>
                <p className="body-2 text-n-1/50 mb-6">{plan.description}</p>

                <div className="flex items-end h-[4rem] mb-6">
                  {plan.price !== "0" ? (
                    <div className="flex items-end gap-1">
                      <span className="text-[1.25rem] font-bold leading-tight">Rp</span>
                      <span className="text-[2.5rem] font-bold leading-tight min-w-[6ch] text-left">
                        {plan.price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[2.5rem] font-bold leading-tight">Free</span>
                  )}
                </div>

                <Button
                  className={`w-full mb-8 ${i === 1 ? "bg-color-1 text-n-8" : "bg-n-6"}`}
                  onClick={() => handleGetStarted(plan.title, plan.price)}
                  white={i === 1}
                >
                  {plan.price === "0" ? "Get Started" : "Subscribe"}
                </Button>

                <div className="mt-auto">
                  <h5 className="body-1 mb-4">Top features:</h5>
                  <ul className="space-y-3">
                    {plan.features.slice(0, 3).map((feature, j) => (
                      <li key={j} className="flex items-start">
                        <img src={check} alt="Check" width={16} height={16} className="mt-1" />
                        <p className="body-2 ml-2">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package labels above the columns */}
      <div className="hidden lg:flex absolute top-0 right-[25%] w-[50%] justify-between px-8">
        <div className="w-[30%] text-center body-2 text-n-1/50">Basic</div>
        <div className="w-[30%] text-center body-2 text-n-1/50">Premium</div>
        <div className="w-[30%] text-center body-2 text-n-1/50">Rich</div>
      </div>
    </div>
  );
};

export default PricingList;
