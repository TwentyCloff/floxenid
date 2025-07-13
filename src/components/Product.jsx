import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import PaymentSystem from './payment';

const Product = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const product = {
    id: 'ptht-v1',
    name: 'PTHt v1',
    price: 12500,
    description: 'Auto harvesting script with advanced pathfinding and intelligent detection'
  };

  const handleBuyNow = () => {
    setSelectedProduct(product);
    setShowPayment(true);
  };

  if (showPayment) {
    return <PaymentSystem product={selectedProduct} onBack={() => setShowPayment(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="text-3xl font-bold text-gray-900 mb-6">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0
            }).format(product.price)}
          </div>
          <button
            onClick={handleBuyNow}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;