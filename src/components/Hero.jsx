import { useEffect, useRef, useState } from "react";
import Typewriter from "typewriter-effect";

import { curve } from "../assets";
import blackholeVideo from "../assets/hero/blackhole.webm";
import Button from "./Button";
import Section from "./Section";

const Hero = () => {
  const parallaxRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  // Update posisi kursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      // Tambah partikel baru
      const newParticles = Array.from({ length: 10 }, () => ({
        id: Math.random(),
        x: cursorPos.x,
        y: cursorPos.y,
      }));
      setParticles((prev) => [...prev, ...newParticles]);

      // Hapus partikel setelah 600ms
      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.find((np) => np.id === p.id))
        );
      }, 600);
    };

    const heroElement = document.getElementById("hero");
    heroElement?.addEventListener("mousemove", handleMouseMove);
    heroElement?.addEventListener("click", handleClick);

    return () => {
      heroElement?.removeEventListener("mousemove", handleMouseMove);
      heroElement?.removeEventListener("click", handleClick);
    };
  }, [cursorPos]);

  return (
    <Section
      id="hero"
      customPaddings
      className="pt-[12rem] -mt-[5.25rem] relative overflow-hidden"
    >
      {/* Background gradient gelap halus */}
      <div
        className="absolute inset-0 z-[-20] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #121212 0%, #000000 90%)",
        }}
      />

      {/* Overlay hitam transparan */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20 z-[-9]" />

      {/* Video blackhole */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="blackhole-video absolute left-1/2 transform -translate-x-1/2 w-[130vw] h-[130vh] object-cover z-[-10] pointer-events-none
                   top-[-10%] sm:top-[-15%] md:top-[-10%] lg:top-[-10%]"
        style={{
          filter: "brightness(0.7)",
        }}
      >
        <source src={blackholeVideo} type="video/webm" />
      </video>

      {/* Mobile-only adjustment */}
      <style>
        {`
          @media (max-width: 640px) {
            .blackhole-video {
              top: -30% !important;
              filter: brightness(0.95) !important;
            }
          }
          @media (min-width: 640px) {
            #hero {
              cursor: none;
            }
          }
        `}
      </style>

      {/* Konten utama */}
      <div ref={parallaxRef} className="container relative z-10">
        <div className="relative max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
          <h1 className="h1 mb-6 text-white">
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

          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8 text-gray-300">
            Unlock the next level of game scripting with{" "}
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

      {/* Gradient transisi ke hitam pekat */}
      <div
        className="absolute bottom-0 left-0 w-full h-[12rem] z-[-5]"
        style={{
          background: "linear-gradient(to bottom, transparent, #000)",
        }}
      />

      {/* Custom Cursor */}
      <div
        className="hidden sm:block fixed z-50 pointer-events-none"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          transform: "translate(-50%, -50%)",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "2px solid white",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(4px)",
          transition: "transform 0.1s ease-out",
        }}
      />

      {/* Partikel efek klik */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed z-40 pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            width: "6px",
            height: "6px",
            backgroundColor: "white",
            borderRadius: "9999px",
            transform: `translate(-50%, -50%) scale(${Math.random() * 1.5 + 1})`,
            animation: "particle-pop 0.6s ease-out forwards",
          }}
        />
      ))}

      {/* Animasi partikel */}
      <style>{`
        @keyframes particle-pop {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -150%) scale(0.5);
          }
        }
      `}</style>
    </Section>
  );
};

export default Hero;
