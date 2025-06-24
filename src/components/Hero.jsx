import Section from "./Section";

const Hero = () => {
  return (
    <Section
      id="hero"
      customPaddings
      className="pt-[12rem] -mt-[5.25rem] relative min-h-screen flex items-center"
    >
      {/* Simple gradient background */}
      <div 
        className="absolute inset-0 z-[-1] bg-gradient-to-b from-gray-900 to-black"
      />

      <div className="container relative z-10">
        <div className="relative max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
          <h1 className="h1 mb-6 text-white">
            Empower Your Scripts With
            <br />
            <span className="text-[1.4rem] sm:text-[1.75rem] md:text-[2rem] leading-snug block text-blue-400">
              Qarvo.network
            </span>
          </h1>

          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8 text-gray-300">
            Unlock the next level of game scripting with our powerful platform
          </p>

          {/* Call-to-action button */}
          <a
            href="#pricing"
            className="inline-block px-7 py-3 rounded-full border border-white/30 text-white font-semibold
                       bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg"
          >
            Get started
          </a>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
