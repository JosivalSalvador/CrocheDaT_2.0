"use client";

import { use } from "react";
import { useChatDetails } from "@/hooks/use-chats";
import { AdminChatHeader } from "@/app/(admin)/_components/chats/admin-chat-header";
import { MessageThread } from "@/app/(admin)/_components/chats/admin-message-thread";
import { ChatInput } from "@/app/(customer)/_components/chat/chat-input";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

import type { ChatResponse } from "@/types/index";

interface AdminChatIndividualPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AdminChatIndividualPage({
  params,
}: AdminChatIndividualPageProps) {
  const resolvedParams = use(params);

  const { data, isLoading, isError } = useChatDetails(resolvedParams.id);
  const chat = data?.chat as ChatResponse | undefined;

  // 👇 Adicionado md:overflow-hidden no final.
  // Isso garante que no Desktop o formato de "card" corte perfeitamente o Header e o Input nas pontas.
  const containerClasses =
    "relative mx-auto flex w-full max-w-5xl flex-col bg-background shadow-none -mt-16 h-[100dvh] md:my-6 md:h-[calc(100dvh-3rem)] md:rounded-2xl md:border md:border-border/50 md:shadow-2xl md:overflow-hidden";

  if (isLoading) {
    return (
      <div className={containerClasses}>
        <div className="border-b p-4 sm:p-6">
          <Skeleton className="h-10 w-full max-w-sm rounded-xl" />
        </div>
        <div className="flex flex-1 flex-col space-y-4 overflow-hidden p-4 sm:p-6">
          <Skeleton className="h-16 w-10/12 self-start rounded-xl sm:w-3/4" />
          <Skeleton className="h-16 w-10/12 self-end rounded-xl sm:w-3/4" />
          <Skeleton className="h-16 w-8/12 self-start rounded-xl sm:w-1/2" />
        </div>
        <div className="p-4 sm:p-6">
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !chat) {
    return (
      <div className={containerClasses}>
        <div className="flex h-full w-full flex-col items-center justify-center p-4">
          <div className="border-destructive/20 bg-destructive/10 text-destructive flex w-full max-w-md flex-col items-center justify-center rounded-xl border p-6 text-center sm:p-8">
            <AlertCircle className="mb-4 h-10 w-10 opacity-80" />
            <h2 className="text-lg font-bold sm:text-xl">
              Ticket não encontrado
            </h2>
            <p className="mt-2 text-sm opacity-80">
              Este atendimento pode ter sido excluído do sistema.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* 👇 Removido o rounded-t-2xl daqui. Ajustei a sintaxe do backdrop-filter também. */}
      <div className="bg-background/95 supports-backdrop-filter:bg-background/60 z-10 shrink-0 backdrop-blur">
        <AdminChatHeader chat={chat} />
      </div>

      {/* A Thread do Admin */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <MessageThread messages={chat.messages} />
      </div>

      {/* 👇 Removido o rounded-b-2xl daqui. */}
      <div className="bg-background z-10 shrink-0">
        <ChatInput chatId={chat.id} isOpen={chat.isOpen} />
      </div>
    </div>
  );
}
