import { ReactNode } from "react";
import { GridBackground } from "@/components/ui/grid-background";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      {/* Fundo padronizado para Auth */}
      <div className="absolute inset-0 z-0">
        <GridBackground />
      </div>

      {/* Card centralizado */}
      <div className="bg-card/50 border-border relative z-10 w-full max-w-md rounded-2xl border p-8 shadow-2xl backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}
