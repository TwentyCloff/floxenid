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
      id="hero"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      className="pt-[12rem] -mt-[5.25rem] bg-[#0a0a0a] relative overflow-hidden" // tambah bg hitam + relative + overflow-hidden
    >
      {/* Background hitam full screen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -20,
          backgroundColor: "#0a0a0a",
        }}
      />

      {/* Video blackhole di belakang */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120vw",
          height: "120vh",
          zIndex: -15,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.6)",
          }}
          onError={() => console.log("Video error loading blackhole")}
        >
          <source src={blackholeVideo} type="video/webm" />
        </video>
      </div>

      <div ref={parallaxRef} className="container relative z-10">
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

        <BackgroundCircles />

        <CompanyLogos className="relative z-10 mt-20 block" />
      </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;
