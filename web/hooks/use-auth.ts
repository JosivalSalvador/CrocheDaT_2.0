"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserAction } from "@/app/(auth)/_actions/get-user.action";

/**
 * Hook de Autenticação
 * Centraliza o estado do usuário logado consumindo a sessão via Server Action.
 */
export function useAuth() {
  const {
    data: userData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      // Busca a sessão descriptografada do cookie através da Server Action
      const user = await getUserAction();
      return user ?? null;
    },
    // Mantém o dado como "fresco" por 5 minutos para evitar re-execuções desnecessárias
    staleTime: 1000 * 60 * 5,
    // Revalida quando o usuário volta para a aba, garantindo que a sessão não expirou no servidor
    refetchOnWindowFocus: true,
  });

  return {
    user: userData,
    isLoading: isLoading || isFetching,
    isAuthenticated: !!userData,
    // Verificações de permissão baseadas nas Roles do seu Prisma
    isAdmin: userData?.role === "ADMIN",
    isSupporter: userData?.role === "SUPPORTER",
    isUser: userData?.role === "USER",
    // Função para forçar a atualização dos dados do usuário (ex: após editar perfil)
    refreshUser: refetch,
  };
}
