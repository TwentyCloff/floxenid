import { useEffect, useRef, useState } from "react";
import planet1 from "../assets/planet-1.png";
import planet2 from "../assets/planet-2.png";
import planet3 from "../assets/planet-3.png";
import planet4 from "../assets/planet-4.png";
import planet5 from "../assets/planet-5.png";
import "./CustomCursor.css";

const planetImages = [planet1, planet2, planet3, planet4, planet5];

const lerp = (start, end, amt) => start + (end - start) * amt;

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [circlePos, setCirclePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [particles, setParticles] = useState([]);
  const [visible, setVisible] = useState(true);
  const requestRef = useRef();
  const planetIndex = useRef(0);

  // Update mouse position instantly
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate circle to follow dot smoothly
  useEffect(() => {
    const animate = () => {
      setCirclePos((prev) => {
        const x = lerp(prev.x, mousePos.x, 0.15);
        const y = lerp(prev.y, mousePos.y, 0.15);
        return { x, y };
      });
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [mousePos]);

  // Fade cursor out/in on mouse leave/enter window
  useEffect(() => {
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget || e.relatedTarget.nodeName === "HTML") handleMouseLeave();
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
        return [];
      }

      const id = Date.now() + Math.random();
      const img = planetImages[planetIndex.current];
      planetIndex.current = (planetIndex.current + 1) % planetImages.length;

      const newParticle = { id, x: mousePos.x, y: mousePos.y, img };

      setTimeout(() => {
        setParticles((cur) => cur.filter((p) => p.id !== id));
      }, 3000);

      return [...prev, newParticle];
    });
  };

  return (
    <>
      {/* Dot: posisi langsung mouse */}
      <div
        className="custom-cursor-dot"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Lingkaran: posisi nge-lerp ngikutin dot */}
      <div
        className="custom-cursor-circle"
        style={{
          left: circlePos.x,
          top: circlePos.y,
          opacity: visible ? 1 : 0,
        }}
      >
        <div className="custom-cursor-click-text">Click!</div>
      </div>

      {/* Partikel planet */}
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

      {/* Overlay full screen untuk catch click */}
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
