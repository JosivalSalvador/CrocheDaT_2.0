// web/lib/types/index.ts

// 1. Sincronizado com o Enum 'Role' do seu Prisma
export type UserRole = "ADMIN" | "SUPPORTER" | "USER";

export interface User {
  id: string; // Obrigatório: seu sessions.service sempre retorna o ID
  name: string;
  email: string;
  role: UserRole;
}

/**
 * Representa a resposta padrão de autenticação do seu servidor Fastify
 * Sincronizado com sessions.controller.ts
 */
export interface AuthResponse {
  token: string; // O JWT
  user: User;
  // Removi o refreshToken daqui porque, conforme vimos no seu controller,
  // ele vem via Cookie (Set-Cookie) e não no corpo do JSON.
}

export type HttpError = {
  status: number;
  message: string;
};
