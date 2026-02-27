// web/app/(auth)/types.ts
import { z } from "zod";
import { AuthResponse } from "@/lib/types"; // Importa a "verdade" global

// Re-exporta o AuthResponse com o nome de LoginResponse para manter o padrão do seu código
export type LoginResponse = AuthResponse;

// --- LOGIN ---
export const loginSchema = z.object({
  email: z.email("Formato de e-mail inválido").min(1, "O e-mail é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// --- REGISTER ---
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "O nome é obrigatório")
      .min(3, "O nome deve ter no mínimo 3 caracteres"),
    email: z
      .email("Formato de e-mail inválido")
      .min(1, "O e-mail é obrigatório"),
    password: z
      .string()
      .min(1, "A senha é obrigatória")
      .min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(1, "A confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export interface RegisterResponse {
  userId?: string;
  message?: string;
}

// --- UI STATE ---
export type AuthFormState = {
  success: boolean;
  message: string | null;
  errors?: Record<string, string[]>;
};
