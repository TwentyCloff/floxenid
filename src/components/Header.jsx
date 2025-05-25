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

  // Premium Button Component
  const FuturisticButton = ({ children, onClick, variant = "primary" }) => {
    const variants = {
      primary: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700",
      secondary: "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700",
      danger: "bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700",
      dashboard: "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
    };

    return (
      <button
        onClick={onClick}
        className={`
          relative overflow-hidden
          px-6 py-2.5 rounded-lg
          text-sm font-medium text-white
          ${variants[variant]}
          shadow-lg
          transition-all duration-200
          hover:shadow-xl
          hover:scale-[1.02]
          active:scale-95
          before:absolute before:inset-0
          before:bg-white before:opacity-0
          before:transition-opacity before:duration-300
          hover:before:opacity-10
          border border-white/10
          backdrop-blur-sm
        `}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
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
            ? "bg-black backdrop-blur-md"
            : "bg-black/20 backdrop-blur-md"
        }`}
        style={{ height: "68px" }}
      >
        <div className="flex items-center px-5 lg:px-7.5 xl:px-10 py-3 h-full">
          {/* Logo */}
          <a
            className="block w-auto xl:mr-8 text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text"
            href="#hero"
          >
            Qarvo
          </a>

          {/* Navigation */}
          <nav
            className={`${
              openNavigation ? "flex" : "hidden"
            } fixed top-[68px] left-0 right-0 bottom-0 bg-black lg:static lg:flex lg:mx-auto lg:bg-transparent`}
          >
            <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target={item.external ? "_blank" : "_self"}
                  rel={item.external ? "noreferrer noopener" : undefined}
                  onClick={handleClick}
                  className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                    item.onlyMobile ? "lg:hidden" : ""
                  } px-6 py-6 md:py-8 lg:mr-0.25 lg:text-xs lg:font-semibold ${
                    item.url === pathname.hash
                      ? "z-2 lg:text-n-1"
                      : "lg:text-n-1/50"
                  } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
                >
                  {item.title}
                </a>
              ))}

              {/* Mobile buttons */}
              <div className="flex flex-col lg:hidden items-center gap-4 mt-4">
                {user && (
                  <FuturisticButton onClick={goToDashboard} variant="dashboard">
                    Dashboard
                  </FuturisticButton>
                )}
                {!user ? (
                  <>
                    <FuturisticButton onClick={handleLogin} variant="primary">
                      Sign In
                    </FuturisticButton>
                    <FuturisticButton onClick={handleSignUp} variant="secondary">
                      Sign Up
                    </FuturisticButton>
                  </>
                ) : (
                  <FuturisticButton onClick={handleLogout} variant="danger">
                    Logout
                  </FuturisticButton>
                )}
              </div>
            </div>

            <HambugerMenu />
          </nav>

          {/* Desktop buttons */}
          <div className="hidden lg:flex items-center gap-4 ml-auto">
            {user && (
              <FuturisticButton onClick={goToDashboard} variant="dashboard">
                Dashboard
              </FuturisticButton>
            )}
            {!user ? (
              <>
                <FuturisticButton onClick={handleLogin} variant="primary">
                  Sign In
                </FuturisticButton>
                <FuturisticButton onClick={handleSignUp} variant="secondary">
                  Sign Up
                </FuturisticButton>
              </>
            ) : (
              <FuturisticButton onClick={handleLogout} variant="danger">
                Logout
              </FuturisticButton>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleNavigation}
            className="ml-auto lg:hidden p-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            <MenuSvg openNavigation={openNavigation} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
