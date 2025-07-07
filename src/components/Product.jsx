import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Star, 
  Heart, 
  Search,
  ShoppingBag,
  CreditCard,
  X,
  Zap,
  Terminal,
  Sparkles,
  ArrowRight,
  Code,
  Shield,
  Cpu,
  Smartphone
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProductSystem = () => {
  const [products] = useState([
    {
      id: 'ptht-v1',
      name: 'PTHt v1',
      price: 12500,
      bglPrice: '50 BGL',
      category: 'growlauncher',
      description: 'Auto harvesting script with advanced pathfinding',
      features: ['Auto Harvest', 'Safe Mode', 'Anti-Ban', 'Fast Speed'],
      rating: 4.9,
      reviews: 142,
      badge: 'Popular',
      icon: <Terminal className="w-6 h-6" />
    },
    {
      id: 'ptht-v2',
      name: 'PTHt v2',
      price: 25000,
      bglPrice: '1 BLACK',
      category: 'growlauncher',
      description: 'Enhanced version with premium features',
      features: ['Multi-World', 'Smart AI', 'Discord Webhook', 'Premium Support'],
      rating: 4.8,
      reviews: 89,
      badge: 'Premium',
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'pnb-v1',
      name: 'PNB v1',
      price: 12500,
      bglPrice: '50 BGL',
      category: 'growlauncher',
      description: 'Plant and break automation script',
      features: ['Auto Plant', 'Auto Break', 'Seed Detection', 'Profit Calculator'],
      rating: 4.7,
      reviews: 67,
      badge: 'Best Seller',
      icon: <Code className="w-6 h-6" />
    },
    {
      id: 'pnb-v2',
      name: 'PNB v2',
      price: 50000,
      bglPrice: '2 BLACK',
      category: 'growlauncher',
      description: 'Advanced PNB with AI optimization',
      features: ['AI Optimization', 'Multi-Bot', 'Cloud Sync', 'Analytics'],
      rating: 4.9,
      reviews: 201,
      badge: 'Elite',
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      id: 'reme-qeme',
      name: 'Reme Qeme Helper',
      price: 11250,
      bglPrice: '45 BGL',
      category: 'growlauncher',
      description: 'Specialized helper for Reme Qeme activities',
      features: ['Auto Collect', 'Smart Timing', 'Safe Routes', 'Profit Tracking'],
      rating: 4.6,
      reviews: 34,
      badge: 'Helper',
      icon: <Shield className="w-6 h-6" />
    },
    {
      id: 'cook-arroz',
      name: 'Cook Arroz (50 Oven)',
      price: 12500,
      bglPrice: '50 BGL',
      category: 'growlauncher',
      description: 'Automated cooking system for 50 ovens',
      features: ['50 Oven Support', 'Auto Ingredient', 'Profit Optimizer', 'Queue Management'],
      rating: 4.8,
      reviews: 76,
      badge: 'Cooking',
      icon: <Terminal className="w-6 h-6" />
    },
    {
      id: 'ptht-andro',
      name: 'PTHt Andro',
      price: 12500,
      bglPrice: '50 BGL',
      category: 'bothax',
      description: 'Android version of PTHt script',
      features: ['Android Support', 'Touch Emulation', 'Battery Saver', 'Background Mode'],
      rating: 4.7,
      reviews: 123,
      badge: 'Mobile',
      icon: <Smartphone className="w-6 h-6" />
    },
    {
      id: 'pnb-andro-pc',
      name: 'PNB Andro / PC',
      price: 50000,
      bglPrice: '2 BLACK',
      category: 'bothax',
      description: 'Cross-platform PNB script',
      features: ['Cross-Platform', 'Sync Data', 'Remote Control', 'Premium Features'],
      rating: 4.9,
      reviews: 156,
      badge: 'Cross-Platform',
      icon: <Cpu className="w-6 h-6" />
    },
    {
      id: 'ptht-pc',
      name: 'PTHt PC',
      price: 20000,
      bglPrice: '80 BGL',
      category: 'bothax',
      description: 'PC optimized PTHt with enhanced performance',
      features: ['PC Optimized', 'Multi-Instance', 'High Performance', 'Advanced AI'],
      rating: 4.8,
      reviews: 98,
      badge: 'PC',
      icon: <Terminal className="w-6 h-6" />
    },
    {
      id: 'pnb-mneck-pc',
      name: 'PNB MNeck PC',
      price: 125000,
      bglPrice: '5 BLACK',
      category: 'bothax',
      description: 'Premium MNeck automation for PC',
      features: ['MNeck Specialized', 'Mass Production', 'Enterprise Grade', 'Priority Support'],
      rating: 4.9,
      reviews: 45,
      badge: 'Enterprise',
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      id: 'csn-helper-pc',
      name: 'CSN Helper PC',
      price: 37500,
      bglPrice: '150 BGL',
      category: 'bothax',
      description: 'Casino helper with advanced algorithms',
      features: ['Casino Automation', 'Risk Management', 'Profit Tracking', 'Statistics'],
      rating: 4.6,
      reviews: 67,
      badge: 'Casino',
      icon: <Code className="w-6 h-6" />
    },
    {
      id: 'aio-helper-andro',
      name: 'AIO Helper Andro',
      price: 37500,
      bglPrice: '150 BGL',
      category: 'bothax',
      description: 'All-in-one helper for Android',
      features: ['All-in-One', 'Multiple Functions', 'User Friendly', 'Regular Updates'],
      rating: 4.8,
      reviews: 134,
      badge: 'AIO',
      icon: <Smartphone className="w-6 h-6" />
    },
    {
      id: 'auto-cook-arroz-andro',
      name: 'Auto Cook Arroz Andro',
      price: 12500,
      bglPrice: '50 BGL',
      category: 'bothax',
      description: 'Android cooking automation',
      features: ['Android Cooking', 'Auto Ingredient', 'Efficient Cooking', 'Profit Calculator'],
      rating: 4.7,
      reviews: 89,
      badge: 'Mobile',
      icon: <Smartphone className="w-6 h-6" />
    },
    {
      id: 'proxy-gpai-pc',
      name: 'Proxy GPAI PC',
      price: 32500,
      bglPrice: '130 BGL',
      category: 'gpai',
      description: 'Advanced proxy system for GPAI',
      features: ['Proxy System', 'IP Rotation', 'High Anonymity', 'Fast Connection'],
      rating: 4.8,
      reviews: 56,
      badge: 'Proxy',
      icon: <Shield className="w-6 h-6" />
    }
  ]);

  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);

  const categories = [
    { id: 'all', name: 'All Scripts', icon: <Code className="w-4 h-4" /> },
    { id: 'growlauncher', name: 'Growlauncher', icon: <Terminal className="w-4 h-4" /> },
    { id: 'bothax', name: 'Bothax', icon: <Zap className="w-4 h-4" /> },
    { id: 'gpai', name: 'GPAI', icon: <Shield className="w-4 h-4" /> }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
      return;
    }
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const toggleFavorite = (productId) => {
    setFavorites(favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId]);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-px opacity-5">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="bg-neutral-800" />
          ))}
        </div>
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: Math.random() * 8,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg">
                  <Terminal className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                    GT Script Store
                  </h1>
                  <p className="text-neutral-400 text-sm">Premium Growtopia Scripts</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search scripts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-neutral-400"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCart(true)}
                className="relative bg-gradient-to-r from-emerald-500 to-blue-500 p-3 rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
              >
                <ShoppingCart className="w-6 h-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {getCartCount()}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map(category => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-400/20 to-blue-500/20 rounded-lg text-emerald-400 group-hover:from-emerald-400/30 group-hover:to-blue-500/30 transition-all duration-300">
                      {product.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{product.name}</h3>
                      <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                        {product.badge}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        favorites.includes(product.id) 
                          ? 'text-red-500 fill-current' 
                          : 'text-neutral-400'
                      }`}
                    />
                  </button>
                </div>
                
                <p className="text-neutral-400 text-sm mb-4">{product.description}</p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-neutral-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-neutral-400">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.features.slice(0, 3).map(feature => (
                    <span key={feature} className="bg-neutral-800 text-neutral-300 px-2 py-1 rounded-lg text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-emerald-400">
                        {formatCurrency(product.price)}
                      </span>
                      <div className="text-sm text-neutral-400">
                        {product.bglPrice}
                      </div>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(product)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            className="bg-neutral-900 w-full max-w-md h-full overflow-y-auto border-l border-neutral-800"
          >
            <div className="p-6 border-b border-neutral-800">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-neutral-400 hover:text-white p-2 hover:bg-neutral-800 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-400">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-neutral-800 rounded-lg">
                        <div className="p-2 bg-gradient-to-r from-emerald-400/20 to-blue-500/20 rounded-lg text-emerald-400">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-sm">{item.name}</h3>
                          <p className="text-emerald-400 font-bold">{formatCurrency(item.price)}</p>
                          <p className="text-neutral-400 text-xs">{item.bglPrice}</p>
                          
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-neutral-700 p-1 rounded-full hover:bg-neutral-600"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="mx-2 font-semibold text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-neutral-700 p-1 rounded-full hover:bg-neutral-600"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-400 ml-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-neutral-800 pt-4 mb-6">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span className="text-white">Total:</span>
                      <span className="text-emerald-400">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => alert('Redirecting to payment...')}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Payment</span>
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductSystem;