import { cn } from "@/lib/utils";
import { ElementType, ComponentPropsWithoutRef } from "react";

// StarBorderDemo component
export function StarBorderDemo() {
  return (
    <div className="space-y-8">
      <StarBorder>
        Theme-aware Border
      </StarBorder>
    </div>
  );
}

// StarBorder component with JSDoc type annotations
/**
 * @typedef {{
 *   as?: React.ElementType
 *   color?: string
 *   speed?: string
 *   className?: string
 *   children: React.ReactNode
 * }} StarBorderProps
 */

/**
 * StarBorder component that creates a decorative border with animated star effects
 * @param {StarBorderProps & React.ComponentPropsWithoutRef<'button'>} props
 */
export function StarBorder({
  as: Component = 'button',
  className,
  color = '#ffffff', // White animation color
  speed = "6s",
  children,
  ...props
}) {
  return (
    <Component 
      className={cn(
        "relative inline-block py-[1px] overflow-hidden rounded-[20px]",
        className
      )} 
      {...props}
    >
      {/* Bottom animation layer */}
      <div
        className={cn(
          "absolute w-[300%] h-[50%] bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0",
          "opacity-20 dark:opacity-70" 
        )}
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      
      {/* Top animation layer */}
      <div
        className={cn(
          "absolute w-[300%] h-[50%] top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0",
          "opacity-20 dark:opacity-70"
        )}
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      
      {/* Content container with black background */}
      <div className={cn(
        "relative z-1 border text-foreground text-center text-base py-4 px-6 rounded-[20px]",
        "bg-black border-black/40",
        "dark:bg-black dark:border-black"
      )}>
        {children}
      </div>
    </Component>
  );
}

// Tailwind animation configuration (for reference - this would still be in your tailwind.config.js)
/*
module.exports = {
  theme: {
    extend: {
      animation: {
        'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
        'star-movement-top': 'star-movement-top linear infinite alternate',
      },
      keyframes: {
        'star-movement-bottom': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
        },
        'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
        },
      },
    },
 
