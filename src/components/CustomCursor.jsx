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
  const requestRef = useRef(null);
  const planetIndex = useRef(0);

  // Track mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Circle follows dot
  useEffect(() => {
    const moveCircle = () => {
      if (circleRef.current && dotRef.current) {
        const circle = circleRef.current;
        const dot = dotRef.current.getBoundingClientRect();
        const cx = parseFloat(circle.style.left || 0);
        const cy = parseFloat(circle.style.top || 0);
        const dx = mousePos.x - cx;
        const dy = mousePos.y - cy;
        circle.style.left = `${cx + dx * 0.2}px`;
        circle.style.top = `${cy + dy * 0.2}px`;
      }
      requestRef.current = requestAnimationFrame(moveCircle);
    };
    requestRef.current = requestAnimationFrame(moveCircle);
    return () => cancelAnimationFrame(requestRef.current);
  }, [mousePos]);

  // On click: spawn particle
  const handleClick = () => {
    setParticles((prev) => {
      if (prev.length >= 5) {
        return [];
      }

      const id = Date.now() + Math.random();
      const img = planetImages[planetIndex.current];
      const newParticle = {
        id,
        x: mousePos.x,
        y: mousePos.y,
        img,
      };

      planetIndex.current = (planetIndex.current + 1) % planetImages.length;

      // Schedule removal
      setTimeout(() => {
        setParticles((current) => current.filter((p) => p.id !== id));
      }, 3000);

      return [...prev, newParticle];
    });
  };

  return (
    <>
      {/* Dot (cursor center) */}
      <div
        ref={dotRef}
        className="fixed w-[6px] h-[6px] bg-white rounded-full z-50 pointer-events-none"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Circle follower */}
      <div
        ref={circleRef}
        className="fixed w-12 h-12 rounded-full border-2 border-white bg-white/10 backdrop-blur-sm z-40 pointer-events-none"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="absolute left-1/2 top-full translate-x-[-50%] mt-1 text-white text-xs">
          Click!
        </div>
      </div>

      {/* Planets (particles) */}
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

      <style>{`
        .animate-popout {
          animation: popout 0.25s ease-out, fadeout 0.25s ease-in 2.75s forwards;
        }

        @keyframes popout {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.7);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
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

      {/* Click listener */}
      <div
        className="fixed inset-0 z-10"
        onClick={handleClick}
        style={{ pointerEvents: "auto" }}
      ></div>
    </>
  );
};

export default CustomCursor;
