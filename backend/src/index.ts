import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./database/connection"; // <--- deve vir aqui em cima!
import clientRoutes from "./routes/clientRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Teste de conexão com o banco
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");
    res.send("✅ Conexão com o banco de dados funcionando!");
  } catch (error: any) {
    console.error("❌ Erro na conexão com o banco:", error.message);
    res.status(500).send(`Erro ao conectar no banco de dados: ${error.message}`);
  }
});

// Rota padrão
app.get("/", (req, res) => {
  res.send("API rodando!");
});

// Rotas de cliente
app.use("/api", clientRoutes);

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

