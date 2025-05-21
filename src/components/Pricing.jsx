import React, { useEffect, useState } from "react";
import { smallSphere, stars } from "../assets";
import { LeftLine, RightLine } from "./design/Pricing";
import Heading from "./Heading";
import PricingList from "./PricingList";
import Section from "./Section";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase"; // sesuaikan path firebase config lo

const Pricing = () => {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pricing"));
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setPricingData(data);
      } catch (error) {
        console.error("Error fetching pricing data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  return (
    <Section id="pricing" className="pricing-section">
      <div className="pricing-header">
        <Heading title="Our Pricing" subtitle="Affordable plans for everyone" />
        <img src={smallSphere} alt="decor" className="small-sphere" />
      </div>
      <LeftLine />
      <RightLine />
      {loading ? (
        <p>Loading pricing...</p>
      ) : (
        <PricingList pricingData={pricingData} />
      )}
      <img src={stars} alt="stars decor" className="stars" />
    </Section>
  );
};

export default Pricing;
