import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function PublicHomeLoading() {
  return (
    <div className="container mx-auto flex-1 px-4 py-8 sm:px-6 md:py-12 lg:px-8 lg:py-16">
      {/* =========================================
          1. CABEÇALHO (Cópia exata da página)
      ========================================= */}
      <header className="animate-in fade-in slide-in-from-bottom-4 mb-8 flex flex-col items-center text-center duration-1000 md:mb-12">
        <span className="text-primary mb-3 text-[10px] font-semibold tracking-widest uppercase md:mb-4 md:text-xs">
          Design Autoral & Exclusivo
        </span>

        <h1 className="text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
          Nossas Peças Artesanais
        </h1>

        <p className="text-muted-foreground mt-4 max-w-2xl text-sm text-balance md:mt-6 md:text-lg">
          Descubra o cuidado em cada detalhe. Explore coleções exclusivas
          criadas para trazer aconchego, sofisticação e estilo ao seu dia a dia.
        </p>
      </header>

      {/* =========================================
          2. MENU RÁPIDO DE CATEGORIAS (Skeleton do CategoryNav)
      ========================================= */}
      <div className="animate-in fade-in mb-10 delay-150 duration-1000 md:mb-16">
        <nav className="relative w-full">
          <div className="flex w-full items-center gap-3 overflow-x-auto px-2 pt-2 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center md:gap-4 [&::-webkit-scrollbar]:hidden">
            <Skeleton className="bg-muted/50 h-9 w-20 shrink-0 rounded-full md:h-11 md:w-24" />
            <Skeleton className="bg-muted/50 h-9 w-28 shrink-0 rounded-full md:h-11 md:w-32" />
            <Skeleton className="bg-muted/50 h-9 w-32 shrink-0 rounded-full md:h-11 md:w-36" />
            <Skeleton className="bg-muted/50 h-9 w-24 shrink-0 rounded-full md:h-11 md:w-28" />
          </div>
        </nav>
      </div>

      {/* =========================================
          3. LISTAGEM DE PRODUTOS (Skeleton da Home)
      ========================================= */}
      <div className="space-y-10 md:space-y-16">
        {Array.from({ length: 2 }).map((_, rowIndex) => (
          <div key={rowIndex} className="w-full overflow-hidden">
            {/* Título da Seção */}
            <div className="border-border/40 mb-4 flex items-end justify-between border-b pb-3 md:mb-6 md:pb-4">
              <Skeleton className="bg-muted/50 h-6 w-32 rounded-md md:h-8 md:w-48" />
              <Skeleton className="bg-muted/50 h-4 w-16 rounded-md md:h-5 md:w-24" />
            </div>

            {/* Cards (Mantendo a mesma lógica do seu carrossel/scroll) */}
            <div className="flex flex-nowrap gap-3 sm:gap-4 md:gap-6">
              {Array.from({ length: 5 }).map((_, colIndex) => (
                <Card
                  key={colIndex}
                  className="border-border/40 bg-card/20 flex h-full min-w-[55%] flex-col overflow-hidden rounded-xl border shadow-none backdrop-blur-sm sm:min-w-[33.333%] sm:rounded-2xl md:min-w-[25%] lg:min-w-[20%]"
                >
                  <div className="aspect-square w-full shrink-0">
                    <Skeleton className="bg-muted/50 h-full w-full rounded-none" />
                  </div>

                  <CardContent className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
                    <Skeleton className="bg-muted/50 h-3 w-2/3 rounded-md sm:h-4" />
                    <Skeleton className="bg-muted/50 h-2 w-full rounded-md sm:h-3" />
                    <Skeleton className="bg-muted/50 h-2 w-4/5 rounded-md sm:h-3" />
                  </CardContent>

                  <CardFooter className="mt-auto flex flex-row items-center justify-between gap-2 p-3 pt-0 sm:p-4 sm:pt-0">
                    <Skeleton className="bg-muted/50 h-4 w-12 rounded-md sm:h-5 sm:w-16" />
                    <Skeleton className="bg-muted/50 h-7 w-14 shrink-0 rounded-md sm:h-8 sm:w-20 sm:rounded-lg" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
