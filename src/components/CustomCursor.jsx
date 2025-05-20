import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setVisible(true); // munculkan saat gerak
    };

    const handleClick = () => {
      const newParticles = Array.from({ length: 10 }, () => ({
        id: Math.random(),
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

    const handleMouseLeave = () => setVisible(false);
    const handleVisibilityChange = () => {
      setVisible(!document.hidden);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [cursorPos]);

  return (
    <>
      {/* Custom Cursor with fade */}
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
    </>
  );
};

export default CustomCursor;
