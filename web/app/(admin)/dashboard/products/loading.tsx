import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="z-0 flex min-h-[calc(100vh-4rem)] flex-col gap-6 p-4 sm:p-6 md:gap-8 md:p-8">
      {/* 🏷️ CABEÇALHO */}
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          {/* Título e subtítulo com tamanhos parecidos com os textos originais */}
          <Skeleton className="h-8 w-32 sm:h-10 sm:w-40" />
          <Skeleton className="h-4 w-64 sm:w-80" />
        </div>

        {/* Botões do header (obedecendo seu grid/flex responsivo exato) */}
        <div className="grid w-full grid-cols-2 items-center gap-2 sm:gap-3 md:flex md:w-auto md:flex-row">
          <Skeleton className="h-9 w-full rounded-md sm:h-10 md:w-43" />
          <Skeleton className="h-9 w-full rounded-md sm:h-10 md:w-34" />
        </div>
      </div>

      {/* 📦 CONTEÚDO PRINCIPAL (Grid + Filtros) */}
      <div className="relative z-10 flex-1">
        <div className="flex flex-col gap-6">
          {/* 🎛️ FILTROS (Copiando o gap e tamanhos exatos do ProductFilters) */}
          <div className="flex w-full flex-row items-center gap-2 sm:gap-4">
            {/* Barra de Busca */}
            <Skeleton className="h-10 flex-1 rounded-xl sm:h-11" />
            {/* Filtro Select */}
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl sm:h-11 sm:w-55" />
          </div>

          {/* 📦 GRID DE PRODUTOS (Espelhando a exata mesma estrutura do seu isLoading) */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="aspect-3/4 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
