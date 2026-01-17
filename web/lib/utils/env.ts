// web/src/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Variáveis de SERVIDOR (Só o Docker vê)
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    API_INTERNAL_URL: z.string().url(),
  },

  /*
   * Variáveis de CLIENTE (O navegador vê)
   */
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
  },

  /*
   * Linkagem manual para o Next.js conseguir ler
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    API_INTERNAL_URL: process.env.API_INTERNAL_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
