import { useEffect, useState } from "react";

const YinYangParticle = ({ x, y, id }) => {
  return (
    <svg
      key={id}
      className="yin-yang-particle"
      width="32"
      height="32"
      viewBox="0 0 100 100"
      style={{
        position: "fixed",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 40,
        animation: "moveUpFade 1s ease-out forwards, spin 1.5s linear infinite",
        filter: "drop-shadow(0 0 8px rgba(128, 0, 128, 0.7)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Aura asap di belakang Yin Yang */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="url(#auraGradient)"
        opacity="0.3"
        style={{ animation: "pulseAura 2s ease-in-out infinite" }}
      />
      <defs>
        <radialGradient id="auraGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="50%" stopColor="rgba(128,0,128,0.6)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Yin Yang putih & ungu */}
      <circle cx="50" cy="50" r="48" fill="#fff" stroke="#800080" strokeWidth="4" />
      <path
        d="M50 2
           A48 48 0 1 1 50 98
           A24 24 0 1 0 50 2Z"
        fill="#800080"
      />
      <circle cx="50" cy="25" r="10" fill="#fff" />
      <circle cx="50" cy="75" r="10" fill="#800080" />
      <circle cx="50" cy="25" r="5" fill="#800080" />
      <circle cx="50" cy="75" r="5" fill="#fff" />
    </svg>
  );
};

const CustomCursor = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.cursor = "none";

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleClick = () => {
      const newParticle = {
        id: Math.random(),
        x: cursorPos.x,
        y: cursorPos.y,
      };
      setParticles((prev) => [...prev, newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 1200);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleVisibilityChange = () => {
      setVisible(!document.hidden);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.body.style.cursor = "auto";

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [cursorPos]);

  return (
    <>
      {/* Custom Cursor */}
      <div
        className="fixed z-50 pointer-events-none transition-opacity duration-200 sm:block hidden"
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
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Yin Yang Particle with aura */}
      {particles.map((p) => (
        <YinYangParticle key={p.id} id={p.id} x={p.x} y={p.y} />
      ))}

      <style>{`
        @keyframes moveUpFade {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -150%) translateY(-20px);
          }
        }
        @keyframes spin {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        @keyframes pulseAura {
          0%, 100% {
            opacity: 0.3;
            r: 40;
          }
          50% {
            opacity: 0.5;
            r: 48;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
