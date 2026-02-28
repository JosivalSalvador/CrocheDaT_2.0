"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { LoginForm } from "../_components/login-form";

/**
 * Componente Interno para evitar problemas de Hydration com useSearchParams
 */
function LoginContent() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  useEffect(() => {
    // Se o usuário veio redirecionado do /register, mostramos o sucesso
    if (registered === "true") {
      toast.success("Conta criada com sucesso!", {
        description: "Agora você já pode entrar no sistema.",
      });

      // Limpa a URL para não mostrar o toast novamente se o usuário der F5
      window.history.replaceState({}, "", "/login");
    }
  }, [registered]);

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Entrar
        </h1>
        <p className="text-muted-foreground text-sm">
          Acesse sua conta para gerenciar o Crochê da T
        </p>
      </div>

      <LoginForm />

      <p className="text-muted-foreground text-center text-sm">
        Não tem uma conta?{" "}
        <Link
          href="/register"
          className="text-primary font-medium underline-offset-4 transition-colors hover:underline"
        >
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}

/**
 * Página de Login principal.
 * No Next.js 15, componentes que usam useSearchParams devem estar dentro de Suspense.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
