// src/components/PricingList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const PricingList = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg p-6 shadow-md flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="mb-4">{item.description}</p>
            <p className="text-2xl font-semibold mb-4">${item.price}</p>
          </div>
          <button
            onClick={() => navigate(`/project/${item.id}`)}
            className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Get Started
          </button>
        </div>
      ))}
    </div>
  );
};

export default PricingList;
