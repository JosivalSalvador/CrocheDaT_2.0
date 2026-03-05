"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema } from "@/schemas/sessions.schema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Lock, Mail } from "lucide-react";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data);
  };

  return (
    <Card className="border-border/40 bg-card/60 animate-in fade-in zoom-in-95 w-full shadow-2xl backdrop-blur-xl duration-500">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Login
        </CardTitle>
        <CardDescription>
          Entre para acessar seu painel e mensagens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="text-muted-foreground/60 absolute top-3 left-3 h-4 w-4" />
                      <Input
                        placeholder="seu@email.com"
                        className="bg-background/40 h-12 pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Senha</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-primary text-xs hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground/60 absolute top-3 left-3 h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-background/40 h-12 pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="shadow-primary/20 h-12 w-full rounded-xl font-bold shadow-lg"
              disabled={login.isPending}
            >
              {login.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-center">
        <p className="text-muted-foreground w-full text-sm">
          Ainda não tem conta?{" "}
          <Link href="/register" className="text-primary font-bold">
            Cadastre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
