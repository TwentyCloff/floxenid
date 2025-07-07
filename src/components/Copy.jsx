'use client';

import { useEffect, useRef, useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Instagram, 
  Linkedin,
  Send,
  ArrowUp,
  Star,
  Heart,
  ExternalLink,
  Code,
  Zap,
  Shield,
  Globe,
  Terminal,
  Layers,
  BookOpen,
  Users,
  Sparkles,
  Rocket,
  Settings,
  Play,
  Download,
  FileText,
  Video,
  HelpCircle,
  MessageCircle,
  Headphones
} from 'lucide-react';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "AI Assistant", href: "#ai-assistant", icon: Sparkles },
        { name: "Code Generator", href: "#code-generator", icon: Code },
        { name: "API Tools", href: "#api-tools", icon: Settings },
        { name: "Analytics", href: "#analytics", icon: Zap },
        { name: "Security", href: "#security", icon: Shield },
        { name: "Integrations", href: "#integrations", icon: Globe }
      ]
    },
    {
      title: "Docs",
      links: [
        { name: "Getting Started", href: "#getting-started", icon: Play },
        { name: "API Reference", href: "#api-reference", icon: FileText },
        { name: "Tutorials", href: "#tutorials", icon: Video },
        { name: "Examples", href: "#examples", icon: Code },
        { name: "SDK Downloads", href: "#sdk-downloads", icon: Download }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Community", href: "#community", icon: Users },
        { name: "Blog", href: "#blog", icon: FileText },
        { name: "Help Center", href: "#help-center", icon: HelpCircle },
        { name: "Discord", href: "#discord", icon: MessageCircle },
        { name: "Support", href: "#support", icon: Headphones }
      ]
    },
    {
      title: "Pricing",
      links: [
        { name: "Free Plan", href: "#free-plan", icon: Star },
        { name: "Pro Plan", href: "#pro-plan", icon: Rocket },
        { name: "Enterprise", href: "#enterprise", icon: Shield },
        { name: "Compare Plans", href: "#compare-plans", icon: FileText }
      ]
    }
  ];

  const socialLinks = [
    { 
      name: "GitHub", 
      icon: Github, 
      href: "https://github.com/floxen", 
      color: "hover:text-gray-300",
      bg: "hover:bg-gray-800"
    },
    { 
      name: "Twitter", 
      icon: Twitter, 
      href: "https://twitter.com/floxen", 
      color: "hover:text-blue-400",
      bg: "hover:bg-blue-950"
    },
    { 
      name: "Instagram", 
      icon: Instagram, 
      href: "https://instagram.com/floxen", 
      color: "hover:text-pink-400",
      bg: "hover:bg-pink-950"
    },
    { 
      name: "LinkedIn", 
      icon: Linkedin, 
      href: "https://linkedin.com/company/floxen", 
      color: "hover:text-blue-500",
      bg: "hover:bg-blue-950"
    },
    { 
      name: "Discord", 
      icon: MessageCircle, 
      href: "https://discord.gg/floxen", 
      color: "hover:text-purple-400",
      bg: "hover:bg-purple-950"
    }
  ];

  const handleSubscribe = () => {
    if (email.trim()) {
      console.log('Subscribing email:', email);
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer 
      ref={footerRef}
      className="relative bg-neutral-950 border-t border-neutral-800/50"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950 to-black opacity-50" />
      
      {/* Glowing accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-30" />
      
      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        
        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand section */}
          <div className="lg:col-span-4">
            <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              
              {/* Logo */}
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center font-bold text-neutral-900 shadow-2xl">
                    FX
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-lg" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">FLOXEN</h3>
                  <p className="text-sm text-neutral-400 mt-1">Developer Platform</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-neutral-300 leading-relaxed mb-8 text-base">
                Empowering developers with AI-powered tools and seamless integrations. 
                <span className="text-emerald-400 font-medium"> Build faster, deploy smarter</span>.
              </p>

              {/* Contact info */}
              <div className="space-y-4">
                <div className="flex items-center text-neutral-300 hover:text-emerald-400 transition-colors duration-300 cursor-pointer group">
                  <div className="flex items-center justify-center w-8 h-8 bg-neutral-800 rounded-lg mr-3 group-hover:bg-emerald-900 transition-colors duration-300">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span>hello@floxen.dev</span>
                </div>
                <div className="flex items-center text-neutral-300 hover:text-emerald-400 transition-colors duration-300 cursor-pointer group">
                  <div className="flex items-center justify-center w-8 h-8 bg-neutral-800 rounded-lg mr-3 group-hover:bg-emerald-900 transition-colors duration-300">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-neutral-300 hover:text-emerald-400 transition-colors duration-300 cursor-pointer group">
                  <div className="flex items-center justify-center w-8 h-8 bg-neutral-800 rounded-lg mr-3 group-hover:bg-emerald-900 transition-colors duration-300">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation sections */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {footerSections.map((section, index) => (
                <div
                  key={index}
                  className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wide">
                    {section.title}
                  </h4>
                  <ul className="space-y-4">
                    {section.links.map((link, linkIndex) => {
                      const Icon = link.icon;
                      return (
                        <li key={linkIndex}>
                          <a
                            href={link.href}
                            className="group flex items-center text-neutral-400 hover:text-emerald-400 transition-all duration-300"
                          >
                            <Icon className="h-4 w-4 mr-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                              {link.name}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter section */}
          <div className="lg:col-span-2">
            <div 
              className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '800ms' }}
            >
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wide">
                Stay Updated
              </h4>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Get the latest updates on new features, AI improvements, and developer resources.
              </p>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  />
                </div>
                <button
                  onClick={handleSubscribe}
                  disabled={isSubscribed}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isSubscribed 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-neutral-900 hover:shadow-lg hover:shadow-emerald-500/25'
                  }`}
                >
                  {isSubscribed ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Subscribe
                    </>
                  )}
                </button>
              </div>

              {/* Quick Links */}
              <div className="mt-8 pt-6 border-t border-neutral-800">
                <h5 className="text-white font-medium mb-4 text-sm">Quick Actions</h5>
                <div className="space-y-3">
                  <a
                    href="#status"
                    className="flex items-center text-neutral-400 hover:text-emerald-400 transition-colors duration-300 group"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:bg-emerald-400 transition-colors duration-300" />
                    <span className="text-sm">System Status</span>
                  </a>
                  <a
                    href="#roadmap"
                    className="flex items-center text-neutral-400 hover:text-emerald-400 transition-colors duration-300 group"
                  >
                    <Rocket className="w-4 h-4 mr-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="text-sm">Roadmap</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 mb-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          
          {/* Social links */}
          <div 
            className={`flex items-center space-x-4 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '1000ms' }}
          >
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-400 transition-all duration-300 hover:border-neutral-600 hover:scale-110 ${social.color} ${social.bg}`}
                  title={social.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <div 
            className={`text-center md:text-right transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '1200ms' }}
          >
            <p className="text-neutral-400 mb-2">
              © 2025 <span className="text-emerald-400 font-medium">FLOXEN</span>. All rights reserved.
            </p>
            <p className="text-neutral-500 text-sm flex items-center justify-center md:justify-end">
              Made with <Heart className="h-4 w-4 mx-1 text-red-400" /> by developers, for developers
            </p>
          </div>
        </div>

        {/* Back to top button */}
        {isVisible && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-neutral-900 rounded-full shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-30" />
    </footer>
  );
};

export default Footer;