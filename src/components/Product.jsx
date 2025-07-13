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
  List,
  Globe,
  Server,
  Lock
} from 'lucide-react';

const ModernProductStore = () => {
  // Product labels configuration (easily editable)
  const productLabels = {
    popular: { text: 'Popular', color: 'bg-blue-100 text-blue-700' },
    premium: { text: 'Premium', color: 'bg-purple-100 text-purple-700' },
    bestseller: { text: 'Best Seller', color: 'bg-green-100 text-green-700' },
    elite: { text: 'Elite', color: 'bg-yellow-100 text-yellow-700' },
    helper: { text: 'Helper', color: 'bg-orange-100 text-orange-700' },
    cooking: { text: 'Cooking', color: 'bg-red-100 text-red-700' },
    mobile: { text: 'Mobile', color: 'bg-indigo-100 text-indigo-700' },
    crossplatform: { text: 'Cross-Platform', color: 'bg-pink-100 text-pink-700' },
    proxy: { text: 'Proxy', color: 'bg-cyan-100 text-cyan-700' },
    security: { text: 'Security', color: 'bg-emerald-100 text-emerald-700' }
  };

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
      badge: 'popular',
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
      badge: 'premium',
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
      badge: 'bestseller',
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
      badge: 'elite',
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
      badge: 'helper',
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
      badge: 'cooking',
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
      badge: 'mobile',
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
      badge: 'crossplatform',
      icon: <Cpu className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop'
    },
    // New GPAI Proxy Products
    {
      id: 'proxy-residential',
      name: 'Residential Proxy Pool',
      price: 75000,
      bglPrice: '3 BLACK',
      category: 'gpai',
      description: 'High-quality residential proxies with 99.9% uptime and global coverage',
      features: ['Global IPs', 'High Speed', 'Residential', '24/7 Support'],
      rating: 4.8,
      reviews: 245,
      badge: 'proxy',
      icon: <Globe className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop'
    },
    {
      id: 'proxy-datacenter',
      name: 'Datacenter Proxy',
      price: 35000,
      bglPrice: '1.5 BLACK',
      category: 'gpai',
      description: 'Fast and reliable datacenter proxies optimized for automation',
      features: ['High Speed', 'Stable Connection', 'Multiple Locations', 'API Access'],
      rating: 4.7,
      reviews: 189,
      badge: 'proxy',
      icon: <Server className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=200&fit=crop'
    },
    {
      id: 'proxy-premium',
      name: 'Premium Proxy Suite',
      price: 125000,
      bglPrice: '5 BLACK',
      category: 'gpai',
      description: 'Elite proxy package with advanced security and rotation features',
      features: ['Auto Rotation', 'SSL Support', 'Premium IPs', 'Advanced Security'],
      rating: 4.9,
      reviews: 78,
      badge: 'security',
      icon: <Lock className="w-6 h-6" />,
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button className="p-3 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Our Product</h1>
                <p className="text-gray-500">Premium scripts & tools</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 shadow-sm"
                />
              </div>
              
              <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 border ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg border-blue-600 transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className={`bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group hover:border-gray-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Product Image */}
              <div className={`relative ${
                viewMode === 'list' ? 'w-64 h-40' : 'h-52'
              } bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
                    {product.icon}
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${productLabels[product.badge]?.color || 'bg-gray-100 text-gray-700'}`}>
                    {productLabels[product.badge]?.text || product.badge}
                  </span>
                </div>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-sm"
                >
                  <Heart 
                    className={`w-4 h-4 transition-colors ${
                      favorites.includes(product.id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-3">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{product.description}</p>
                
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
                  <span className="ml-2 text-sm text-gray-500 font-medium">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.features.slice(0, 4).map(feature => (
                    <span key={feature} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-medium">
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {formatCurrency(product.price)}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      or {product.bglPrice}
                    </div>
                  </div>
                  
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 max-w-md mx-auto">Try adjusting your search terms or filter criteria to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernProductStore;
