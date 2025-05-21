import React from "react";
import { useNavigate } from "react-router-dom";

const PricingList = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {data.map(item => (
        <div
          key={item.id}
          className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-2xl font-semibold mb-2 text-white">{item.title}</h3>
            <p className="text-white/80 mb-4">{item.description}</p>
            <p className="text-3xl font-bold text-blue-400 mb-4">${item.price}</p>
          </div>
          <button
            onClick={() => navigate(`/project/${item.id}`)}
            className="mt-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>
      ))}
    </div>
  );
};

export default PricingList;
