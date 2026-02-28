"use server";

import { redirect } from "next/navigation";
import { authService } from "../_services/auth.service";
import { AuthFormState, registerSchema } from "../types";
import { HttpError } from "@/lib/types";

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const rawData = Object.fromEntries(formData.entries());

  const result = registerSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: "Por favor, corrija os erros no formulário.",
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await authService.register(result.data);
  } catch (error: unknown) {
    // Agora validamos se é um erro da API (com status) ou um erro de sistema
    const isHttpError = (err: unknown): err is HttpError =>
      !!err && typeof err === "object" && "message" in err && "status" in err;

    if (isHttpError(error)) {
      return {
        success: false,
        message: error.message,
      };
    }

    // Erros genéricos caem aqui, satisfazendo o teste e protegendo o app
    return {
      success: false,
      message: "Falha ao criar conta. Tente novamente.",
    };
  }
  redirect("/login?registered=true");
}
