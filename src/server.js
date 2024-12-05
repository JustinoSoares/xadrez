// src/index.js

const express = require("express");
const { sequelize } = require("../models"); // Certifique-se de importar corretamente
const usuarioRouter = require("./routes/user.router");
const torneioRouter = require("./routes/torneio.router");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", usuarioRouter);
app.use("/", torneioRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}.`);
});
