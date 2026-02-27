"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LoginForm } from "../_components/login-form";
import { fadeIn } from "@/lib/animations/fade";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-[400px] space-y-8"
      >
        {/* Cabeçalho */}
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Entrar no Sistema
          </h1>
          <p className="text-muted-foreground text-sm">
            Gerenciamento de encomendas e peças
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="border-border bg-card rounded-xl border p-8 shadow-lg">
          <LoginForm />
        </div>

        {/* Footer da Página */}
        <p className="text-muted-foreground text-center text-sm">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
