import axios from "axios";

export async function buscarEnderecoPorCEP(cep: string) {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    if (response.data.erro) {
      return null;
    }

    return {
      logradouro: response.data.logradouro,
      bairro: response.data.bairro,
      cidade: response.data.localidade,
      uf: response.data.uf,
    };
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
}
