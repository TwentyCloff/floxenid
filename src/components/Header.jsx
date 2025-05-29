import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { gsap } from "gsap";
import { auth } from "../config/firebaseConfig";
import MenuSvg from "../assets/svg/MenuSvg";
import { navigation } from "../constants";
import { HambugerMenu } from "../components/design/Header";

const Header = () => {
  const pathname = useLocation();
  const navigate = useNavigate();
  const buttonRefs = useRef({});

  const [openNavigation, setOpenNavigation] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Initialize GSAP animations for each button
    Object.keys(buttonRefs.current).forEach((key) => {
      const button = buttonRefs.current[key];
      if (!button) return;

      const pinkRects = gsap.utils.toArray(button.querySelectorAll(".pink rect"));
      const blueRects = gsap.utils.toArray(button.querySelectorAll(".blue rect"));

      button.addEventListener("mouseenter", () => {
        gsap.to(blueRects, {
          duration: 0.8,
          ease: "elastic.out(1, 0.3)",
          xPercent: "100",
          stagger: 0.01,
          overwrite: true,
          delay: 0.13
        });

        gsap.to(pinkRects, {
          duration: 0.8,
          ease: "elastic.out(1, 0.3)",
          xPercent: "100",
          stagger: 0.01,
          overwrite: true
        });
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(blueRects, {
          duration: 0.8,
          ease: "elastic.out(1, 0.3)",
          xPercent: "-100",
          stagger: 0.01,
          overwrite: true,
          delay: 0.13
        });

        gsap.to(pinkRects, {
          duration: 0.8,
          ease: "elastic.out(1, 0.3)",
          xPercent: "-100",
          stagger: 0.01,
          overwrite: true
        });
      });
    });

    return () => {
      // Clean up event listeners
      Object.keys(buttonRefs.current).forEach((key) => {
        const button = buttonRefs.current[key];
        if (button) {
          button.removeEventListener("mouseenter");
          button.removeEventListener("mouseleave");
        }
      });
    };
  }, [user]); // Re-run when user state changes

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

  // Animated Button Component
  const AnimatedButton = ({ children, onClick, variant = "primary", buttonKey }) => {
    const baseStyle = `
      relative overflow-hidden
      px-6 py-2.5 rounded-md
      text-sm font-medium
      transition-all duration-200
      border
      backdrop-blur-sm
      hover:shadow-lg
      active:scale-[0.98]
      font-['IBM_Plex_Mono'] italic
    `;

    const variants = {
      primary: `
        bg-[#1a0d2b] hover:bg-[#231538]
        text-purple-100 hover:text-[#c40a35]
        border-purple-900/50 hover:border-purple-500/30
        shadow-[inset_0_1px_0_0_rgba(148,102,255,0.2)]
      `,
      secondary: `
        bg-[#0f0918] hover:bg-[#1a1126]
        text-purple-200 hover:text-[#c40a35]
        border-purple-800/30 hover:border-purple-500/20
        shadow-[inset_0_1px_0_0_rgba(148,102,255,0.1)]
      `,
      dashboard: `
        bg-[#160e29] hover:bg-[#1f1638]
        text-indigo-100 hover:text-[#c40a35]
        border-indigo-900/50 hover:border-indigo-500/30
        shadow-[inset_0_1px_0_0_rgba(99,102,241,0.2)]
      `,
      logout: `
        bg-[#180a1a] hover:bg-[#231025]
        text-pink-100 hover:text-[#c40a35]
        border-pink-900/50 hover:border-pink-500/30
        shadow-[inset_0_1px_0_0_rgba(236,72,153,0.2)]
      `
    };

    return (
      <button
        ref={(el) => (buttonRefs.current[buttonKey] = el)}
        onClick={onClick}
        className={`${baseStyle} ${variants[variant]}`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <g className="pink">
            <rect x="-100%" y="0" width="100%" height="5" />
            <rect x="-100%" y="5" width="100%" height="5" />
            <rect x="-100%" y="10" width="100%" height="5" />
            <rect x="-100%" y="15" width="100%" height="5" />
            <rect x="-100%" y="20" width="100%" height="5" />
            <rect x="-100%" y="25" width="100%" height="5" />
            <rect x="-100%" y="30" width="100%" height="5" />
            <rect x="-100%" y="35" width="100%" height="5" />
            <rect x="-100%" y="40" width="100%" height="5" />
            <rect x="-100%" y="45" width="100%" height="5" />
          </g>
          <g className="blue">
            <rect x="-100%" y="0" width="100%" height="5" />
            <rect x="-100%" y="5" width="100%" height="5" />
            <rect x="-100%" y="10" width="100%" height="5" />
            <rect x="-100%" y="15" width="100%" height="5" />
            <rect x="-100%" y="20" width="100%" height="5" />
            <rect x="-100%" y="25" width="100%" height="5" />
            <rect x="-100%" y="30" width="100%" height="5" />
            <rect x="-100%" y="35" width="100%" height="5" />
            <rect x="-100%" y="40" width="100%" height="5" />
            <rect x="-100%" y="45" width="100%" height="5" />
          </g>
        </svg>
        <div className="absolute inset-0 bg-[#24252c] bg-[repeating-linear-gradient(0deg,#181a29,#181a29_1px,#202436_1px,#202436_2px)] rounded-md transform -skew-x-15 -z-1" />
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
            : "bg-[#000000]/3 backdrop-blur-md"
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
            <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row lg:ml-20">
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
                  <AnimatedButton 
                    onClick={goToDashboard} 
                    variant="dashboard"
                    buttonKey="mobile-dashboard"
                  >
                    Dashboard
                  </AnimatedButton>
                )}
                {!user ? (
                  <>
                    <AnimatedButton 
                      onClick={handleLogin} 
                      variant="primary"
                      buttonKey="mobile-signin"
                    >
                      Sign In
                    </AnimatedButton>
                    <AnimatedButton 
                      onClick={handleSignUp} 
                      variant="secondary"
                      buttonKey="mobile-signup"
                    >
                      Sign Up
                    </AnimatedButton>
                  </>
                ) : (
                  <AnimatedButton 
                    onClick={handleLogout} 
                    variant="logout"
                    buttonKey="mobile-logout"
                  >
                    Logout
                  </AnimatedButton>
                )}
              </div>
            </div>

            <HambugerMenu />
          </nav>

          {/* Desktop buttons */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            {user && (
              <AnimatedButton 
                onClick={goToDashboard} 
                variant="dashboard"
                buttonKey="desktop-dashboard"
              >
                Dashboard
              </AnimatedButton>
            )}
            {!user ? (
              <>
                <AnimatedButton 
                  onClick={handleLogin} 
                  variant="primary"
                  buttonKey="desktop-signin"
                >
                  Sign In
                </AnimatedButton>
                <AnimatedButton 
                  onClick={handleSignUp} 
                  variant="secondary"
                  buttonKey="desktop-signup"
                >
                  Sign Up
                </AnimatedButton>
              </>
            ) : (
              <AnimatedButton 
                onClick={handleLogout} 
                variant="logout"
                buttonKey="desktop-logout"
              >
                Logout
              </AnimatedButton>
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
