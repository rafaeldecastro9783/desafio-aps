import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { clientSchema } from "../schemas/clientSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import cep from "cep-promise";

type ClientFormData = z.infer<typeof clientSchema>;

export function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    control,
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const cepValue = watch("cep");
  const [cepErro, setCepErro] = useState("");
  const [cnpjErro, setCnpjErro] = useState("");

  // Buscar cliente ao carregar
  useEffect(() => {
    async function fetchClient() {
      try {
        const response = await api.get(`/clients`);
        const cliente = response.data.find((c: any) => c.id === Number(id));
        if (!cliente) {
          alert("Cliente não encontrado");
          return navigate("/");
        }

        for (const key in cliente) {
          if (key in cliente) {
            setValue(key as keyof ClientFormData, cliente[key]);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar cliente:", error);
        alert("Erro ao carregar cliente");
      }
    }

    fetchClient();
  }, [id, navigate, setValue]);

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

  // Atualizar cliente
  const onSubmit = async (data: ClientFormData) => {
    try {
      await api.put(`/clients/${id}`, data);
      alert("Cliente atualizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 409) {
        setCnpjErro("Outro cliente já possui esse CNPJ.");
      } else {
        alert("Erro ao atualizar cliente.");
      }
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Editar Cliente</h2>
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
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}
