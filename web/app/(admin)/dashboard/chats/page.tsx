"use client";

import { useState } from "react";
import { AdminChatList } from "../../_components/chats/admin-chat-list";
import { MessagesSquare, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ChatFilterStatus = "ALL" | "OPEN" | "CLOSED";

export default function AdminChatsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<ChatFilterStatus>("ALL");

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        {/* Identificação da Página */}
        <div className="flex items-center gap-4">
          <div className="bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-md sm:h-14 sm:w-14">
            <MessagesSquare className="text-primary-foreground h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
              Fila de Atendimentos
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Acompanhe e gerencie os tickets de suporte e encomendas.
            </p>
          </div>
        </div>

        {/* CONTROLES DA FILA */}
        <div className="flex w-full flex-row items-center gap-2 sm:w-auto sm:gap-3">
          <div className="relative flex-1 sm:w-72 lg:w-80">
            <Search className="text-muted-foreground/70 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Buscar cliente, ID ou pedido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-border/50 bg-background/60 focus-visible:ring-primary h-11 w-full rounded-xl pl-10 text-sm shadow-sm transition-colors focus-visible:ring-1"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as ChatFilterStatus)
            }
          >
            {/* A Mágica da Setinha:
              [&>svg]:hidden -> Esconde a seta padrão injetada pelo Shadcn no mobile
              sm:[&>svg]:block -> Mostra a seta padrão de volta no desktop
            */}
            <SelectTrigger className="border-border/50 bg-background/60 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl p-0 shadow-sm sm:w-44 sm:justify-between sm:px-3 [&>svg]:hidden sm:[&>svg]:block">
              <div className="flex items-center justify-center gap-2">
                <Filter className="text-primary h-4 w-4" />
                <span className="hidden font-semibold sm:inline-block">
                  <SelectValue placeholder="Status" />
                </span>
              </div>
            </SelectTrigger>

            {/* O Fundo Sólido Padrão:
              bg-popover text-popover-foreground -> Usa as cores oficiais do seu tema
            */}
            <SelectContent
              position="popper"
              align="end"
              sideOffset={8}
              className="border-border/50 text-foreground z-50 min-w-40 rounded-xl border bg-white shadow-lg dark:bg-zinc-950"
            >
              <SelectItem value="ALL" className="cursor-pointer font-medium">
                Todos os Tickets
              </SelectItem>
              <SelectItem value="OPEN" className="cursor-pointer font-medium">
                Apenas Abertos
              </SelectItem>
              <SelectItem value="CLOSED" className="cursor-pointer font-medium">
                Resolvidos
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Container Principal */}
      <main className="border-border/40 bg-card/40 flex-1 overflow-hidden rounded-4xl border shadow-sm backdrop-blur-md dark:bg-zinc-950/40">
        <AdminChatList searchTerm={searchTerm} statusFilter={statusFilter} />
      </main>
    </div>
  );
}
