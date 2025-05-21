import { useNavigate } from 'react-router-dom';

const PricingList = ({ id, name, description, price, image }) => {
  const navigate = useNavigate();

  return (
    <div className="pricing-card">
      <img src={image} alt={name} className="pricing-img" />
      <h3 className="pricing-title">{name}</h3>
      <p className="pricing-description">{description}</p>
      <p className="pricing-price">{price}</p>
      <button
        className="pricing-btn"
        onClick={() => navigate(`/project/${id}`)}
      >
        Get Started
      </button>
    </div>
  );
};

export default PricingList;
