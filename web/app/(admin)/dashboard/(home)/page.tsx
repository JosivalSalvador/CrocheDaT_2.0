"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAllChats } from "@/hooks/use-chats";
import { useProducts } from "@/hooks/use-products";
import { useUsersList } from "@/hooks/use-users";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageSquare,
  ShoppingBag,
  Users,
  PackageSearch,
  AlertCircle,
  ArrowRight,
  Clock,
  User,
} from "lucide-react";

import type { ChatResponse } from "@/types/index";

export default function DashboardOverviewPage() {
  const { data: chatsData, isLoading: isLoadingChats } = useAllChats();
  const { data: productsData, isLoading: isLoadingProducts } = useProducts();
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isUsersError,
  } = useUsersList();

  // ==========================================
  // 🧮 PROCESSAMENTO DE DADOS
  // ==========================================
  const metrics = useMemo(() => {
    const chats = (chatsData?.chats || []) as ChatResponse[];
    const products = productsData?.products || [];
    const users = usersData?.users || [];

    const openChats = chats.filter((chat) => chat.isOpen);
    const supportChats = openChats.filter((chat) => chat.type === "SUPPORT");
    const orderChats = openChats.filter((chat) => chat.type === "ORDER");

    const sortedWaitlist = [...openChats].sort((a, b) => {
      const dateA = a.lastMessageAt
        ? new Date(a.lastMessageAt as string | Date).getTime()
        : 0;
      const dateB = b.lastMessageAt
        ? new Date(b.lastMessageAt as string | Date).getTime()
        : 0;
      return dateA - dateB;
    });

    const recentUsers = [...users]
      .sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(a.createdAt as string | Date).getTime()
          : 0;
        const dateB = b.createdAt
          ? new Date(b.createdAt as string | Date).getTime()
          : 0;
        return dateB - dateA;
      })
      .slice(0, 5);

    return {
      openTotal: openChats.length,
      supportTotal: supportChats.length,
      orderTotal: orderChats.length,
      productsTotal: products.length,
      usersTotal: users.length,
      waitlist: sortedWaitlist.slice(0, 6),
      recentUsers,
    };
  }, [chatsData, productsData, usersData]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const isLoading = isLoadingChats || isLoadingProducts || isLoadingUsers;

  // ==========================================
  // ⏳ ESTADO DE LOADING (Aprimorado)
  // ==========================================
  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col space-y-8 p-4 sm:p-6 md:p-8">
        <div>
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-48 rounded-md" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-2xl border p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-100 w-full rounded-2xl lg:col-span-2" />
          <Skeleton className="h-100 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // ==========================================
  // 🚀 TELA PRINCIPAL
  // ==========================================
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-6 p-4 sm:space-y-8 sm:p-6 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          {greeting}, Equipe! 👋
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Aqui está o resumo do que está acontecendo na plataforma hoje.
        </p>
      </div>

      {/* METRIC CARDS (KPIs) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card group hover:border-primary/30 relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">
              Fila de Atendimento
            </p>
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {metrics.openTotal}
            </h2>
            <span className="text-muted-foreground text-sm font-medium">
              aguardando
            </span>
          </div>
        </div>

        <div className="bg-card group relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all hover:border-blue-500/30 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">
              Tipos de Ticket
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 transition-transform group-hover:scale-110">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex flex-col">
              <span className="text-foreground text-2xl font-bold tracking-tight">
                {metrics.orderTotal}
              </span>
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Vendas
              </span>
            </div>
            <div className="bg-border h-8 w-px"></div>
            <div className="flex flex-col">
              <span className="text-foreground text-2xl font-bold tracking-tight">
                {metrics.supportTotal}
              </span>
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Dúvidas
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card group relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all hover:border-orange-500/30 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">
              Vitrine Ativa
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-500 transition-transform group-hover:scale-110">
              <PackageSearch className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {metrics.productsTotal}
            </h2>
            <span className="text-muted-foreground text-sm font-medium">
              produtos
            </span>
          </div>
        </div>

        <div className="bg-card group relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all hover:border-emerald-500/30 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">
              Total de Contas
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 transition-transform group-hover:scale-110">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            {isUsersError ? (
              <p className="text-muted-foreground text-xs font-medium">
                Acesso restrito a Admins.
              </p>
            ) : (
              <div className="flex items-baseline space-x-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  {metrics.usersTotal}
                </h2>
                <span className="text-muted-foreground text-sm font-medium">
                  registros
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PAINEL PRINCIPAL DE AÇÃO */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Esquerda: Fila de Espera */}
        <div className="bg-card flex flex-col rounded-2xl border shadow-sm lg:col-span-2">
          <div className="flex flex-col items-start justify-between border-b p-4 sm:flex-row sm:items-center sm:p-6">
            <div>
              <h3 className="text-lg font-bold">Fila de Espera</h3>
              <p className="text-muted-foreground text-sm">
                Atendimentos aguardando sua resposta.
              </p>
            </div>
            {metrics.waitlist.length > 0 && (
              <span className="bg-destructive text-destructive-foreground mt-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:mt-0">
                {metrics.openTotal}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col p-0">
            {metrics.waitlist.length === 0 ? (
              <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center p-12 text-center">
                <div className="bg-primary/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                  <span className="text-3xl">🎉</span>
                </div>
                <p className="text-foreground text-lg font-medium">
                  Fila zerada!
                </p>
                <p className="mt-1 text-sm">
                  Todos os clientes foram atendidos.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {metrics.waitlist.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/dashboard/chats/${chat.id}`}
                    className="hover:bg-muted/50 group flex flex-col items-start justify-between p-4 transition-colors sm:flex-row sm:items-center sm:p-6"
                  >
                    <div className="flex w-full items-center space-x-4 sm:w-auto">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${chat.type === "ORDER" ? "bg-blue-500/10 text-blue-500" : "bg-primary/10 text-primary"}`}
                      >
                        {chat.type === "ORDER" ? (
                          <ShoppingBag className="h-6 w-6" />
                        ) : (
                          <MessageSquare className="h-6 w-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground text-sm font-semibold sm:text-base">
                          {chat.type === "ORDER"
                            ? "Nova Encomenda"
                            : "Dúvida / Suporte"}
                        </p>
                        <div className="text-muted-foreground mt-0.5 flex items-center text-xs sm:text-sm">
                          <Clock className="mr-1.5 h-3.5 w-3.5" />
                          <span>
                            {chat.lastMessageAt
                              ? new Date(
                                  chat.lastMessageAt as string | Date,
                                ).toLocaleTimeString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Aguardando mensagem..."}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botão Responsivo: Ocupa tudo no Mobile, se ajusta no PC */}
                    <div className="mt-4 flex w-full shrink-0 sm:mt-0 sm:w-auto">
                      <span className="bg-primary text-primary-foreground group-hover:bg-primary/90 flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all sm:w-auto sm:rounded-full sm:px-4 sm:py-1.5 sm:text-xs">
                        Responder{" "}
                        <ArrowRight className="ml-2 h-4 w-4 sm:ml-1 sm:h-3 sm:w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Direita: Atividade Recente */}
        <div className="bg-card flex flex-col rounded-2xl border shadow-sm">
          <div className="border-b p-4 sm:p-6">
            <h3 className="text-lg font-bold">Novos Cadastros</h3>
            <p className="text-muted-foreground text-sm">
              Últimos clientes registrados.
            </p>
          </div>

          <div className="p-0">
            {isUsersError ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center p-12 text-center">
                <AlertCircle className="mb-3 h-10 w-10 opacity-50" />
                <p className="text-sm">Área restrita a Administradores.</p>
              </div>
            ) : metrics.recentUsers.length === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center p-12 text-center">
                <Users className="mb-3 h-10 w-10 opacity-20" />
                <p className="text-sm">Nenhum registro recente.</p>
              </div>
            ) : (
              <div className="divide-y">
                {metrics.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="hover:bg-muted/30 flex items-center justify-between p-4 transition-colors sm:p-5"
                  >
                    <div className="flex min-w-0 flex-1 items-center space-x-3">
                      {/* Avatar Adicionado para dar mais vida à lista */}
                      <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                        <User className="text-muted-foreground h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate text-sm font-semibold">
                          {user.name}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="ml-3 shrink-0 text-right">
                      <span className="text-muted-foreground text-xs font-medium">
                        {user.createdAt
                          ? new Date(
                              user.createdAt as string | Date,
                            ).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                            })
                          : "-"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
