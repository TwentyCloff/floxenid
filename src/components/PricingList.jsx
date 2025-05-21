import { check } from "../assets";
import { pricing } from "../contss";
import Button from "./Button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Loader2, AlertCircle } from "lucide-react";

const PricingList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(projectsData);
      } catch (err) {
        setError("Failed to load projects");
        console.error("Firebase error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleGetStarted = (e, id) => {
    if (!id) {
      e.preventDefault();
      setError("Project details not available");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Merge pricing plans with actual projects
  const mergedPlans = pricing.map(plan => {
    const project = projects.find(p => p.id === plan.id);
    return {
      ...plan,
      ...project,
      available: !!project // Mark if project exists in Firebase
    };
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="relative">
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="flex gap-[1rem] max-lg:flex-wrap">
        {mergedPlans.map((plan, i) => (
          <div
            key={plan.id || i}
            className="w-[19rem] max-lg:w-full h-full px-6 bg-n-8 border border-n-6 rounded-[2rem] lg:w-auto even:py-14 odd:py-8 odd:my-4 [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3"
          >
            <h4 className="h4 mb-4">{plan.title}</h4>
            <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
              {plan.description}
            </p>

            <div className="flex items-center h-[5.5rem] mb-6">
              {plan.price !== null && (
                <>
                  <div className="h-3">$</div>
                  <div className="text-[5.5rem] leading-none font-bold">
                    {plan.price}
                  </div>
                </>
              )}
            </div>

            {plan.price !== null ? (
              plan.available ? (
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
                <div className="text-center mb-6 text-sm text-n-1/50">
                  Coming soon
                </div>
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
              {plan.features?.map((feature, j) => (
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
    </div>
  );
};

export default PricingList;
