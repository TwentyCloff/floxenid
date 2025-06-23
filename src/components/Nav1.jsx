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
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef(null);

  // Refs for all interactive elements
  const navRef = useRef(null);
  const productsButtonRef = useRef(null);
  const productsMenuRef = useRef(null);
  const docsButtonRef = useRef(null);
  const docsMenuRef = useRef(null);
  const resourcesButtonRef = useRef(null);
  const resourcesMenuRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  // Enhanced hover detection with shape-based closing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!activeMenu) return;

      // Get all relevant elements
      const button = 
        activeMenu === 'products' ? productsButtonRef.current :
        activeMenu === 'docs' ? docsButtonRef.current :
        resourcesButtonRef.current;

      const menu = 
        activeMenu === 'products' ? productsMenuRef.current :
        activeMenu === 'docs' ? docsMenuRef.current :
        resourcesMenuRef.current;

      if (!button || !menu) return;

      // Get bounding rectangles
      const buttonRect = button.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();

      // Create an expanded hover area that connects button and menu
      const hoverArea = {
        left: Math.min(buttonRect.left, menuRect.left) - 20,
        right: Math.max(buttonRect.right, menuRect.right) + 20,
        top: Math.min(buttonRect.top, menuRect.top) - 10,
        bottom: Math.max(buttonRect.bottom, menuRect.bottom) + 10
      };

      // Check if cursor is outside the combined hover area
      if (
        e.clientX < hoverArea.left ||
        e.clientX > hoverArea.right ||
        e.clientY < hoverArea.top ||
        e.clientY > hoverArea.bottom
      ) {
        if (!timeoutRef.current) {
          timeoutRef.current = setTimeout(() => {
            if (!isHovering) {
              setActiveMenu(null);
            }
          }, 150); // 150ms delay before closing
        }
      } else {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeMenu, isHovering]);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
    setActiveMenu(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };
  const goToDashboard = () => navigate("/dashboard");
  const goToPricing = () => navigate("/pricing");
  const goToSignUp = () => navigate("/signup");

  const handleMenuEnter = (menuType) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setActiveMenu(menuType);
    setIsHovering(true);
  };

  const handleMenuLeave = () => {
    setIsHovering(false);
    // The shape-based detection will handle closing now
  };

  // Menu data
  const productsMenu = {
    openSource: [
      { title: "Once UI Core", description: "Open-source NPM package", url: "/core" },
      { title: "Once UI Starter", description: "Quick start from scratch", url: "/starter" },
      { title: "Magic Portfolio", description: "Free portfolio template", url: "/portfolio" },
    ],
    pro: [
      { title: "Magic Store", description: "Store for selling merch", url: "/store" },
      { title: "Magic Docs", description: "Automatic MDX documentation", url: "/magic-docs" },
      { title: "Magic Bio", description: "Link-in-bio site", url: "/bio" },
      { title: "Once UI Blocks", description: "Copy-paste sections", url: "/blocks" },
      { title: "Once UI for Figma", description: "Figma design system", url: "/figma" },
    ]
  };

  const docsMenu = {
    guides: [
      { title: "Getting Started", description: "Begin your Once UI journey", url: "/docs/getting-started" },
      { title: "Customization", description: "Tailor Once UI to your needs", url: "/docs/customization" },
    ],
    reference: [
      { title: "Components API", description: "Complete component reference", url: "/docs/components" },
      { title: "Theme Config", description: "Customize colors and styles", url: "/docs/theme" },
    ]
  };

  const resourcesMenu = {
    company: [
      { title: "About Us", description: "Learn about our mission", url: "/about" },
      { title: "Our Team", description: "Meet the creators", url: "/team" },
    ],
    updates: [
      { title: "Changelog", description: "Latest updates and changes", url: "/changelog" },
      { title: "Roadmap", description: "Future plans and features", url: "/roadmap" },
      { title: "Blog", description: "News and articles", url: "/blog" },
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

      <header 
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0E0E10]/90 backdrop-blur-sm' : 'bg-transparent'}`}
      >
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
                ref={productsButtonRef}
                onMouseEnter={() => handleMenuEnter('products')}
                onMouseLeave={handleMenuLeave}
              >
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                    activeMenu === 'products' ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Products
                  <ChevronIcon isOpen={activeMenu === 'products'} />
                </button>

                <div 
                  ref={productsMenuRef}
                  className={`absolute left-0 mt-2 w-[600px] rounded-lg bg-[#161618]/70 backdrop-blur-lg border border-gray-600/30 overflow-hidden transition-all duration-300 origin-top ${
                    activeMenu === 'products' ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'
                  }`}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={handleMenuLeave}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                          Open-source
                        </h3>
                        <ul className="space-y-4">
                          {productsMenu.openSource.map((item, index) => (
                            <MenuItem key={`opensource-${index}`} {...item} />
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
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
                ref={docsButtonRef}
                onMouseEnter={() => handleMenuEnter('docs')}
                onMouseLeave={handleMenuLeave}
              >
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                    activeMenu === 'docs' ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Docs
                  <ChevronIcon isOpen={activeMenu === 'docs'} />
                </button>

                <div 
                  ref={docsMenuRef}
                  className={`absolute left-0 mt-2 w-[500px] rounded-lg bg-[#161618]/70 backdrop-blur-lg border border-gray-600/30 overflow-hidden transition-all duration-300 origin-top ${
                    activeMenu === 'docs' ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'
                  }`}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={handleMenuLeave}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                          Guides
                        </h3>
                        <ul className="space-y-4">
                          {docsMenu.guides.map((item, index) => (
                            <MenuItem key={`guide-${index}`} {...item} />
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
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
                ref={resourcesButtonRef}
                onMouseEnter={() => handleMenuEnter('resources')}
                onMouseLeave={handleMenuLeave}
              >
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                    activeMenu === 'resources' ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Resources
                  <ChevronIcon isOpen={activeMenu === 'resources'} />
                </button>

                <div 
                  ref={resourcesMenuRef}
                  className={`absolute left-0 mt-2 w-[500px] rounded-lg bg-[#161618]/70 backdrop-blur-lg border border-gray-600/30 overflow-hidden transition-all duration-300 origin-top ${
                    activeMenu === 'resources' ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'
                  }`}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={handleMenuLeave}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                          Company
                        </h3>
                        <ul className="space-y-4">
                          {resourcesMenu.company.map((item, index) => (
                            <MenuItem key={`company-${index}`} {...item} />
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
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
                  location.pathname === '/pricing' ? 'text-white' : 'text-gray-300 hover:text-white'
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
              className="text-gray-300 hover:text-white transition-colors duration-200 hidden md:block"
            >
              <span className="sr-only">Discord</span>
              <DiscordIcon />
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
              {openNavigation ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Simplified version */}
        <nav
          className={`${
            openNavigation ? 'block' : 'hidden'
          } fixed top-16 left-0 right-0 bg-[#161618]/95 backdrop-blur-lg border-t border-gray-700/30 md:hidden transition-all duration-300 ease-in-out`}
          style={{
            maxHeight: openNavigation ? 'calc(100vh - 64px)' : '0',
            overflow: 'hidden'
          }}
        >
          <div className="px-4 py-3 space-y-1">
            <a
              href="/products"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800/50 hover:text-white"
              onClick={handleClick}
            >
              Products
            </a>

            <a
              href="/docs"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800/50 hover:text-white"
              onClick={handleClick}
            >
              Docs
            </a>

            <a
              href="/resources"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800/50 hover:text-white"
              onClick={handleClick}
            >
              Resources
            </a>

            <button
              onClick={() => {
                goToPricing();
                handleClick();
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/pricing' ? 'bg-gray-800/50 text-white' : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              Pricing
            </button>

            <div className="pt-4 pb-2 border-t border-gray-700/30 flex flex-col space-y-3">
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

// Icon Components
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
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const DiscordIcon = () => (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const MenuIcon = () => (
  <svg
    className="h-6 w-6 text-gray-300"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="h-6 w-6 text-gray-300"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const MenuItem = ({ title, description, url }) => {
  return (
    <li>
      <a
        href={url}
        className="group block rounded-md p-2 transition-colors duration-200 hover:bg-gray-800/50"
      >
        <p className="text-base font-medium text-white group-hover:text-white">
          {title}
        </p>
        <p className="mt-1 text-sm text-gray-300">{description}</p>
      </a>
    </li>
  );
};

export default Navbar;
