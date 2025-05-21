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

  // Positions for smooth animation
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const circlePos = useRef({ x: pos.current.x, y: pos.current.y });
  const requestRef = useRef();

  // Animate circle following dot smoothly
  const animate = () => {
    const lerp = (start, end, amt) => start + (end - start) * amt;
    circlePos.current.x = lerp(circlePos.current.x, pos.current.x - 32, 0.15);
    circlePos.current.y = lerp(circlePos.current.y, pos.current.y - 32, 0.15);

    if (circleRef.current) {
      circleRef.current.style.left = `${circlePos.current.x}px`;
      circleRef.current.style.top = `${circlePos.current.y}px`;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  useEffect(() => {
    const moveCursor = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
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

    const image = planetImages[planetIndex.current % planetImages.length];
    planetIndex.current++;

    const id = Date.now();
    const newParticle = {
      id,
      x: e.clientX,
      y: e.clientY,
      image
    };
    setParticles((prev) => [...prev, newParticle]);

    // Hapus partikel setelah 3 detik (langsung hilang tanpa shrink)
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 3000);
  };

  return (
    <div onClick={handleClick}>
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{ opacity: isVisible ? 1 : 0, visibility: isVisible ? 'visible' : 'hidden' }}
      />
      <div
        ref={circleRef}
        className="custom-cursor-circle"
        style={{ opacity: isVisible ? 1 : 0, visibility: isVisible ? 'visible' : 'hidden' }}
      >
        <div className="custom-cursor-text">Click!</div>
      </div>
      {particles.map((p) => (
        <img
          key={p.id}
          src={p.image}
          className="planet-particle"
          style={{ left: p.x, top: p.y }}
          alt="planet"
          draggable={false}
        />
      ))}
    </div>
  );
};

export default CustomCursor;
