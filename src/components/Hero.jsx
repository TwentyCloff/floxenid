import { useRef, useState, useEffect } from "react";
import { ScrollParallax } from "react-just-parallax";

import { heroBackground } from "../assets";
import { heroIcons } from "../constants";
import Button from "./Button";
import CompanyLogos from "./CompanyLogos";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import Notification from "./Notification";
import Section from "./Section";

import sample1 from "../assets/hero/sample1.jpg";
import sample2 from "../assets/hero/sample2.jpg";

const products = [sample1, sample2];

const Hero = () => {
  const parallaxRef = useRef(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 4000); // 4 seconds
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div ref={parallaxRef} className="container relative">
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
          <h1 className="h1 mb-6">
            Empower Your Scripts With
            <br />
            <span className="text-gradient">Qarvo</span>.network
          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
            Unlock the next level of game scripting with{" "}
            <span className="font-semibold">Qarvo.network</span>
          </p>

          <Button href="#pricing" white>
            Get started
          </Button>
        </div>

        <div className="relative max-w-5xl mx-auto xl:mb-24">
          <div className="relative rounded-[1.5rem] overflow-hidden">
            <img
              src={products[current]}
              alt={`Product ${current}`}
              className="w-full h-auto object-cover rounded-[1.5rem] shadow-none pointer-events-none select-none transition-all duration-500"
            />

            {/* Navigation arrows */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-3xl bg-black/30 hover:bg-black/50 rounded-full px-3 py-2"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl bg-black/30 hover:bg-black/50 rounded-full px-3 py-2"
            >
              ›
            </button>
          </div>

          {/* Background */}
          <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
            <img
              src={heroBackground}
              className="w-full pointer-events-none select-none"
              width={1440}
              height={1800}
              alt="Hero background"
            />
          </div>

          <BackgroundCircles />
        </div>

        <CompanyLogos className="hidden relative z-10 mt-20 lg:block" />
      </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;
