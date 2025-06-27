import { ElementType } from "react";

// Simple class merging utility
const mergeClasses = (...classes) => classes.filter(Boolean).join(' ');

export function StarBorder({
  as: Component = 'button',
  className = '',
  color = '#ffffff',
  speed = "6s",
  children,
  ...props
}) {
  return (
    <Component 
      className={mergeClasses(
        "relative inline-block py-[1px] overflow-hidden rounded-[20px]",
        className
      )} 
      {...props}
    >
      <div
        className={mergeClasses(
          "absolute w-[300%] h-[50%] bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0",
          "opacity-20 dark:opacity-70" 
        )}
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className={mergeClasses(
          "absolute w-[300%] h-[50%] top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0",
          "opacity-20 dark:opacity-70"
        )}
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div className={mergeClasses(
        "relative z-1 border text-foreground text-center text-base py-4 px-6 rounded-[20px]",
        "bg-black border-black/40",
        "dark:bg-black dark:border-black"
      )}>
        {children}
      </div>
    </Component>
  );
}

// Main demo component
export function StarBorderDemo() {
  return (
    <div className="space-y-8">
      <StarBorder>
        Theme-aware Border
      </StarBorder>
    </div>
  );
}

// Add default export
const ButtonTest = { StarBorderDemo, StarBorder };
export default ButtonTest;
