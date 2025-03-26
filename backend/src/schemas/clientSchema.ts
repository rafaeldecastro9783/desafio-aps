import { z } from "zod";
import { validarCNPJ } from "../utils/validateCNPJ";

export const clientSchema = z.object({
  cnpj: z
    .string()
    .min(14, "CNPJ deve ter 14 dígitos")
    .refine(validarCNPJ, { message: "CNPJ inválido" }),

  nome: z.string().min(1, "Nome é obrigatório"),
  nome_fantasia: z.string().min(1, "Nome fantasia é obrigatório"),
  cep: z.string().min(8, "CEP inválido"),
  logradouro: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().optional(),
  complemento: z.string().optional(),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(8, "Telefone é obrigatório"),
});
