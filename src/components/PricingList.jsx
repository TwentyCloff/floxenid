import { check } from "../assets";
import { pricing } from "../constants";
import Button from "./Button";
import { Link } from "react-router-dom";

const PricingList = () => {
  const handleGetStarted = (e, id) => {
    if (!id) {
      console.log("ID kosong");
      e.preventDefault();
      alert("Project details are not available");
      return;
    }

    if (id === "1") {
      // Validasi akses premium
      const isLoggedIn = localStorage.getItem("user"); // Ganti sesuai sistem login kamu
      if (!isLoggedIn) {
        e.preventDefault();
        alert("Hanya pengguna premium yang bisa mengakses project ini.");
        return;
      }
    }
  };

  return (
    <div className="flex gap-[1rem] max-lg:flex-wrap">
      {pricing.map((plan, i) => (
        <div
          key={plan.id || i}
          className="w-[19rem] max-lg:w-full h-full px-6 bg-n-8 border border-n-6 rounded-[2rem] lg:w-auto even:py-14 odd:py-8 odd:my-4 [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3"
        >
          <h4 className="h4 mb-4">{plan.title}</h4>
          <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
            {plan.description}
          </p>

          <div className="flex items-center h-[5.5rem] mb-6">
            {plan.price !== null && plan.price !== undefined && (
              <>
                <div className="h-3">$</div>
                <div className="text-[5.5rem] leading-none font-bold">
                  {plan.price}
                </div>
              </>
            )}
          </div>

          {plan.price !== null && plan.price !== undefined ? (
            plan.id ? (
              <Link
                to={`/project/${plan.id}`}
                onClick={(e) => handleGetStarted(e, plan.id)}
                className={`flex justify-center items-center px-8 py-4 rounded-full border font-code text-sm font-bold uppercase tracking-wider transition-colors mb-6 w-full ${
                  plan.premium
                    ? "bg-n-1 text-n-8 hover:bg-n-1/90"
                    : "bg-transparent text-n-1 border-n-1 hover:bg-n-1/10"
                }`}
              >
                Get started
              </Link>
            ) : (
              <span className="block text-center text-sm text-n-1/50 italic mb-6">
                Details Not Available
              </span>
            )
          ) : (
            <Button
              className="w-full mb-6"
              href="mailto:info@example.com"
              white
            >
              Contact us
            </Button>
          )}

          <ul>
            {plan.features.map((feature, j) => (
              <li
                key={`plan-${i}-feature-${j}`}
                className="flex items-start py-5 border-t border-n-6"
              >
                <img
                  src={check}
                  alt="Check"
                  width={24}
                  height={24}
                  className="pointer-events-none select-none"
                />
                <p className="body-2 ml-4">{feature}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PricingList;
