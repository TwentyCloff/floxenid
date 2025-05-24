import { useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Section from "./Section";

const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!itemRef.current) return;

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
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

const BentoCard = ({ src, title, description }) => {
  return (
    <article className="relative w-full h-full">
      <video
        src={src}
        loop
        muted
        autoPlay
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="relative z-10 flex flex-col justify-between w-full h-full p-5 text-blue-50">
        <div>
          <h1 className="text-4xl font-bold mb-3">{title}</h1>
          {description && <p className="text-xl max-w-[16rem]">{description}</p>}
        </div>
      </div>
    </article>
  );
};

const Services = () => {
  return (
    <Section id="how-to-use">
      <div className="bg-black pb-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Featured Card */}
            <BentoTilt className="relative h-96 md:h-[80vh] rounded-2xl overflow-hidden">
              <BentoCard
                src="/videos/feature-1.mp4"
                title={
                  <>
                    radia<b>n</b>t
                  </>
                }
                description="A cross-platform metagame app for Web2 and Web3 games"
              />
            </BentoTilt>

            {/* Secondary Cards Grid */}
            <div className="grid grid-cols-2 grid-rows-2 gap-6">
              <BentoTilt className="rounded-2xl overflow-hidden">
                <BentoCard
                  src="/videos/feature-2.mp4"
                  title={
                    <>
                      zig<b>m</b>a
                    </>
                  }
                  description="Anime-inspired NFT collection"
                />
              </BentoTilt>

              <BentoTilt className="rounded-2xl overflow-hidden">
                <BentoCard
                  src="/videos/feature-3.mp4"
                  title={
                    <>
                      n<b>e</b>xus
                    </>
                  }
                  description="Gamified social hub"
                />
              </BentoTilt>

              <BentoTilt className="rounded-2xl overflow-hidden">
                <BentoCard
                  src="/videos/feature-4.mp4"
                  title={
                    <>
                      az<b>u</b>l
                    </>
                  }
                  description="Cross-world AI Agent"
                />
              </BentoTilt>

              {/* Special Coming Soon Card */}
              <BentoTilt className="rounded-2xl overflow-hidden bg-gradient-to-br from-purple-400 to-indigo-600">
                <div className="flex flex-col justify-between w-full h-full p-6">
                  <h2 className="text-3xl font-bold text-white">
                    M<b>o</b>re co<b>m</b>ing so<b>o</b>n!
                  </h2>
                  <TiLocationArrow className="self-end text-white text-4xl" />
                </div>
              </BentoTilt>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Services;
