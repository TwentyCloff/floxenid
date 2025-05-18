import { useRef, useEffect, useState } from "react";
import { ScrollParallax } from "react-just-parallax";
import Typewriter from "typewriter-effect";

import { curve, heroBackground } from "../assets";
import sample1 from "../assets/hero/sample1.jpg";
import sample2 from "../assets/hero/sample2.jpg";

import { heroIcons } from "../constants";
import Button from "./Button";
import CompanyLogos from "./CompanyLogos";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import Generating from "./Generating";
import Notification from "./Notification";
import Section from "./Section";

const images = [sample1, sample2];

const Hero = () => {
  const parallaxRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

        <div className="relative max-w-5xl mx-auto xl:mb-24">
          {/* Removed conic-border wrapper */}
          <div className="relative overflow-hidden rounded-[1.5rem]">
            <img
              src={images[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full object-cover h-auto rounded-[1.5rem]"
            />

            <Generating className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" />

            <ScrollParallax isAbsolutelyPositioned>
              <ul className="hidden absolute -left-[5.5rem] bottom-[7.5rem] px-1 py-1 bg-n-9/40 backdrop-blur border border-transparent rounded-2xl xl:flex">
                {heroIcons.map((icon, index) => (
                  <li className="p-5" key={index}>
                    <img src={icon} width={24} height={25} alt={icon} />
                  </li>
                ))}
              </ul>
            </ScrollParallax>

            <ScrollParallax isAbsolutelyPositioned>
              <Notification
                className="hidden absolute -right-[5.5rem] bottom-[11rem] w-[18rem] xl:flex"
                title="Code generation"
              />
            </ScrollParallax>
          </div>

          <Gradient />

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
