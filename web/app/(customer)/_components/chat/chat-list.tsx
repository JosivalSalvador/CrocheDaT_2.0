"use client";

import { useMyChats } from "@/hooks/use-chats";
import { ChatListItem } from "./chat-list-item";
import { EmptyChatList } from "./empty-chat-list";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export function ChatList() {
  const { data, isLoading, isError } = useMyChats();

  if (isLoading) {
    return (
      // Skeleton sem gap, com divisor para simular a lista real
      <div className="divide-border/40 flex flex-col divide-y">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="h-12 w-12 shrink-0 rounded-full sm:h-14 sm:w-14" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-destructive/20 bg-destructive/10 text-destructive m-4 flex flex-col items-center justify-center rounded-xl border p-6">
        <AlertCircle className="mb-2 h-8 w-8 opacity-80" />
        <p className="text-sm font-medium">
          Não foi possível carregar seus chats.
        </p>
        <p className="text-xs opacity-80">Tente recarregar a página.</p>
      </div>
    );
  }

  const chatsArray = data?.chats;

  if (!chatsArray || chatsArray.length === 0) {
    // Adicionei um padding aqui para o Empty State não ficar colado nas bordas
    return (
      <div className="p-4 sm:p-0">
        <EmptyChatList />
      </div>
    );
  }

  return (
    // 👇 divide-y é o segredo para a lista estilo WhatsApp
    <div className="divide-border/40 animate-in fade-in -mx-4 flex flex-col divide-y duration-500 sm:mx-0">
      {chatsArray.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
    </div>
  );
}
