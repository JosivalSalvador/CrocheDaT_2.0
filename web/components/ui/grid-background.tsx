import React from "react";

export function GridBackground() {
  return (
    // 1. pointer-events-none adicionado ao container pai
    <div className="bg-background pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Gradiente principal */}
      <div className="from-primary/5 via-background to-background absolute inset-0 bg-linear-to-b" />

      {/* Glow principal (transform-gpu adicionado) */}
      <div className="bg-primary/10 absolute top-1/3 left-1/2 h-125 w-125 -translate-x-1/2 transform-gpu rounded-full blur-[100px]" />

      {/* Glow secundário (transform-gpu adicionado) */}
      <div className="bg-primary/10 absolute top-10 -right-37.5 h-75 w-75 transform-gpu rounded-full blur-[80px]" />

      {/* Grid moderno (transform-gpu adicionado para suavizar o scroll) */}
      <div className="absolute inset-0 transform-gpu bg-[linear-gradient(to_right,hsl(var(--primary)/0.07)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.07)_1px,transparent_1px)] bg-size-[140px_140px]" />

      {/* Fade inferior */}
      <div className="from-background absolute inset-x-0 bottom-0 h-64 bg-linear-to-t to-transparent" />
    </div>
  );
}
