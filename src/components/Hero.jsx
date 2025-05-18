import { useRef } from "react";
import Typewriter from "typewriter-effect";

import { curve } from "../assets";
import blackholeVideo from "../assets/hero/blackhole.webm";
import Button from "./Button";
import CompanyLogos from "./CompanyLogos";
import { BottomLine } from "./design/Hero";
import Section from "./Section";

const Hero = () => {
  const parallaxRef = useRef(null);

  return (
    <Section
      id="hero"
      customPaddings
      className="pt-[12rem] -mt-[5.25rem] relative overflow-hidden"
      style={{ isolation: "isolate" }}  // pisahkan stacking context
    >
      {/* Background hitam, tanpa filter */}
      <div
        className="absolute inset-0 bg-[#0a0a0a] z-[-20] pointer-events-none"
        style={{ filter: "none" }}  // pastikan no filter di sini
      />

      {/* Video blackhole berdiri sendiri, dengan filter hanya di video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-1/2 transform -translate-x-1/2 w-[120vw] h-[120vh] object-cover brightness-[0.6] z-[-30] pointer-events-none"
        style={{ filter: "brightness(0.6)" }}  // filter di sini aja
      >
        <source src={blackholeVideo} type="video/webm" />
      </video>

      {/* Konten utama (container) */}
      <div
        ref={parallaxRef}
        className="container relative z-10"
        style={{ isolation: "isolate" }} // layer ini bebas filter
      >
        <div className="relative max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
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

          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8 text-gray-300">
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

      {/* CompanyLogos tetap bebas filter */}
      <CompanyLogos
        className="relative z-20 mt-20"
        style={{ isolation: "isolate", backgroundColor: "transparent" }}
      />

      <BottomLine className="relative z-20" />
    </Section>
  );
};

export default Hero;
