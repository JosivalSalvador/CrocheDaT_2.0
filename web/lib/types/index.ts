// web/lib/types/index.ts

export type UserRole = "ADMIN" | "USER";

export interface User {
  id?: string; // Opcional para evitar conflitos se o ID não vier no login
  name: string;
  email: string;
  role: UserRole;
}

/**
 * Representa a resposta padrão de autenticação do seu servidor Fastify
 */
export interface AuthResponse {
  token: string; // O JWT (Access Token)
  refreshToken?: string; // Opcional no body (já que vai via Cookie)
  user: User;
}

export type HttpError = {
  status: number;
  message: string;
};
