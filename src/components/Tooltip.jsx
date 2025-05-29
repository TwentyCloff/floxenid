import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Tooltip = ({ 
  content, 
  children, 
  position = "top", 
  delay = 200,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({});
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  
  let timeout;
  
  const updatePosition = () => {
    if (triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      const positions = {
        top: {
          top: triggerRect.top - tooltipRect.height - 10,
          left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
        },
        bottom: {
          top: triggerRect.bottom + 10,
          left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
        },
        left: {
          top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
          left: triggerRect.left - tooltipRect.width - 10
        },
        right: {
          top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
          left: triggerRect.right + 10
        }
      };
      
      setCoords(positions[position]);
    }
  };
  
  const showTooltip = () => {
    if (disabled) return;
    timeout = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };
  
  const hideTooltip = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };
  
  useEffect(() => {
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <div 
      className="relative inline-block"
      ref={triggerRef}
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
            className={`absolute z-50 px-3 py-2 text-sm font-medium rounded-md shadow-lg max-w-xs whitespace-normal ${
              position === 'top' ? 'origin-bottom' : 
              position === 'bottom' ? 'origin-top' : 
              position === 'left' ? 'origin-right' : 'origin-left'
            }`}
            style={{
              ...coords,
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              backdropFilter: 'blur(4px)',
              color: '#fff'
            }}
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              y: position === 'top' ? 5 : position === 'bottom' ? -5 : 0,
              x: position === 'left' ? 5 : position === 'right' ? -5 : 0
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
              x: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8,
              y: position === 'top' ? 5 : position === 'bottom' ? -5 : 0,
              x: position === 'left' ? 5 : position === 'right' ? -5 : 0
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300
            }}
          >
            {content}
            <div 
              className={`absolute w-2 h-2 bg-gray-900/90 transform rotate-45 ${
                position === 'top' ? 'bottom-[-2px] left-1/2 -translate-x-1/2' :
                position === 'bottom' ? 'top-[-2px] left-1/2 -translate-x-1/2' :
                position === 'left' ? 'right-[-2px] top-1/2 -translate-y-1/2' :
                'left-[-2px] top-1/2 -translate-y-1/2'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
