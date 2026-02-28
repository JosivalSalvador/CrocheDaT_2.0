import { ReactNode } from "react";
import { GridBackground } from "@/components/ui/grid-background";

/**
 * Layout específico para o grupo (auth): Login e Registro.
 * Centraliza os formulários e aplica o efeito visual de "Glassmorphism".
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    // 'min-h-svh' (Small Viewport Height) é melhor para mobile para evitar a barra de endereço
    <div className="bg-background relative flex min-h-svh w-full items-center justify-center overflow-hidden p-4">
      {/* Camada de fundo: GridBackground */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <GridBackground />
      </div>

      {/* Card centralizado:
          - max-w-md: ideal para formulários de login/registro.
          - backdrop-blur-xl: aumenta o efeito de profundidade.
          - border-primary/10: um toque sutil da cor principal na borda.
      */}
      <div className="bg-card/40 border-primary/10 relative z-10 w-full max-w-md rounded-3xl border p-6 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl md:p-10">
        {/* Adicionando um espaço para a logo ou nome em cima do children se desejar */}
        <div className="mb-8 text-center">
          <h2 className="text-foreground text-2xl font-bold tracking-tight">
            Crochê da T
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Bem-vinda(o) de volta!
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
