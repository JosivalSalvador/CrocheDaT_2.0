import { GridBackground } from "@/components/ui/grid-background";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailsLoading() {
  return (
    <div className="selection:bg-primary/20 relative min-h-screen overflow-hidden pb-36 lg:pb-16">
      <div className="pointer-events-none absolute inset-0 z-0">
        <GridBackground />
      </div>

      {/* =========================================
          BARRA DE AÇÃO FIXA MOBILE (SKELETON)
      ========================================= */}
      <div className="border-border/40 bg-background/90 fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between border-t px-4 pt-4 pb-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] backdrop-blur-xl lg:hidden">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="bg-muted/60 h-3 w-20 rounded-md" />
          <Skeleton className="bg-muted/50 h-7 w-28 rounded-md" />
        </div>
        <Skeleton className="bg-primary/20 h-12 w-36 rounded-full" />
      </div>

      <main className="relative z-10 container mx-auto max-w-7xl px-4 pt-6 md:pt-12">
        {/* Navegação Voltar - Desktop (lg) (SKELETON) */}
        <div className="mb-10 hidden lg:block">
          <Skeleton className="bg-muted/50 h-4 w-32 rounded-md" />
        </div>

        <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-16 xl:gap-20">
          {/* =========================================
              COLUNA ESQUERDA: GALERIA (SKELETON)
          ========================================= */}
          <div className="w-full lg:sticky lg:top-24 lg:w-[55%] xl:w-[60%]">
            <Skeleton className="bg-muted/40 aspect-square w-full rounded-4xl sm:rounded-[2.5rem]" />

            {/* Thumbnails da galeria (Opcional, mas fica lindo) */}
            <div className="mt-4 flex gap-3 overflow-hidden">
              <Skeleton className="bg-muted/40 h-20 w-20 shrink-0 rounded-2xl sm:h-24 sm:w-24" />
              <Skeleton className="bg-muted/40 h-20 w-20 shrink-0 rounded-2xl sm:h-24 sm:w-24" />
              <Skeleton className="bg-muted/40 h-20 w-20 shrink-0 rounded-2xl sm:h-24 sm:w-24" />
            </div>
          </div>

          {/* =========================================
              COLUNA DIREITA: INFORMAÇÕES (SKELETON)
          ========================================= */}
          <div className="flex w-full flex-col lg:w-[45%] lg:pt-4 xl:w-[40%]">
            {/* CABEÇALHO DA OBRA */}
            <div className="mb-8 space-y-5">
              {/* Badge de Categoria */}
              <Skeleton className="bg-muted/60 h-6 w-32 rounded-full" />

              {/* Título H1 */}
              <div className="space-y-2">
                <Skeleton className="bg-muted/50 h-10 w-full rounded-xl sm:h-12 lg:h-14" />
                <Skeleton className="bg-muted/50 h-10 w-3/4 rounded-xl sm:h-12 lg:h-14" />
              </div>

              {/* PREÇO DESKTOP */}
              <div className="mt-8 hidden lg:block">
                <Skeleton className="bg-muted/40 h-12 w-48 rounded-xl" />
              </div>
            </div>

            {/* FICHA TÉCNICA - Cards */}
            <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <Skeleton className="bg-muted/30 h-26 w-full rounded-3xl" />
              <Skeleton className="bg-muted/30 h-26 w-full rounded-3xl" />
            </div>

            {/* DESCRIÇÃO DA OBRA */}
            <div className="border-border/20 bg-muted/10 mb-8 space-y-4 rounded-3xl border p-5 sm:p-7">
              <Skeleton className="bg-muted/40 h-4 w-40 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="bg-muted/30 h-3 w-full rounded-md" />
                <Skeleton className="bg-muted/30 h-3 w-full rounded-md" />
                <Skeleton className="bg-muted/30 h-3 w-5/6 rounded-md" />
                <Skeleton className="bg-muted/30 h-3 w-4/6 rounded-md" />
              </div>
            </div>

            {/* BOTÕES DE AÇÃO DESKTOP */}
            <div className="hidden flex-col gap-4 lg:flex">
              <Skeleton className="bg-primary/20 h-14 w-full rounded-full" />
              <Skeleton className="bg-muted/40 h-14 w-full rounded-full" />
            </div>

            {/* BOTÃO SECUNDÁRIO NO MOBILE/TABLET */}
            <div className="mt-2 lg:hidden">
              <Skeleton className="bg-muted/40 h-14 w-full rounded-full" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
