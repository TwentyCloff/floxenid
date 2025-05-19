import { useRef } from "react";
import Typewriter from "typewriter-effect";

import { curve } from "../assets";
import blackholeVideo from "../assets/hero/blackhole.webm";
import Button from "./Button";
// import { BottomLine } from "./design/Hero"; // Di-comment/hapus jika bikin abu-abu
import Section from "./Section";

const Hero = () => {
  const parallaxRef = useRef(null);

  return (
    <Section
      id="hero"
      customPaddings
      className="pt-[12rem] -mt-[5.25rem] relative overflow-hidden"
    >
      {/* Background gradient halus untuk transisi natural */}
      <div
        className="absolute inset-0 z-[-20] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #181818 0%, #000000 80%)",
        }}
      />

      {/* Video blackhole tanpa filter brightness */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-[-10%] left-1/2 transform -translate-x-1/2 w-[120vw] h-[120vh] object-cover z-[-10] pointer-events-none"
      >
        <source src={blackholeVideo} type="video/webm" />
      </video>

      {/* Konten utama */}
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
      </div>

      {/* BottomLine dihapus agar tidak menambah abu-abu */}
      {/* <BottomLine className="relative z-20" /> */}
    </Section>
  );
};

export default Hero;
