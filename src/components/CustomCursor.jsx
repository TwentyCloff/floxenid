import { useEffect, useRef, useState } from "react";
import planet1 from "../assets/planet-1.png";
import planet2 from "../assets/planet-2.png";
import planet3 from "../assets/planet-3.png";
import planet4 from "../assets/planet-4.png";
import planet5 from "../assets/planet-5.png";

const planetImages = [planet1, planet2, planet3, planet4, planet5];

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const dotRef = useRef(null);
  const circleRef = useRef(null);
  const animationFrame = useRef(null);
  const planetIndex = useRef(0);

  // Mouse tracking & smooth circle follow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const follow = () => {
      if (circleRef.current && dotRef.current) {
        const circle = circleRef.current;
        const dot = dotRef.current;
        const dotRect = dot.getBoundingClientRect();

        const currentX = parseFloat(circle.style.left || 0);
        const currentY = parseFloat(circle.style.top || 0);

        const dx = mousePos.x - currentX;
        const dy = mousePos.y - currentY;

        circle.style.left = `${currentX + dx * 0.15}px`;
        circle.style.top = `${currentY + dy * 0.15}px`;
      }

      animationFrame.current = requestAnimationFrame(follow);
    };

    animationFrame.current = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(animationFrame.current);
  }, [mousePos]);

  const handleClick = () => {
    setParticles((prev) => {
      // Reset if full
      if (prev.length >= 5) {
        return [];
      }

      const newParticle = {
        id: Date.now() + Math.random(),
        x: mousePos.x,
        y: mousePos.y,
        img: planetImages[planetIndex.current],
      };

      planetIndex.current = (planetIndex.current + 1) % planetImages.length;

      // Schedule removal
      setTimeout(() => {
        setParticles((current) => current.filter((p) => p.id !== newParticle.id));
      }, 3000);

      return [...prev, newParticle];
    });
  };

  return (
    <>
      {/* Dot (actual cursor center) */}
      <div
        ref={dotRef}
        className="fixed z-50 w-[6px] h-[6px] bg-white rounded-full pointer-events-none"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Follower Circle */}
      <div
        ref={circleRef}
        className="fixed z-40 w-[48px] h-[48px] rounded-full border-2 border-white bg-white/5 backdrop-blur-sm pointer-events-none transition-transform duration-75"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="absolute text-xs text-white left-1/2 top-full translate-x-[-50%] mt-1">
          Click!
        </div>
      </div>

      {/* Planet Particles */}
      {particles.map((p) => (
        <img
          key={p.id}
          src={p.img}
          alt="planet"
          className="fixed w-8 h-8 z-30 pointer-events-none animate-popout"
          style={{
            left: p.x,
            top: p.y,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Global styles */}
      <style>{`
        .animate-popout {
          animation: popout 0.3s ease, fadeout 0.2s ease 2.8s forwards;
        }

        @keyframes popout {
          0% {
            transform: translate(-50%, -50%) scale(0.6);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeout {
          to {
            opacity: 0;
          }
        }

        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
