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
  const textRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [particles, setParticles] = useState([]);
  const planetIndex = useRef(0);

  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const circlePos = useRef({ x: pos.current.x, y: pos.current.y });
  const requestRef = useRef();

  const animate = () => {
    const lerp = (start, end, amt) => start + (end - start) * amt;
    circlePos.current.x = lerp(circlePos.current.x, pos.current.x - 32, 0.15);
    circlePos.current.y = lerp(circlePos.current.y, pos.current.y - 32, 0.15);

    if (circleRef.current) {
      circleRef.current.style.left = `${circlePos.current.x}px`;
      circleRef.current.style.top = `${circlePos.current.y}px`;
    }
    if (textRef.current) {
      textRef.current.style.left = `${pos.current.x}px`;
      textRef.current.style.top = `${pos.current.y + 24}px`;
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
      // Set visible setiap mouse bergerak di window
      setIsVisible(true);
    };

    const handleMouseOutWindow = (e) => {
      if (
        e.relatedTarget === null ||
        e.clientY <= 0 ||
        e.clientY >= window.innerHeight ||
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth
      ) {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseout', handleMouseOutWindow);

    // Hapus listener mouseenter, karena kadang gak trigger di beberapa browser
    // setIsVisible(true) sudah di handle di mousemove

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseout', handleMouseOutWindow);
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
      image,
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
        className="custom-cursor-dot"
        style={{ opacity: isVisible ? 1 : 0, visibility: isVisible ? 'visible' : 'hidden' }}
      />
      <div
        ref={circleRef}
        className="custom-cursor-circle"
        style={{ opacity: isVisible ? 1 : 0, visibility: isVisible ? 'visible' : 'hidden' }}
      />
      <div
        ref={textRef}
        className="custom-cursor-text"
        style={{ opacity: isVisible ? 1 : 0, visibility: isVisible ? 'visible' : 'hidden' }}
      >
        Click!
      </div>
      {particles.map((p) => (
        <img
          key={p.id}
          src={p.image}
          className="planet-particle"
          alt="planet"
          draggable={false}
          style={{
            left: p.x + 'px',
            top: p.y + 'px',
          }}
        />
      ))}
    </div>
  );
};

export default CustomCursor;
