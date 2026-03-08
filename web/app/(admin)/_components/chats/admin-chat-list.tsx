"use client";

import { useAllChats } from "@/hooks/use-chats";
import { useUsersList } from "@/hooks/use-users"; // Importando o hook de usuários
import { AdminChatListItem } from "./admin-chat-list-item";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Inbox, SearchX } from "lucide-react";

import type { ChatResponse, UserResponse } from "@/types/index";

// 1. Tipagem exata para casar com a Page e eliminar o erro "IntrinsicAttributes"
interface AdminChatListProps {
  searchTerm: string;
  statusFilter: "ALL" | "OPEN" | "CLOSED";
}

export function AdminChatList({
  searchTerm,
  statusFilter,
}: AdminChatListProps) {
  // 2. Buscamos os Chats E os Usuários paralelamente
  const {
    data: chatsData,
    isLoading: isLoadingChats,
    isError: isErrorChats,
  } = useAllChats();
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useUsersList();

  // 3. Extração segura garantindo arrays válidos (baseado no formato das suas actions)
  const chatsArray = (chatsData?.chats || chatsData || []) as ChatResponse[];
  const usersArray = (usersData?.users || usersData || []) as UserResponse[];

  const isLoading = isLoadingChats || isLoadingUsers;
  const isError = isErrorChats || isErrorUsers;

  // =====================================
  // ESTADOS DE CARREGAMENTO E ERRO
  // =====================================
  if (isLoading) {
    return (
      <div className="flex flex-col">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-border/40 border-b p-6 last:border-0">
            <div className="flex animate-pulse items-center gap-4">
              <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-1/3 rounded-lg" />
                <Skeleton className="h-3 w-1/4 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center p-8 text-center">
        <div className="bg-destructive/10 text-destructive mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-sm">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-foreground text-lg font-bold tracking-tight">
          Erro de Conexão
        </h3>
        <p className="text-muted-foreground mt-1 max-w-70 text-sm font-medium">
          Falha ao sincronizar dados dos clientes e atendimentos.
        </p>
      </div>
    );
  }

  if (chatsArray.length === 0) {
    return (
      <div className="flex min-h-112.5 flex-col items-center justify-center p-12 text-center">
        <div className="bg-muted/40 text-muted-foreground/50 mb-4 flex h-20 w-20 items-center justify-center rounded-3xl shadow-inner">
          <Inbox className="h-10 w-10" />
        </div>
        <h3 className="text-foreground text-xl font-bold tracking-tight">
          Fila Limpa
        </h3>
        <p className="text-muted-foreground mt-2 max-w-xs text-sm font-medium">
          Nenhum cliente solicitou atendimento até o momento.
        </p>
      </div>
    );
  }

  // =====================================
  // MOTOR DE BUSCA E FILTRO INTELIGENTE
  // =====================================
  const filteredData = chatsArray
    .map((chat) => {
      // Cruzamento de dados: acha o usuário dono deste chat
      const user = usersArray.find((u) => u.id === chat.userId);
      return { chat, user };
    })
    .filter(({ chat, user }) => {
      // Regra 1: Filtro de Status
      if (statusFilter === "OPEN" && !chat.isOpen) return false;
      if (statusFilter === "CLOSED" && chat.isOpen) return false;

      // Regra 2: Filtro de Busca Profunda
      if (searchTerm) {
        const term = searchTerm.toLowerCase().trim();

        // Verifica IDs
        const matchesChatId = chat.id.toLowerCase().includes(term);
        const matchesCartId = chat.cartId?.toLowerCase().includes(term);

        // Verifica Dados do Usuário
        const matchesName = user?.name.toLowerCase().includes(term);
        const matchesEmail = user?.email.toLowerCase().includes(term);

        // Verifica conteúdo de mensagens (se a API retornar prévias)
        const matchesMessage = chat.messages?.some((m) =>
          m.content.toLowerCase().includes(term),
        );

        return (
          matchesChatId ||
          matchesCartId ||
          matchesName ||
          matchesEmail ||
          matchesMessage
        );
      }

      return true;
    })
    // Ordenação: Sempre o atendimento com mensagem mais recente no topo
    .sort(
      (a, b) =>
        new Date(b.chat.lastMessageAt).getTime() -
        new Date(a.chat.lastMessageAt).getTime(),
    );

  // =====================================
  // RENDERIZAÇÃO DA LISTA
  // =====================================
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="divide-border/40 flex flex-col divide-y">
          {filteredData.length === 0 ? (
            <div className="animate-in fade-in flex min-h-75 flex-col items-center justify-center py-20 text-center duration-300">
              <div className="bg-muted/30 text-muted-foreground/60 mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                <SearchX className="h-6 w-6" />
              </div>
              <p className="text-foreground text-sm font-bold">
                Nenhum resultado encontrado
              </p>
              <p className="text-muted-foreground mt-1 text-xs font-medium">
                Tente buscar por outro nome ou termo.
              </p>
            </div>
          ) : (
            filteredData.map(({ chat, user }) => (
              <div
                key={chat.id}
                className="animate-in fade-in slide-in-from-top-2 duration-300"
              >
                {/* Passamos tanto o chat quanto os dados do usuário para o Item. 
                  No próximo passo, vamos ajustar o Item para receber esse "user" e mostrar o Nome dele!
                */}
                <AdminChatListItem chat={chat} user={user} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* FOOTER DA LISTA - Contador estático na base */}
      <div className="border-border/40 bg-muted/10 border-t px-6 py-3.5 backdrop-blur-sm">
        <p className="text-muted-foreground/70 text-[10px] font-bold tracking-[0.15em] uppercase">
          Exibindo{" "}
          <span className="text-foreground">{filteredData.length}</span> de{" "}
          <span className="text-foreground">{chatsArray.length}</span>{" "}
          atendimentos
        </p>
      </div>
    </div>
  );
}
