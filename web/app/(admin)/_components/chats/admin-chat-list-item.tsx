"use client";

import Link from "next/link";
import { HeadphonesIcon, ShoppingBag, CheckCheck } from "lucide-react";

import type { ChatResponse, UserResponse } from "@/types/index";
import { ChatType, Role } from "@/types/enums";

// Função de tempo ajustada para um visual mais "Dashboard" (compacto)
function getRelativeTime(dateString: Date | string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.round((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return "agora";
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  if (diffInMinutes < 2880) return "ontem";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

interface AdminChatListItemProps {
  chat: ChatResponse;
  user?: UserResponse;
}

export function AdminChatListItem({ chat, user }: AdminChatListItemProps) {
  const isOrder = chat.type === ChatType.ORDER;
  const timeAgo = getRelativeTime(chat.lastMessageAt);

  // A mensagem mais recente é a [0]
  const lastMessage =
    chat.messages && chat.messages.length > 0 ? chat.messages[0] : null;

  // Regra de Negócio: O cliente mandou a última mensagem e o chat está aberto?
  const isWaitingForAdmin =
    chat.isOpen && lastMessage?.sender.role === Role.USER;

  // Formatação de Dados do Usuário
  const userName = user?.name || "Usuário Desconhecido";
  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <Link
      href={`/dashboard/chats/${chat.id}`}
      className={`group border-border/40 hover:bg-muted/50 focus-visible:bg-muted/50 relative flex w-full items-center gap-3 border-b p-3 transition-colors focus-visible:outline-none sm:gap-4 sm:p-4 ${
        !chat.isOpen ? "opacity-75 hover:opacity-100" : ""
      } ${isWaitingForAdmin ? "bg-blue-50/30 dark:bg-blue-950/10" : "bg-transparent"}`}
    >
      {/* Indicador de "Ação Requerida" (Borda lateral sutil) */}
      {isWaitingForAdmin && (
        <div className="absolute top-0 left-0 h-full w-1 rounded-r-full bg-blue-500" />
      )}

      {/* AVATAR COM INICIAIS E STATUS */}
      <div className="bg-muted relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-14 sm:w-14">
        <span
          className={`text-sm font-bold tracking-tight sm:text-base ${
            isWaitingForAdmin
              ? "text-blue-600 dark:text-blue-400"
              : "text-muted-foreground group-hover:text-primary"
          }`}
        >
          {userInitials}
        </span>

        {/* Ícone pequeno sobreposto indicando Encomenda ou Suporte */}
        <div
          className={`border-background absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 sm:h-5 sm:w-5 ${
            isOrder
              ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400"
              : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400"
          }`}
        >
          {isOrder ? (
            <ShoppingBag className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
          ) : (
            <HeadphonesIcon className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
          )}
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL DA LISTA */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {/* Linha Superior: Nome do Cliente + Info do Pedido + Tempo */}
        <div className="flex items-center justify-between gap-2">
          <h3
            className={`truncate text-[15px] sm:text-base ${
              isWaitingForAdmin
                ? "text-foreground font-bold"
                : "text-foreground/90 font-semibold"
            }`}
          >
            {userName}
            {/* Tag inline e limpa para identificar o chat rapidamente */}
            <span className="text-muted-foreground ml-2 hidden items-center gap-1 font-normal opacity-80 sm:inline-flex">
              - {isOrder ? `Pedido #${chat.cartId?.split("-")[0]}` : "Suporte"}
            </span>
          </h3>
          <span
            className={`shrink-0 text-xs font-medium ${
              isWaitingForAdmin ? "text-blue-500" : "text-muted-foreground/80"
            }`}
          >
            {timeAgo}
          </span>
        </div>

        {/* Linha Inferior: Preview da Última Mensagem */}
        <div className="mt-0.5 flex items-center gap-1.5 sm:mt-1">
          {/* Tag de "Encerrado" */}
          {!chat.isOpen && (
            <span className="bg-secondary text-secondary-foreground shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium tracking-wider uppercase">
              Encerrado
            </span>
          )}

          {/* Checks de leitura se a mensagem foi enviada pela equipe Admin/Suporte */}
          {lastMessage?.sender.role !== Role.USER && lastMessage && (
            <CheckCheck className="text-muted-foreground/50 h-4 w-4 shrink-0" />
          )}

          {/* O Texto da Mensagem */}
          <p
            className={`truncate text-sm sm:text-[15px] ${isWaitingForAdmin ? "text-foreground font-semibold" : "text-muted-foreground"}`}
          >
            {lastMessage?.sender.role !== Role.USER && lastMessage && (
              <span className="text-foreground/70 font-medium">Vocês: </span>
            )}
            {lastMessage ? lastMessage.content : "Novo atendimento iniciado..."}
          </p>

          {/* Bolinha de Notificação Estilo WhatsApp/Telegram */}
          {isWaitingForAdmin && (
            <span className="ml-auto flex h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500 shadow-sm" />
          )}
        </div>
      </div>
    </Link>
  );
}
