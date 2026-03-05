import { z } from "zod";

// Base para os campos de imagem
const imageObject = z.object({
  name: z.string().min(1, { message: "Nome da imagem é obrigatório" }),
  url: z.url({ message: "URL da imagem inválida" }), // Ajustado para z.string().url()
});

// ==========================================
// Schema para Criar Produto
// ==========================================
export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres" })
    .transform((value) => value.trim()),

  description: z
    .string()
    .min(10, { message: "A descrição deve ter no mínimo 10 caracteres" })
    .transform((value) => value.trim()),

  material: z
    .string()
    .min(3, { message: "O material deve ter no mínimo 3 caracteres" })
    .transform((value) => value.trim()),

  productionTime: z
    .number()
    .int()
    .positive({
      message: "O tempo de produção deve ser um número inteiro positivo",
    }),

  price: z.number().positive({ message: "O preço deve ser um valor positivo" }),

  categoryId: z.uuid({ message: "ID de categoria inválido" }), // Ajustado para z.string().uuid()

  images: z.array(imageObject).optional(),
});

// ==========================================
// Schema para Atualizar Produto (Apenas dados, sem imagens acumuladas)
// ==========================================
export const updateProductSchema = createProductSchema
  .omit({ images: true })
  .partial();

// ==========================================
// Schemas Auxiliares para Imagens (Granularidade)
// ==========================================
export const addImageSchema = imageObject;
export const imageIdParamSchema = z.object({
  imageId: z.uuid({ message: "ID da imagem inválido" }), // Ajustado para z.string().uuid()
});

// ==========================================
// Schema para Parâmetros (ID do Produto)
// ==========================================
export const productIdSchema = z.object({
  id: z.uuid({ message: "ID do produto inválido" }), // Ajustado para z.string().uuid()
});

// ==========================================
// Schemas de Resposta (Retorno da API)
// ==========================================
export const productImageResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  url: z.url(),
  productId: z.uuid(),
});

export const productResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  material: z.string(),
  productionTime: z.number().int(),
  // O Prisma retorna Decimal como objeto, mas no JSON vira string/number. Essa união resolve o Swagger.
  price: z.coerce.number(),
  categoryId: z.uuid(),
  category: z.object({ name: z.string() }).optional(),
  images: z.array(productImageResponseSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});
