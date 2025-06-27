import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userPlan, setUserPlan] = useState('Free');
  const [openNavigation, setOpenNavigation] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const timeoutRef = useRef(null);
  const isHoveringRef = useRef(false);

  // Refs for all interactive elements
  const navRef = useRef(null);
  const productsButtonRef = useRef(null);
  const productsMenuRef = useRef(null);
  const docsButtonRef = useRef(null);
  const docsMenuRef = useRef(null);
  const resourcesButtonRef = useRef(null);
  const resourcesMenuRef = useRef(null);
  const profileModalRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Check for admin/owner emails first
        if (currentUser.email === 'floxenstaff@gmail.com') {
          setUserPlan('Admin');
        } else if (currentUser.email === 'floxenowner@gmail.com') {
          setUserPlan('Owner');
        } else {
          // Check Firestore for regular user's plan
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserPlan(userDoc.data().plan || 'Free');
          } else {
            // Create a new user document if it doesn't exist
            await setDoc(doc(db, 'users', currentUser.uid), {
              displayName: currentUser.displayName || '',
              email: currentUser.email,
              plan: 'Free',
              createdAt: new Date().toISOString()
            });
            setUserPlan('Free');
          }
        }
      }
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event) => {
      if (profileModalRef.current && !profileModalRef.current.contains(event.target)) {
        setShowProfileModal(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  // Enhanced hover detection with precise boundaries
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!activeMenu) return;

      const button = 
        activeMenu === 'products' ? productsButtonRef.current :
        activeMenu === 'docs' ? docsButtonRef.current :
        resourcesButtonRef.current;

      const menu = 
        activeMenu === 'products' ? productsMenuRef.current :
        activeMenu === 'docs' ? docsMenuRef.current :
        resourcesMenuRef.current;

      if (!button || !menu) return;

      // Get precise boundaries with 1% buffer
      const buttonRect = button.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();

      // Create a connecting bridge between button and menu
      const bridgeArea = {
        left: Math.min(buttonRect.left, menuRect.left) - (window.innerWidth * 0.01),
        right: Math.max(buttonRect.right, menuRect.right) + (window.innerWidth * 0.01),
        top: Math.min(buttonRect.top, menuRect.top) - (window.innerHeight * 0.01),
        bottom: Math.max(buttonRect.bottom, menuRect.bottom) + (window.innerHeight * 0.01)
      };

      // Check if cursor is within the interactive zone
      const isInZone = 
        e.clientX >= bridgeArea.left &&
        e.clientX <= bridgeArea.right &&
        e.clientY >= bridgeArea.top && 
        e.clientY <= bridgeArea.bottom;

      if (!isInZone && !isHoveringRef.current) {
        if (!timeoutRef.current) {
          timeoutRef.current = setTimeout(() => {
            setActiveMenu(null);
          }, 100);
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

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
    setActiveMenu(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setUserPlan('Free');
    setShowLogoutConfirm(false);
    setShowProfileModal(false);
  };

  const goToDashboard = () => navigate("/dashboard");
  const goToPricing = () => navigate("/pricing");
  const goToSignUp = () => navigate("/Sign-Up");
  const goToEditProfile = () => {
    navigate("/profile");
    setShowProfileModal(false);
  };
  const goToPurchaseHistory = () => navigate("/purchase-history");
  const goToSupport = () => navigate("/support");

  const handleMenuEnter = (menuType) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setActiveMenu(menuType);
    isHoveringRef.current = true;
  };

  const handleMenuLeave = () => {
    isHoveringRef.current = false;
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

  const PlanBadge = ({ plan }) => {
    const getPlanStyles = () => {
      switch (plan) {
        case 'Free':
          return 'bg-gray-100 text-gray-800';
        case 'Premium':
          return 'bg-purple-100 text-purple-800';
        case 'Ultra':
          return 'bg-yellow-100 text-yellow-800';
        case 'Admin':
          return 'bg-blue-100 text-blue-800';
        case 'Owner':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
  
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${getPlanStyles()}`}>
        {plan}
      </span>
    );
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
        text-gray-800
        border-gray-200
      `,
      dashboard: `
        bg-gray-100 hover:bg-gray-200
        text-gray-800
        border-gray-300
      `,
      logout: `
        bg-red-500 hover:bg-red-600
        text-white
        border-red-600
      `,
      profile: `
        bg-transparent hover:bg-gray-100
        text-gray-800
        border-transparent
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

  // Profile Icon Component with image handling
  const ProfileIcon = () => (
    <div 
      className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors overflow-hidden ${
        showProfileModal ? 'bg-white' : 'bg-gray-200 hover:bg-gray-300'
      }`}
      onClick={() => setShowProfileModal(!showProfileModal)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  );

  return (
    <>
      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div 
            ref={profileModalRef}
            className="bg-white/95 backdrop-blur-lg rounded-xl p-6 w-full max-w-md border border-white/30"
          >
            <div className="flex items-start space-x-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{user?.displayName || 'User Name'}</h3>
                    <p className="text-sm text-gray-500">ID: {user?.uid?.substring(0, 7) || '1234567'}</p>
                    <div className="mt-1">
                      <PlanBadge plan={userPlan} />
                    </div>
                  </div>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={goToEditProfile}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-300 my-4"></div>
            
            <nav className="space-y-2">
              <button 
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={goToEditProfile}
              >
                Edit Profile
              </button>
              <button 
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={goToPurchaseHistory}
              >
                Purchase History
              </button>
              <button 
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={goToSupport}
              >
                Support
              </button>
              <button 
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                onClick={() => {
                  setShowProfileModal(false);
                  setShowLogoutConfirm(true);
                }}
              >
                Log Out
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 w-full max-w-sm border border-white/30">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {openNavigation && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleNavigation}
        />
      )}

      <header 
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-sm shadow-sm' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-8">
            <a 
              href="/" 
              className="text-xl font-bold tracking-tight text-gray-800"
            >
              FLOXEN ID
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
                    activeMenu === 'products' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Products
                  <ChevronIcon isOpen={activeMenu === 'products'} />
                </button>

                <div 
                  ref={productsMenuRef}
                  className={`absolute left-0 mt-2 w-[600px] rounded-lg bg-white/95 backdrop-blur-lg border border-white/30 shadow-xl overflow-hidden transition-all duration-200 origin-top ${
                    activeMenu === 'products' ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'
                  }`}
                  onMouseEnter={() => isHoveringRef.current = true}
                  onMouseLeave={handleMenuLeave}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                          Open-source
                        </h3>
                        <ul className="space-y-3">
                          {productsMenu.openSource.map((item, index) => (
                            <MenuItem key={`opensource-${index}`} {...item} darkText />
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                          Pro
                        </h3>
                        <ul className="space-y-3">
                          {productsMenu.pro.map((item, index) => (
                            <MenuItem key={`pro-${index}`} {...item} darkText />
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
                    activeMenu === 'docs' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Docs
                  <ChevronIcon isOpen={activeMenu === 'docs'} />
                </button>

                <div 
                  ref={docsMenuRef}
                  className={`absolute left-0 mt-2 w-[500px] rounded-lg bg-white/95 backdrop-blur-lg border border-white/30 shadow-xl overflow-hidden transition-all duration-200 origin-top ${
                    activeMenu === 'docs' ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'
                  }`}
                  onMouseEnter={() => isHoveringRef.current = true}
                  onMouseLeave={handleMenuLeave}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                          Guides
                        </h3>
                        <ul className="space-y-3">
                          {docsMenu.guides.map((item, index) => (
                            <MenuItem key={`guide-${index}`} {...item} darkText />
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                          Reference
                        </h3>
                        <ul className="space-y-3">
                          {docsMenu.reference.map((item, index) => (
                            <MenuItem key={`reference-${index}`} {...item} darkText />
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
                    activeMenu === 'resources' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Resources
                  <ChevronIcon isOpen={activeMenu === 'resources'} />
                </button>

                <div 
                  ref={resourcesMenuRef}
                  className={`absolute left-0 mt-2 w-[500px] rounded-lg bg-white/95 backdrop-blur-lg border border-white/30 shadow-xl overflow-hidden transition-all duration-200 origin-top ${
                    activeMenu === 'resources' ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'
                  }`}
                  onMouseEnter={() => isHoveringRef.current = true}
                  onMouseLeave={handleMenuLeave}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                          Company
                        </h3>
                        <ul className="space-y-3">
                          {resourcesMenu.company.map((item, index) => (
                            <MenuItem key={`company-${index}`} {...item} darkText />
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                          Updates
                        </h3>
                        <ul className="space-y-3">
                          {resourcesMenu.updates.map((item, index) => (
                            <MenuItem key={`update-${index}`} {...item} darkText />
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
                  location.pathname === '/pricing' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pricing
              </button>
            </nav>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-2">
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hidden md:block"
              >
                <span className="sr-only">Discord</span>
                <DiscordIcon />
              </a>
              {user && <PlanBadge plan={userPlan} />}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <ElegantButton onClick={goToDashboard} variant="dashboard">
                    Dashboard
                  </ElegantButton>
                  <ProfileIcon />
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
              className="ml-auto md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              {openNavigation ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav
          className={`${
            openNavigation ? 'block' : 'hidden'
          } fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 md:hidden transition-all duration-200 ease-in-out`}
          style={{
            maxHeight: openNavigation ? 'calc(100vh - 64px)' : '0',
            overflow: 'hidden'
          }}
        >
          <div className="px-4 py-3 space-y-1">
            <a
              href="/products"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              onClick={handleClick}
            >
              Products
            </a>

            <a
              href="/docs"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              onClick={handleClick}
            >
              Docs
            </a>

            <a
              href="/resources"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
                location.pathname === '/pricing' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Pricing
            </button>

            <div className="pt-4 pb-2 border-t border-gray-200 flex flex-col space-y-3">
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
                  <div 
                    className="flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                    onClick={() => {
                      setShowProfileModal(true);
                      handleClick();
                    }}
                  >
                    <ProfileIcon />
                    <span className="ml-2">Profile</span>
                  </div>
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
    className="h-6 w-6 text-gray-600"
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
    className="h-6 w-6 text-gray-600"
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

const MenuItem = ({ title, description, url, darkText = false }) => {
  return (
    <li>
      <a
        href={url}
        className={`group block rounded-md p-2 transition-colors duration-200 hover:bg-gray-100 ${
          darkText ? 'text-gray-800' : 'text-gray-600'
        }`}
      >
        <p className={`text-base font-medium group-hover:text-gray-900 ${
          darkText ? 'text-gray-800' : 'text-gray-700'
        }`}>
          {title}
        </p>
        <p className={`mt-1 text-sm ${
          darkText ? 'text-gray-600' : 'text-gray-500'
        }`}>{description}</p>
      </a>
    </li>
  );
};

export default Navbar;
