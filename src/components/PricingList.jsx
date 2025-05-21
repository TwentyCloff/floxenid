import React from "react";

const PricingList = ({ pricingData }) => {
  if (!pricingData || pricingData.length === 0) {
    return <p>No pricing plans available.</p>;
  }

  return (
    <div className="pricing-list">
      {pricingData.map(({ id, title, price, features }) => (
        <div key={id} className="pricing-card">
          <h3>{title}</h3>
          <p className="price">${price}</p>
          <ul>
            {features?.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PricingList;
