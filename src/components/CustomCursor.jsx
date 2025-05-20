import { useEffect, useState, useRef } from "react";

const planets = [
  <svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" fill="#3B82F6" /><path fill="#2563EB" d="M20 15h10v10H20zM35 35h10v10H35z" /></svg>,
  <svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" fill="#EF4444" /><circle cx="22" cy="22" r="6" fill="#B91C1C" /><circle cx="42" cy="42" r="8" fill="#DC2626" /></svg>,
  <svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" fill="#FBBF24" /><circle cx="32" cy="32" r="20" fill="#F59E0B" /></svg>,
  <svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" fill="#8B5CF6" /><ellipse cx="32" cy="32" rx="15" ry="30" fill="#7C3AED" /></svg>,
  <svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" fill="#22C55E" /><circle cx="40" cy="24" r="6" fill="#15803D" /><circle cx="24" cy="40" r="5" fill="#16A34A" /></svg>,
];

const CustomCursor = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [visible, setVisible] = useState(true);
  const [fadingAll, setFadingAll] = useState(false);
  const timeouts = useRef([]);

  useEffect(() => {
    document.body.style.cursor = "none";

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleClick = () => {
      setParticles((prev) => {
        if (prev.length >= 5) {
          // Mulai animasi fade out
          setFadingAll(true);
          timeouts.current.forEach(clearTimeout);
          timeouts.current = [];

          setTimeout(() => {
            setParticles([]);
            setFadingAll(false);
          }, 300); // tunggu animasi selesai

          return prev;
        }

        const newParticle = {
          id: Math.random(),
          x: cursorPos.x,
          y: cursorPos.y,
          planetIndex: prev.length % planets.length,
        };

        const updated = [...prev, newParticle];

        const timeout = setTimeout(() => {
          setParticles((current) => current.filter((p) => p.id !== newParticle.id));
        }, 2000);

        timeouts.current.push(timeout);
        return updated;
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
      timeouts.current.forEach(clearTimeout);
    };
  }, [cursorPos]);

  return (
    <>
      {/* Cursor */}
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

      {/* Partikel Planet */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`fixed z-40 pointer-events-none ${
            fadingAll ? "fade-out" : "animate-pop"
          }`}
          style={{
            left: p.x,
            top: p.y,
            width: "24px",
            height: "24px",
            transform: "translate(-50%, -50%)",
          }}
        >
          {planets[p.planetIndex]}
        </div>
      ))}

      {/* Style Animasi */}
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

        .animate-pop {
          animation: particle-pop 0.6s ease-out forwards;
        }

        .fade-out {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.5);
          transition: opacity 0.3s ease, transform 0.3s ease;
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
