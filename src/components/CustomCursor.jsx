import { useEffect, useState } from "react";
import planet1 from "./assets/planet-1.png";
import planet2 from "./assets/planet-2.png";
import planet3 from "./assets/planet-3.png";
import planet4 from "./assets/planet-4.png";
import planet5 from "./assets/planet-5.png";

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
        if (prev.length >= 5) {
          return []; // Jika sudah 5, klik ke-6 hapus semuanya langsung
        }

        const newParticle = {
          id: Math.random(),
          x: cursorPos.x,
          y: cursorPos.y,
          image: planetImages[prev.length % planetImages.length],
          fading: false,
        };

        // Tambahkan partikel baru
        const newParticles = [...prev, newParticle];

        // Jadwalkan fade-out setelah 3 detik
        setTimeout(() => {
          setParticles((curr) =>
            curr.map((p) =>
              p.id === newParticle.id ? { ...p, fading: true } : p
            )
          );
        }, 2500);

        // Hapus setelah 3 detik
        setTimeout(() => {
          setParticles((curr) => curr.filter((p) => p.id !== newParticle.id));
        }, 3000);

        return newParticles;
      });
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
      {/* Custom cursor bulat */}
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

      {/* Partikel gambar planet */}
      {particles.map((p) => (
        <img
          key={p.id}
          src={p.image}
          alt="planet"
          className="fixed z-40 pointer-events-none transition-opacity duration-500"
          style={{
            left: p.x,
            top: p.y,
            width: "40px",
            height: "40px",
            transform: "translate(-50%, -50%)",
            opacity: p.fading ? 0 : 1,
          }}
        />
      ))}

      {/* Tambahan styling global */}
      <style>{`
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
