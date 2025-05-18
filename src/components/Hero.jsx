import { useRef } from "react"; 
import Typewriter from "typewriter-effect";

import { curve, heroBackground } from "../assets";
import Button from "./Button";
import CompanyLogos from "./CompanyLogos";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import Section from "./Section";

const Hero = () => {
  const parallaxRef = useRef(null);

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
            Unlock the next level of game scripting{" "}
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

        {/* Tambahkan container overlay hitam di sini */}
        <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%] rounded-[1rem] overflow-hidden">
          <img
            src={heroBackground}
            className="w-full pointer-events-none select-none"
            width={1440}
            height={1800}
            alt="Hero"
          />
          {/* Lapisan hitam transparan */}
          <div className="absolute inset-0 bg-black opacity-30" />
        </div>

        {/* Gradient dari original, agar shading dan efek warna lebih kaya */}
        <Gradient />

        <BackgroundCircles />

        <CompanyLogos className="relative z-10 mt-20 block" />
      </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;
