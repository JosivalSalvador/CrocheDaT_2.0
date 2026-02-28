"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { loginAction } from "../_actions/login.action";
import { loginSchema, LoginInput, AuthFormState } from "../types";

// Componentes da sua UI (Shadcn)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthFormState = {
  success: false,
  message: null,
  errors: {},
};

export function LoginForm() {
  // useTransition controla o estado de carregamento da transição da Action
  const [isPending, startTransition] = useTransition();
  const [state, action] = useActionState(loginAction, initialState);

  // 1. Hook Form para validação client-side
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

  // 2. Efeito para notificações do Sonner (sucesso ou erro global)
  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state.success, state.message]);

  // 3. Submissão unindo RHF com Server Action
  const onSubmit = (data: LoginInput) => {
    startTransition(async () => {
      // Criamos o FormData para manter a compatibilidade com a Action
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      await action(formData);
    });
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo de E-mail */}
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            disabled={isPending}
            className={
              clientErrors.email
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {clientErrors.email && (
            <p className="text-destructive text-xs font-medium">
              {clientErrors.email.message}
            </p>
          )}
        </div>

        {/* Campo de Senha */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
          </div>
          <Input
            {...register("password")}
            id="password"
            type="password"
            disabled={isPending}
            className={
              clientErrors.password
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {clientErrors.password && (
            <p className="text-destructive text-xs font-medium">
              {clientErrors.password.message}
            </p>
          )}
        </div>

        {/* Erros específicos vindo do Servidor (ex: conta bloqueada) */}
        {state.errors?.email && (
          <p className="text-destructive text-xs font-medium">
            {state.errors.email[0]}
          </p>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl font-semibold transition-all active:scale-[0.98]"
        >
          {isPending ? "Autenticando..." : "Entrar na conta"}
        </Button>
      </form>
    </div>
  );
}
