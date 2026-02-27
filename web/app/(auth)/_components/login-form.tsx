"use client";

import { useActionState, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { loginAction } from "../_actions/login.action";
import { loginSchema, LoginInput, AuthFormState } from "../types";
import { fadeIn } from "@/lib/animations/fade";

const initialState: AuthFormState = {
  success: false,
  message: null,
  errors: {},
};

export function LoginForm() {
  // 1. Estado da Server Action (BFF)
  const [state, action, isPending] = useActionState(loginAction, initialState);

  // 2. Validação do formulário no Cliente
  const {
    register,
    handleSubmit,
    formState: { errors: clientErrors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Submissão unindo Client + Server
  const onSubmit = (data: LoginInput) => {
    startTransition(() => {
      action(data);
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo de E-mail */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            className="border-input focus:ring-primary w-full rounded-md border bg-transparent p-2 transition-all outline-none focus:ring-2"
          />
          {clientErrors.email && (
            <p className="text-xs font-medium text-red-500">
              {clientErrors.email.message}
            </p>
          )}
        </div>

        {/* Campo de Senha */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Senha
          </label>
          <input
            {...register("password")}
            id="password"
            type="password"
            className="border-input focus:ring-primary w-full rounded-md border bg-transparent p-2 transition-all outline-none focus:ring-2"
          />
          {clientErrors.password && (
            <p className="text-xs font-medium text-red-500">
              {clientErrors.password.message}
            </p>
          )}
        </div>

        {/* Feedback de Erro do Servidor (BFF) */}
        {state?.message && !state.success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/15 text-destructive border-destructive/20 rounded border p-3 text-sm"
          >
            {state.message}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md p-2 font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Autenticando..." : "Entrar na conta"}
        </button>
      </form>
    </motion.div>
  );
}
