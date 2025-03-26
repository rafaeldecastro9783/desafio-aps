import { z } from "zod";

export const clientSchema = z.object({
  cnpj: z
    .string()
    .min(14, "CNPJ obrigatório")
    .regex(/^\d{14}$/, "CNPJ deve conter apenas números"),
  nome: z.string().min(1, "Nome obrigatório"),
  nome_fantasia: z.string().min(1, "Nome fantasia obrigatório"),
  cep: z.string().min(8, "CEP obrigatório"),
  complemento: z.string().optional(),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(8, "Telefone obrigatório"),
});
