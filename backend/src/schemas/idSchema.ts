import { z } from "zod";

export const idSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID inválido. Deve ser um número."),
});
