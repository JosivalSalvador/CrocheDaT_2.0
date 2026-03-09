import { Skeleton } from "@/components/ui/skeleton";

export default function ChatsLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      {/* =========================================
          1. CABEÇALHO DA PÁGINA E BOTÃO
      ========================================= */}
      <div className="mb-6 flex flex-col items-start justify-between gap-5 sm:mb-8 sm:flex-row sm:items-center">
        <div className="w-full flex-1">
          <Skeleton className="mb-2 h-8 w-48 sm:h-10 sm:w-64" />
          <Skeleton className="h-5 w-full max-w-sm sm:h-6" />
        </div>

        {/* Skeleton do Botão (NewSupportModal) */}
        <div className="w-full shrink-0 sm:w-auto">
          <Skeleton className="h-10 w-full rounded-md sm:w-36" />
        </div>
      </div>

      {/* =========================================
          2. CONTAINER DA LISTA
      ========================================= */}
      <div className="sm:border-border/50 sm:bg-card relative min-h-[50vh] w-full rounded-xl sm:border sm:p-4 sm:shadow-sm">
        {/* =========================================
            3. SKELETON DO CHAT LIST (Cópia exata)
        ========================================= */}
        <div className="divide-border/40 flex flex-col divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              {/* Avatar Redondo */}
              <Skeleton className="h-12 w-12 shrink-0 rounded-full sm:h-14 sm:w-14" />

              {/* Container Central do Item */}
              <div className="flex flex-1 flex-col gap-2">
                {/* Linha Superior */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32 sm:w-48" />
                  <Skeleton className="h-3 w-12 sm:w-16" />
                </div>
                {/* Linha Inferior */}
                <Skeleton className="h-4 w-3/4 sm:w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
