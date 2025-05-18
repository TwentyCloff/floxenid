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
        {/* Wrapper teks dan video background */}
        <div className="relative max-w-[62rem] mx-auto mb-[4rem] md:mb-20 lg:mb-[6rem] text-center">
          
          {/* Video Background di belakang teks */}
          <div className="absolute inset-0 -z-10 rounded-xl overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover brightness-50"
            >
              <source src={blackholeVideo} type="video/webm" />
              Your browser does not support the video tag.
            </video>
            
            {/* Overlay warna hitam abu-abu semi transparan supaya teks tetap terbaca */}
            <div className="absolute inset-0 bg-black bg-opacity-60" />
          </div>

          {/* Teks utama */}
          <h1 className="h1 mb-6 relative z-10 text-white">
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

          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 relative z-10 text-gray-300 lg:mb-8">
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

          <Button href="#pricing" white className="relative z-10">
            Get started
          </Button>
        </div>

        {/* Background circles dan logo tetap di bawah */}
        <BackgroundCircles />

        <CompanyLogos className="relative z-10 mt-20 block" />
      </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;
