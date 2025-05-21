import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // pastikan ini sesuai dengan file firebase kamu
import PricingList from './PricingList';

const Pricing = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(items);
      } catch (error) {
        console.error('Error fetching pricing data:', error);
      }
    };

    fetchPricing();
  }, []);

  return (
    <section className="py-20 px-4 md:px-10 lg:px-20 bg-white" id="pricing">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Pricing</h2>
        <p className="text-gray-600 text-lg">Choose the plan that suits you best</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((item) => (
          <PricingList
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </section>
  );
};

export default Pricing;
