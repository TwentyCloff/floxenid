import React, { useEffect, useState } from "react";
import PricingList from "./PricingList";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const Pricing = () => {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projects = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPricingData(projects);
      } catch (error) {
        console.error("Error fetching pricing data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  if (loading) return <div className="text-center py-20 text-white">Loading pricing...</div>;

  return (
    <section className="relative py-20 px-6 max-w-7xl mx-auto text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] opacity-80 -z-10" />
      <div className="absolute inset-0 backdrop-blur-[4px] -z-10" />
      
      <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        Pricing Plans
      </h2>

      <PricingList data={pricingData} />
    </section>
  );
};

export default Pricing;

