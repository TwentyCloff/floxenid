import { useRef } from "react";
import Typewriter from "typewriter-effect";

import { curve } from "../assets";
import blackholeVideo from "../assets/hero/blackhole.webm";
import Button from "./Button";
import CompanyLogos from "./CompanyLogos";
import { BackgroundCircles, BottomLine } from "./design/Hero";
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
        {/* Video background, besar, naik ke atas, blend mode */}
        <div className="absolute inset-0 -z-10 rounded-xl overflow-hidden -top-12 scale-[1.2] origin-top">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover brightness-60 mix-blend-screen"
          >
            <source src={blackholeVideo} type="video/webm" />
            Your browser does not support the video tag.
          </video>
          {/* Overlay hitam semi transparan supaya tetap gelap */}
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>

        <div className="relative z-10 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
          <h1 className="h1 mb-6 text-white">
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

          <p className="body-1 max-w-3xl mx-auto mb-6 text-gray-300 lg:mb-8">
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

        <BackgroundCircles />

        <CompanyLogos className="relative z-10 mt-20 block" />
      </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;
