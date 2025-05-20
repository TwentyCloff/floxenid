import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      const newParticles = Array.from({ length: 10 }, () => ({
        id: crypto.randomUUID(),
        x: cursorPos.x,
        y: cursorPos.y,
      }));
      setParticles((prev) => [...prev, ...newParticles]);

      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.find((np) => np.id === p.id))
        );
      }, 600);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick);
    };
  }, [cursorPos]);

  return (
    <>
      {/* Lingkaran utama cursor */}
      <div
        className="fixed z-[9999] pointer-events-none hidden sm:block"
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
          transition: "transform 0.08s ease-out",
        }}
      />

      {/* Partikel klik */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed z-[9998] pointer-events-none"
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

        @media (min-width: 640px) {
          html, body {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
