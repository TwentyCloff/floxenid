import Typewriter from "typewriter-effect";
import blackholeVideo from "../assets/hero/blackhole.webm";
import Section from "./Section";

const Hero = () => {
  return (
    <Section
      id="hero"
      customPaddings
      className="pt-[12rem] -mt-[5.25rem] relative overflow-hidden"
    >
      {/* White background */}
      <div className="absolute inset-0 z-[-20] bg-white" />

      {/* Normal video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute left-1/2 transform -translate-x-1/2 w-full h-full object-cover z-[-10] pointer-events-none"
      >
        <source src={blackholeVideo} type="video/webm" />
      </video>

      {/* Main content */}
      <div className="container relative z-10">
        <div className="relative max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
          <h1 className="h1 mb-6 text-gray-800">
            Empower Your Scripts With
            <br />
            <span className="text-[1.4rem] sm:text-[1.75rem] md:text-[2rem] leading-snug block">
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
            </span>
          </h1>

          <p className="body-1 max-w-3xl mx-auto mb-6 text-gray-600 lg:mb-8">
            Unlock the next level of game scripting with{" "}
            <span className="inline-block relative font-semibold text-gray-800">
              Qarvo
            </span>
            .network
          </p>

          {/* Button */}
          <a
            href="#pricing"
            className="inline-block px-7 py-3 rounded-full border border-gray-300 text-gray-800 font-semibold
                       bg-white/70 hover:bg-white transition-all duration-300 shadow-lg"
          >
            Get started
          </a>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
