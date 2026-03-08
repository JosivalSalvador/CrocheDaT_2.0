"use client";

import { use } from "react";
import { useChatDetails } from "@/hooks/use-chats";
import { ChatHeader } from "@/app/(customer)/_components/chat/chat-header";
import { MessageThread } from "@/app/(customer)/_components/chat/message-thread";
import { ChatInput } from "@/app/(customer)/_components/chat/chat-input";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

import type { ChatResponse } from "@/types/index";

interface ChatPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ChatIndividualPage({ params }: ChatPageProps) {
  const resolvedParams = use(params);

  const { data, isLoading, isError } = useChatDetails(resolvedParams.id);

  const chat = data?.chat as ChatResponse | undefined;

  // Classe utilitária para manter a consistência entre Loading, Erro e Page
  // Mobile: h-dvh (full) | Desktop: h-[90vh], margem top/bottom, bordas e sombra
  const containerClasses =
    "relative mx-auto flex w-full max-w-5xl flex-col overflow-hidden bg-background shadow-2xl transition-all h-dvh md:h-[90vh] md:my-8 md:rounded-2xl md:border md:border-border/50";

  if (isLoading) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center">
        <div className={containerClasses}>
          <div className="border-b p-4">
            <Skeleton className="h-10 w-full max-w-sm rounded-xl" />
          </div>
          <div className="flex-1 space-y-4 p-6">
            <Skeleton className="h-16 w-3/4 self-start rounded-xl" />
            <Skeleton className="h-16 w-3/4 self-end rounded-xl" />
          </div>
          <div className="border-t p-4">
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !chat) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center p-4">
        <div className="border-destructive/20 bg-destructive/10 text-destructive flex w-full max-w-md flex-col items-center justify-center rounded-xl border p-6 text-center sm:p-8">
          <AlertCircle className="mb-4 h-10 w-10 opacity-80" />
          <h2 className="text-lg font-bold">Atendimento não encontrado</h2>
          <p className="mt-2 text-sm opacity-80">
            Não conseguimos carregar este chat.
          </p>
        </div>
      </div>
    );
  }

  return (
    // Centralizamos o container na tela com o flex do pai
    <div className="flex min-h-dvh w-full items-center justify-center bg-transparent">
      <div className={containerClasses}>
        <ChatHeader chat={chat} />

        {/* Ocupa todo o espaço entre Header e Input */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <MessageThread messages={chat.messages} />
        </div>

        <ChatInput chatId={chat.id} isOpen={chat.isOpen} />
      </div>
    </div>
  );
}
