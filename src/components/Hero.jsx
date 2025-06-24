import { useEffect, useState, useRef } from 'react';
import { FaRocket, FaLock, FaTools, FaChartBar, FaStar, FaRegStar, FaHeadset, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app, auth, db } from '../config/firebaseConfig';

// Import images
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonialSlide, setCurrentTestimonialSlide] = useState(0);
  const slideInterval = useRef(null);
  const testimonialInterval = useRef(null);

  const banners = [
    { image: banner1, alt: "Premium Technology Solutions", link: null },
    { image: banner2, alt: "Innovative Tools for Developers", link: null },
    { image: banner3, alt: "Join Our Developer Community", link: "/community" }
  ];

  // Check auth state and purchases
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user has purchased
        const userPurchasesRef = ref(db, `users/${currentUser.uid}/purchases`);
        onValue(userPurchasesRef, (snapshot) => {
          const purchases = snapshot.val();
          setHasPurchased(purchases && Object.keys(purchases).length > 0);
        });
      } else {
        setHasPurchased(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch testimonials from Firebase
  useEffect(() => {
    const testimonialsRef = ref(db, 'testimonials');
    onValue(testimonialsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const validTestimonials = Object.values(data).filter(t => t.userId);
        setTestimonials(validTestimonials);
      }
    });
  }, []);

  // Banner slider autoplay
  useEffect(() => {
    startAutoSlide();
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, []);

  // Testimonial slider autoplay
  useEffect(() => {
    startTestimonialAutoSlide();
    return () => {
      if (testimonialInterval.current) {
        clearInterval(testimonialInterval.current);
      }
    };
  }, [testimonials]);

  const startAutoSlide = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    slideInterval.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000);
  };

  const startTestimonialAutoSlide = () => {
    if (testimonialInterval.current) {
      clearInterval(testimonialInterval.current);
    }
    if (testimonials.length > 0) {
      testimonialInterval.current = setInterval(() => {
        setCurrentTestimonialSlide(prev => (prev + 1) % testimonials.length);
      }, 5000);
    }
  };

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    // Reset autoplay timer when user manually changes slide
    startAutoSlide();
  };

  const handleTestimonialSlideChange = (index) => {
    setCurrentTestimonialSlide(index);
    // Reset autoplay timer when user manually changes slide
    startTestimonialAutoSlide();
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % banners.length);
    startAutoSlide();
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length);
    startAutoSlide();
  };

  const nextTestimonial = () => {
    setCurrentTestimonialSlide(prev => (prev + 1) % testimonials.length);
    startTestimonialAutoSlide();
  };

  const prevTestimonial = () => {
    setCurrentTestimonialSlide(prev => (prev - 1 + testimonials.length) % testimonials.length);
    startTestimonialAutoSlide();
  };

  const handleSubmitTestimonial = (e) => {
    e.preventDefault();
    if (!user || !hasPurchased) return;

    const testimonialsRef = ref(db, 'testimonials');
    const newTestimonialRef = push(testimonialsRef);

    set(newTestimonialRef, {
      name: user.displayName || 'Anonymous',
      photoURL: user.photoURL || '',
      message: newTestimonial.message,
      rating: newTestimonial.rating,
      userId: user.uid,
      createdAt: new Date().toISOString()
    }).then(() => {
      setNewTestimonial({ message: '', rating: 5 });
      setShowForm(false);
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? 
            <FaStar key={star} className="text-yellow-400" /> : 
            <FaRegStar key={star} className="text-yellow-400" />
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

  // Function to calculate visible testimonials based on screen size
  const getVisibleTestimonials = () => {
    const width = window.innerWidth;
    let visibleCount = 1;
    
    if (width >= 1024) {
      visibleCount = 3;
    } else if (width >= 768) {
      visibleCount = 2;
    }
    
    const visibleTestimonials = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentTestimonialSlide + i) % testimonials.length;
      visibleTestimonials.push(testimonials[index]);
    }
    
    return visibleTestimonials;
  };

  return (
    <div className="w-full">
      {/* Hero Slider Section */}
      <section className="relative bg-gradient-to-r from-white via-blue-50 to-blue-100 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="relative rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-64 md:h-96 overflow-hidden">
              {banners.map((banner, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  {banner.link ? (
                    <a href={banner.link}>
                      <img 
                        src={banner.image} 
                        alt={banner.alt} 
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ) : (
                    <img 
                      src={banner.image} 
                      alt={banner.alt} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-all z-10"
            >
              <FaChevronLeft className="text-xl" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-all z-10"
            >
              <FaChevronRight className="text-xl" />
            </button>
            
            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white bg-opacity-50'}`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Advanced Solutions for Modern Developers
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Build faster, scale smarter, and deliver exceptional experiences
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 shadow-lg">
              Explore Products
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
              <div 
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
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
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewTestimonial({...newTestimonial, rating: star})}
                        className="text-2xl mr-1 focus:outline-none"
                      >
                        {star <= newTestimonial.rating ? 
                          <FaStar className="text-yellow-400" /> : 
                          <FaRegStar className="text-yellow-400" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Your Experience</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    value={newTestimonial.message}
                    onChange={(e) => setNewTestimonial({...newTestimonial, message: e.target.value})}
                    required
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
            <div className="relative">
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-300 ease-in-out">
                  {getVisibleTestimonials().map((testimonial, index) => (
                    <div 
                      key={index} 
                      className="w-full md:w-1/2 lg:w-1/3 px-4 flex-shrink-0"
                    >
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
                              <span className="text-blue-500 text-xl">
                                {testimonial.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                        <p className="text-gray-600 italic">"{testimonial.message}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {testimonials.length > 1 && (
                <>
                  <button 
                    onClick={prevTestimonial}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white text-blue-600 p-2 rounded-full shadow-md hover:bg-blue-50 transition-all"
                  >
                    <FaChevronLeft />
                  </button>
                  <button 
                    onClick={nextTestimonial}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white text-blue-600 p-2 rounded-full shadow-md hover:bg-blue-50 transition-all"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
              
              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.length > 0 && Array.from({ length: Math.min(5, testimonials.length) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleTestimonialSlideChange(index)}
                    className={`w-3 h-3 rounded-full transition-all ${index === currentTestimonialSlide % testimonials.length ? 'bg-blue-600 w-6' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
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
            Join thousands of developers already using our platform
          </p>
          <button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-full transition duration-300 shadow-lg">
            Sign Up Free
          </button>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Trusted By</h2>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {/* Replace with actual partner logos */}
            <div className="w-40 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Partner 1</span>
            </div>
            <div className="w-40 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Partner 2</span>
            </div>
            <div className="w-40 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Partner 3</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
