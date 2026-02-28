import { z } from "zod";
import { AuthResponse } from "@/lib/types";

// Re-exporta para manter a semântica de "Login" dentro deste módulo
export type LoginResponse = AuthResponse;

// --- LOGIN ---
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "O e-mail é obrigatório" })
    .check(z.email({ message: "Formato de e-mail inválido" })),

  password: z.string().min(1, { message: "A senha é obrigatória" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

// --- REGISTER ---
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "O nome deve ter no mínimo 3 caracteres" }),

    email: z
      .string()
      .min(1, { message: "O e-mail é obrigatório" })
      .check(z.email({ message: "Formato de e-mail inválido" })),

    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
      .regex(/[a-z]/, {
        message: "A senha deve conter pelo menos uma letra minúscula",
      })
      .regex(/[A-Z]/, {
        message: "A senha deve conter pelo menos uma letra maiúscula",
      })
      .regex(/[0-9]/, { message: "A senha deve conter pelo menos um número" })
      .regex(/[^A-Za-z0-9]/, {
        message: "A senha deve conter pelo menos um caractere especial",
      }),

    confirmPassword: z
      .string()
      .min(1, { message: "A confirmação de senha é obrigatória" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// Tipo usado no FORMULÁRIO (com confirmPassword)
export type RegisterInput = z.infer<typeof registerSchema>;

// Tipo usado no SERVICE (O que o Fastify realmente recebe)
export type RegisterData = Omit<RegisterInput, "confirmPassword">;

/**
 * Sincronizado com users.controller.ts (Server)
 */
export interface RegisterResponse {
  userId: string;
  message: string;
}

// --- UI STATE (Para Server Actions) ---
export type AuthFormState = {
  success: boolean;
  message: string | null;
  errors?: Record<string, string[]>;
};
