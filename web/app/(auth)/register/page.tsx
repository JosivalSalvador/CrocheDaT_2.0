// web/app/(auth)/register/page.tsx
import { RegisterForm } from "../_components/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Criar conta</h1>
        <p className="text-muted-foreground text-sm">
          Preencha os dados para começar
        </p>
      </div>
      <RegisterForm />
      <p className="text-muted-foreground text-center text-sm">
        Já tem conta?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Fazer login
        </Link>
      </p>
    </div>
  );
}
