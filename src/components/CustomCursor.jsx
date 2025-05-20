import { useEffect, useState } from "react";

const NUM_CRACKS = 6;
const NUM_FRAGMENTS = 14;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const Crack = ({ x, y, id, angle, length }) => {
  return (
    <div
      key={id}
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: length,
        height: 3,
        background: "linear-gradient(90deg, #c8a2ff, #6f42c1)",
        borderRadius: "2px",
        filter:
          "drop-shadow(0 0 8px #b188ff) drop-shadow(0 0 12px #cdb4ff)",
        transformOrigin: "0% 50%",
        transform: `translate(-50%, -50%) rotate(${angle}deg) scaleX(0)`,
        animation: "donghuaCrackExpand 0.6s forwards",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};

const Fragment = ({ x, y, id, angle, distance }) => {
  return (
    <div
      key={id}
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: 8,
        height: 8,
        background:
          "radial-gradient(circle at center, #b5a1ff 0%, #4b2e83 80%, transparent 100%)",
        borderRadius: "50%",
        filter: "drop-shadow(0 0 8px #cbb8ff)",
        transform: `translate(-50%, -50%) translate(0, 0) scale(0.8) rotate(0deg)`,
        animation: `donghuaFragmentMove 1.1s forwards`,
        animationDelay: `${Math.random() * 0.3}s`,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};

const SmokeParticle = ({ x, y, id }) => {
  const size = randomBetween(15, 30);
  const delay = Math.random() * 0.5;
  return (
    <div
      key={id}
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: size,
        height: size,
        background:
          "radial-gradient(circle at center, rgba(150, 100, 255, 0.3), transparent 80%)",
        borderRadius: "50%",
        filter: "blur(6px)",
        opacity: 0,
        animation: "donghuaSmokeRise 2.5s forwards",
        animationDelay: `${delay}s`,
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
};

const CustomCursor = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cracks, setCracks] = useState([]);
  const [fragments, setFragments] = useState([]);
  const [smoke, setSmoke] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.cursor = "none";

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleClick = () => {
      // Create crack lines
      const newCracks = Array.from({ length: NUM_CRACKS }).map((_, i) => {
        const angle = i * (360 / NUM_CRACKS) + randomBetween(-15, 15);
        const length = randomBetween(80, 140);
        return {
          id: Math.random(),
          x: cursorPos.x,
          y: cursorPos.y,
          angle,
          length,
        };
      });

      // Create fragments with random angle & distance
      const newFragments = Array.from({ length: NUM_FRAGMENTS }).map(() => {
        const angle = Math.random() * 2 * Math.PI;
        const distance = randomBetween(60, 130);
        return {
          id: Math.random(),
          x: cursorPos.x,
          y: cursorPos.y,
          angle,
          distance,
        };
      });

      // Create smoke particles (less, bigger, float up)
      const newSmoke = Array.from({ length: 7 }).map(() => {
        return {
          id: Math.random(),
          x: cursorPos.x + randomBetween(-15, 15),
          y: cursorPos.y + randomBetween(-15, 15),
        };
      });

      setCracks((prev) => [...prev, ...newCracks]);
      setFragments((prev) => [...prev, ...newFragments]);
      setSmoke((prev) => [...prev, ...newSmoke]);

      setTimeout(() => {
        setCracks((prev) =>
          prev.filter((c) => !newCracks.find((nc) => nc.id === c.id))
        );
        setFragments((prev) =>
          prev.filter((f) => !newFragments.find((nf) => nf.id === f.id))
        );
        setSmoke((prev) =>
          prev.filter((s) => !newSmoke.find((ns) => ns.id === s.id))
        );
      }, 2500);
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
          border: "2px solid #b497ff",
          background:
            "radial-gradient(circle at center, rgba(180,150,255,0.3), transparent 80%)",
          backdropFilter: "blur(6px)",
          opacity: visible ? 1 : 0,
          boxShadow:
            "0 0 10px #a36fff, 0 0 20px #cbb4ff, inset 0 0 10px #d9bbff",
        }}
      />

      {/* Crack lines */}
      {cracks.map(({ id, x, y, angle, length }) => (
        <Crack key={id} x={x} y={y} angle={angle} length={length} />
      ))}

      {/* Fragments */}
      {fragments.map(({ id, x, y, angle, distance }) => (
        <Fragment key={id} x={x} y={y} angle={angle} distance={distance} />
      ))}

      {/* Smoke particles */}
      {smoke.map(({ id, x, y }) => (
        <SmokeParticle key={id} x={x} y={y} />
      ))}

      <style>{`
        @keyframes donghuaCrackExpand {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scaleX(0);
            opacity: 1;
            filter: drop-shadow(0 0 15px #b497ff);
          }
          80% {
            transform: translate(-50%, -50%) scaleX(1) rotate(var(--angle));
            opacity: 1;
            filter: drop-shadow(0 0 30px #9c6eff) drop-shadow(0 0 25px #cca9ff);
          }
          100% {
            opacity: 0;
            filter: none;
            transform: translate(-50%, -50%) scaleX(1) rotate(var(--angle));
          }
        }

        @keyframes donghuaFragmentMove {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(0, 0) scale(0.8) rotate(0deg);
            filter: drop-shadow(0 0 12px #b497ff);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(0.5) rotate(180deg);
            filter: none;
          }
        }

        @keyframes donghuaSmokeRise {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.5);
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0;
            transform: translateY(-40px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-50px) scale(1.1);
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
