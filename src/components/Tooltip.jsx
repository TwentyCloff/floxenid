import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Tooltip = ({ 
  content, 
  children, 
  position = "top", 
  responsive = true,
  delay = 0.3,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [calculatedPosition, setCalculatedPosition] = useState(position);
  const tooltipRef = useRef(null);
  const parentRef = useRef(null);
  let timeoutId;

  // Handle responsive positioning
  useEffect(() => {
    if (!isVisible || !responsive) return;

    const checkPosition = () => {
      if (!tooltipRef.current || !parentRef.current) return;

      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();
      
      // Check viewport boundaries
      const positions = {
        top: parentRect.top - tooltipRect.height > 0,
        bottom: parentRect.bottom + tooltipRect.height < window.innerHeight,
        left: parentRect.left - tooltipRect.width > 0,
        right: parentRect.right + tooltipRect.width < window.innerWidth
      };

      // Fallback positions if preferred position doesn't fit
      let newPosition = position;
      if (position === "top" && !positions.top) newPosition = "bottom";
      if (position === "bottom" && !positions.bottom) newPosition = "top";
      if (position === "left" && !positions.left) newPosition = "right";
      if (position === "right" && !positions.right) newPosition = "left";

      setCalculatedPosition(newPosition);
    };

    checkPosition();
    window.addEventListener("resize", checkPosition);
    return () => window.removeEventListener("resize", checkPosition);
  }, [isVisible, position, responsive]);

  const handleMouseEnter = () => {
    if (disabled) return;
    timeoutId = setTimeout(() => setIsVisible(true), delay * 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutId);
    setIsVisible(false);
  };

  // Position styles
  const positionStyles = {
    top: {
      bottom: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginBottom: "8px"
    },
    bottom: {
      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginTop: "8px"
    },
    left: {
      right: "100%",
      top: "50%",
      transform: "translateY(-50%)",
      marginRight: "8px"
    },
    right: {
      left: "100%",
      top: "50%",
      transform: "translateY(-50%)",
      marginLeft: "8px"
    }
  };

  return (
    <div 
      className="relative inline-block"
      ref={parentRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={`absolute z-50 px-3 py-2 text-sm font-medium rounded-md shadow-lg max-w-xs ${
              calculatedPosition === "top" || calculatedPosition === "bottom" 
                ? "w-max" 
                : "w-48"
            } bg-gray-800 text-white`}
            style={positionStyles[calculatedPosition]}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {content}
            {/* Tooltip arrow */}
            <div 
              className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
                calculatedPosition === "top" ? "bottom-[-4px] left-1/2 -translate-x-1/2" :
                calculatedPosition === "bottom" ? "top-[-4px] left-1/2 -translate-x-1/2" :
                calculatedPosition === "left" ? "right-[-4px] top-1/2 -translate-y-1/2" :
                "left-[-4px] top-1/2 -translate-y-1/2"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
