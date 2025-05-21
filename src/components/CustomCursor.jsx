import { useEffect, useState } from "react";

// Import gambar planet dari folder assets
import planet1 from "../assets/planet-1.png";
import planet2 from "../assets/planet-2.png";
import planet3 from "../assets/planet-3.png";
import planet4 from "../assets/planet-4.png";
import planet5 from "../assets/planet-5.png";

const planetImages = [planet1, planet2, planet3, planet4, planet5];

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
      setParticles((prev) => {
        if (prev.length >= 5) return [];

        const planetIndex = prev.length % planetImages.length;
        const id = Date.now() + Math.random();

        const newParticle = {
          id,
          x: cursorPos.x,
          y: cursorPos.y,
          planetIndex,
        };

        const updatedParticles = [...prev, newParticle];

        setTimeout(() => {
          setParticles((current) =>
            current.filter((p) => p.id !== newParticle.id)
          );
        }, 3000); // 3 detik

        return updatedParticles;
      });
    };

    const handleMouseLeave = () => setVisible(false);
    const handleVisibilityChange = () => setVisible(!document.hidden);

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
      {/* Lingkaran dan dot putih */}
      <div
        className="fixed z-50 pointer-events-none transition-opacity duration-200 sm:block hidden"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          transform: "translate(-50%, -50%)",
          width: "48px",
          height: "48px",
          borderRadius: "9999px",
          border: "2px solid white",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(4px)",
          opacity: visible ? 1 : 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            backgroundColor: "white",
            borderRadius: "50%",
            marginBottom: "2px",
          }}
        />
        <div
          style={{
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            marginTop: "4px",
          }}
        >
          Click!
        </div>
      </div>

      {/* Particle planet */}
      {particles.map((p) => (
        <img
          key={p.id}
          src={planetImages[p.planetIndex]}
          className="fixed z-40 pointer-events-none planet"
          style={{
            left: p.x,
            top: p.y,
            width: "64px",
            height: "64px",
            transform: "translate(-50%, -50%)",
            animation: "pop-out 0.4s ease-out",
          }}
          alt={`Planet ${p.planetIndex + 1}`}
        />
      ))}

      <style>{`
        @keyframes pop-out {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        body, *:not(.use-default-cursor) {
          cursor: none !important;
        }
        .use-default-cursor {
          cursor: auto !important;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
