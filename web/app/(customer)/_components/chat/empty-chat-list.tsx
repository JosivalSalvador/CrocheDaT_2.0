"use client";

import { MessageSquareDashed } from "lucide-react";

export function EmptyChatList() {
  return (
    <div className="border-border/60 bg-muted/10 hover:bg-muted/20 animate-in fade-in flex min-h-75 flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all duration-500 sm:min-h-100 sm:p-10">
      {/* Círculo do Ícone: Menor no mobile, maior no desktop */}
      <div className="bg-primary/10 mb-4 flex h-14 w-14 items-center justify-center rounded-full shadow-sm sm:mb-5 sm:h-16 sm:w-16">
        <MessageSquareDashed className="text-primary h-7 w-7 opacity-80 sm:h-8 sm:w-8" />
      </div>

      {/* Título: Escala com a tela */}
      <h3 className="text-foreground text-base font-semibold tracking-tight sm:text-lg md:text-xl">
        Nenhum atendimento no momento
      </h3>

      {/* Texto descritivo: max-w restringe a largura pra não virar uma tripa de texto num monitor grande */}
      <p className="text-muted-foreground mt-2 max-w-xs text-xs leading-relaxed sm:max-w-sm sm:text-sm">
        Você ainda não tem nenhum chat em andamento. Inicie um novo suporte ou
        faça uma encomenda para conversar com a nossa equipe.
      </p>
    </div>
  );
}
