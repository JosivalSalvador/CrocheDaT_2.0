"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { z } from "zod";

import { registerUserSchema } from "@/schemas/users.schema";
import { useAuth } from "@/hooks/use-auth";

// Importando os componentes do seu Design System
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowRight,
  Loader2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

// ============================================================================
// 🧠 MAGIA DE FRONTEND: Estendendo o schema do backend para validar a confirmação
// ============================================================================
const formSchema = registerUserSchema
  .extend({
    confirmPassword: z.string().min(1, { message: "Confirme sua senha" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem. Digite novamente.",
    path: ["confirmPassword"], // Aponta o erro especificamente para este campo
  });

type FormValues = z.infer<typeof formSchema>;

export function RegisterForm() {
  const { register: registerAuth } = useAuth();

  // Estados para os botões de olhinho
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Inicializando o formulário do Shadcn + React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched", // Mostra o erro assim que o usuário digita e sai do campo
  });

  const isLoading = registerAuth.isPending;

  const onSubmit = (values: FormValues) => {
    // 🧹 Limpeza elegante: Usando o underscore, o ESLint entende que estamos
    // ignorando essa variável de propósito e não vai reclamar.
    const { confirmPassword, ...dataToSubmit } = values;
    void confirmPassword;

    registerAuth.mutate(dataToSubmit);
  };

  return (
    // Responsividade Base: max-w-md segura o tamanho no desktop, w-full expande no mobile.
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto w-full max-w-md px-4 duration-700 sm:px-0">
      {/* Cabeçalho */}
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          Criar Conta
        </h1>
        <p className="text-muted-foreground mt-2 px-2 text-xs text-balance sm:text-sm">
          Junte-se a nós para realizar encomendas exclusivas e gerenciar seu
          perfil.
        </p>
      </div>

      {/* Caixa do Formulário - Ajustes de Padding responsivos */}
      <div className="border-border/40 bg-card/40 shadow-primary/5 rounded-3xl border p-5 shadow-2xl backdrop-blur-xl sm:rounded-4xl sm:p-6 md:p-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-5"
          >
            {/* 1. CAMPO NOME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1 sm:space-y-1.5">
                  <FormLabel className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                    UserName
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="text-muted-foreground/60 absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
                      <Input
                        placeholder="Como quer ser chamado?"
                        className="bg-background/50 border-border/60 focus-visible:ring-primary/40 h-11 rounded-xl pl-10 text-sm transition-all sm:h-12"
                        disabled={isLoading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-medium sm:text-xs" />
                </FormItem>
              )}
            />

            {/* 2. CAMPO E-MAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1 sm:space-y-1.5">
                  <FormLabel className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                    E-mail
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="text-muted-foreground/60 absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        className="bg-background/50 border-border/60 focus-visible:ring-primary/40 h-11 rounded-xl pl-10 text-sm transition-all sm:h-12"
                        disabled={isLoading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-medium sm:text-xs" />
                </FormItem>
              )}
            />

            {/* 3. CAMPO SENHA */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1 sm:space-y-1.5">
                  <FormLabel className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                    Senha
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground/60 absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Crie uma senha forte"
                        className="bg-background/50 border-border/60 focus-visible:ring-primary/40 h-11 rounded-xl pr-12 pl-10 text-sm transition-all sm:h-12"
                        disabled={isLoading}
                        {...field}
                      />
                      {/* Olhinho Toggle */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 p-1 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-medium text-balance sm:text-xs" />
                </FormItem>
              )}
            />

            {/* 4. CAMPO CONFIRMAR SENHA */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1 sm:space-y-1.5">
                  <FormLabel className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase sm:text-xs">
                    Confirmar Senha
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground/60 absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repita sua senha"
                        className={cn(
                          "bg-background/50 border-border/60 focus-visible:ring-primary/40 h-11 rounded-xl pr-12 pl-10 text-sm transition-all sm:h-12",
                          form.formState.errors.confirmPassword &&
                            "border-destructive/50 focus-visible:ring-destructive/30",
                        )}
                        disabled={isLoading}
                        {...field}
                      />
                      {/* Olhinho Toggle */}
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 p-1 transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-medium sm:text-xs" />
                </FormItem>
              )}
            />

            {/* Botão de Submit */}
            <Button
              type="submit"
              className="mt-4 h-11 w-full rounded-xl text-sm font-bold tracking-wide shadow-md transition-transform active:scale-[0.98] sm:mt-6 sm:h-12 sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                  Criando conta...
                </>
              ) : (
                <>
                  Criar minha conta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Footer do Formulário */}
      <div className="text-muted-foreground animate-in fade-in mt-6 text-center text-xs delay-300 duration-1000 sm:mt-8 sm:text-sm">
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="text-primary hover:text-primary/80 font-semibold underline-offset-4 transition-colors hover:underline"
        >
          Entrar agora
        </Link>
      </div>
    </div>
  );
}
