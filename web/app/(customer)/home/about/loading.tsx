import { GridBackground } from "@/components/ui/grid-background";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <div className="selection:bg-primary/30 relative min-h-screen overflow-hidden pb-20">
      {/* Background Base idêntico */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <GridBackground />
      </div>

      {/* Luzes de Fundo (Glow) exatas */}
      <div className="bg-primary/10 pointer-events-none absolute top-0 left-0 -z-10 h-75 w-full max-w-2xl -translate-x-1/4 -translate-y-1/4 rounded-full blur-[100px] sm:h-125 sm:max-w-3xl sm:blur-[120px]" />
      <div className="bg-primary/5 pointer-events-none absolute right-0 bottom-0 -z-10 h-62.5 w-full max-w-xl translate-x-1/4 translate-y-1/4 rounded-full blur-[80px] sm:h-100 sm:max-w-2xl sm:blur-[100px]" />

      <main className="relative z-10 container mx-auto px-4 pt-12 md:pt-20">
        {/* =========================================
            1. CABEÇALHO SKELETON
        ========================================= */}
        <header className="mb-16 flex flex-col items-center text-center md:mb-24">
          <Skeleton className="bg-muted/50 mb-4 h-7 w-36 rounded-full" />

          {/* Título */}
          <div className="flex w-full flex-col items-center space-y-2">
            <Skeleton className="bg-muted/60 h-10 w-3/4 max-w-150 rounded-xl sm:h-12 md:h-16" />
            <Skeleton className="bg-muted/60 h-10 w-1/2 max-w-100 rounded-xl sm:h-12 md:h-16" />
          </div>

          {/* Subtítulo */}
          <div className="mt-4 flex w-full max-w-2xl flex-col items-center space-y-2 sm:mt-6">
            <Skeleton className="bg-muted/40 h-4 w-full rounded-md sm:h-5" />
            <Skeleton className="bg-muted/40 h-4 w-4/5 rounded-md sm:h-5" />
          </div>
        </header>

        {/* =========================================
            2. A MARCA E A CRIADORA SKELETON
        ========================================= */}
        <section className="mb-16 grid gap-6 sm:mb-20 sm:gap-8 md:mb-32 md:gap-12 lg:grid-cols-2 lg:items-stretch">
          {/* Card da Essência */}
          <div className="border-border/40 bg-card/20 flex flex-col rounded-4xl border p-5 backdrop-blur-sm sm:p-6 md:p-8">
            <Skeleton className="bg-muted/40 mb-6 aspect-video w-full rounded-xl" />
            <Skeleton className="bg-muted/50 mb-3 h-6 w-40 rounded-lg sm:mb-4 sm:h-8" />
            <div className="flex-1 space-y-2">
              <Skeleton className="bg-muted/40 h-4 w-full rounded-md" />
              <Skeleton className="bg-muted/40 h-4 w-full rounded-md" />
              <Skeleton className="bg-muted/40 h-4 w-5/6 rounded-md" />
            </div>
          </div>

          {/* Card da Thayssa */}
          <div className="border-border/40 bg-card/20 flex flex-col rounded-4xl border p-5 backdrop-blur-sm sm:p-6 md:p-8">
            <div className="mb-6 flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
              <Skeleton className="bg-muted/40 h-24 w-24 shrink-0 rounded-full sm:h-32 sm:w-32" />
              <div className="mt-2 flex w-full flex-col items-center space-y-2 sm:mt-0 sm:items-start">
                <Skeleton className="bg-muted/50 h-6 w-48 rounded-lg sm:h-8" />
                <Skeleton className="bg-primary/20 h-4 w-32 rounded-md" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="bg-muted/40 h-4 w-full rounded-md" />
              <Skeleton className="bg-muted/40 h-4 w-full rounded-md" />
              <Skeleton className="bg-muted/40 h-4 w-4/5 rounded-md" />
            </div>
          </div>
        </section>

        {/* =========================================
            3. COMO FUNCIONA SKELETON
        ========================================= */}
        <section className="mb-20 md:mb-32">
          <div className="mb-10 flex flex-col items-center space-y-3 px-4 sm:mb-12">
            <Skeleton className="bg-muted/60 h-8 w-64 rounded-lg sm:h-10 md:w-80" />
            <Skeleton className="bg-muted/40 h-4 w-full max-w-lg rounded-md sm:h-5" />
          </div>

          <div className="grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 sm:gap-6 sm:px-0 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-background/40 border-border/50 flex flex-col items-center rounded-3xl border p-5 backdrop-blur-sm sm:p-6"
              >
                <Skeleton className="bg-primary/20 mb-4 h-10 w-10 shrink-0 rounded-full sm:h-12 sm:w-12" />
                <Skeleton className="bg-muted/50 mb-2 h-5 w-24 rounded-lg sm:h-6" />
                <div className="flex w-full flex-col items-center space-y-2">
                  <Skeleton className="bg-muted/40 h-3 w-full rounded-md sm:h-4" />
                  <Skeleton className="bg-muted/40 h-3 w-4/5 rounded-md sm:h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            4. FOOTER CARD SKELETON
        ========================================= */}
        <section className="bg-card/30 border-border/40 mx-auto flex w-full max-w-4xl flex-col items-center rounded-4xl border p-6 backdrop-blur-xl sm:rounded-[2.5rem] sm:p-8 md:p-12">
          <Skeleton className="bg-muted/50 mb-4 h-10 w-10 rounded-full sm:mb-6 sm:h-12 sm:w-12" />
          <Skeleton className="bg-muted/60 mb-3 h-8 w-64 rounded-lg sm:mb-4 sm:h-10 md:h-12 md:w-96" />

          <div className="mb-6 flex w-full flex-col items-center space-y-2 sm:mb-8">
            <Skeleton className="bg-muted/40 h-4 w-full max-w-lg rounded-md sm:h-5" />
            <Skeleton className="bg-muted/40 h-4 w-4/5 max-w-md rounded-md sm:h-5" />
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Skeleton className="bg-primary/30 h-12 w-full rounded-full sm:h-14 sm:w-48" />
            <Skeleton className="bg-muted/50 h-12 w-full rounded-full sm:h-14 sm:w-40" />
            <Skeleton className="bg-muted/50 h-12 w-full rounded-full sm:h-14 sm:w-40" />
          </div>
        </section>
      </main>
    </div>
  );
}
