import { check } from "../assets";
import { pricing } from "../constants";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const PricingList = () => {
  const navigate = useNavigate();

  const handleGetStarted = (planTitle, planPrice) => {
    navigate(`/payment?plan=${encodeURIComponent(planTitle)}&price=${planPrice}`);
  };

  return (
    <div className="flex gap-[1rem] max-lg:flex-wrap">
      {pricing.map((plan, i) => {
        const isPremium = plan.premium;

        return (
          <div
            key={plan.id}
            className={`w-[19rem] max-lg:w-full h-full px-6 border border-n-6 rounded-[2rem] lg:w-auto even:py-14 odd:py-8 odd:my-4 transition duration-300
              ${isPremium
                ? "bg-n-8 hover:bg-n-6 hover:border-color-1"
                : "bg-n-8 hover:bg-n-6 hover:border-color-1"}`}
          >
            <h4 className="h4 mb-4 [&:first-child]:text-color-2 [&:nth-child(2)]:text-color-1 [&:last-child]:text-color-3">
              {plan.title}
            </h4>

            <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
              {plan.description}
            </p>

            <div className="flex items-end h-[5.5rem] mb-6">
              {plan.price && (
                <div className="flex items-end gap-1">
                  <span className="text-[2rem] font-bold leading-tight">$</span>
                  <span className="text-[4rem] font-bold leading-tight min-w-[6ch] text-left">
                    {plan.price}
                  </span>
                </div>
              )}
            </div>

            <Button
              className="w-full mb-6"
              onClick={plan.price ? () => handleGetStarted(plan.title, plan.price) : null}
              white={!isPremium}
            >
              Get started
            </Button>

            <ul>
              {plan.features.map((feature, j) => (
                <li
                  key={`plan-${i}-feature-${j}`}
                  className="flex items-start py-5 border-t border-n-6"
                >
                  <img src={check} alt="Check" width={20} height={20} />
                  <p className="body-2 ml-4">{feature}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default PricingList;
