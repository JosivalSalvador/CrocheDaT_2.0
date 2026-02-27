"use server";

import { redirect } from "next/navigation";
import { authService } from "../_services/auth.service";
import { RegisterInput, AuthFormState, registerSchema } from "../types";
import { HttpError } from "@/lib/types";

export async function registerAction(
  _prevState: AuthFormState,
  data: RegisterInput,
): Promise<AuthFormState> {
  // 1. Validação com Zod
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: "Por favor, corrija os erros no formulário.",
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    // 2. Chamada ao serviço
    await authService.register(result.data);
  } catch (error: unknown) {
    // Ajuste para capturar o erro do seu httpClient customizado
    const isHttpError = (err: unknown): err is HttpError =>
      !!err && typeof err === "object" && "message" in err;

    const errorMessage = isHttpError(error)
      ? error.message
      : "Falha ao criar conta. Tente novamente.";

    return {
      success: false,
      message: errorMessage,
    };
  }

  // 3. Redirecionamento seguro (o parâmetro ?registered=true é ótimo para exibir um Toast)
  redirect("/login?registered=true");
}
