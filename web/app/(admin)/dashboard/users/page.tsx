"use client";

import { useState } from "react";
import { Users, AlertCircle } from "lucide-react";

// 👇 Adicionado o useProfile aqui na importação
import { useUsersList, useProfile } from "@/hooks/use-users";
import { UsersFilters } from "../../_components/users/users-filters"; // Ajuste o caminho se sua pasta chamar algo diferente
import { UsersList } from "../../_components/users/users-list";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function UsersPage() {
  // Busca os dados da lista via React Query
  const { data, isLoading, isError, error } = useUsersList();

  // 👇 Busca os dados do usuário logado (renomeado para profileData para não dar conflito com o 'data' acima)
  const { data: profileData } = useProfile();

  // ==========================================
  // ⚙️ ESTADOS DOS FILTROS
  // ==========================================
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // ==========================================
  // 🔍 LÓGICA DE FILTRAGEM LOCAL (Client-Side)
  // ==========================================
  const filteredUsers =
    data?.users.filter((user) => {
      // 🛡️ Esconde o próprio usuário da tabela
      // Pega o ID independente de como seu backend retorna (direto no objeto ou dentro de 'user')
      const currentUserId = profileData?.user?.id;
      if (currentUserId && user.id === currentUserId) {
        return false;
      }

      // Verifica se o texto digitado bate com o nome OU email
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Verifica o cargo ("ALL" ignora esse filtro)
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    }) || [];

  return (
    // O container pai assume o padding (p-4 no mobile, md:p-8 no desktop)
    // pb-20 no mobile previne que os botões fiquem escondidos atrás da navegação do celular
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 pb-20 sm:p-6 md:space-y-8 md:p-8 md:pb-8">
      {/* 🏷️ CABEÇALHO DA PÁGINA */}
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-foreground flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
            <Users className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
            Usuários
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gerencie o acesso de clientes, equipe de suporte e administradores.
          </p>
        </div>
      </div>

      {/* 🧩 ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="relative z-10 space-y-4 sm:space-y-6">
        {/* 1. FILTROS 
            Ficam de fora do isLoading para que a interface não fique "pulando" 
            quando os dados carregarem. 
        */}
        <UsersFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
        />

        {/* 2. ESTADO DE CARREGAMENTO */}
        {isLoading ? (
          <div className="bg-card space-y-4 rounded-md border p-4 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="hidden h-6 w-32 md:block" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="w-1/3 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="hidden h-4 w-24 md:block" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </div>
        ) : /* 3. ESTADO DE ERRO */
        isError || !data ? (
          <Alert variant="destructive" className="shadow-sm">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <AlertTitle className="text-sm sm:text-base">
              Erro ao carregar usuários
            </AlertTitle>
            <AlertDescription className="mt-1 text-xs sm:text-sm">
              {error?.message ||
                "Não foi possível buscar a lista de usuários no momento. Tente recarregar a página."}
            </AlertDescription>
          </Alert>
        ) : (
          /* 4. ESTADO DE SUCESSO (A Tabela) */
          <UsersList users={filteredUsers} />
        )}
      </div>
    </div>
  );
}
