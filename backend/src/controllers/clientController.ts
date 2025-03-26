import { Request, Response } from "express";
import { db } from "../database/connection";
import { Client } from "../models/clientModel";
import { clientSchema } from "../schemas/clientSchema";
import { buscarEnderecoPorCEP } from "../services/viaCepService";
import { idSchema } from "../schemas/idSchema";



export const getAllClients = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM clients");
    res.status(200).json(rows as Client[]);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ message: "Erro ao buscar clientes" });
  }
};

export const createClient = async (req: Request, res: Response) => {
  const validation = clientSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Erro de validação",
      errors: validation.error.flatten().fieldErrors,
    });
  }

  try {
    const {
      cnpj,
      nome,
      nome_fantasia,
      cep,
      complemento,
      email,
      telefone,
    } = validation.data;

    // Busca de endereço
    const endereco = await buscarEnderecoPorCEP(cep);
    if (!endereco) {
      return res.status(400).json({ message: "CEP inválido ou não encontrado" });
    }

    const { logradouro, bairro, cidade, uf } = endereco;

    // Verifica se já existe o CNPJ
    const [existing]: any = await db.query(
      "SELECT id FROM clients WHERE cnpj = ?",
      [cnpj]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Já existe um cliente com esse CNPJ" });
    }

    // Insere no banco
    const sql = `
      INSERT INTO clients (
        cnpj, nome, nome_fantasia, cep, logradouro,
        bairro, cidade, uf, complemento, email, telefone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      cnpj,
      nome,
      nome_fantasia,
      cep,
      logradouro,
      bairro,
      cidade,
      uf,
      complemento || "",
      email,
      telefone,
    ];

    const [result] = await db.query(sql, values);

    res.status(201).json({
      message: "Cliente criado com sucesso!",
      id: (result as any).insertId,
    });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    res.status(500).json({ message: "Erro ao criar cliente" });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const validation = clientSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Erro de validação",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const {
      cnpj,
      nome,
      nome_fantasia,
      cep,
      complemento,
      email,
      telefone,
    } = validation.data;

    // Busca o endereço atualizado pelo CEP
    const endereco = await buscarEnderecoPorCEP(cep);
    if (!endereco) {
      return res.status(400).json({ message: "CEP inválido ou não encontrado" });
    }

    const { logradouro, bairro, cidade, uf } = endereco;

    // Verifica se existe outro cliente com o mesmo CNPJ (mas ID diferente)
    const [existing]: any = await db.query(
      "SELECT id FROM clients WHERE cnpj = ? AND id != ?",
      [cnpj, id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Outro cliente já possui esse CNPJ",
      });
    }

    // Atualiza o cliente no banco
    const sql = `
      UPDATE clients SET
        cnpj = ?, nome = ?, nome_fantasia = ?, cep = ?, logradouro = ?,
        bairro = ?, cidade = ?, uf = ?, complemento = ?, email = ?, telefone = ?
      WHERE id = ?
    `;

    const values = [
      cnpj,
      nome,
      nome_fantasia,
      cep,
      logradouro,
      bairro,
      cidade,
      uf,
      complemento || "",
      email,
      telefone,
      id,
    ];

    const [result]: any = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente não encontrado para atualização." });
    }

    res.status(200).json({ message: "Cliente atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(500).json({ message: "Erro ao atualizar cliente" });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    // Valida o ID
    const validation = idSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        message: "ID inválido",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { id } = validation.data;

    // Verifica se o cliente existe
    const [existing]: any = await db.query("SELECT id FROM clients WHERE id = ?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({ message: "Cliente não encontrado para exclusão." });
    }

    // Deleta o cliente
    const [result]: any = await db.query("DELETE FROM clients WHERE id = ?", [id]);

    res.status(200).json({ message: "Cliente excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    res.status(500).json({ message: "Erro ao excluir cliente" });
  }
};
