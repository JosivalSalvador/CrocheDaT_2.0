import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function CategoryLoading() {
  return (
    <div className="relative flex w-full flex-1 flex-col">
      {/* Luz de fundo (Idêntica à da página) */}
      <div className="bg-primary/10 pointer-events-none absolute top-0 left-1/2 -z-10 h-72 w-full max-w-2xl -translate-x-1/2 rounded-[100%] blur-[100px]" />

      <div className="container mx-auto flex-1 px-3 py-12 sm:px-4 md:py-20">
        {/* =========================================
            1. CABEÇALHO (Com Skeletons para o texto dinâmico)
        ========================================= */}
        <header className="animate-in fade-in slide-in-from-top-4 mb-10 flex flex-col items-center text-center duration-700 md:mb-14">
          <div className="border-border/50 bg-background/50 text-muted-foreground mb-4 flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
            Design Autoral
          </div>

          {/* Skeleton do Título da Categoria */}
          <Skeleton className="mb-2 h-10 w-64 sm:h-12 sm:w-80 md:h-14 md:w-96" />

          {/* Skeleton do Parágrafo de Descrição */}
          <div className="mt-3 flex w-full flex-col items-center gap-2">
            <Skeleton className="h-5 w-full max-w-xl md:h-6" />
            <Skeleton className="h-5 w-4/5 max-w-lg md:h-6" />
          </div>
        </header>

        {/* =========================================
            2. CENTRAL DE FILTROS: NAV + BUSCA
        ========================================= */}
        <div className="animate-in fade-in mb-12 flex flex-col items-center gap-6 delay-150 duration-700 md:mb-16 md:gap-8">
          {/* Menu Rápido de Categorias (Skeleton do CategoryNav) */}
          <div className="w-full max-w-5xl">
            <nav className="relative w-full">
              <div className="flex w-full items-center gap-3 overflow-x-auto px-2 pt-2 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center md:gap-4 [&::-webkit-scrollbar]:hidden">
                <Skeleton className="bg-muted/50 h-9 w-20 shrink-0 rounded-full md:h-11 md:w-24" />
                <Skeleton className="bg-muted/50 h-9 w-28 shrink-0 rounded-full md:h-11 md:w-32" />
                <Skeleton className="bg-muted/50 h-9 w-32 shrink-0 rounded-full md:h-11 md:w-36" />
                <Skeleton className="bg-muted/50 h-9 w-24 shrink-0 rounded-full md:h-11 md:w-28" />
              </div>
            </nav>
          </div>

          {/* Barra de Busca (Mock visual/desativado) */}
          <div className="relative w-full max-w-md">
            <Search className="text-muted-foreground/50 absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2" />
            <div className="border-border/40 bg-background/40 h-12 w-full rounded-full border shadow-sm backdrop-blur-md" />
          </div>
        </div>

        {/* =========================================
            3. LISTAGEM / GRID RESPONSIVO (Cópia da página)
        ========================================= */}
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
      </div>
    </div>
  );
}
