"use client";

import { useSyncExternalStore } from "react";
import { useProfile } from "@/hooks/use-users";
import { ProfileForm } from "@/app/(admin)/_components/geral/profile-form";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Funções auxiliares obrigatórias para o useSyncExternalStore
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ProfilePage() {
  const { data, isLoading, isError, error } = useProfile();

  // A forma mais moderna (React 18+) de evitar erros de hidratação sem causar renders em cascata
  const isClient = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  // Força o Skeleton enquanto está no servidor (getServerSnapshot) ou enquanto a API carrega
  const showSkeleton = !isClient || isLoading;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 pb-20 sm:p-6 md:space-y-8 md:p-8">
      {/* 🏷️ CABEÇALHO */}
      <div className="flex flex-col gap-2 sm:gap-4">
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          Meu Perfil
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Gerencie suas informações pessoais e configurações de segurança.
        </p>
      </div>

      {/* 🧩 ÁREA DINÂMICA */}
      <div className="relative z-10">
        {/* 1. ESTADO DE CARREGAMENTO */}
        {showSkeleton ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <Skeleton className="h-95 w-full rounded-xl" />
              <Skeleton className="h-95 w-full rounded-xl" />
            </div>
            <Skeleton className="h-37.5 w-full rounded-xl" />
          </div>
        ) : /* 2. ESTADO DE ERRO */
        isError || !data ? (
          <Alert variant="destructive" className="shadow-sm">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <AlertTitle className="text-sm sm:text-base">
              Erro ao carregar perfil
            </AlertTitle>
            <AlertDescription className="mt-1 text-xs sm:text-sm">
              {error?.message ||
                "Não foi possível carregar as informações do seu usuário."}
            </AlertDescription>
          </Alert>
        ) : (
          /* 3. ESTADO DE SUCESSO */
          <ProfileForm user={data.user} />
        )}
      </div>
    </div>
  );
}
