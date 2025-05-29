import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Tooltip = ({ 
  content, 
  children, 
  position = "top",
  delay = 0.3,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({});
  const tooltipRef = useRef(null);
  const parentRef = useRef(null);

  const positions = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2"
  };

  const updatePosition = () => {
    if (parentRef.current && tooltipRef.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let newPosition = position;
      
      // Adjust position if tooltip would go off screen
      if (position === "top" && parentRect.top - tooltipRect.height < 0) {
        newPosition = "bottom";
      } else if (position === "bottom" && parentRect.bottom + tooltipRect.height > window.innerHeight) {
        newPosition = "top";
      } else if (position === "left" && parentRect.left - tooltipRect.width < 0) {
        newPosition = "right";
      } else if (position === "right" && parentRect.right + tooltipRect.width > window.innerWidth) {
        newPosition = "left";
      }
      
      setCoords({ position: newPosition });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [isVisible]);

  let timeout;
  const showTooltip = () => {
    timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);
  };

  const hideTooltip = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      ref={parentRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={`absolute z-50 ${positions[coords.position || position]}`}
            initial={{ opacity: 0, y: position === 'top' ? 5 : -5, x: position === 'left' ? 5 : position === 'right' ? -5 : 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: position === 'top' ? 5 : -5, x: position === 'left' ? 5 : position === 'right' ? -5 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="bg-gray-800 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg border border-gray-700 max-w-xs">
              {content}
              <div className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 border border-gray-700 ${
                coords.position === 'top' || position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-0 border-l-0' :
                coords.position === 'bottom' || position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2 border-b-0 border-r-0' :
                coords.position === 'left' || position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2 border-l-0 border-b-0' :
                'left-[-4px] top-1/2 -translate-y-1/2 border-r-0 border-t-0'
              }`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
