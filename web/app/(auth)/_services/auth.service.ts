// web/app/(auth)/_services/auth.service.ts

import { httpClient } from "@/lib/api/http-client";
import {
  LoginInput,
  RegisterData,
  LoginResponse,
  RegisterResponse,
} from "../types";

export const authService = {
  /**
   * Autenticação via Fastify
   */
  async login(data: LoginInput): Promise<LoginResponse> {
    return httpClient<LoginResponse>("/sessions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Cadastro de novos usuários
   */
  async register(data: RegisterData): Promise<RegisterResponse> {
    return httpClient<RegisterResponse>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Logout no Servidor
   * AJUSTE: Agora aceita o refreshToken vindo da Server Action
   */
  async logout(refreshToken?: string): Promise<void> {
    return httpClient("/sessions/logout", {
      method: "POST",
      headers: {
        // SOLUÇÃO: Injetamos o cookie manualmente.
        // Como a Server Action roda no Node, ela precisa desse "empurrão"
        // para o backend enxergar quem está deslogando.
        Cookie: refreshToken ? `refreshToken=${refreshToken}` : "",
      },
    });
  },
};
