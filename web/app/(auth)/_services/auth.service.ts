import { httpClient } from "@/lib/api/http-client";
import {
  LoginInput,
  RegisterInput,
  LoginResponse,
  RegisterResponse,
} from "../types";

export const authService = {
  /**
   * Autenticação via Fastify
   * Retorna { token, user } e o servidor seta o refreshToken via Cookie
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
  async register(data: RegisterInput): Promise<RegisterResponse> {
    return httpClient<RegisterResponse>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Nota: O método getMe foi removido pois o endpoint /me
   * ainda não está implementado no servidor.
   * A validação da sessão deve ser feita via cookies/BFF.
   */
};
