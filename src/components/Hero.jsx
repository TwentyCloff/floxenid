import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { FaRocket, FaLock, FaTools, FaChartBar, FaStar, FaRegStar, FaHeadset } from 'react-icons/fa';
import { ref, onValue, push, set } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../config/firebaseConfig';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import gambar (pastikan file ada di direktori)
import banner1 from '../assets/imgHome/banner1.webp';
import banner2 from '../assets/imgHome/banner2.webp';
import banner3 from '../assets/imgHome/banner3.webp';

const LandingPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [user, setUser] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    message: '',
    rating: 5
  });
  const [showForm, setShowForm] = useState(false);

  // Cek status auth dan pembelian
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Verifikasi pembelian user
        const userPurchasesRef = ref(db, `users/${currentUser.uid}/purchases`);
        onValue(userPurchasesRef, (snapshot) => {
          const purchases = snapshot.val();
          setHasPurchased(!!purchases && Object.keys(purchases).length > 0);
        });
      } else {
        setHasPurchased(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Ambil testimoni dari Firebase
  useEffect(() => {
    const testimonialsRef = ref(db, 'testimonials');
    const unsubscribe = onValue(testimonialsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTestimonials = data ? Object.values(data).filter(t => t.userId) : [];
      setTestimonials(loadedTestimonials);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmitTestimonial = async (e) => {
    e.preventDefault();
    if (!user || !hasPurchased || !newTestimonial.message) return;

    try {
      const testimonialsRef = ref(db, 'testimonials');
      const newTestimonialRef = push(testimonialsRef);

      await set(newTestimonialRef, {
        name: user.displayName || 'Anonymous',
        photoURL: user.photoURL || '',
        message: newTestimonial.message,
        rating: newTestimonial.rating,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });

      setNewTestimonial({ message: '', rating: 5 });
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          interactive ? (
            <button
              type="button"
              key={star}
              onClick={() => onChange && onChange(star)}
              className="text-2xl mr-1 focus:outline-none"
            >
              {star <= newTestimonial.rating ? 
                <FaStar className="text-yellow-400" /> : 
                <FaRegStar className="text-yellow-400" />}
            </button>
          ) : (
            star <= rating ? 
              <FaStar key={star} className="text-yellow-400" /> : 
              <FaRegStar key={star} className="text-yellow-400" />
          )
        ))}
      </div>
    );
  };

  const features = [
    {
      icon: <FaRocket className="text-3xl text-blue-600" />,
      title: "High Performance",
      description: "Optimized for speed and efficiency"
    },
    {
      icon: <FaLock className="text-3xl text-blue-600" />,
      title: "Secure Solutions",
      description: "Enterprise-grade security"
    },
    {
      icon: <FaTools className="text-3xl text-blue-600" />,
      title: "Easy Integration",
      description: "Simple API and documentation"
    },
    {
      icon: <FaChartBar className="text-3xl text-blue-600" />,
      title: "Real Analytics",
      description: "Monitor performance metrics"
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Slider Section */}
      <section className="relative bg-gradient-to-r from-white via-blue-50 to-blue-100 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            className="rounded-xl shadow-lg overflow-hidden"
          >
            <SwiperSlide>
              <img src={banner1} alt="Banner 1" className="w-full h-auto" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={banner2} alt="Banner 2" className="w-full h-auto" />
            </SwiperSlide>
            <SwiperSlide>
              <a href="/community">
                <img src={banner3} alt="Banner 3" className="w-full h-auto" />
              </a>
            </SwiperSlide>
          </Swiper>

          <div className="text-center mt-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Advanced Solutions for Developers
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Build faster and deliver exceptional experiences
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 shadow-lg">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Customer Feedback</h2>
            {user && hasPurchased && (
              <button 
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
              >
                {showForm ? 'Cancel' : 'Add Testimonial'}
              </button>
            )}
          </div>

          {showForm && (
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
              <form onSubmit={handleSubmitTestimonial}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Your Rating</label>
                  {renderStars(newTestimonial.rating, true, (rating) => 
                    setNewTestimonial({...newTestimonial, rating})
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Your Experience</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    value={newTestimonial.message}
                    onChange={(e) => setNewTestimonial({...newTestimonial, message: e.target.value})}
                    required
                    placeholder="Share your experience..."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {testimonials.length > 0 ? (
            <Swiper
              modules={[Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              pagination={{ clickable: true }}
              className="pb-12"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-white p-6 rounded-xl shadow-sm h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 overflow-hidden">
                        {testimonial.photoURL ? (
                          <img 
                            src={testimonial.photoURL} 
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaHeadset className="text-blue-500 text-xl" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.message}"</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No testimonials yet. Be the first to review!</p>
            </div>
          )}

          {user && !hasPurchased && (
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Purchase a product to leave your feedback!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied customers
          </p>
          <button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-full transition duration-300 shadow-lg">
            Sign Up Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
