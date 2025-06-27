import React from "react";

// Helper function untuk menggabungkan class
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Komponen tombol dengan efek border bintang
function StarBorder({
  as: Component = "button",   // Default elemen: <button>, bisa diubah via prop 'as'
  className = "",             // Tambahan class
  color,                      // Warna efek bintang
  speed = "6s",               // Durasi animasi
  children,                   // Isi tombol
  ...props
}) {
  const defaultColor = color || "hsl(var(--foreground))";

  return (
    <Component
      className={cn(
        "relative inline-block py-[1px] overflow-hidden rounded-[20px]",
        className
      )}
      {...props}
    >
      {/* Efek bintang bagian bawah */}
      <div
        className={cn(
          "absolute w-[300%] h-[50%] bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0",
          "opacity-20 dark:opacity-70"
        )}
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      {/* Efek bintang bagian atas */}
      <div
        className={cn(
          "absolute w-[300%] h-[50%] top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0",
          "opacity-20 dark:opacity-70"
        )}
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      {/* Konten utama tombol */}
      <div
        className={cn(
          "relative z-1 border text-foreground text-center text-base py-4 px-6 rounded-[20px]",
          "bg-gradient-to-b from-background/90 to-muted/90 border-border/40",
          "dark:from-background dark:to-muted dark:border-border"
        )}
      >
        {children}
      </div>
    </Component>
  );
}

// Komponen demo untuk menampilkan tombolnya
export default function StarBorderDemo() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-10">
      <StarBorder>
        Theme-aware Border
      </StarBorder>
    </div>
  );
}
