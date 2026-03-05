import { z } from "zod";
import { loginResponseSchema, loginSchema } from "../schemas/sessions.schema";

// Tipos de Entrada
export type LoginInput = z.infer<typeof loginSchema>;

// Tipos de Resposta
export type LoginResponse = z.infer<typeof loginResponseSchema>;
