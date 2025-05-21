import { useEffect, useRef, useState } from "react";
import planet1 from "../asseth/planet-1.png";
import planet2 from "../asseth/planet-2.png";
import planet3 from "../asseth/planet-3.png";
import planet4 from "../asseth/planet-4.png";
import planet5 from "../asseth/planet-5.png";

const planetImages = [planet1, planet2, planet3, planet4, planet5];

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const dotRef = useRef(null);
  const circleRef = useRef(null);
  const requestRef = useRef(null);
  const planetIndex = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const moveCircle = () => {
      if (circleRef.current) {
        const circle = circleRef.current;
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
        className="fixed w-[8px] h-[8px] bg-white rounded-full z-50 pointer-events-none"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Circle follower */}
      <div
        ref={circleRef}
        className="fixed w-16 h-16 rounded-full border-2 border-white bg-white/10 z-40 pointer-events-none"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: "translate(-50%, -50%)",
          // Hilangkan backdropBlur agar tidak blur di dalam lingkaran
          backdropFilter: "none",
        }}
      >
        {/* Click text di bawah dot (di luar lingkaran) */}
        <div
          className="absolute left-1/2 top-full translate-x-[-50%] mt-4 text-white text-sm select-none pointer-events-none"
          style={{ userSelect: "none" }}
        >
          Click!
        </div>
      </div>

      {/* Planets (particles) */}
      {particles.map((p) => (
        <img
          key={p.id}
          src={p.img}
          alt="planet"
          className="fixed z-30 pointer-events-none animate-popout"
          style={{
            left: p.x,
            top: p.y,
            width: "48px",
            height: "48px",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* CSS Animations */}
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

      {/* Click listener overlay */}
      <div
        className="fixed inset-0 z-10"
        onClick={handleClick}
        style={{ pointerEvents: "auto" }}
      />
    </>
  );
};

export default CustomCursor;
