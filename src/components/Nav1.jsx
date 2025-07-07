'use client';

import { useState } from 'react';
import { 
  Headphones, 
  MessageCircle, 
  User, 
  Terminal, 
  ChevronDown,
  Code,
  BookOpen,
  Zap,
  Users,
  Star,
  Play,
  Download,
  FileText,
  Video,
  HelpCircle,
  Menu,
  X,
  Shield,
  Rocket,
  Settings,
  Globe,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = {
    Product: {
      icon: Rocket,
      items: [
        { name: 'AI Assistant', icon: Sparkles, desc: 'Intelligent code companion', color: 'from-purple-400 to-pink-400' },
        { name: 'Code Generator', icon: Code, desc: 'Generate code instantly', color: 'from-blue-400 to-cyan-400' },
        { name: 'API Tools', icon: Settings, desc: 'RESTful API solutions', color: 'from-green-400 to-emerald-400' },
        { name: 'Analytics', icon: Zap, desc: 'Performance insights', color: 'from-orange-400 to-red-400' },
        { name: 'Security', icon: Shield, desc: 'Enterprise-grade security', color: 'from-indigo-400 to-purple-400' },
        { name: 'Integrations', icon: Globe, desc: 'Connect everything', color: 'from-teal-400 to-blue-400' }
      ]
    },
    Docs: {
      icon: BookOpen,
      items: [
        { name: 'Getting Started', icon: Play, desc: 'Quick start guide', color: 'from-emerald-400 to-green-400' },
        { name: 'API Reference', icon: FileText, desc: 'Complete API docs', color: 'from-blue-400 to-indigo-400' },
        { name: 'Tutorials', icon: Video, desc: 'Step-by-step guides', color: 'from-purple-400 to-pink-400' },
        { name: 'Examples', icon: Code, desc: 'Code samples', color: 'from-orange-400 to-red-400' },
        { name: 'SDK Downloads', icon: Download, desc: 'All platforms', color: 'from-cyan-400 to-blue-400' }
      ]
    },
    Resource: {
      icon: Users,
      items: [
        { name: 'Community', icon: Users, desc: 'Join our developers', color: 'from-pink-400 to-rose-400' },
        { name: 'Blog', icon: FileText, desc: 'Latest updates', color: 'from-indigo-400 to-blue-400' },
        { name: 'Help Center', icon: HelpCircle, desc: 'Find answers', color: 'from-green-400 to-emerald-400' },
        { name: 'Status Page', icon: Zap, desc: 'System status', color: 'from-yellow-400 to-orange-400' },
        { name: 'Roadmap', icon: Star, desc: 'What\'s coming next', color: 'from-purple-400 to-indigo-400' }
      ]
    },
    Pricing: {
      icon: Star,
      items: [
        { name: 'Free Plan', icon: Star, desc: 'Perfect for getting started', color: 'from-emerald-400 to-green-400' },
        { name: 'Pro Plan', icon: Rocket, desc: 'For growing teams', color: 'from-blue-400 to-indigo-400' },
        { name: 'Enterprise', icon: Shield, desc: 'Custom solutions', color: 'from-purple-400 to-pink-400' },
        { name: 'Compare Plans', icon: FileText, desc: 'See all features', color: 'from-orange-400 to-red-400' }
      ]
    }
  };

  const handleMenuHover = (menu) => {
    setActiveMenu(menu);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-800/50"
        onMouseLeave={handleMenuLeave}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section with GIF */}
            <motion.div 
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <motion.div
                className="relative overflow-hidden rounded-xl"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src="https://i.imgur.com/WRJRR5G.gif"
                  alt="Floxen Logo" 
                  className="h-10 w-auto object-contain"
                />
              </motion.div>
            </motion.div>

            {/* Navigation Menu */}
            <div className="hidden lg:flex items-center space-x-2">
              {Object.entries(menuItems).map(([key, menu]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => handleMenuHover(key)}
                >
                  <motion.button
                    className="relative px-6 py-3 text-neutral-300 hover:text-white transition-all duration-300 font-medium group flex items-center space-x-2 rounded-xl"
                    whileHover={{ 
                      scale: 1.05,
                      y: -2,
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                      backgroundColor: 'rgba(38, 38, 38, 0.8)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {/* Animated background glow */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Animated border */}
                    <motion.div
                      className="absolute inset-0 rounded-xl border border-transparent"
                      whileHover={{ 
                        borderColor: 'rgba(74, 222, 128, 0.4)',
                        boxShadow: '0 0 20px rgba(74, 222, 128, 0.2)'
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Icon with enhanced animation */}
                    <motion.div
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: 5,
                        color: '#4ade80'
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <menu.icon className="w-4 h-4 relative z-10" />
                    </motion.div>
                    
                    {/* Text */}
                    <span className="relative z-10">{key}</span>
                    
                    {/* Chevron with smooth rotation */}
                    <motion.div
                      animate={{ rotate: activeMenu === key ? 180 : 0 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className="relative z-10"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Support Button */}
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 25px rgba(74, 222, 128, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex items-center px-4 py-2 bg-neutral-800/80 hover:bg-neutral-700 text-emerald-400 rounded-xl transition-all duration-300 group border border-neutral-700 hover:border-emerald-400/50 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Headphones className="w-4 h-4 mr-2" />
                </motion.div>
                Support
              </motion.button>

              {/* Discord Button */}
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 25px rgba(96, 165, 250, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex items-center px-4 py-2 bg-neutral-800/80 hover:bg-neutral-700 text-blue-400 rounded-xl transition-all duration-300 group border border-neutral-700 hover:border-blue-400/50 backdrop-blur-sm"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                </motion.div>
                Discord
              </motion.button>

              {/* Sign Up Button */}
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 30px rgba(74, 222, 128, 0.6)'
                }}
                whileTap={{ scale: 0.95 }}
                className="relative px-6 py-2.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 text-neutral-900 font-semibold rounded-xl hover:from-emerald-300 hover:to-emerald-500 transition-all duration-300 group overflow-hidden shadow-lg"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"
                  initial={{ x: '-100%', skewX: -20 }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.8 }}
                />
                <span className="relative z-10 flex items-center">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <User className="w-4 h-4 mr-2" />
                  </motion.div>
                  Sign Up
                </span>
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden p-2 text-neutral-300 hover:text-white transition-colors duration-300 rounded-lg hover:bg-neutral-800/50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-800/50 shadow-2xl"
            >
              <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems[activeMenu].items.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                        }}
                        className="p-4 rounded-xl bg-neutral-900/50 hover:bg-neutral-800/50 border border-neutral-800/30 hover:border-neutral-700/50 transition-all duration-300 backdrop-blur-sm"
                      >
                        <div className="flex items-start space-x-3">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}
                          >
                            <item.icon className="w-5 h-5" />
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300 flex items-center">
                              {item.name}
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                whileHover={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </motion.div>
                            </h3>
                            <p className="text-sm text-neutral-400 mt-1 group-hover:text-neutral-300 transition-colors duration-300">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-950/90 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-80 h-full bg-neutral-900/95 backdrop-blur-xl shadow-2xl border-l border-neutral-800/50"
            >
              <div className="p-6 space-y-6 mt-20">
                {Object.entries(menuItems).map(([key, menu]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 text-white font-semibold">
                      <menu.icon className="w-5 h-5" />
                      <span>{key}</span>
                    </div>
                    <div className="space-y-2 ml-8">
                      {menu.items.map((item) => (
                        <motion.div
                          key={item.name}
                          whileHover={{ x: 5 }}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-800/50 text-neutral-300 hover:text-white transition-all duration-200 cursor-pointer"
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="text-sm">{item.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;