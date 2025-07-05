'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Minus, 
  Search,
  Sparkles,
  Shield,
  Zap,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFAQs, setFilteredFAQs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const faqData = [
    {
      id: 1,
      category: 'general',
      question: 'What makes your platform different from competitors?',
      answer: 'Our platform combines cutting-edge technology with user-centric design. We offer 500% faster deployment times, 99.9% uptime guarantee, and 24/7 premium support. Our clients have seen average productivity increases of 300% within the first month.',
      icon: Sparkles,
      color: 'emerald'
    },
    {
      id: 2,
      category: 'security',
      question: 'How secure is your platform?',
      answer: 'Security is our top priority. We use enterprise-grade encryption, multi-factor authentication, and regular security audits. We\'ve processed over 10 million transactions with zero security breaches. Our platform is SOC 2 Type II certified and GDPR compliant.',
      icon: Shield,
      color: 'blue'
    },
    {
      id: 3,
      category: 'performance',
      question: 'What kind of performance can I expect?',
      answer: 'Our platform delivers exceptional performance with sub-second response times, 99.9% uptime, and infinite scalability. We handle everything from 1K to 1M+ users seamlessly. Our global CDN ensures fast loading times worldwide.',
      icon: Zap,
      color: 'purple'
    },
    {
      id: 4,
      category: 'support',
      question: 'What support options are available?',
      answer: 'We offer comprehensive 24/7 support through multiple channels including live chat, email, and phone. Our expert team has an average response time of under 2 minutes. We also provide dedicated account managers for enterprise clients.',
      icon: Users,
      color: 'cyan'
    },
    {
      id: 5,
      category: 'general',
      question: 'How quickly can I get started?',
      answer: 'You can be up and running in less than 5 minutes. Our onboarding process is streamlined and intuitive. We provide step-by-step guides, video tutorials, and one-on-one setup assistance if needed.',
      icon: Clock,
      color: 'emerald'
    },
    {
      id: 6,
      category: 'security',
      question: 'Do you offer compliance certifications?',
      answer: 'Yes, we maintain multiple compliance certifications including SOC 2 Type II, ISO 27001, GDPR, HIPAA, and PCI DSS. We undergo regular third-party audits and maintain detailed compliance documentation.',
      icon: CheckCircle,
      color: 'blue'
    },
    {
      id: 7,
      category: 'performance',
      question: 'Can your platform handle high traffic volumes?',
      answer: 'Absolutely! Our platform is built for scale. We use advanced load balancing, auto-scaling infrastructure, and distributed architecture. We\'ve successfully handled traffic spikes of 10,000% without any performance degradation.',
      icon: Zap,
      color: 'purple'
    },
    {
      id: 8,
      category: 'support',
      question: 'Do you provide training and onboarding?',
      answer: 'Yes, we offer comprehensive training programs including live workshops, recorded tutorials, documentation, and personalized onboarding sessions. Our success team ensures you get maximum value from day one.',
      icon: Users,
      color: 'cyan'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Questions', color: 'emerald' },
    { id: 'general', label: 'General', color: 'emerald' },
    { id: 'security', label: 'Security', color: 'blue' },
    { id: 'performance', label: 'Performance', color: 'purple' },
    { id: 'support', label: 'Support', color: 'cyan' }
  ];

  const colorVariants = {
    emerald: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/20',
      gradient: 'from-emerald-400 to-emerald-600',
      shadow: 'shadow-emerald-400/20'
    },
    blue: {
      text: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/20',
      gradient: 'from-blue-400 to-blue-600',
      shadow: 'shadow-blue-400/20'
    },
    purple: {
      text: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'border-purple-400/20',
      gradient: 'from-purple-400 to-purple-600',
      shadow: 'shadow-purple-400/20'
    },
    cyan: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      border: 'border-cyan-400/20',
      gradient: 'from-cyan-400 to-cyan-600',
      shadow: 'shadow-cyan-400/20'
    }
  };

  useEffect(() => {
    let filtered = faqData;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFAQs(filtered);
    setActiveIndex(null); // Reset active index when filtering
  }, [searchQuery, selectedCategory]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const stats = [
    { number: '500+', label: 'Questions Answered', color: 'emerald' },
    { number: '24/7', label: 'Support Available', color: 'blue' },
    { number: '< 2min', label: 'Response Time', color: 'purple' },
    { number: '99.9%', label: 'Resolution Rate', color: 'cyan' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-neutral-950 py-8 md:py-12 lg:py-20 px-4">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes smoothFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.08;
          }
          25% { 
            transform: translateY(-15px) translateX(8px) scale(1.03);
            opacity: 0.12;
          }
          50% { 
            transform: translateY(-10px) translateX(-3px) scale(1.06);
            opacity: 0.15;
          }
          75% { 
            transform: translateY(-18px) translateX(12px) scale(1.03);
            opacity: 0.12;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .faq-enter {
          animation: fadeInUp 0.4s ease-out;
        }
        
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }
        
        .accordion-content.active {
          max-height: 500px;
          transition: max-height 0.4s ease-in;
        }
      `}</style>

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-purple-400/3 via-transparent to-emerald-400/3" />
        
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-3xl opacity-10"
              style={{
                left: `${15 + (i * 18)}%`,
                top: `${10 + (i * 15)}%`,
                width: `${60 + Math.random() * 40}px`,
                height: `${60 + Math.random() * 40}px`,
                background: `linear-gradient(135deg, 
                  ${i % 4 === 0 ? '#8b5cf6' : i % 4 === 1 ? '#06b6d4' : i % 4 === 2 ? '#3b82f6' : '#10b981'} 0%, 
                  transparent 70%)`,
                animation: `smoothFloat ${8 + i * 1.2}s ease-in-out infinite`,
                animationDelay: `${i * 1.5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div 
        ref={sectionRef}
        className="relative z-10 max-w-6xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <div 
            className={`inline-flex items-center px-4 py-2 rounded-full bg-neutral-900/80 border border-emerald-400/30 text-emerald-400 font-mono text-sm mb-4 md:mb-6 shadow-lg shadow-emerald-400/10 backdrop-blur-sm transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <HelpCircle className="mr-2 h-4 w-4 animate-pulse" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 
            className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-emerald-400 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            Got <span className="text-emerald-400 animate-pulse">Questions?</span> We've Got Answers
          </h2>

          <p 
            className={`text-sm md:text-base lg:text-lg xl:text-xl text-neutral-400 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            Find answers to the most <span className="text-white font-medium">common questions</span> about our platform. 
            Can't find what you're looking for? <span className="text-emerald-400 font-medium">Contact our support team</span>.
          </p>
        </div>

        {/* Stats Section */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-8 md:mb-12 transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          {stats.map((stat, index) => {
            const colors = colorVariants[stat.color];
            return (
              <div
                key={index}
                className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className={`relative p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl bg-neutral-900/50 border border-neutral-700/50 backdrop-blur-sm hover:border-neutral-600 transition-all duration-300 ${colors.shadow}`}>
                  <div className="text-center">
                    <div className={`text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold mb-1 ${colors.text}`}>{stat.number}</div>
                    <div className="text-xs md:text-sm text-neutral-400">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filter Section */}
        <div 
          className={`mb-8 md:mb-12 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-6 md:mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 backdrop-blur-sm transition-all duration-300"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((category) => {
              const colors = colorVariants[category.color];
              const isActive = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                    isActive 
                      ? `${colors.bg} ${colors.text} border ${colors.border} shadow-lg ${colors.shadow}` 
                      : 'bg-neutral-900/50 text-neutral-400 border border-neutral-700/50 hover:border-neutral-600 hover:text-neutral-300'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ List */}
        <div 
          className={`space-y-4 md:space-y-6 transform transition-all duration-700 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 text-lg">No questions found matching your search.</p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => {
              const Icon = faq.icon;
              const colors = colorVariants[faq.color];
              const isActive = activeIndex === index;
              
              return (
                <div
                  key={faq.id}
                  className={`group relative bg-neutral-900/50 border border-neutral-700/50 rounded-xl md:rounded-2xl backdrop-blur-sm hover:border-neutral-600 transition-all duration-300 faq-enter ${isActive ? colors.shadow : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-4 md:px-6 py-4 md:py-6 text-left focus:outline-none focus:ring-2 focus:ring-emerald-400/50 rounded-xl md:rounded-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1 mr-4">
                        <div className={`p-2 md:p-3 rounded-lg bg-gradient-to-r ${colors.gradient} shadow-lg mr-3 md:mr-4`}>
                          <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                          {faq.question}
                        </h3>
                      </div>
                      <div className={`p-2 rounded-full transition-all duration-300 ${isActive ? `${colors.bg} ${colors.text}` : 'bg-neutral-800 text-neutral-400'}`}>
                        {isActive ? (
                          <Minus className="h-4 w-4 md:h-5 md:w-5" />
                        ) : (
                          <Plus className="h-4 w-4 md:h-5 md:w-5" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  <div className={`accordion-content ${isActive ? 'active' : ''}`}>
                    <div className="px-4 md:px-6 pb-4 md:pb-6">
                      <div className="ml-12 md:ml-16 pt-2 md:pt-4 border-t border-neutral-700/50">
                        <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Contact Section */}
        <div 
          className={`text-center mt-12 md:mt-16 lg:mt-20 transform transition-all duration-700 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <div className="max-w-2xl mx-auto p-6 md:p-8 rounded-2xl bg-gradient-to-br from-neutral-900/90 via-neutral-800/50 to-neutral-900/90 border border-neutral-700/50 backdrop-blur-sm">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-neutral-400 mb-6">
              Our support team is available 24/7 to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <div className="flex items-center justify-center px-4 py-2 bg-emerald-400/10 border border-emerald-400/20 rounded-lg text-emerald-400 text-sm">
                <Clock className="h-4 w-4 mr-2" />
                Available 24/7
              </div>
              <div className="flex items-center justify-center px-4 py-2 bg-blue-400/10 border border-blue-400/20 rounded-lg text-blue-400 text-sm">
                <Users className="h-4 w-4 mr-2" />
                Expert Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;