import { CustomerHeader } from "./_components/header";
import { GridBackground } from "@/components/ui/grid-background";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="selection:bg-primary/30 relative flex min-h-screen flex-col">
      {/* Background sutil para a área logada */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <GridBackground />
      </div>

      {/* Header Fixo no Topo */}
      <CustomerHeader />

      {/* Conteúdo das Páginas Filhas renderizado aqui */}
      <main className="relative z-10 flex flex-1 flex-col">{children}</main>
    </div>
  );
}
