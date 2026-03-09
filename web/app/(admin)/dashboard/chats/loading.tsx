import { Skeleton } from "@/components/ui/skeleton";

export default function AdminChatsLoading() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* 🏷️ CABEÇALHO */}
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        {/* Identificação da Página */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 shrink-0 rounded-2xl sm:h-14 sm:w-14" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 sm:h-8 sm:w-64" />
            <Skeleton className="h-4 w-64 sm:w-80" />
          </div>
        </div>

        {/* CONTROLES DA FILA */}
        <div className="flex w-full flex-row items-center gap-2 sm:w-auto sm:gap-3">
          {/* Input de Busca */}
          <Skeleton className="h-11 flex-1 rounded-xl sm:w-72 lg:w-80" />
          {/* Select de Status */}
          <Skeleton className="h-11 w-11 shrink-0 rounded-xl sm:w-44" />
        </div>
      </header>

      {/* 📦 Container Principal (A Lista de Chats) */}
      <main className="border-border/40 bg-card/40 flex-1 flex-col overflow-hidden rounded-4xl border shadow-sm backdrop-blur-md dark:bg-zinc-950/40">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="divide-border/40 flex flex-col divide-y">
              {/* Skeletons das linhas de chat (Copiando o design do AdminChatListItem) */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex w-full items-center gap-3 p-3 sm:gap-4 sm:p-4"
                >
                  {/* Avatar (Arredondado como no design real) */}
                  <Skeleton className="h-12 w-12 shrink-0 rounded-full sm:h-14 sm:w-14" />

                  {/* Textos (Nome, info, tempo e mensagem) */}
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <Skeleton className="h-4 w-1/3 sm:w-40" />
                      <Skeleton className="h-3 w-10 sm:w-12" />
                    </div>
                    <Skeleton className="h-3 w-2/3 sm:w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER DA LISTA */}
          <div className="border-border/40 bg-muted/10 border-t px-6 py-3.5 backdrop-blur-sm">
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </main>
    </div>
  );
}
