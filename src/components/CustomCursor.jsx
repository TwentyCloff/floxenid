import { useEffect, useState } from "react";

const YinYangParticle = ({ x, y, id }) => (
  <svg
    key={id}
    className="yin-yang-particle"
    width="24"
    height="24"
    viewBox="0 0 100 100"
    style={{
      position: "fixed",
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
      zIndex: 40,
      animation: "moveUpFade 1s ease-out forwards, spin 1s linear infinite",
    }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="48" fill="black" stroke="white" strokeWidth="4" />
    <path
      d="M50 2
         A48 48 0 1 1 50 98
         A24 24 0 1 0 50 2Z"
      fill="white"
    />
    <circle cx="50" cy="25" r="10" fill="black" />
    <circle cx="50" cy="75" r="10" fill="white" />
    <circle cx="50" cy="25" r="5" fill="white" />
    <circle cx="50" cy="75" r="5" fill="black" />
  </svg>
);

const CustomCursor = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = "none";

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleClick = () => {
      const newParticles = Array.from({ length: 5 }, () => ({
        id: Math.random(),
        x: cursorPos.x + (Math.random() - 0.5) * 30,
        y: cursorPos.y + (Math.random() - 0.5) * 30,
      }));
      setParticles((prev) => [...prev, ...newParticles]);

      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.find((np) => np.id === p.id))
        );
      }, 1000);
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
      // Restore default cursor on unmount
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

      {/* Yin Yang Particles */}
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
      `}</style>
    </>
  );
};

export default CustomCursor;
