import React, { useEffect, useRef, useState } from 'react';
import planet1 from '../assets/planet-1.png';
import planet2 from '../assets/planet-2.png';
import planet3 from '../assets/planet-3.png';
import planet4 from '../assets/planet-4.png';
import planet5 from '../assets/planet-5.png';
import './CustomCursor.css';

const planetImages = [planet1, planet2, planet3, planet4, planet5];

const CustomCursor = () => {
  const dotRef = useRef(null);
  const circleRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [particles, setParticles] = useState([]);
  const planetIndex = useRef(0);

  useEffect(() => {
    const moveCursor = (e) => {
      const { clientX, clientY } = e;
      if (dotRef.current) {
        dotRef.current.style.left = `${clientX}px`;
        dotRef.current.style.top = `${clientY}px`;
      }
      if (circleRef.current) {
        circleRef.current.animate([
          { left: `${circleRef.current.style.left}`, top: `${circleRef.current.style.top}` },
          { left: `${clientX - 20}px`, top: `${clientY - 20}px` }
        ], {
          duration: 150,
          fill: 'forwards'
        });
        circleRef.current.style.left = `${clientX - 20}px`;
        circleRef.current.style.top = `${clientY - 20}px`;
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  const handleClick = (e) => {
    if (particles.length >= 5) {
      setParticles([]);
      planetIndex.current = 0;
      return;
    }

    const { clientX, clientY } = e;
    const image = planetImages[planetIndex.current % planetImages.length];
    planetIndex.current++;

    const id = Date.now();
    const newParticle = {
      id,
      x: clientX,
      y: clientY,
      image
    };
    setParticles((prev) => [...prev, newParticle]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 3000);
  };

  return (
    <div onClick={handleClick}>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ opacity: isVisible ? 1 : 0 }}
      ></div>
      <div
        ref={circleRef}
        className="cursor-circle"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div className="cursor-text">Click!</div>
      </div>
      {particles.map((p) => (
        <img
          key={p.id}
          src={p.image}
          className="cursor-particle"
          style={{ left: p.x, top: p.y }}
        />
      ))}
    </div>
  );
};

export default CustomCursor;
