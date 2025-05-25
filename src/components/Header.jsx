import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "../config/firebaseConfig";
import MenuSvg from "../assets/svg/MenuSvg";
import { navigation } from "../constants";
import { HambugerMenu } from "../components/design/Header";

const Header = () => {
  const pathname = useLocation();
  const navigate = useNavigate();

  const [openNavigation, setOpenNavigation] = useState(false);
  const [user, setUser] = useState(null);

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

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  // Elegant Button Component
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
      <button
        onClick={onClick}
        className={`${baseStyle} ${variants[variant]}`}
      >
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
        <div className="fixed inset-0 bg-black/80 z-40 lg:hidden transition-opacity duration-300" />
      )}

      <div
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
          openNavigation
            ? "bg-[#000000] backdrop-blur-md"
            : "bg-[#000000]/10 backdrop-blur-md"
        }`}
        style={{ height: "68px" }}
      >
        <div className="flex items-center px-5 lg:px-7.5 xl:px-10 py-3 h-full">
          {/* Logo */}
          <a
            className="block w-auto xl:mr-8 text-3xl font-bold bg-gradient-to-r from-purple-300 to-purple-100 text-transparent bg-clip-text"
            href="#hero"
          >
            Qarvo
          </a>

          {/* Navigation */}
          <nav
            className={`${
              openNavigation ? "flex" : "hidden"
            } fixed top-[68px] left-0 right-0 bottom-0 bg-[#0a0614] lg:static lg:flex lg:mx-auto lg:bg-transparent`}
          >
            <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target={item.external ? "_blank" : "_self"}
                  rel={item.external ? "noreferrer noopener" : undefined}
                  onClick={handleClick}
                  className={`block relative font-code text-2xl uppercase text-purple-100 transition-colors hover:text-white ${
                    item.onlyMobile ? "lg:hidden" : ""
                  } px-6 py-6 md:py-8 lg:mr-0.25 lg:text-xs lg:font-semibold ${
                    item.url === pathname.hash
                      ? "z-2 lg:text-white"
                      : "lg:text-purple-100/70"
                  } lg:leading-5 lg:hover:text-white xl:px-12`}
                >
                  {item.title}
                </a>
              ))}

              {/* Mobile buttons */}
              <div className="flex flex-col lg:hidden items-center gap-3 mt-4">
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
            </div>

            <HambugerMenu />
          </nav>

          {/* Desktop buttons */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
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
            className="ml-auto lg:hidden p-3 rounded-md hover:bg-purple-900/20 transition-colors"
          >
            <MenuSvg openNavigation={openNavigation} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
