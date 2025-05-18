import { useRef } from "react";
import { ScrollParallax } from "react-just-parallax";
import Typewriter from "typewriter-effect";

import { curve, heroBackground } from "../assets";
import { heroIcons } from "../constants";
import Button from "./Button";
import CompanyLogos from "./CompanyLogos";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import Notification from "./Notification";
import Section from "./Section";

import sample1 from "../assets/hero/sample1.jpg";
import sample2 from "../assets/hero/sample2.jpg";

import { useEffect, useState } from "react";

const products = [
  {
    image: sample1,
    name: "Qarvo Executor",
    description: "High-performance script execution."
  },
  {
    image: sample2,
    name: "Qarvo Hub",
    description: "All-in-one GUI for Roblox exploits."
  }
];

const Hero = () => {
  const parallaxRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => setIndex((index - 1 + products.length) % products.length);
  const nextSlide = () => setIndex((index + 1) % products.length);

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
            <Typewriter
              options={{
                strings: [
                  "Fast Execution",
                  "Continuous Improvement",
                  "24/7 Support",
                  "User-Friendly Interface",
                  "Optimized Performance",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </h1>

          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
            Unlock the next level of game scripting
            with{" "}
            <span className="inline-block relative font-semibold">
              Qarvo
              <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2 pointer-events-none select-none"
                width={624}
                height={28}
                alt="Curve"
              />
            </span>
            .network
          </p>

          <Button href="#pricing" white>
            Get started
          </Button>
        </div>

        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
            <div className="relative bg-n-8 rounded-[1rem]">
              <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />

              <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490] flex items-center justify-center relative">
                {products.map((product, i) => (
                  <div
                    key={i}
                    className={`absolute transition-opacity duration-700 ease-in-out w-full h-full flex flex-col items-center justify-center text-center p-4 ${index === i ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <img src={product.image} alt={product.name} className="rounded-xl w-auto h-60 object-contain mb-4" />
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                    <p className="text-sm text-n-2">{product.description}</p>
                  </div>
                ))}
                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl">❮</button>
                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl">❯</button>
              </div>
            </div>

            <Gradient />
          </div>

          <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
            <img
              src={heroBackground}
              className="w-full pointer-events-none select-none"
              width={1440}
              height={1800}
              alt="Hero"
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
