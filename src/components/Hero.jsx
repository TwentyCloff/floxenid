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
      className="pt-[12rem] -mt-[5.25rem] relative overflow-visible"
    >
      {/* Konten utama dan CompanyLogos tanpa background, transparan */}
      <div
        ref={parallaxRef}
        className="container relative z-20"
        style={{ isolation: "isolate" }}
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

        {/* CompanyLogos tanpa background, transparan */}
        <CompanyLogos
          className="relative mt-20"
          style={{ backgroundColor: "transparent", isolation: "isolate" }}
        />

        <BottomLine className="relative" />
      </div>

      {/* Background hitam dan video blackhole muncul **di bawah konten**, fixed position */}
      <div
        className="fixed bottom-0 left-0 w-full h-[50vh] z-10 pointer-events-none"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover brightness-[0.6]"
          style={{ filter: "brightness(0.6)" }}
        >
          <source src={blackholeVideo} type="video/webm" />
        </video>
      </div>
    </Section>
  );
};

export default Hero;
