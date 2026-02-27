"use server";

import { redirect } from "next/navigation";
import { authService } from "../_services/auth.service";
import { setSession } from "@/lib/auth/session";
import { LoginInput, AuthFormState, loginSchema } from "../types";
import { HttpError } from "@/lib/types";

export async function loginAction(
  _prevState: AuthFormState,
  data: LoginInput,
): Promise<AuthFormState> {
  let destination: string | null = null;

  // 1. Validação com Zod (Server-side)
  const result = loginSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      message: "Por favor, corrija os erros no formulário.",
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    /**
     * 2. Chamada ao serviço de autenticação
     * O 'authService.login' agora retorna 'token' conforme o tipo LoginResponse ajustado.
     */
    const { token, refreshToken, user } = await authService.login(data);

    /**
     * 3. Persistência da Sessão no BFF
     * Mesmo que o refreshToken venha via Cookie do Fastify, passamos o valor aqui
     * para garantir a consistência nos cookies do Next.js.
     */
    await setSession(token, refreshToken ?? "", user);

    // Define o destino com base no cargo (Role) do usuário
    destination = user.role === "ADMIN" ? "/admin/dashboard" : "/home";
  } catch (error) {
    const isHttpError = (err: unknown): err is HttpError =>
      !!err && typeof err === "object" && "message" in err;

    return {
      success: false,
      message: isHttpError(error)
        ? error.message
        : "Credenciais inválidas ou erro no servidor",
    };
  }

  /**
   * 4. Redirecionamento
   * Mantido fora do try/catch pois o Next.js utiliza exceções para controlar navegação.
   */
  if (destination) {
    redirect(destination);
  }

  return {
    success: true,
    message: "Login realizado com sucesso!",
  };
}
