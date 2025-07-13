import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Star, 
  Heart, 
  Search,
  ShoppingBag,
  ArrowLeft,
  Zap,
  Terminal,
  Sparkles,
  Code,
  Shield,
  Cpu,
  Smartphone,
  Filter,
  Grid,
  List
} from 'lucide-react';
import { motion } from 'framer-motion';

const ModernProductStore = () => {
  const [products] = useState([
    {
      id: 'ptht-v1',
      name: 'PTHt v1',
      price: 12500,
      bglPrice: '50 BGL',
      category: 'growlauncher',
      description: 'Auto harvesting script with advanced pathfinding and intelligent detection',
      features: ['Auto Harvest', 'Safe Mode', 'Anti-Ban', 'Fast Speed'],
      rating: 4.9,
      reviews: 142,
      badge: 'Popular',
      icon: <Terminal className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop'
    },
    {
      id: 'ptht-v2',
      name: 'PTHt v2',
      price: 25000,
      bglPrice: '1 BLACK',
      category: 'growlauncher',
      description: 'Enhanced version with premium features and AI optimization',
      features: ['Multi-World', 'Smart AI', 'Discord Webhook', 'Premium Support'],
      rating: 4.8,
      reviews: 89,
      badge: 'Premium',
      icon: <Zap className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop'
    },
    {
      id: 'pnb-v1',
      name: 'PNB v1',
      price: 12500,
      bglPrice: '50 BGL',
      category: 'growlauncher',
      description: 'Plant and break automation script with profit optimization',
      features: ['Auto Plant', 'Auto Break', 'Seed Detection', 'Profit Calculator'],
      rating: 4.7,
      reviews: 67,
      badge: 'Best Seller',
      icon: <Code className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop'
    },
    {
      id: 'pnb-v2',
      name: 'PNB v2',
      price: 50000,
      bglPrice: '2 BLACK',
      category: 'growlauncher',
      description: 'Advanced PNB with AI optimization and cloud synchronization',
      features: ['AI Optimization', 'Multi-Bot', 'Cloud Sync', 'Analytics'],
      rating: 4.9,
      reviews: 201,
      badge: 'Elite',
      icon: <Sparkles className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop'
    },
    {
      id: 'reme-qeme',
      name: 'Reme Qeme Helper',
      price: 11250,
      bglPrice: '45 BGL',
      category: 'growlauncher',
      description: 'Specialized helper for Reme Qeme activities with smart routing',
      features: ['Auto Collect', 'Smart Timing', 'Safe Routes', 'Profit Tracking'],
      rating: 4.6,
      reviews: 34,
      badge: 'Helper',
      icon: <Shield className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop'
    },
    {
      id: 'cook-arroz',
      name: 'Cook Arroz (50 Oven)',
      price: 12500,
      bglPrice: '50 BGL',
      category: 'growlauncher',
      description: 'Automated cooking system supporting up to 50 ovens simultaneously',
      features: ['50 Oven Support', 'Auto Ingredient', 'Profit Optimizer', 'Queue Management'],
      rating: 4.8,
      reviews: 76,
      badge: 'Cooking',
      icon: <Terminal className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop'
    },
    {
      id: 'ptht-andro',
      name: 'PTHt Android',
      price: 12500,
      bglPrice: '50 BGL',
      category: 'bothax',
      description: 'Android optimized PTHt script with touch emulation',
      features: ['Android Support', 'Touch Emulation', 'Battery Saver', 'Background Mode'],
      rating: 4.7,
      reviews: 123,
      badge: 'Mobile',
      icon: <Smartphone className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop'
    },
    {
      id: 'pnb-andro-pc',
      name: 'PNB Cross-Platform',
      price: 50000,
      bglPrice: '2 BLACK',
      category: 'bothax',
      description: 'Cross-platform PNB script with data synchronization',
      features: ['Cross-Platform', 'Sync Data', 'Remote Control', 'Premium Features'],
      rating: 4.9,
      reviews: 156,
      badge: 'Cross-Platform',
      icon: <Cpu className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop'
    }
  ]);

  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    { id: 'all', name: 'All Products', icon: <Code className="w-4 h-4" /> },
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-500 text-sm">Premium automation scripts</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
              
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Product Image */}
              <div className={`relative ${
                viewMode === 'list' ? 'w-48 h-32' : 'h-48'
              } bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                    {product.icon}
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    {product.badge}
                  </span>
                </div>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      favorites.includes(product.id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.features.slice(0, 3).map(feature => (
                    <span key={feature} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(product.price)}
                    </div>
                    <div className="text-sm text-gray-500">
                      or {product.bglPrice}
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy Now</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernProductStore;
