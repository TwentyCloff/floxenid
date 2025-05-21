import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BsArrowUpRight } from "react-icons/bs";
import { smallSphere, stars } from "../assets"; // import assets
import { LeftLine, RightLine } from "./design/Pricing"; // import design components
import Heading from "./Heading"; // import Heading component
import PricingList from "./PricingList"; // import PricingList component
import Section from "./Section"; // import Section component
import { firebaseApp } from "../config/firebase"; // firebase config
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default function Pricing() {
  const [pricingData, setPricingData] = useState([]);

  useEffect(() => {
    async function fetchPricing() {
      try {
        const querySnapshot = await getDocs(collection(db, "pricing"));
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setPricingData(data);
      } catch (error) {
        console.error("Error fetching pricing:", error);
      }
    }
    fetchPricing();
  }, []);

  return (
    <Section className="relative w-full max-w-7xl mx-auto px-6 pt-24">
      {/* Background Design */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.25, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-[450px] h-[450px] bg-primary rounded-full opacity-40 blur-[160px]"
        />
      </div>

      {/* Heading Component */}
      <Heading title="Get started with Brainwave" className="text-5xl font-semibold max-w-xl" />

      {/* Left and Right Line Design */}
      <LeftLine />
      <RightLine />

      {/* Pricing List */}
      {pricingData.length === 0 ? (
        <p className="mt-12 text-center">Loading pricing...</p>
      ) : (
        <PricingList pricingData={pricingData} />
      )}

      {/* Additional background assets */}
      <img src={smallSphere} alt="small sphere" className="absolute bottom-10 left-5 opacity-50" />
      <img src={stars} alt="stars" className="absolute top-10 right-5 opacity-50" />
    </Section>
  );
}
