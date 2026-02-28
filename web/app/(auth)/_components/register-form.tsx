"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { registerAction } from "../_actions/register.action";
import { registerSchema, RegisterInput, AuthFormState } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthFormState = {
  success: false,
  message: null,
  errors: {},
};

export function RegisterForm() {
  // 1. Usamos useTransition para gerenciar o estado pendente da Action
  const [isPending, startTransition] = useTransition();
  const [state, action] = useActionState(registerAction, initialState);

  const {
    register,
    handleSubmit,
    formState: { errors: clientErrors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Notificações Sonner
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  // 3. Submissão convertendo para FormData (Resolve o erro de tipagem)
  const onSubmit = (data: RegisterInput) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await action(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      {/* Campo Nome */}
      <div className="grid gap-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          {...register("name")}
          id="name"
          placeholder="Como quer ser chamada(o)?"
          disabled={isPending}
          className={clientErrors.name ? "border-destructive" : ""}
        />
        {clientErrors.name && (
          <span className="text-destructive text-xs font-medium">
            {clientErrors.name.message}
          </span>
        )}
      </div>

      {/* Campo E-mail */}
      <div className="grid gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          {...register("email")}
          id="email"
          type="email"
          placeholder="seu@email.com"
          disabled={isPending}
          className={clientErrors.email ? "border-destructive" : ""}
        />
        {clientErrors.email && (
          <span className="text-destructive text-xs font-medium">
            {clientErrors.email.message}
          </span>
        )}
      </div>

      {/* Grid de Senhas (Lado a lado no desktop, pilha no mobile) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            {...register("password")}
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={isPending}
            className={clientErrors.password ? "border-destructive" : ""}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirmar</Label>
          <Input
            {...register("confirmPassword")}
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            disabled={isPending}
            className={clientErrors.confirmPassword ? "border-destructive" : ""}
          />
        </div>
      </div>

      {/* Erros de senha aparecem abaixo do grid */}
      {(clientErrors.password || clientErrors.confirmPassword) && (
        <span className="text-destructive text-xs font-medium">
          {clientErrors.password?.message ||
            clientErrors.confirmPassword?.message}
        </span>
      )}

      {/* Erros vindos do Servidor (ex: Email já existe) */}
      {state.errors?.email && (
        <span className="text-destructive text-xs font-medium">
          {state.errors.email[0]}
        </span>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl py-6 text-base font-semibold transition-all active:scale-[0.98]"
      >
        {isPending ? "Criando conta..." : "Criar minha conta"}
      </Button>
    </form>
  );
}
