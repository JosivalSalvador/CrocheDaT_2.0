import React from "react";

export function GridBackground() {
  return (
    <div className="bg-background absolute inset-0 -z-10 overflow-hidden">
      {/* Gradiente principal */}

      <div className="via-background to-background absolute inset-0 bg-linear-to-b from-pink-50" />

      {/* Glow principal */}

      <div className="absolute top-1/3 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-pink-200/40 blur-3xl" />

      {/* Glow secundário */}

      <div className="absolute top-10 -right-37.5 h-75 w-75 rounded-full bg-pink-100/40 blur-3xl" />

      {/* Grid moderno */}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f9a8d4_1px,transparent_1px),linear-gradient(to_bottom,#f9a8d4_1px,transparent_1px)] bg-size-[140px_140px] opacity-20" />

      {/* Fade inferior */}

      <div className="from-background absolute inset-x-0 bottom-0 h-64 bg-linear-to-t to-transparent" />
    </div>
  );
}
