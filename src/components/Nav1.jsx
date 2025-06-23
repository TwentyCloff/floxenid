import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [openNavigation, setOpenNavigation] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const menuRefs = {
    products: useRef(null),
    docs: useRef(null),
    resources: useRef(null)
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (activeMenu && menuRefs[activeMenu].current && 
          !menuRefs[activeMenu].current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleMenuButtonClick = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };
  const goToDashboard = () => navigate("/dashboard");
  const goToPricing = () => navigate("/pricing");
  const goToSignUp = () => navigate("/signup");

  // Menu data with icons
  const productsMenu = {
    openSource: [
      { 
        title: "Once UI Core", 
        description: "Open-source NPM package", 
        url: "/core",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      },
      { 
        title: "Once UI Starter", 
        description: "Quick start from scratch", 
        url: "/starter",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      },
      { 
        title: "Magic Portfolio", 
        description: "Free portfolio template", 
        url: "/portfolio",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
      },
    ],
    pro: [
      { 
        title: "Magic Store", 
        description: "Store for selling merch", 
        url: "/store",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        )
      },
      { 
        title: "Magic Docs", 
        description: "Automatic MDX documentation", 
        url: "/magic-docs",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      },
      { 
        title: "Magic Bio", 
        description: "Link-in-bio site", 
        url: "/bio",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        )
      },
      { 
        title: "Once UI Blocks", 
        description: "Copy-paste sections", 
        url: "/blocks",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        )
      },
      { 
        title: "Once UI for Figma", 
        description: "Figma design system", 
        url: "/figma",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        )
      },
    ]
  };

  const docsMenu = {
    guides: [
      { 
        title: "Getting Started", 
        description: "Begin your Once UI journey", 
        url: "/docs/getting-started",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      },
      { 
        title: "Customization", 
        description: "Tailor Once UI to your needs", 
        url: "/docs/customization",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      },
    ],
    reference: [
      { 
        title: "Components API", 
        description: "Complete component reference", 
        url: "/docs/components",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )
      },
      { 
        title: "Theme Config", 
        description: "Customize colors and styles", 
        url: "/docs/theme",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        )
      },
    ]
  };

  const resourcesMenu = {
    company: [
      { 
        title: "About Us", 
        description: "Learn about our mission", 
        url: "/about",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
      },
      { 
        title: "Our Team", 
        description: "Meet the creators", 
        url: "/team",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      },
    ],
    updates: [
      { 
        title: "Changelog", 
        description: "Latest updates and changes", 
        url: "/changelog",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      { 
        title: "Roadmap", 
        description: "Future plans and features", 
        url: "/roadmap",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        )
      },
      { 
        title: "Blog", 
        description: "News and articles", 
        url: "/blog",
        icon: (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        )
      },
    ]
  };

  const ElegantButton = ({ children, onClick, variant = "primary", className = "" }) => {
    const baseStyle = `
      relative overflow-hidden
      px-6 py-2.5 rounded-md
      text-sm font-medium
      transition-all duration-200
      border
      backdrop-blur-sm
      hover:shadow-lg
      active:scale-[0.98]
    `;

    const variants = {
      primary: `
        bg-white hover:bg-gray-100
        text-black
        border-gray-200
      `,
      dashboard: `
        bg-[#160e29] hover:bg-[#1f1638]
        text-indigo-100 hover:text-indigo-50
        border-indigo-900/50 hover:border-indigo-500/30
      `,
      logout: `
        bg-[#180a1a] hover:bg-[#231025]
        text-pink-100 hover:text-pink-50
        border-pink-900/50 hover:border-pink-500/30
      `
    };

    return (
      <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    );
  };

  return (
    <>
      {openNavigation && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleNavigation}
        />
      )}

      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0E0E10]/90 backdrop-blur-sm' : 'bg-[#0E0E10]/80 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-8">
            <a 
              href="/" 
              className="text-xl font-bold tracking-tight text-white"
            >
              once ui
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {/* Products Menu */}
              <div 
                className="relative"
                ref={menuRefs.products}
                onMouseEnter={() => setActiveMenu('products')}
                onMouseLeave={() => {
                  if (!menuRefs.products.current?.matches(':hover')) {
                    setActiveMenu(null);
                  }
                }}
              >
                <button 
                  onClick={() => handleMenuButtonClick('products')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                    activeMenu === 'products' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Products
                  <ChevronIcon isOpen={activeMenu === 'products'} />
                </button>

                <div 
                  className={`absolute left-0 mt-2 w-[600px] rounded-lg shadow-lg bg-[#161618]/90 backdrop-blur-md border border-gray-700/50 overflow-hidden transition-all duration-300 origin-top ${
                    activeMenu === 'products' ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'
                  }`}
                  onMouseEnter={() => setActiveMenu('products')}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                          Open-source
                        </h3>
                        <ul className="space-y-4">
                          {productsMenu.openSource.map((item, index) => (
                            <MenuItem key={`opensource-${index}`} {...item} />
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                          Pro
                        </h3>
                        <ul className="space-y-4">
                          {productsMenu.pro.map((item, index) => (
                            <MenuItem key={`pro-${index}`} {...item} />
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Docs Menu */}
              <div 
                className="relative"
                ref={menuRefs.docs}
                onMouseEnter={() => setActiveMenu('docs')}
                onMouseLeave={() => {
                  if (!menuRefs.docs.current?.matches(':hover')) {
                    setActiveMenu(null);
                  }
                }}
              >
                <button 
                  onClick={() => handleMenuButtonClick('docs')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                    activeMenu === 'docs' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Docs
                  <ChevronIcon isOpen={activeMenu === 'docs'} />
                </button>

                <div 
                  className={`absolute left-0 mt-2 w-[500px] rounded-lg shadow-lg bg-[#161618]/90 backdrop-blur-md border border-gray-700/50 overflow-hidden transition-all duration-300 origin-top ${
                    activeMenu === 'docs' ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'
                  }`}
                  onMouseEnter={() => setActiveMenu('docs')}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                          Guides
                        </h3>
                        <ul className="space-y-4">
                          {docsMenu.guides.map((item, index) => (
                            <MenuItem key={`guide-${index}`} {...item} />
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                          Reference
                        </h3>
                        <ul className="space-y-4">
                          {docsMenu.reference.map((item, index) => (
                            <MenuItem key={`reference-${index}`} {...item} />
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resources Menu */}
              <div 
                className="relative"
                ref={menuRefs.resources}
                onMouseEnter={() => setActiveMenu('resources')}
                onMouseLeave={() => {
                  if (!menuRefs.resources.current?.matches(':hover')) {
                    setActiveMenu(null);
                  }
                }}
              >
                <button 
                  onClick={() => handleMenuButtonClick('resources')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                    activeMenu === 'resources' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Resources
                  <ChevronIcon isOpen={activeMenu === 'resources'} />
                </button>

                <div 
                  className={`absolute left-0 mt-2 w-[500px] rounded-lg shadow-lg bg-[#161618]/90 backdrop-blur-md border border-gray-700/50 overflow-hidden transition-all duration-300 origin-top ${
                    activeMenu === 'resources' ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'
                  }`}
                  onMouseEnter={() => setActiveMenu('resources')}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                          Company
                        </h3>
                        <ul className="space-y-4">
                          {resourcesMenu.company.map((item, index) => (
                            <MenuItem key={`company-${index}`} {...item} />
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                          Updates
                        </h3>
                        <ul className="space-y-4">
                          {resourcesMenu.updates.map((item, index) => (
                            <MenuItem key={`update-${index}`} {...item} />
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Link */}
              <button
                onClick={goToPricing}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === '/pricing' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Pricing
              </button>
            </nav>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-6">
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200 hidden md:block"
            >
              <span className="sr-only">Discord</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>

            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <ElegantButton onClick={goToDashboard} variant="dashboard">
                    Dashboard
                  </ElegantButton>
                  <ElegantButton onClick={handleLogout} variant="logout">
                    Logout
                  </ElegantButton>
                </>
              ) : (
                <ElegantButton onClick={goToSignUp} variant="primary">
                  Sign Up
                </ElegantButton>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleNavigation}
              className="ml-auto md:hidden p-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <svg
                className="h-6 w-6 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {openNavigation ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Simplified version without mega menus */}
        <nav
          className={`${
            openNavigation ? 'block' : 'hidden'
          } fixed top-16 left-0 right-0 bg-[#161618]/95 backdrop-blur-md border-t border-gray-700/50 md:hidden transition-all duration-300 ease-in-out`}
          style={{
            maxHeight: openNavigation ? 'calc(100vh - 64px)' : '0',
            overflow: 'hidden'
          }}
        >
          <div className="px-4 py-3 space-y-1">
            {/* Products in mobile - simple link */}
            <a
              href="/products"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={handleClick}
            >
              Products
            </a>

            {/* Docs in mobile - simple link */}
            <a
              href="/docs"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={handleClick}
            >
              Docs
            </a>

            {/* Resources in mobile - simple link */}
            <a
              href="/resources"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={handleClick}
            >
              Resources
            </a>

            {/* Pricing in mobile */}
            <button
              onClick={() => {
                goToPricing();
                handleClick();
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/pricing' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Pricing
            </button>

            {/* Mobile buttons */}
            <div className="pt-4 pb-2 border-t border-gray-700/50 flex flex-col space-y-3">
              {user ? (
                <>
                  <ElegantButton 
                    onClick={() => {
                      goToDashboard();
                      handleClick();
                    }} 
                    variant="dashboard"
                    className="w-full"
                  >
                    Dashboard
                  </ElegantButton>
                  <ElegantButton 
                    onClick={() => {
                      handleLogout();
                      handleClick();
                    }} 
                    variant="logout"
                    className="w-full"
                  >
                    Logout
                  </ElegantButton>
                </>
              ) : (
                <ElegantButton 
                  onClick={() => {
                    goToSignUp();
                    handleClick();
                  }} 
                  variant="primary"
                  className="w-full"
                >
                  Sign Up
                </ElegantButton>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

const ChevronIcon = ({ isOpen }) => (
  <svg
    className={`ml-1 h-5 w-5 transition-transform duration-200 ${
      isOpen ? "rotate-180" : ""
    }`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const MenuItem = ({ title, description, url, icon }) => {
  return (
    <li>
      <a
        href={url}
        className="group flex items-start p-3 rounded-md transition-colors duration-200 hover:bg-gray-800/50"
      >
        <div className="flex-shrink-0 mt-0.5 mr-3">
          {icon}
        </div>
        <div>
          <p className="text-base font-medium text-white group-hover:text-white">
            {title}
          </p>
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
      </a>
    </li>
  );
};

export default Navbar;
