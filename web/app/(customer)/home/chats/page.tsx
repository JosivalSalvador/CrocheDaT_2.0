import { Metadata } from "next";
import { ChatList } from "../../_components/chat/chat-list";
import { NewSupportModal } from "../../_components/chat/new-support-modal";

export const metadata: Metadata = {
  title: "Meus Atendimentos | Minha Loja",
  description: "Acompanhe suas encomendas e suportes.",
};

export default function ChatsPage() {
  return (
    // Max-width 4xl dá um respiro um pouco melhor pra telas ultrawide, mas mantém centralizado.
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      {/* Cabeçalho da Página */}
      <div className="mb-6 flex flex-col items-start justify-between gap-5 sm:mb-8 sm:flex-row sm:items-center">
        <div className="flex-1">
          <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Atendimentos
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Acompanhe o status das suas encomendas ou tire dúvidas com o
            suporte.
          </p>
        </div>

        {/* 👇 O SEGREDO DO MOBILE: w-full no celular, auto no desktop */}
        <div className="w-full shrink-0 sm:w-auto">
          {/* Importante: Garanta que o botão dentro do NewSupportModal também tenha className="w-full" repassado pra ele! */}
          <NewSupportModal />
        </div>
      </div>

      {/* Container da Lista */}
      {/* 👇 Substituí o min-h-100 por min-h-[50vh] e adicionei um card ao redor para destacar a lista */}
      <div className="sm:border-border/50 sm:bg-card relative min-h-[50vh] w-full rounded-xl sm:border sm:p-4 sm:shadow-sm">
        <ChatList />
      </div>
    </div>
  );
}
