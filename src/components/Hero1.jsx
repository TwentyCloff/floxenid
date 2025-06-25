import Typewriter from "typewriter-effect";
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

      {/* Dot pattern background with fade effects */}
      <div className="absolute inset-0 z-[-15] overflow-hidden">
        {/* Left fade - creates a gradient fade effect on the left side */}
        <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-10" />
        
        {/* Right fade - creates a gradient fade effect on the right side */}
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-10" />
        
        {/* Dot pattern (2% larger than standard 20px grid) */}
        <svg
          className="w-full h-full"
          aria-hidden="true"
        >
          <defs>
            {/* 
              Pattern definition:
              - width/height: 20.4px (2% larger than standard 20px)
              - Creates a grid of dots spaced 20.4px apart
            */}
            <pattern
              id="dot-pattern"
              width="20.4"  // Horizontal spacing between dots
              height="20.4" // Vertical spacing between dots
              patternUnits="userSpaceOnUse" // Uses px units
              patternTransform="scale(1)" // Optional: can adjust scale if needed
            >
              {/* 
                Each dot in the pattern:
                - cx/cy: 10.2 (center of the 20.4px square)
                - r: 1px radius (dot size)
                - fill: semi-transparent light gray
              */}
              <circle 
                cx="10.2"  // Center X position
                cy="10.2"  // Center Y position
                r="1"      // Dot radius
                fill="rgba(160, 160, 160, 0.2)" // Light gray with 20% opacity
              />
            </pattern>
          </defs>
          {/* 
            Rectangle that fills the entire area with the dot pattern 
            - The pattern repeats infinitely in both directions
          */}
          <rect
            width="100%"
            height="100%"
            fill="url(#dot-pattern)"
            opacity="1"
          />
        </svg>
      </div>

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
                  delay: 50,
                  deleteSpeed: 30,
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
                       bg-white hover:bg-gray-50 transition-all duration-300 shadow-md
                       focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            aria-label="Get started with Qarvo"
          >
            Get started
          </a>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
