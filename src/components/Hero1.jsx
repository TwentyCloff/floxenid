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
      {/* Clean white background */}
      <div className="absolute inset-0 z-[-20] bg-white" />

      {/* Original video positioning without any filters */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="blackhole-video absolute left-1/2 transform -translate-x-1/2 w-[130vw] h-[130vh] object-cover z-[-10] pointer-events-none
                   top-[-30%] sm:top-[-30%] md:top-[-20%] lg:top-[-15%] xl:top-[-12%] 2xl:top-[-10%]"
      >
        <source src={blackholeVideo} type="video/webm" />
      </video>

      <style>
        {`
          @media (max-width: 640px) {
            .blackhole-video {
              top: -50% !important;
            }
          }
          @media (min-width: 1920px) {
            .blackhole-video {
              top: -12% !important;
              transform: translateX(-50%) scale(1.1);
            }
          }
          @media (min-width: 2560px) {
            .blackhole-video {
              top: -10% !important;
              transform: translateX(-50%) scale(1.25);
            }
          }
        `}
      </style>

      {/* Main content with white theme */}
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

          {/* Clean button styling */}
          <a
            href="#pricing"
            className="inline-block px-7 py-3 rounded-full border border-gray-300 text-gray-800 font-semibold
                       bg-white hover:bg-gray-50 transition-all duration-300 shadow-md"
          >
            Get started
          </a>
        </div>
      </div>

      {/* Subtle white fade at bottom */}
      <div
        className="absolute bottom-0 left-0 w-full h-[12rem] z-[-5]"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.9))",
        }}
      />
    </Section>
  );
};

export default Hero;
