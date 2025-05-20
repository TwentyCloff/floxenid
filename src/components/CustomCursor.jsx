import { useEffect, useState } from "react";

const CrackLine = ({ x, y, id, angle, length }) => {
  return (
    <div
      key={id}
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: 0,
        height: 2,
        background:
          "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(128,0,128,0.9))",
        transformOrigin: "0% 50%",
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        filter:
          "drop-shadow(0 0 8px rgba(128,0,128,0.8)) drop-shadow(0 0 12px rgba(255,255,255,0.8))",
        animation: "crackExpand 0.6s forwards, crackFade 0.8s forwards 0.3s",
        pointerEvents: "none",
        zIndex: 100,
        "--length": `${length}px`,
      }}
    />
  );
};

const Debris = ({ x, y, id, angle, distance }) => {
  // small glowing fragment that flies out then fades
  return (
    <div
      key={id}
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: 6,
        height: 6,
        background:
          "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(128,0,128,0.7) 70%, transparent 100%)",
        borderRadius: "50%",
        filter: "drop-shadow(0 0 6px rgba(128,0,128,0.8))",
        transform: `translate(-50%, -50%) translate(${distance * Math.cos(angle)}px, ${distance * Math.sin(angle)}px)`,
        animation: "debrisFly 1s forwards",
        pointerEvents: "none",
        zIndex: 101,
      }}
    />
  );
};

const CustomCursor = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cracks, setCracks] = useState([]);
  const [debris, setDebris] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.cursor = "none";

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleClick = () => {
      // Create 8 crack lines with random angle/length
      const newCracks = Array.from({ length: 8 }).map((_, i) => {
        const angle = i * 45 + (Math.random() * 30 - 15);
        const length = 70 + Math.random() * 50;
        return {
          id: Math.random(),
          x: cursorPos.x,
          y: cursorPos.y,
          angle,
          length,
        };
      });

      // Create 12 debris particles with random angle/distance
      const newDebris = Array.from({ length: 12 }).map(() => {
        const angle = Math.random() * 2 * Math.PI;
        const distance = 50 + Math.random() * 50;
        return {
          id: Math.random(),
          x: cursorPos.x,
          y: cursorPos.y,
          angle,
          distance,
        };
      });

      setCracks((prev) => [...prev, ...newCracks]);
      setDebris((prev) => [...prev, ...newDebris]);

      // Remove them after animation duration
      setTimeout(() => {
        setCracks((prev) =>
          prev.filter((c) => !newCracks.find((nc) => nc.id === c.id))
        );
        setDebris((prev) =>
          prev.filter((d) => !newDebris.find((nd) => nd.id === d.id))
        );
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

      {/* Crack Lines */}
      {cracks.map(({ id, x, y, angle, length }) => (
        <CrackLine key={id} x={x} y={y} angle={angle} length={length} />
      ))}

      {/* Debris Particles */}
      {debris.map(({ id, x, y, angle, distance }) => (
        <Debris key={id} x={x} y={y} angle={angle} distance={distance} />
      ))}

      <style>{`
        @keyframes crackExpand {
          0% {
            width: 0;
            opacity: 1;
            filter: drop-shadow(0 0 10px rgba(128,0,128,0.9));
          }
          70% {
            width: var(--length);
            opacity: 1;
            filter: drop-shadow(0 0 12px rgba(128,0,128,1)) drop-shadow(0 0 15px rgba(255,255,255,1));
          }
          100% {
            opacity: 0;
            filter: none;
          }
        }
        @keyframes crackFade {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes debrisFly {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(0, 0);
            filter: drop-shadow(0 0 8px rgba(128,0,128,0.8));
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(var(--dx), var(--dy));
            filter: none;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
