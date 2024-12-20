const express = require("express");
const { sequelize } = require("../models/index.js");
const usuarioRouter = require("./routes/user.router");
const torneioRouter = require("./routes/torneio.router");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware(
app.use(cors({
  origin: "*", // Permitir apenas este domínio
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/", usuarioRouter);
app.use("/", torneioRouter);

// Exportar o `app` para o Vercel
module.exports = app;

// Testar a conexão com o banco separadamente
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  })
  .catch((err) => {
    console.error("Não foi possível conectar ao banco de dados:", err);
  });
