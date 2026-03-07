"use client";

import { useSyncExternalStore } from "react";
import { useProfile } from "@/hooks/use-users";
import { ProfileForm } from "../../_components/geral/profile-form";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// 🛡️ O PADRÃO REACT 18+ PARA HIDRATAÇÃO
// Substitui o uso de useEffect e evita avisos de "cascading renders" no linter.
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ProfilePage() {
  // Retorna 'false' no servidor e na primeira renderização do cliente (evitando erro de hidratação).
  // Imediatamente após hidratar, o React altera para 'true' de forma nativa e otimizada.
  const isClient = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const { data, isLoading, isError, error } = useProfile();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 pb-20 sm:p-6 md:space-y-8 md:p-8 md:pb-8">
      {/* 🏷️ CABEÇALHO (Sempre visível)
          Como este texto é estático, ele sempre renderiza igual no servidor e no cliente.
          Isso mata o erro da raiz e melhora muito a experiência visual. */}
      <div className="relative z-10 flex flex-col gap-2 sm:gap-4">
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          Meu Perfil
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Gerencie suas informações pessoais e configurações de segurança.
        </p>
      </div>

      {/* 🧩 ÁREA DINÂMICA (Formulário ou Estados de Carregamento) */}
      <div className="relative z-10">
        {/* 1. ESTADO DE CARREGAMENTO */}
        {!isClient || isLoading ? (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Skeleton className="h-100 w-full rounded-xl" />
            <Skeleton className="h-100 w-full rounded-xl" />
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
