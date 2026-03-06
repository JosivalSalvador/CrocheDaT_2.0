import { RegisterForm } from "../_components/register-form";
import { GridBackground } from "@/components/ui/grid-background";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar Conta | Nossas Peças",
  description:
    "Crie sua conta para realizar encomendas exclusivas e gerenciar seu perfil.",
};

export default function RegisterPage() {
  return (
    <div className="selection:bg-primary/30 relative flex min-h-dvh flex-col items-center justify-center overflow-hidden">
      {/* Background com Grid */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <GridBackground />
      </div>

      {/* Efeito Criativo: Glow centralizado bem atrás do formulário */}
      <div className="bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 -z-10 h-100 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />

      {/* Botão de Voltar Solto - Desktop Only */}
      <div className="animate-in fade-in slide-in-from-left-4 absolute top-6 left-4 z-20 duration-700 md:top-8 md:left-8">
        <Link
          href="/"
          className="text-muted-foreground hover:text-primary hidden items-center gap-2 text-sm font-medium transition-colors md:inline-flex"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para a Vitrine
        </Link>
      </div>

      {/* Container Principal Extremamente Responsivo */}
      <main className="relative z-10 flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <RegisterForm />
      </main>
    </div>
  );
}
