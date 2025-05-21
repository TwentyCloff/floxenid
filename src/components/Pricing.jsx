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

  if (loading) return <div>Loading pricing...</div>;

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Pricing Plans</h2>
      <PricingList data={pricingData} />
    </section>
  );
};

export default Pricing;
