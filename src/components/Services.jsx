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

const Services = () => {
  return (
    <Section id="how-to-use">
      <div className="bg-black pb-52 circular-font">
        <div className="container mx-auto px-3 md:px-10">
          <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
            <div className="relative w-full h-full">
              <video
                src="/videos/feature-1.mp4"
                loop
                muted
                autoPlay
                className="absolute left-0 top-0 w-full h-full object-cover"
              />
              <div className="relative z-10 flex flex-col justify-between w-full h-full p-5">
                <div>
                  <h1 className="bento-title text-white">
                    radia<b className="font-semibold">n</b>t
                  </h1>
                  <p className="mt-3 text-lg text-n-3 max-w-[240px]">
                    A cross-platform metagame app, turning your activities across Web2 and Web3 games into a rewarding adventure.
                  </p>
                </div>
              </div>
            </div>
          </BentoTilt>

          <div className="grid h-[135vh] grid-cols-2 grid-rows-3 gap-7">
            <BentoTilt className="row-span-1 md:col-span-1 md:row-span-2">
              <div className="relative w-full h-full">
                <video
                  src="/videos/feature-2.mp4"
                  loop
                  muted
                  autoPlay
                  className="absolute left-0 top-0 w-full h-full object-cover"
                />
                <div className="relative z-10 flex flex-col justify-between w-full h-full p-5">
                  <div>
                    <h1 className="bento-title text-white">
                      zig<b className="font-semibold">m</b>a
                    </h1>
                    <p className="mt-3 text-lg text-n-3 max-w-[240px]">
                      An anime and gaming-inspired NFT collection - the IP primed for expansion.
                    </p>
                  </div>
                </div>
              </div>
            </BentoTilt>

            <BentoTilt className="row-span-1 ms-32 md:col-span-1 md:ms-0">
              <div className="relative w-full h-full">
                <video
                  src="/videos/feature-3.mp4"
                  loop
                  muted
                  autoPlay
                  className="absolute left-0 top-0 w-full h-full object-cover"
                />
                <div className="relative z-10 flex flex-col justify-between w-full h-full p-5">
                  <div>
                    <h1 className="bento-title text-white">
                      n<b className="font-semibold">e</b>xus
                    </h1>
                    <p className="mt-3 text-lg text-n-3 max-w-[240px]">
                      A gamified social hub, adding a new dimension of play to social interaction for Web3 communities.
                    </p>
                  </div>
                </div>
              </div>
            </BentoTilt>

            <BentoTilt className="me-14 md:col-span-1 md:me-0">
              <div className="relative w-full h-full">
                <video
                  src="/videos/feature-4.mp4"
                  loop
                  muted
                  autoPlay
                  className="absolute left-0 top-0 w-full h-full object-cover"
                />
                <div className="relative z-10 flex flex-col justify-between w-full h-full p-5">
                  <div>
                    <h1 className="bento-title text-white">
                      az<b className="font-semibold">u</b>l
                    </h1>
                    <p className="mt-3 text-lg text-n-3 max-w-[240px]">
                      A cross-world AI Agent - elevating your gameplay to be more fun and productive.
                    </p>
                  </div>
                </div>
              </div>
            </BentoTilt>

            <BentoTilt>
              <div className="flex w-full h-full flex-col justify-between bg-violet-300 p-5">
                <h1 className="bento-title text-black">
                  M<b className="font-semibold">o</b>re co<b className="font-semibold">m</b>ing so<b className="font-semibold">o</b>n!
                </h1>
                <TiLocationArrow className="m-5 scale-[5] self-end text-black" />
              </div>
            </BentoTilt>

            <BentoTilt>
              <video
                src="/videos/feature-5.mp4"
                loop
                muted
                autoPlay
                className="w-full h-full object-cover"
              />
            </BentoTilt>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Services;
