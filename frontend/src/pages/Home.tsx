import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";

type Cliente = {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
};

export function Home() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    api.get("/clients")
      .then(res => setClientes(res.data))
      .catch(err => console.error("Erro ao buscar clientes:", err));
  }, []);

  const excluirCliente = async (id: number) => {
    const confirmacao = confirm("Tem certeza que deseja excluir este cliente?");
    if (!confirmacao) return;

    try {
      await api.delete(`/clients/${id}`);
      alert("Cliente excluído com sucesso!");
      setClientes(prev => prev.filter(cliente => cliente.id !== id));
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      alert("Erro ao excluir cliente.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Nome</th>
              <th className="py-2 px-4 text-left">CNPJ</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{cliente.nome}</td>
                <td className="py-2 px-4">{cliente.cnpj}</td>
                <td className="py-2 px-4">{cliente.email}</td>
                <td className="py-2 px-4 text-center space-x-2">
                  <Link
                    to={`/editar/${cliente.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => excluirCliente(cliente.id)}
                    className="text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
