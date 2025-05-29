import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ 
  content, 
  children, 
  position = 'top',
  delay = 200,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({});
  const triggerRef = useRef(null);
  let timeout;

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height
      });
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => clearTimeout(timeout);
  }, []);

  const getTooltipPosition = () => {
    const offset = 8;
    const tooltipWidth = 200; // Approximate width, can be dynamic if needed

    switch (position) {
      case 'top':
        return {
          top: coords.top - offset,
          left: coords.left + coords.width / 2,
          transform: 'translateX(-50%) translateY(-100%)'
        };
      case 'bottom':
        return {
          top: coords.top + coords.height + offset,
          left: coords.left + coords.width / 2,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          top: coords.top + coords.height / 2,
          left: coords.left - offset,
          transform: 'translateX(-100%) translateY(-50%)'
        };
      case 'right':
        return {
          top: coords.top + coords.height / 2,
          left: coords.left + coords.width + offset,
          transform: 'translateY(-50%)'
        };
      default:
        return {
          top: coords.top - offset,
          left: coords.left + coords.width / 2,
          transform: 'translateX(-50%) translateY(-100%)'
        };
    }
  };

  const positionClasses = {
    top: 'bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2',
    bottom: 'top-[calc(100%+8px)] left-1/2 -translate-x-1/2',
    left: 'right-[calc(100%+8px)] top-1/2 -translate-y-1/2',
    right: 'left-[calc(100%+8px)] top-1/2 -translate-y-1/2'
  };

  return (
    <div 
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 w-max max-w-xs ${positionClasses[position]}`}
            style={{
              pointerEvents: 'none'
            }}
          >
            <div className="bg-gray-800 text-white text-xs rounded-md py-2 px-3 shadow-lg">
              <div className="relative">
                {content}
                <div className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${{
                  top: 'bottom-[-4px] left-1/2 -translate-x-1/2',
                  bottom: 'top-[-4px] left-1/2 -translate-x-1/2',
                  left: 'right-[-4px] top-1/2 -translate-y-1/2',
                  right: 'left-[-4px] top-1/2 -translate-y-1/2'
                }[position]}`} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
