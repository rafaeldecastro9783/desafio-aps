# Desafio APS Tecnologia

Projeto desenvolvido para a desafio da APS Tecnologia, com o objetivo de construir uma aplicação completa de cadastro de clientes, com funcionalidades modernas e boas práticas de desenvolvimento.

---

## 🔧 Tecnologias utilizadas

### 🖥️ Frontend
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Axios](https://axios-http.com/)

### 🔙 Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zod](https://zod.dev/) para validações
- [MySQL](https://www.mysql.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)

### 🌐 Integrações externas
- [ViaCEP](https://viacep.com.br) – Busca de endereço via CEP
- [BrasilAPI](https://brasilapi.com.br) – Consulta de CNPJ

---

## ✨ Funcionalidades

- ✅ Cadastro de clientes com validações completas
- ✅ Consulta automática de CNPJ (nome e nome fantasia)
- ✅ Preenchimento automático de endereço via CEP
- ✅ Listagem de clientes em tabela estilizada
- ✅ Edição com validações e atualização de dados
- ✅ Exclusão com confirmação
- ✅ Feedbacks amigáveis e mensagens de erro claras

---

## 🧪 Como rodar o projeto

### 📁 Clone o repositório

```bash
git clone https://github.com/rafaeldecastro9783/desafio-aps.git
cd desafio-aps

🚀 Backend

cd backend
npm install
npm run dev

Crie um arquivo .env com o seguinte conteúdo:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=seu_banco
PORT=3000

    ⚠️ Altere sua_senha e seu_banco conforme sua instalação local do MySQL.

🛠️ Banco de dados

O script de criação da tabela está disponível em:

backend/database/schema.sql

Execute esse script no seu banco MySQL para criar a estrutura da tabela clients e inserir um exemplo.
💻 Frontend

cd frontend
npm install
npm run dev

Acesse no navegador: http://localhost:5173

👨‍💻 Autor

Rafael de Castro
Desenvolvido com dedicação e foco para o Desafio APS.

📄 Licença

Este projeto é acadêmico e foi desenvolvido para fins educacionais.

