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
                  <button
                    onClick={goToDashboard}
                    className="relative w-full max-w-xs px-6 py-3 font-medium text-white group"
                  >
                    <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-2 translate-y-2 bg-purple-600 group-hover:translate-x-0 group-hover:translate-y-0 rounded-lg"></span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center justify-center gap-2">
                      Dashboard
                    </span>
                  </button>
                )}
                {!user ? (
                  <>
                    <button
                      onClick={handleLogin}
                      className="relative w-full max-w-xs px-6 py-3 font-medium text-white group"
                    >
                      <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-2 translate-y-2 bg-indigo-600 group-hover:translate-x-0 group-hover:translate-y-0 rounded-lg"></span>
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative flex items-center justify-center gap-2">
                        Sign In
                      </span>
                    </button>
                    <button
                      onClick={handleSignUp}
                      className="relative w-full max-w-xs px-6 py-3 font-medium text-white group"
                    >
                      <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-2 translate-y-2 bg-pink-600 group-hover:translate-x-0 group-hover:translate-y-0 rounded-lg"></span>
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative flex items-center justify-center gap-2">
                        Sign Up
                      </span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="relative w-full max-w-xs px-6 py-3 font-medium text-white group"
                  >
                    <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-2 translate-y-2 bg-red-600 group-hover:translate-x-0 group-hover:translate-y-0 rounded-lg"></span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-600 to-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center justify-center gap-2">
                      Logout
                    </span>
                  </button>
                )}
              </div>
            </div>

            <HambugerMenu />
          </nav>

          {/* Desktop buttons */}
          <div className="hidden lg:flex items-center gap-4 ml-auto">
            {user && (
              <button
                onClick={goToDashboard}
                className="relative px-6 py-2.5 font-medium text-white group"
              >
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-1.5 translate-y-1.5 bg-purple-600 group-hover:translate-x-0 group-hover:translate-y-0 rounded-lg"></span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative">Dashboard</span>
              </button>
            )}
            {!user ? (
              <>
                <button
                  onClick={handleLogin}
                  className="relative px-6 py-2.5 font-medium text-white group"
                >
                  <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-1.5 translate-y-1.5 bg-indigo-600 group-hover:translate-x-0 group-hover:translate-y-0 rounded-lg"></span>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative">Sign In</span>
                </button>
                <button
                  onClick={handleSignUp}
                  className="relative px-6 py-2.5 font-medium text-white group"
                >
                  <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-1.5 translate-y-1.5 bg-pink-600 group-hover:translate-x-0 group-hover:translate-y-0 rounded-lg"></span>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative">Sign Up</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="relative px-6 py-2.5 font-medium text-white group"
              >
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-1.5 translate-y-1.5 bg-red-600 group-hover:translate-x-0 group-hover:translate-y-0 rounded-lg"></span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-600 to-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative">Logout</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleNavigation}
            className="ml-auto lg:hidden p-3 rounded-lg hover:bg-n-7 transition-colors"
          >
            <MenuSvg openNavigation={openNavigation} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
