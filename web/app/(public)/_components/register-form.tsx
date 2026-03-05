"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { registerUserSchema } from "@/schemas/users.schema";

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
import { Loader2, Mail, Lock, User } from "lucide-react";

type RegisterFormValues = z.infer<typeof registerUserSchema>;

export function RegisterForm() {
  const { register } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    register.mutate(data);
  };

  return (
    <Card className="border-border/40 bg-card/60 animate-in fade-in zoom-in-95 w-full shadow-2xl backdrop-blur-xl duration-500">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Criar Conta
        </CardTitle>
        <CardDescription>
          Preencha os dados abaixo para começar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="text-muted-foreground/60 absolute top-3 left-3 h-4 w-4" />
                      <Input
                        placeholder="Seu nome"
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
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground/60 absolute top-3 left-3 h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="Mínimo 8 caracteres"
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
              disabled={register.isPending}
            >
              {register.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Criar conta"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-center">
        <p className="text-muted-foreground w-full text-sm">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-primary font-bold">
            Fazer Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
