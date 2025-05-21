import { useNavigate } from 'react-router-dom';

const PricingList = ({ id, name, description, price, image }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-all">
      <img src={image} alt={name} className="w-full h-40 object-cover rounded-md mb-4" />
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <p className="text-lg font-semibold mb-4">{price}</p>
      <button
        onClick={() => navigate(`/project/${id}`)}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
      >
        Get Started
      </button>
    </div>
  );
};

export default PricingList;
