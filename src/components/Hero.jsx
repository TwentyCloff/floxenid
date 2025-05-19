import { useRef } from "react";
import Typewriter from "typewriter-effect";

import { curve } from "../assets";
import blackholeVideo from "../assets/hero/blackhole.webm";
import Button from "./Button";
import Section from "./Section";

const Hero = () => {
  const parallaxRef = useRef(null);

  return (
    <Section
      id="hero"
      customPaddings
      className="pt-[10rem] sm:pt-[8rem] -mt-[5.25rem] relative overflow-hidden min-h-screen"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-[-20] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #121212 0%, #000000 90%)",
        }}
      />

      {/* Overlay hitam tipis */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20 z-[-9]" />

      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover object-top z-[-10] pointer-events-none"
        style={{
          filter: "brightness(0.7)",
        }}
      >
        <source src={blackholeVideo} type="video/webm" />
      </video>

      {/* Konten utama */}
      <div ref={parallaxRef} className="container relative z-10 px-4">
        <div className="relative max-w-[62rem] mx-auto text-center mb-20 sm:mb-16">
          <h1 className="h1 mb-6 text-white text-3xl sm:text-4xl md:text-5xl">
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

          <p className="body-1 max-w-3xl mx-auto mb-6 text-gray-300 text-base sm:text-lg">
            Unlock the next level of game scripting{" "}
            <span className="inline-block relative font-semibold text-white">
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
      </div>

      {/* Gradient transisi ke bawah */}
      <div
        className="absolute bottom-0 left-0 w-full h-[6rem] z-[-5]"
        style={{
          background: "linear-gradient(to bottom, transparent, #000)",
        }}
      />
    </Section>
  );
};

export default Hero;
