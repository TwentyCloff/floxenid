import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";

import MenuSvg from "../assets/svg/MenuSvg";
import { links } from "../config";
import { navigation } from "../constants";
import Button from "./Button";
import { HambugerMenu } from "./design/Header";

const NavLink = ({ item, activeId, onClick }) => (
  <a
    key={item.id}
    href={item.url}
    target={item.external ? "_blank" : "_self"}
    rel={item.external ? "noreferrer noopener" : undefined}
    onClick={onClick}
    className={`block relative font-code text-2xl uppercase transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:mr-0.25 lg:text-xs lg:font-semibold lg:leading-5 lg:hover:text-n-1 xl:px-12 ${
      item.onlyMobile ? "lg:hidden" : ""
    } ${
      activeId === item.url.replace("#", "")
        ? "text-color-1"
        : "text-n-1/50"
    }`}
  >
    {item.title}
  </a>
);

const Header = () => {
  const [openNavigation, setOpenNavigation] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const sectionRefs = useRef({});
  const location = useLocation();

  const toggleNavigation = () => {
    setOpenNavigation((prev) => {
      const newState = !prev;
      setTimeout(() => {
        newState ? disablePageScroll() : enablePageScroll();
        document.body.style.overflow = newState ? "hidden" : "auto";
      }, 100);
      return newState;
    });
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    document.body.style.overflow = "auto";
    setOpenNavigation(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    navigation.forEach((item) => {
      const id = item.url.replace("#", "");
      const section = document.getElementById(id);
      if (section) {
        sectionRefs.current[id] = section;
        observer.observe(section);
      }
    });

    return () => {
      Object.values(sectionRefs.current).forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <>
      {openNavigation && (
        <div className="fixed inset-0 bg-black/80 z-40 lg:hidden transition-opacity duration-300" />
      )}

      <div
        className={`fixed top-0 left-0 w-full z-50 shadow-md transition-colors duration-300 ${
          openNavigation ? "bg-black backdrop-blur-md" : "bg-black/20 backdrop-blur-md"
        }`}
        style={{ height: "68px" }}
      >
        <div className="flex items-center px-5 lg:px-7.5 xl:px-10 py-3 h-full">
          <a
            className="block w-auto xl:mr-8 text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text"
            href="#hero"
          >
            Qarvo
          </a>

          <nav
            id="navbar-menu"
            className={`${
              openNavigation ? "flex" : "hidden"
            } fixed top-[68px] left-0 right-0 bottom-0 bg-black lg:static lg:flex lg:mx-auto lg:bg-transparent transition-transform duration-300 ease-in-out transform lg:translate-y-0 ${
              openNavigation ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
              {navigation.map((item) => (
                <NavLink
                  key={item.id}
                  item={item}
                  activeId={activeSection}
                  onClick={handleClick}
                />
              ))}
            </div>
            <HambugerMenu />
          </nav>

          <Button className="hidden lg:flex ml-auto" href={links.sourceCode} external>
            Source Code
          </Button>

          <Button
            onClick={toggleNavigation}
            className="ml-auto lg:hidden"
            px="px-3"
            aria-label="Toggle Navigation"
            aria-expanded={openNavigation}
            aria-controls="navbar-menu"
          >
            <MenuSvg openNavigation={openNavigation} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Header;
