const express = require("express");
const { sequelize } = require("../models/index.js");
const usuarioRouter = require("./routes/user.router");
const torneioRouter = require("./routes/torneio.router");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
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
