import { z } from "zod";
import {
  createChatSchema,
  sendMessageSchema,
  chatParamsSchema,
  messageResponseSchema,
  chatResponseSchema,
} from "../schemas/chats.schema";

export type CreateChatInput = z.infer<typeof createChatSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type ChatParams = z.infer<typeof chatParamsSchema>;

// ==========================================
// Tipos de Resposta inferidos magicamente do Zod
// ==========================================
export type MessageResponse = z.infer<typeof messageResponseSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;
