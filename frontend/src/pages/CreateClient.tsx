import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema } from "../schemas/clientSchema";
import { z } from "zod";
import { api } from "../services/api";
import cep from "cep-promise";
import { useEffect, useState } from "react";
import axios from "axios";

type ClientFormData = z.infer<typeof clientSchema>;

export function CreateClient() {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const cepValue = watch("cep");
  const cnpjValue = watch("cnpj");

  const [cepErro, setCepErro] = useState("");
  const [cnpjErro, setCnpjErro] = useState("");

  // Buscar endereço pelo CEP
  useEffect(() => {
    const buscarEndereco = async () => {
      const cepNumerico = cepValue?.replace(/\D/g, "");
      if (cepNumerico?.length === 8) {
        try {
          const endereco = await cep(cepNumerico);
          setValue("logradouro", endereco.street);
          setValue("bairro", endereco.neighborhood);
          setValue("cidade", endereco.city);
          setValue("uf", endereco.state);
          setCepErro("");
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
          setCepErro("CEP inválido ou não encontrado.");
          setValue("logradouro", "");
          setValue("bairro", "");
          setValue("cidade", "");
          setValue("uf", "");
        }
      }
    };

    buscarEndereco();
  }, [cepValue, setValue]);

  // Buscar empresa pelo CNPJ
  useEffect(() => {
    const buscarEmpresa = async () => {
      const cnpjLimpo = cnpjValue?.replace(/\D/g, "");
      if (cnpjLimpo?.length === 14) {
        try {
          const res = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
          setValue("nome", res.data.razao_social || "");
          setValue("nome_fantasia", res.data.nome_fantasia || "");
        } catch (error) {
          console.error("Erro ao buscar CNPJ:", error);
        }
      }
    };

    buscarEmpresa();
  }, [cnpjValue, setValue]);

  const onSubmit = async (data: ClientFormData) => {
    try {
      await api.post("/clients", data);
      alert("Cliente cadastrado com sucesso!");
      reset();
      setCnpjErro("");
      setCepErro("");
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 409) {
        setCnpjErro("CNPJ já cadastrado.");
      } else if (error.response?.data?.errors) {
        const mensagens = Object.values(error.response.data.errors).flat();
        alert("Erro de validação:\n" + mensagens.join("\n"));
      } else {
        alert("Erro ao cadastrar cliente.");
      }
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Cadastrar Cliente</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* CNPJ */}
        <Controller
          name="cnpj"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder="CNPJ (somente números)"
              maxLength={14}
              className="border p-2 w-full"
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                field.onChange(onlyNumbers);
                setCnpjErro("");
              }}
              value={field.value || ""}
            />
          )}
        />
        {errors.cnpj && <p className="text-red-500">{errors.cnpj.message}</p>}
        {cnpjErro && <p className="text-red-500">{cnpjErro}</p>}

        <input {...register("nome")} placeholder="Nome" className="border p-2 w-full" />
        {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}

        <input {...register("nome_fantasia")} placeholder="Nome Fantasia" className="border p-2 w-full" />
        {errors.nome_fantasia && <p className="text-red-500">{errors.nome_fantasia.message}</p>}

        {/* CEP */}
        <Controller
          name="cep"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder="CEP"
              maxLength={8}
              className="border p-2 w-full"
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                field.onChange(onlyNumbers);
                setCepErro("");
              }}
              value={field.value || ""}
            />
          )}
        />
        {errors.cep && <p className="text-red-500">{errors.cep.message}</p>}
        {cepErro && <p className="text-red-500">{cepErro}</p>}

        <input {...register("logradouro")} placeholder="Logradouro" className="border p-2 w-full" disabled />
        <input {...register("bairro")} placeholder="Bairro" className="border p-2 w-full" disabled />
        <input {...register("cidade")} placeholder="Cidade" className="border p-2 w-full" disabled />
        <input {...register("uf")} placeholder="UF" className="border p-2 w-full" disabled />

        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-500">Endereço preenchido pelo CEP</span>
          <button
            type="button"
            onClick={() => {
              setValue("logradouro", "");
              setValue("bairro", "");
              setValue("cidade", "");
              setValue("uf", "");
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            Limpar endereço
          </button>
        </div>

        <input {...register("complemento")} placeholder="Complemento" className="border p-2 w-full" />

        <input {...register("email")} placeholder="E-mail" className="border p-2 w-full" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input {...register("telefone")} placeholder="Telefone" className="border p-2 w-full" />
        {errors.telefone && <p className="text-red-500">{errors.telefone.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isSubmitting ? "Enviando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
