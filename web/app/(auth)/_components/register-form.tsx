"use client";

import { useActionState, useEffect, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"; // Simples assim

import { registerAction } from "../_actions/register.action";
import { registerSchema, RegisterInput, AuthFormState } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: AuthFormState = {
  success: false,
  message: null,
  errors: {},
};

export function RegisterForm() {
  const [state, action, isPending] = useActionState(
    registerAction,
    initialState,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  // Efeito para disparar o Sonner baseado na resposta do Servidor
  useEffect(() => {
    if (state.message) {
      if (state.success) toast.success(state.message);
      else toast.error(state.message);
    }
  }, [state]);

  const onSubmit = (data: RegisterInput) => {
    startTransition(() => action(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Input
          {...register("name")}
          placeholder="Nome completo"
          disabled={isPending}
        />
        {errors.name && (
          <span className="text-xs text-red-500">{errors.name.message}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Input
          {...register("email")}
          type="email"
          placeholder="nome@exemplo.com"
          disabled={isPending}
        />
        {errors.email && (
          <span className="text-xs text-red-500">{errors.email.message}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Input
          {...register("password")}
          type="password"
          placeholder="Senha"
          disabled={isPending}
        />
        {errors.password && (
          <span className="text-xs text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <Input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirmar Senha"
          disabled={isPending}
        />
        {errors.confirmPassword && (
          <span className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "A criar conta..." : "Registrar"}
      </Button>
    </form>
  );
}
