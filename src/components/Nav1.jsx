import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [openNavigation, setOpenNavigation] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
  };

  const handleLogin = () => navigate("/login");
  const handleSignUp = () => navigate("/signup");
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };
  const goToDashboard = () => navigate("/dashboard");

  // Navigation items
  const navigation = [
    { id: "home", title: "Home", url: "/" },
    { id: "features", title: "Features", url: "/features" },
    { id: "pricing", title: "Pricing", url: "/pricing" },
    { id: "docs", title: "Documentation", url: "/docs", external: true },
  ];

  // Products menu items
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

  const ElegantButton = ({ children, onClick, variant = "primary" }) => {
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
        bg-[#1a0d2b] hover:bg-[#231538]
        text-purple-100 hover:text-white
        border-purple-900/50 hover:border-purple-500/30
        shadow-[inset_0_1px_0_0_rgba(148,102,255,0.2)]
      `,
      secondary: `
        bg-[#0f0918] hover:bg-[#1a1126]
        text-purple-200 hover:text-purple-50
        border-purple-800/30 hover:border-purple-500/20
        shadow-[inset_0_1px_0_0_rgba(148,102,255,0.1)]
      `,
      dashboard: `
        bg-[#160e29] hover:bg-[#1f1638]
        text-indigo-100 hover:text-indigo-50
        border-indigo-900/50 hover:border-indigo-500/30
        shadow-[inset_0_1px_0_0_rgba(99,102,241,0.2)]
      `,
      logout: `
        bg-[#180a1a] hover:bg-[#231025]
        text-pink-100 hover:text-pink-50
        border-pink-900/50 hover:border-pink-500/30
        shadow-[inset_0_1px_0_0_rgba(236,72,153,0.2)]
      `
    };

    return (
      <button onClick={onClick} className={`${baseStyle} ${variants[variant]}`}>
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
          <span className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
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

      <header className="fixed top-0 left-0 w-full z-50 bg-[#0E0E10] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-8">
            <a 
              href="/" 
              className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            >
              once ui
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target={item.external ? "_blank" : "_self"}
                  rel={item.external ? "noreferrer noopener" : undefined}
                  className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.url ? "text-white font-semibold" : ""
                  }`}
                >
                  {item.title}
                </a>
              ))}

              {/* Products Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
              >
                <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                  Products
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                      isProductsOpen ? "rotate-180" : ""
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
                </button>

                {/* Mega Menu Dropdown */}
                {isProductsOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-[600px] rounded-lg shadow-lg bg-[#161618] border border-gray-800 overflow-hidden transition-all duration-300 origin-top"
                    style={{
                      animation: "fadeIn 0.3s ease-out forwards",
                      transformOrigin: "top center"
                    }}
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
                )}
              </div>
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
              {user && (
                <ElegantButton onClick={goToDashboard} variant="dashboard">
                  Dashboard
                </ElegantButton>
              )}
              {!user ? (
                <>
                  <ElegantButton onClick={handleLogin} variant="primary">
                    Sign In
                  </ElegantButton>
                  <ElegantButton onClick={handleSignUp} variant="secondary">
                    Sign Up
                  </ElegantButton>
                </>
              ) : (
                <ElegantButton onClick={handleLogout} variant="logout">
                  Logout
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

        {/* Mobile Navigation */}
        <nav
          className={`${
            openNavigation ? "block" : "hidden"
          } fixed top-16 left-0 right-0 bg-[#161618] border-t border-gray-800 md:hidden transition-all duration-300 ease-in-out`}
          style={{
            maxHeight: openNavigation ? "calc(100vh - 64px)" : "0",
            overflow: "hidden"
          }}
        >
          <div className="px-4 py-3 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target={item.external ? "_blank" : "_self"}
                rel={item.external ? "noreferrer noopener" : undefined}
                onClick={handleClick}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.url
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item.title}
              </a>
            ))}

            {/* Products in mobile */}
            <div className="px-3 py-2">
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className="flex items-center justify-between w-full text-gray-300 hover:text-white"
              >
                <span className="text-base font-medium">Products</span>
                <svg
                  className={`ml-1 h-5 w-5 transition-transform duration-200 ${
                    isProductsOpen ? "rotate-180" : ""
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
              </button>

              {isProductsOpen && (
                <div className="mt-2 pl-4 space-y-2 border-l border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-400 mt-3">Open-source</h4>
                  {productsMenu.openSource.map((item, index) => (
                    <a
                      key={`mobile-opensource-${index}`}
                      href={item.url}
                      className="block px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      onClick={handleClick}
                    >
                      {item.title}
                    </a>
                  ))}

                  <h4 className="text-sm font-semibold text-gray-400 mt-3">Pro</h4>
                  {productsMenu.pro.map((item, index) => (
                    <a
                      key={`mobile-pro-${index}`}
                      href={item.url}
                      className="block px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      onClick={handleClick}
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile buttons */}
            <div className="pt-4 pb-2 border-t border-gray-800 flex flex-col space-y-3">
              {user && (
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
              )}
              {!user ? (
                <>
                  <ElegantButton 
                    onClick={() => {
                      handleLogin();
                      handleClick();
                    }} 
                    variant="primary"
                    className="w-full"
                  >
                    Sign In
                  </ElegantButton>
                  <ElegantButton 
                    onClick={() => {
                      handleSignUp();
                      handleClick();
                    }} 
                    variant="secondary"
                    className="w-full"
                  >
                    Sign Up
                  </ElegantButton>
                </>
              ) : (
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
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Add global animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

const MenuItem = ({ title, description, url }) => {
  return (
    <li>
      <a
        href={url}
        className="group block rounded-md p-2 transition-colors duration-200 hover:bg-gray-800"
      >
        <p className="text-base font-medium text-white group-hover:text-purple-400">
          {title}
        </p>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </a>
    </li>
  );
};

export default Navbar;
