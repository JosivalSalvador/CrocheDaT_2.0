import { RegisterForm } from "../_components/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Criar uma conta
        </h1>
        <p className="text-muted-foreground text-sm">
          Introduza os seus dados para começar a gerir o Crochê da T
        </p>
      </div>

      <RegisterForm />

      <p className="text-muted-foreground px-8 text-center text-sm">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="hover:text-primary underline underline-offset-4"
        >
          Fazer Login
        </Link>
      </p>
    </div>
  );
}
