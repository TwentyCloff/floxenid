import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "./Navigation";

const Header = () => {
  const [scrolling, setScrolling] = useState(false);
  const [openNavigation, setOpenNavigation] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-white/10 backdrop-blur-sm transition-colors duration-300 ${
        openNavigation || scrolling ? "bg-[#0a0a0a]/80" : "bg-[#0a0a0a]/60"
      }`}
    >
      <div className="container flex items-center justify-between h-[4.5rem]">
        {/* Logo */}
        <Link href="/" className="font-bold text-white text-xl">
          Qarvo
        </Link>

        {/* Navigation */}
        <Navigation
          open={openNavigation}
          setOpen={setOpenNavigation}
        />
      </div>
    </div>
  );
};

export default Header;
