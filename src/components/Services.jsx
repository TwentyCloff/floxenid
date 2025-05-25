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
      className={`transition-all duration-300 ease-out will-change-transform ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
      onTouchStart={() => isMobile && setTransformStyle("scale(0.97)")}
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
          <BentoTilt className="border-hsla relative mb-6 h-64 w-full overflow-hidden rounded-2xl md:h-[65vh] md:rounded-3xl md:mb-8">
            <div className="relative w-full h-full">
              <video
                src="/videos/feature-1.mp4"
                loop
                muted
                autoPlay
                playsInline
                className="absolute left-0 top-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
              <div className="relative z-10 flex flex-col justify-between w-full h-full p-5 md:p-8">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                    radia<b className="font-semibold">n</b>t
                  </h1>
                  <p className="mt-3 text-sm md:text-lg text-gray-300 max-w-[200px] md:max-w-[280px] leading-snug md:leading-normal">
                    Cross-platform metagame app turning Web2/Web3 activities into rewards
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                  Hover to interact
                </div>
              </div>
            </div>
          </BentoTilt>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-3 md:gap-6 md:h-[135vh]">
            {/* Zigma - Top Left */}
            <BentoTilt className="h-64 md:h-full md:row-span-2">
              <div className="relative w-full h-full rounded-2xl overflow-hidden md:rounded-3xl">
                <video
                  src="/videos/feature-2.mp4"
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="absolute left-0 top-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="relative z-10 flex flex-col justify-between w-full h-full p-5">
                  <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                      zig<b className="font-semibold">m</b>a
                    </h1>
                    <p className="mt-2 text-sm md:text-lg text-gray-300 max-w-[180px] md:max-w-[240px] leading-snug">
                      Anime-inspired NFT collection with expansion potential
                    </p>
                  </div>
                </div>
              </div>
            </BentoTilt>

            {/* Nexus - Top Right */}
            <BentoTilt className="h-64 md:h-auto">
              <div className="relative w-full h-full rounded-2xl overflow-hidden md:rounded-3xl">
                <video
                  src="/videos/feature-3.mp4"
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="absolute left-0 top-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="relative z-10 flex flex-col justify-between w-full h-full p-5">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                      n<b className="font-semibold">e</b>xus
                    </h1>
                    <p className="mt-2 text-sm md:text-lg text-gray-300 max-w-[180px] md:max-w-[240px] leading-snug">
                      Gamified social hub for Web3 communities
                    </p>
                  </div>
                </div>
              </div>
            </BentoTilt>

            {/* Azul - Middle Right */}
            <BentoTilt className="h-64 md:h-auto">
              <div className="relative w-full h-full rounded-2xl overflow-hidden md:rounded-3xl">
                <video
                  src="/videos/feature-4.mp4"
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="absolute left-0 top-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="relative z-10 flex flex-col justify-between w-full h-full p-5">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                      az<b className="font-semibold">u</b>l
                    </h1>
                    <p className="mt-2 text-sm md:text-lg text-gray-300 max-w-[180px] md:max-w-[240px] leading-snug">
                      Cross-world AI Agent for enhanced gameplay
                    </p>
                  </div>
                </div>
              </div>
            </BentoTilt>

            {/* Feature 5 - Bottom Right (now 6th position) */}
            <BentoTilt className="h-64 md:h-full">
              <div className="relative w-full h-full rounded-2xl overflow-hidden md:rounded-3xl">
                <video
                  src="/videos/feature-5.mp4"
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="absolute left-0 top-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="relative z-10 p-5">
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                    More Features
                  </h1>
                </div>
              </div>
            </BentoTilt>

            {/* Coming Soon - Now at very bottom (7th position) */}
            <BentoTilt className="h-64 md:h-full col-span-1 md:col-span-1 order-last">
              <div className="flex w-full h-full flex-col justify-between bg-gradient-to-br from-purple-500 to-indigo-600 p-5 rounded-2xl md:rounded-3xl">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                    M<b className="font-semibold">o</b>re co<b className="font-semibold">m</b>ing!
                  </h1>
                  <p className="mt-2 text-sm md:text-lg text-white/90 max-w-[200px]">
                    Exciting updates launching soon
                  </p>
                </div>
                <TiLocationArrow className="mt-4 scale-[2] md:scale-[3] self-end text-white/90 animate-bounce" />
              </div>
            </BentoTilt>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Services;
