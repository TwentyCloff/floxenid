import { useEffect, useRef, useState } from "react";
import planet1 from "../assets/planet-1.png";
import planet2 from "../assets/planet-2.png";
import planet3 from "../assets/planet-3.png";
import planet4 from "../assets/planet-4.png";
import planet5 from "../assets/planet-5.png";
import "./CustomCursor.css";

const planetImages = [planet1, planet2, planet3, planet4, planet5];

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [circlePos, setCirclePos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [particles, setParticles] = useState([]);
  const planetIndex = useRef(0);
  const requestRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  useEffect(() => {
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      setCirclePos((prev) => ({
        x: lerp(prev.x, mousePos.x, 0.2),
        y: lerp(prev.y, mousePos.y, 0.2),
      }));
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [mousePos]);

  const handleClick = () => {
    setParticles((prev) => {
      if (prev.length >= 5) return [];

      const id = Date.now() + Math.random();
      const img = planetImages[planetIndex.current];
      planetIndex.current = (planetIndex.current + 1) % planetImages.length;

      const newParticle = {
        id,
        x: mousePos.x,
        y: mousePos.y,
        img,
      };

      setTimeout(() => {
        setParticles((cur) => cur.filter((p) => p.id !== id));
      }, 3000);

      return [...prev, newParticle];
    });
  };

  return (
    <>
      <div
        className="custom-cursor-dot"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          opacity: visible ? 1 : 0,
        }}
      >
        <div className="custom-cursor-click-text">Click!</div>
      </div>

      <div
        className="custom-cursor-circle"
        style={{
          left: circlePos.x,
          top: circlePos.y,
          opacity: visible ? 1 : 0,
        }}
      />

      {particles.map((p) => (
        <img
          key={p.id}
          src={p.img}
          alt="planet"
          className="custom-cursor-planet"
          style={{
            left: p.x,
            top: p.y,
          }}
          draggable={false}
        />
      ))}

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          pointerEvents: "auto",
          backgroundColor: "transparent",
        }}
        onClick={handleClick}
      />
    </>
  );
};

export default CustomCursor;
