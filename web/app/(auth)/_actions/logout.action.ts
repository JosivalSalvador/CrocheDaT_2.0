"use server";

import { cookies } from "next/headers";
import { destroySession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { authService } from "../_services/auth.service";

export async function logoutAction() {
  try {
    // No Next.js 15+, a função cookies() deve ser aguardada (await)
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Chama o serviço passando a string do token
    await authService.logout(refreshToken);
  } catch (error) {
    console.error("Erro ao invalidar sessão no servidor:", error);
  } finally {
    // Limpa os cookies locais do Next.js
    await destroySession();
  }

  redirect("/login");
}
