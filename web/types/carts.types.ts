import { z } from "zod";
import {
  cartResponseSchema,
  addToCartSchema,
  cartItemParamsSchema,
  cartItemResponseSchema,
  updateCartItemSchema,
} from "../schemas/carts.schema";

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CartItemParams = z.infer<typeof cartItemParamsSchema>;

// ==========================================
// Tipos de Resposta inferidos magicamente do Zod
// ==========================================
export type CartItemResponse = z.infer<typeof cartItemResponseSchema>;
export type CartResponse = z.infer<typeof cartResponseSchema>;
