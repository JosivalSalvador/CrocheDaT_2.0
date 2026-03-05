"use client";

import { RegisterForm } from "../_components/register-form";
import { GridBackground } from "@/components/ui/grid-background";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] w-full items-center justify-center overflow-hidden p-4">
      {/* Background de Grid consistente */}
      <div className="absolute inset-0 z-0">
        <GridBackground />
      </div>

      <Link
        href="/"
        className="text-muted-foreground hover:text-primary absolute top-8 left-4 z-20 flex items-center gap-2 text-sm font-medium transition-colors sm:left-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para a vitrine
      </Link>

      <div className="animate-in fade-in slide-in-from-bottom-8 relative z-10 w-full max-w-100 duration-1000">
        <RegisterForm />

        <p className="text-muted-foreground/60 mt-8 text-center text-xs">
          Ao se cadastrar, você concorda com nossos Termos de Serviço.
        </p>
      </div>
    </div>
  );
}
