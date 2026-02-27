"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserAction } from "@/app/(auth)/_actions/get-user.action"; // Importe a action

export function useAuth() {
  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      // Em vez de bater na API, lemos o cookie da sessão via Server Action
      return await getUserAction();
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  return {
    user: userData,
    isLoading,
    isAuthenticated: !!userData,
    isAdmin: userData?.role === "ADMIN",
    refreshUser: refetch,
  };
}
