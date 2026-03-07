import { ReactNode } from "react";
import { AdminSidebar } from "./_components/geral/admin-sidebar";
import { GridBackground } from "@/components/ui/grid-background";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-muted/10 selection:bg-primary/30 relative flex min-h-screen w-full">
      {/* fundo compartilhado para todo dashboard */}
      <GridBackground />

      {/* O componente agora é autossuficiente em qualquer tela */}
      <AdminSidebar />

      {/* flex-1: Pega todo o espaço restante ao lado da sidebar.
        min-w-0: Regra de ouro do Tailwind. Impede que tabelas/grids "estourem" a largura da tela.
        pt-16: Empurra o conteúdo pra baixo APENAS no mobile, pra não ficar escondido atrás do botão flutuante.
        md:pt-0: No desktop, o topo zera porque a barra lateral organiza tudo.
      */}
      <main className="flex min-h-screen min-w-0 flex-1 flex-col pt-16 transition-all duration-300 md:pt-0">
        {/* 👇 Padding removido daqui! A responsabilidade do espaçamento agora é de cada página (page.tsx) */}
        <div className="animate-in fade-in flex-1 duration-500">{children}</div>
      </main>
    </div>
  );
}
