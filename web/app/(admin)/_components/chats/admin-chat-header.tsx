"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  HeadphonesIcon,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderDetailsSheet } from "./order-details-sheet";
import { useChatMutations } from "@/hooks/use-chats";
import { useUsersList } from "@/hooks/use-users";

import type { ChatResponse, UserResponse } from "@/types/index";
import { ChatType } from "@/types/enums";

interface AdminChatHeaderProps {
  chat: ChatResponse;
  // REMOVIDO: user?: UserResponse. O próprio componente agora é inteligente o suficiente para buscar.
}

export function AdminChatHeader({ chat }: AdminChatHeaderProps) {
  const { toggleStatus } = useChatMutations();

  // 👇 AQUI ESTÁ A VERDADE: Buscamos a lista e achamos o dono do chat na hora!
  const { data: usersData, isLoading: isLoadingUsers } = useUsersList();
  const usersArray = (usersData?.users || usersData || []) as UserResponse[];
  const user = usersArray.find((u) => u.id === chat.userId);

  const isOrder = chat.type === ChatType.ORDER;

  // Formatação de Dados do Usuário
  const userName = user?.name || "Usuário Desconhecido";
  const userInitials = userName.substring(0, 2).toUpperCase();
  const userEmail = user?.email || "ID: " + chat.userId.split("-")[0];

  const handleToggleStatus = () => {
    toggleStatus.mutate({ chatId: chat.id, isOpen: !chat.isOpen });
  };

  return (
    <header className="border-border/40 bg-background/80 sticky top-0 z-40 flex w-full shrink-0 items-center justify-between border-b p-3 shadow-sm backdrop-blur-xl sm:p-4 lg:px-6">
      {/* LADO ESQUERDO: Voltar + Info do Cliente */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="hover:bg-muted h-9 w-9 shrink-0 rounded-full sm:h-10 sm:w-10"
        >
          <Link href="/dashboard/chats">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </Button>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Avatar com Indicador de Status do Chat */}
          <div className="relative hidden shrink-0 sm:block">
            {isLoadingUsers ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : (
              <div className="bg-muted/80 text-muted-foreground ring-border/50 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ring-1">
                {userInitials}
              </div>
            )}
            <span
              className={`border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 ${chat.isOpen ? "bg-emerald-500" : "bg-muted-foreground"}`}
            />
          </div>

          {/* Textos fluídos */}
          <div className="flex min-w-0 flex-col justify-center gap-0.5">
            <div className="flex items-center gap-2">
              {isLoadingUsers ? (
                <Skeleton className="h-5 w-32 rounded-md sm:w-48" />
              ) : (
                <h2 className="text-foreground truncate text-[15px] font-black tracking-tight sm:text-lg">
                  {userName}
                </h2>
              )}

              <Badge
                variant={chat.isOpen ? "outline" : "secondary"}
                className={`hidden shrink-0 text-[9px] font-bold tracking-wider uppercase sm:inline-flex ${
                  chat.isOpen
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : ""
                }`}
              >
                {chat.isOpen ? "Ativo" : "Resolvido"}
              </Badge>
            </div>

            <div className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium sm:text-xs">
              {isLoadingUsers ? (
                <Skeleton className="h-3 w-24 rounded-sm sm:w-32" />
              ) : (
                <span className="truncate">{userEmail}</span>
              )}
              <span className="text-border">•</span>
              <span className="text-foreground/70 flex shrink-0 items-center gap-1">
                {isOrder ? (
                  <ShoppingBag className="h-3 w-3" />
                ) : (
                  <HeadphonesIcon className="h-3 w-3" />
                )}
                <span className="hidden sm:inline-block">
                  {isOrder ? "Encomenda" : "Suporte Geral"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LADO DIREITO: Ações Rápidas */}
      <div className="flex shrink-0 items-center gap-2 pl-2">
        {isOrder && chat.cartId && <OrderDetailsSheet cartId={chat.cartId} />}

        <Button
          variant={chat.isOpen ? "outline" : "default"}
          size="sm"
          onClick={handleToggleStatus}
          disabled={toggleStatus.isPending}
          className={`border-border/50 h-9 gap-2 rounded-xl font-bold shadow-sm transition-all sm:h-10 sm:px-4 ${
            chat.isOpen
              ? "bg-background hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
              : "hover:bg-primary/90"
          }`}
        >
          {chat.isOpen ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden tracking-wide sm:inline-block">
                Encerrar Chat
              </span>
            </>
          ) : (
            <>
              <RotateCcw className="h-4 w-4" />
              <span className="hidden tracking-wide sm:inline-block">
                Reabrir Chat
              </span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
