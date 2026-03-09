import { Skeleton } from "@/components/ui/skeleton";
import { GridBackground } from "@/components/ui/grid-background";
import { Scissors } from "lucide-react";

export default function AboutLoading() {
  return (
    <div className="selection:bg-primary/30 relative min-h-screen overflow-hidden pb-20">
      {/* Background Base e Glows idênticos */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <GridBackground />
      </div>
      <div className="bg-primary/10 pointer-events-none absolute top-0 left-0 -z-10 h-75 w-full max-w-2xl -translate-x-1/4 -translate-y-1/4 rounded-full blur-[100px] sm:h-125 sm:max-w-3xl sm:blur-[120px]" />
      <div className="bg-primary/5 pointer-events-none absolute right-0 bottom-0 -z-10 h-62.5 w-full max-w-xl translate-x-1/4 translate-y-1/4 rounded-full blur-[80px] sm:h-100 sm:max-w-2xl sm:blur-[100px]" />

      <main className="relative z-10 container mx-auto px-4 pt-12 md:pt-20">
        {/* =========================================
            1. CABEÇALHO (Skeleton)
        ========================================= */}
        <header className="animate-in fade-in slide-in-from-top-6 mb-16 flex flex-col items-center text-center duration-1000 md:mb-24">
          <div className="border-primary/20 bg-background/50 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-md">
            <Scissors className="h-3.5 w-3.5" />
            <Skeleton className="h-3 w-20" />
          </div>

          <Skeleton className="mb-4 h-12 w-3/4 max-w-2xl sm:mb-6 md:h-20 lg:h-24" />

          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-64 sm:w-96 md:w-lg" />
            <Skeleton className="h-4 w-56 sm:w-80 md:w-md" />
          </div>
        </header>

        {/* =========================================
            2. A MARCA E A CRIADORA (Skeleton)
        ========================================= */}
        <section className="animate-in fade-in mb-16 grid gap-6 delay-150 duration-1000 sm:mb-20 sm:gap-8 md:mb-32 md:gap-12 lg:grid-cols-2 lg:items-stretch">
          {/* Card Esquerdo */}
          <div className="border-border/40 bg-card/20 relative flex flex-col overflow-hidden rounded-4xl border p-5 backdrop-blur-sm sm:p-6 md:p-8">
            <Skeleton className="mb-6 aspect-video w-full rounded-xl" />
            <Skeleton className="mb-4 h-8 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Card Direito */}
          <div className="border-border/40 bg-card/20 relative flex flex-col overflow-hidden rounded-4xl border p-5 backdrop-blur-sm sm:p-6 md:p-8">
            <div className="mb-6 flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
              <Skeleton className="h-24 w-24 shrink-0 rounded-full sm:h-32 sm:w-32" />
              <div className="mt-2 flex flex-col items-center sm:mt-0 sm:items-start">
                <Skeleton className="mb-2 h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </section>

        {/* =========================================
            3. COMO FUNCIONA (Skeleton dos 4 cards)
        ========================================= */}
        <section className="animate-in fade-in slide-in-from-bottom-8 mb-20 delay-300 duration-700 md:mb-32">
          <div className="mb-10 flex flex-col items-center px-4 text-center sm:mb-12">
            <Skeleton className="mb-4 h-10 w-64 sm:w-96" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>

          <div className="grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 sm:gap-6 sm:px-0 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-background/40 border-border/50 relative flex flex-col items-center rounded-3xl border p-5 text-center backdrop-blur-sm sm:p-6"
              >
                <Skeleton className="mb-4 h-10 w-10 rounded-full sm:h-12 sm:w-12" />
                <Skeleton className="mb-2 h-6 w-24" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="mt-1 h-3 w-4/5" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
