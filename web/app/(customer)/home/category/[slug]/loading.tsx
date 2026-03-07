import { GridBackground } from "@/components/ui/grid-background";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <div className="selection:bg-primary/30 relative min-h-screen overflow-hidden">
      {/* Background Base idêntico */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <GridBackground />
      </div>

      {/* Luz de fundo sutil idêntica */}
      <div className="bg-primary/10 pointer-events-none absolute top-0 left-1/2 -z-10 h-72 w-full max-w-2xl -translate-x-1/2 rounded-[100%] blur-[100px]" />

      <main className="relative z-10 container mx-auto px-3 py-12 sm:px-4 md:py-20">
        {/* Cabeçalho Skeleton */}
        <header className="mb-10 flex flex-col items-center text-center md:mb-14">
          <Skeleton className="bg-muted/50 mb-4 h-6 w-32 rounded-full" />
          <Skeleton className="bg-muted/60 mb-2 h-10 w-64 rounded-xl sm:h-12 sm:w-96 md:h-14" />
          <div className="mt-3 flex w-full max-w-xl flex-col items-center gap-2">
            <Skeleton className="bg-muted/40 h-4 w-full rounded-md sm:h-5" />
            <Skeleton className="bg-muted/40 h-4 w-4/5 rounded-md sm:h-5" />
          </div>
        </header>

        {/* Central de Filtros Skeleton */}
        <div className="mb-12 flex flex-col items-center gap-6 md:mb-16 md:gap-8">
          {/* CategoryNav Skeleton (Simulando os botões de categorias) */}
          <div className="flex w-full max-w-5xl items-center justify-center gap-3 overflow-hidden px-2">
            <Skeleton className="bg-muted/50 h-9 w-20 shrink-0 rounded-full md:h-11 md:w-24" />
            <Skeleton className="bg-muted/50 h-9 w-28 shrink-0 rounded-full md:h-11 md:w-32" />
            <Skeleton className="bg-muted/50 h-9 w-32 shrink-0 rounded-full md:h-11 md:w-36" />
            <Skeleton className="bg-muted/50 h-9 w-24 shrink-0 rounded-full md:h-11 md:w-28" />
          </div>

          {/* Barra de Busca Skeleton */}
          <div className="w-full max-w-md">
            <Skeleton className="bg-muted/40 h-12 w-full rounded-full" />
          </div>
        </div>

        {/* Listagem / Grid Skeleton (Extraído perfeitamente do seu page.tsx) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="border-border/30 bg-card/10 flex h-full flex-col overflow-hidden rounded-2xl border p-3 shadow-sm backdrop-blur-sm sm:p-4"
            >
              <Skeleton className="bg-muted/40 mb-3 aspect-square w-full rounded-xl sm:mb-4" />
              <Skeleton className="bg-muted/40 mb-2 h-3 w-2/3 sm:h-4" />
              <Skeleton className="bg-muted/40 mb-2 h-2 w-full sm:h-3" />
              <Skeleton className="bg-muted/40 mt-auto h-2 w-4/5 sm:h-3" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
