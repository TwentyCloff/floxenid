import { useRef, useState, useEffect } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Section from "./Section";

const BentoTilt = ({ children, className = "", disableTiltOnMobile = true }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    if (!itemRef.current || (isMobile && disableTiltOnMobile)) return;

    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - left) / width;
    const relativeY = (e.clientY - top) / height;
    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    setTransformStyle(
      `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.98, 0.98, 0.98)`
    );
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={`transition-transform duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
      onTouchStart={() => isMobile && setTransformStyle("scale(0.98)")}
      onTouchEnd={() => isMobile && setTransformStyle("")}
    >
      {children}
    </div>
  );
};

const Services = () => {
  return (
    <Section id="how-to-use">
      <div className="bg-black pb-20 md:pb-52 circular-font">
        <div className="container mx-auto px-4 md:px-10">
          {/* Hero Card */}
          <BentoTilt className="border-hsla relative mb-7 h-64 w-full overflow-hidden rounded-xl md:h-[65vh]">
            <div className="relative w-full h-full">
              <video
                src="/videos/feature-1.mp4"
                loop
                muted
                autoPlay
                playsInline
                className="absolute left-0 top-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 flex flex-col justify-between w-full h-full p-4 md:p-6">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold text-white">
                    radia<b className="font-semibold">n</b>t
                  </h1>
                  <p className="mt-2 md:mt-3 text-sm md:text-lg text-gray-300 max-w-[180px] md:max-w-[240px]">
                    A cross-platform metagame app, turning your activities across Web2 and Web3 games into a rewarding adventure.
                  </p>
                </div>
                <div className="hidden md:block">
                  <p className="text-xs text-gray-400">Hover to interact</p>
                </div>
              </div>
            </div>
          </BentoTilt>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 gap-4 md:gap-6 md:h-[135vh]">
            {/* Zigma - Top Left */}
            <BentoTilt className="md:row-span-2 h-64 md:h-full">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <video
                  src="/videos/feature-2.mp4"
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="absolute left-0 top-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 flex flex-col justify-between w-full h-full p-4 md:p-6">
                  <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white">
                      zig<b className="font-semibold">m</b>a
                    </h1>
                    <p className="mt-2 text-sm md:text-lg text-gray-300 max-w-[160px] md:max-w-[240px]">
                      An anime and gaming-inspired NFT collection - the IP primed for expansion.
                    </p>
                  </div>
                </div>
              </div>
            </BentoTilt>

            {/* Nexus - Top Right */}
            <BentoTilt className="h-64 md:h-auto">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <video
                  src="/videos/feature-3.mp4"
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="absolute left-0 top-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 flex flex-col justify-between w-full h-full p-4 md:p-6">
                  <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white">
                      n<b className="font-semibold">e</b>xus
                    </h1>
                    <p className="mt-2 text-sm md:text-lg text-gray-300 max-w-[160px] md:max-w-[240px]">
                      A gamified social hub for Web3 communities.
                    </p>
                  </div>
                </div>
              </div>
            </BentoTilt>

            {/* Azul - Middle Right */}
            <BentoTilt className="h-64 md:h-auto">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <video
                  src="/videos/feature-4.mp4"
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="absolute left-0 top-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 flex flex-col justify-between w-full h-full p-4 md:p-6">
                  <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white">
                      az<b className="font-semibold">u</b>l
                    </h1>
                    <p className="mt-2 text-sm md:text-lg text-gray-300 max-w-[160px] md:max-w-[240px]">
                      A cross-world AI Agent for better gameplay.
                    </p>
                  </div>
                </div>
              </div>
            </BentoTilt>

            {/* Coming Soon - Bottom Left */}
            <BentoTilt className="h-64 md:h-full">
              <div className="flex w-full h-full flex-col justify-between bg-gradient-to-br from-violet-400 to-purple-600 p-4 md:p-6 rounded-xl">
                <h1 className="text-3xl md:text-5xl font-bold text-black">
                  M<b className="font-semibold">o</b>re co<b className="font-semibold">m</b>ing so<b className="font-semibold">o</b>n!
                </h1>
                <TiLocationArrow className="mt-4 scale-[2] md:scale-[3] self-end text-black" />
              </div>
            </BentoTilt>

            {/* Feature 5 - Bottom Right */}
            <BentoTilt className="h-64 md:h-full col-span-1 md:col-span-1">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <video
                  src="/videos/feature-5.mp4"
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="absolute left-0 top-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            </BentoTilt>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Services;
