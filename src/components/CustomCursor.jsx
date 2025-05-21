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
  const [particles, setParticles] = useState([]);
  const [visible, setVisible] = useState(true);
  const dotRef = useRef(null);
  const circleRef = useRef(null);
  const requestRef = useRef(null);
  const planetIndex = useRef(0);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate circle follow with lerp smoothing
  useEffect(() => {
    const moveCircle = () => {
      if (circleRef.current) {
        const circle = circleRef.current;
        const cx = parseFloat(circle.style.left || 0);
        const cy = parseFloat(circle.style.top || 0);
        const dx = mousePos.x - cx;
        const dy = mousePos.y - cy;
        circle.style.left = `${cx + dx * 0.2}px`;
        circle.style.top = `${cy + dy * 0.2}px`;
      }
      requestRef.current = requestAnimationFrame(moveCircle);
    };
    requestRef.current = requestAnimationFrame(moveCircle);
    return () => cancelAnimationFrame(requestRef.current);
  }, [mousePos]);

  // Fade out cursor on mouse leave window
  useEffect(() => {
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);
    window.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget || e.relatedTarget.nodeName === "HTML") {
        handleMouseLeave();
      }
    });
    window.addEventListener("mouseenter", handleMouseEnter);
    return () => {
      window.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  // Handle click: add planet particle
  const handleClick = () => {
    setParticles((prev) => {
      if (prev.length >= 5) {
        // Clear all particles if max reached
        return [];
      }

      const id = Date.now() + Math.random();
      const img = planetImages[planetIndex.current];
      const newParticle = {
        id,
        x: mousePos.x,
        y: mousePos.y,
        img,
      };

      planetIndex.current = (planetIndex.current + 1) % planetImages.length;

      // Remove particle after 3 seconds
      setTimeout(() => {
        setParticles((current) => current.filter((p) => p.id !== id));
      }, 3000);

      return [...prev, newParticle];
    });
  };

  return (
    <>
      {/* Dot (cursor center) */}
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Circle follower */}
      <div
        ref={circleRef}
        className="custom-cursor-circle"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Click text below */}
        <div className="custom-cursor-click-text">Click!</div>
      </div>

      {/* Planets particles */}
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
        />
      ))}

      {/* Invisible full screen overlay to catch clicks */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9990,
          pointerEvents: "auto",
          backgroundColor: "transparent",
        }}
        onClick={handleClick}
      />
    </>
  );
};

export default CustomCursor;
