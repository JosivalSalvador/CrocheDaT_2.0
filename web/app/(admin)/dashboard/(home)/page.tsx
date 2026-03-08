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

    // Correção TS: Garantindo a tipagem de lastMessageAt
    const sortedWaitlist = [...openChats].sort((a, b) => {
      const dateA = a.lastMessageAt
        ? new Date(a.lastMessageAt as string | Date).getTime()
        : 0;
      const dateB = b.lastMessageAt
        ? new Date(b.lastMessageAt as string | Date).getTime()
        : 0;
      return dateA - dateB;
    });

    // Correção TS: Checando a existência de createdAt e garantindo tipagem
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
  // ⏳ ESTADO DE LOADING
  // ==========================================
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-6 p-4 sm:p-6 md:p-8">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 w-full rounded-2xl lg:col-span-2" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // ==========================================
  // 🚀 TELA PRINCIPAL
  // ==========================================
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-8 p-4 sm:p-6 md:p-8">
      {/* HEADER */}
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          {greeting}, Equipe! 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Aqui está o resumo do que está acontecendo na plataforma hoje.
        </p>
      </div>

      {/* METRIC CARDS (KPIs) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">
              Fila de Atendimento
            </p>
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
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

        <div className="bg-card relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">
              Tipos de Ticket
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <div>
              <p className="text-foreground text-2xl font-bold tracking-tight">
                {metrics.orderTotal}
              </p>
              <p className="text-muted-foreground text-xs font-medium">
                Vendas
              </p>
            </div>
            <div className="bg-border h-8 w-px"></div>
            <div>
              <p className="text-foreground text-2xl font-bold tracking-tight">
                {metrics.supportTotal}
              </p>
              <p className="text-muted-foreground text-xs font-medium">
                Dúvidas
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">
              Vitrine Ativa
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
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

        <div className="bg-card relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">
              Total de Contas
            </p>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            {isUsersError ? (
              <p className="text-muted-foreground text-sm font-medium">
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
          <div className="flex items-center justify-between border-b p-6">
            <div>
              <h3 className="text-lg font-bold">Fila de Espera</h3>
              <p className="text-muted-foreground text-sm">
                Atendimentos aguardando sua resposta.
              </p>
            </div>
            {metrics.waitlist.length > 0 && (
              <span className="bg-destructive text-destructive-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                {metrics.openTotal}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col p-0">
            {metrics.waitlist.length === 0 ? (
              <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <span className="text-2xl">🎉</span>
                </div>
                <p className="font-medium">Nenhum cliente na fila!</p>
                <p className="text-sm">Todos os chamados foram respondidos.</p>
              </div>
            ) : (
              <div className="divide-y">
                {metrics.waitlist.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/dashboard/chats/${chat.id}`}
                    className="hover:bg-muted/50 flex flex-col items-start justify-between p-4 transition-colors sm:flex-row sm:items-center sm:p-6"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${chat.type === "ORDER" ? "bg-blue-500/10 text-blue-500" : "bg-primary/10 text-primary"}`}
                      >
                        {chat.type === "ORDER" ? (
                          <ShoppingBag className="h-5 w-5" />
                        ) : (
                          <MessageSquare className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-foreground font-semibold">
                          {chat.type === "ORDER"
                            ? "Nova Encomenda"
                            : "Dúvida/Suporte"}
                        </p>
                        <div className="text-muted-foreground flex items-center text-xs">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>
                            {/* Correção TS no UI render */}
                            {chat.lastMessageAt
                              ? new Date(
                                  chat.lastMessageAt as string | Date,
                                ).toLocaleTimeString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Sem mensagens"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex w-full items-center justify-end sm:mt-0 sm:w-auto">
                      <span className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm">
                        Responder <ArrowRight className="ml-1 h-3 w-3" />
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
          <div className="border-b p-6">
            <h3 className="text-lg font-bold">Novos Cadastros</h3>
            <p className="text-muted-foreground text-sm">
              Últimos clientes registrados.
            </p>
          </div>

          <div className="p-0">
            {isUsersError ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center p-8 text-center">
                <AlertCircle className="mb-2 h-8 w-8 opacity-50" />
                <p className="text-sm">
                  Você não tem permissão para visualizar clientes.
                </p>
              </div>
            ) : metrics.recentUsers.length === 0 ? (
              <div className="text-muted-foreground p-8 text-center text-sm">
                Nenhum usuário recente.
              </div>
            ) : (
              <div className="divide-y">
                {metrics.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 sm:p-6"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate font-medium">
                        {user.name}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {user.email}
                      </p>
                    </div>
                    <div className="ml-4 shrink-0">
                      <span className="text-muted-foreground text-xs">
                        {/* Correção TS no UI render */}
                        {user.createdAt
                          ? new Date(
                              user.createdAt as string | Date,
                            ).toLocaleDateString("pt-BR")
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
