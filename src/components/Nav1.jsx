import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { 
  FiChevronDown, 
  FiX, 
  FiMenu,
  FiZap,
  FiLayers,
  FiUser,
  FiShoppingCart,
  FiFileText,
  FiSettings,
  FiLink,
  FiGrid,
  FiFigma,
  FiClock,
  FiCalendar,
  FiUsers,
  FiBookOpen,
  FiCode,
  FiPieChart,
  FiDollarSign,
  FiMessageSquare,
  FiLogOut,
  FiLogIn,
  FiUserPlus
} from "react-icons/fi";
import { FaDiscord } from "react-icons/fa";

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
        icon: <FiZap className="w-5 h-5 text-gray-400" />
      },
      { 
        title: "Once UI Starter", 
        description: "Quick start from scratch", 
        url: "/starter",
        icon: <FiLayers className="w-5 h-5 text-gray-400" />
      },
      { 
        title: "Magic Portfolio", 
        description: "Free portfolio template", 
        url: "/portfolio",
        icon: <FiUser className="w-5 h-5 text-gray-400" />
      },
    ],
    pro: [
      { 
        title: "Magic Store", 
        description: "Store for selling merch", 
        url: "/store",
        icon: <FiShoppingCart className="w-5 h-5 text-gray-400" />
      },
      { 
        title: "Magic Docs", 
        description: "Automatic MDX documentation", 
        url: "/magic-docs",
        icon: <FiFileText className="w-5 h-5 text-gray-400" />
      },
      { 
        title: "Magic Bio", 
        description: "Link-in-bio site", 
        url: "/bio",
        icon: <FiLink className="w-5 h-5 text-gray-400" />
      },
      { 
        title: "Once UI Blocks", 
        description: "Copy-paste sections", 
        url: "/blocks",
        icon: <FiGrid className="w-5 h-5 text-gray-400" />
      },
      { 
        title: "Once UI for Figma", 
        description: "Figma design system", 
        url: "/figma",
        icon: <FiFigma className="w-5 h-5 text-gray-400" />
      },
    ]
  };

  const docsMenu = {
    guides: [
      { 
        title: "Getting Started", 
        description: "Begin your Once UI journey", 
        url: "/docs/getting-started",
        icon: <FiClock className="w-5 h-5 text-gray-400" />
      },
      { 
        title: "Customization", 
        description: "Tailor Once UI to your needs", 
        url: "/docs/customization",
        icon: <FiSettings className="w-5 h-5 text-gray-400" />
      },
    ],
    reference: [
      { 
        title: "Components API", 
        description: "Complete component reference", 
        url: "/docs/components",
        icon: <FiCode className="w-5 h-5 text-gray-400" />
      },
      { 
        title: "Theme Config", 
        description: "Customize colors and styles", 
        url: "/docs/theme",
        icon: <FiPieChart className="w-5 h-5 text-gray-400" />
      },
    ]
  };

  const resourcesMenu = {
    company: [
      { 
        title: "About Us", 
        description: "Learn about our mission", 
        url: "/about",
        icon: <FiUsers className="w-5 h-5 text-gray-400" />
      },
      { 
        title: "Our Team", 
        description: "Meet the creators", 
        url: "/team",
        icon: <FiUser className="w-5 h-5 text-gray-400" />
      },
    ],
    updates: [
      { 
        title: "Changelog", 
        description: "Latest updates and changes", 
        url: "/changelog",
        icon: <FiCalendar className="w-5 h-5 text-gray-400" />
      },
      { 
        title: "Roadmap", 
        description: "Future plans and features", 
        url: "/roadmap",
        icon: <FiBookOpen className="w-5 h-5 text-gray-400" />
      },
      { 
        title: "Blog", 
        description: "News and articles", 
        url: "/blog",
        icon: <FiMessageSquare className="w-5 h-5 text-gray-400" />
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
              className="text-xl font-bold tracking-tight text-white flex items-center"
            >
              <FiZap className="mr-2 text-purple-400" />
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
                  <FiChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    activeMenu === 'products' ? 'rotate-180' : ''
                  }`} />
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
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                          <FiZap className="mr-2" />
                          Open-source
                        </h3>
                        <ul className="space-y-4">
                          {productsMenu.openSource.map((item, index) => (
                            <MenuItem key={`opensource-${index}`} {...item} />
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                          <FiDollarSign className="mr-2" />
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
                  <FiChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    activeMenu === 'docs' ? 'rotate-180' : ''
                  }`} />
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
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                          <FiBookOpen className="mr-2" />
                          Guides
                        </h3>
                        <ul className="space-y-4">
                          {docsMenu.guides.map((item, index) => (
                            <MenuItem key={`guide-${index}`} {...item} />
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                          <FiCode className="mr-2" />
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
                  <FiChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    activeMenu === 'resources' ? 'rotate-180' : ''
                  }`} />
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
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                          <FiUsers className="mr-2" />
                          Company
                        </h3>
                        <ul className="space-y-4">
                          {resourcesMenu.company.map((item, index) => (
                            <MenuItem key={`company-${index}`} {...item} />
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                          <FiCalendar className="mr-2" />
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
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                  location.pathname === '/pricing' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <FiDollarSign className="mr-2" />
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
              <FaDiscord className="h-6 w-6" />
            </a>

            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <ElegantButton onClick={goToDashboard} variant="dashboard" className="flex items-center">
                    <FiUser className="mr-2" />
                    Dashboard
                  </ElegantButton>
                  <ElegantButton onClick={handleLogout} variant="logout" className="flex items-center">
                    <FiLogOut className="mr-2" />
                    Logout
                  </ElegantButton>
                </>
              ) : (
                <ElegantButton onClick={goToSignUp} variant="primary" className="flex items-center">
                  <FiUserPlus className="mr-2" />
                  Sign Up
                </ElegantButton>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleNavigation}
              className="ml-auto md:hidden p-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              {openNavigation ? (
                <FiX className="h-6 w-6 text-gray-300" />
              ) : (
                <FiMenu className="h-6 w-6 text-gray-300" />
              )}
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
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white flex items-center"
              onClick={handleClick}
            >
              <FiZap className="mr-3" />
              Products
            </a>

            {/* Docs in mobile - simple link */}
            <a
              href="/docs"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white flex items-center"
              onClick={handleClick}
            >
              <FiFileText className="mr-3" />
              Docs
            </a>

            {/* Resources in mobile - simple link */}
            <a
              href="/resources"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white flex items-center"
              onClick={handleClick}
            >
              <FiBookOpen className="mr-3" />
              Resources
            </a>

            {/* Pricing in mobile */}
            <button
              onClick={() => {
                goToPricing();
                handleClick();
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center ${
                location.pathname === '/pricing' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <FiDollarSign className="mr-3" />
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
                    className="w-full flex items-center justify-center"
                  >
                    <FiUser className="mr-2" />
                    Dashboard
                  </ElegantButton>
                  <ElegantButton 
                    onClick={() => {
                      handleLogout();
                      handleClick();
                    }} 
                    variant="logout"
                    className="w-full flex items-center justify-center"
                  >
                    <FiLogOut className="mr-2" />
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
                  className="w-full flex items-center justify-center"
                >
                  <FiUserPlus className="mr-2" />
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
