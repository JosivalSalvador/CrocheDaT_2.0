"use server";

import { redirect } from "next/navigation";
import { setSession } from "@/lib/auth/session";
import { LoginInput, AuthFormState, loginSchema } from "../types";
import { HttpError, AuthResponse } from "@/lib/types";
import { httpClientFull } from "@/lib/api/http-client";

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData, // AJUSTADO: Agora aceita FormData do componente
): Promise<AuthFormState> {
  let destination: string | null = null;

  // 1. Converte FormData para objeto plano de forma segura
  const rawData = Object.fromEntries(formData.entries());

  // 2. Validação com Zod (Garante que os tipos batem com LoginInput)
  const result = loginSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: "Por favor, corrija os erros no formulário.",
      errors: result.error.flatten().fieldErrors,
    };
  }

  // A partir daqui, o TS sabe que 'result.data' é exatamente 'LoginInput'
  const loginData: LoginInput = result.data;

  try {
    /**
     * 3. Chamada Direta via httpClientFull
     * Usamos o loginData validado no corpo da requisição
     */
    const { data: body, headers } = await httpClientFull<AuthResponse>(
      "/sessions",
      {
        method: "POST",
        body: JSON.stringify(loginData),
      },
    );

    /**
     * 4. Extrair o refreshToken do cabeçalho Set-Cookie do Fastify
     */
    const setCookieHeader = headers.get("set-cookie");
    const match = setCookieHeader?.match(/refreshToken=([^;]+)/);
    const refreshToken = match ? match[1] : "";

    if (!refreshToken) {
      throw new Error(
        "Sessão não pôde ser estabelecida (Refresh Token ausente).",
      );
    }

    // 5. Persistência da Sessão no BFF (Cookies do Next.js)
    await setSession(body.token, refreshToken, body.user);

    destination = body.user.role === "ADMIN" ? "/dashboard" : "/home";
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

  // 6. Redirecionamento (Sempre fora do try/catch)
  if (destination) {
    redirect(destination);
  }

  return {
    success: true,
    message: "Login realizado com sucesso!",
  };
}
