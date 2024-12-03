// src/index.js

const express = require('express');
const { sequelize } = require('./models'); // Certifique-se de importar corretamente
const usuarioRouter = require('./src/routes/user.router');
const torneioRouter = require('./src/routes/torneio.router');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", usuarioRouter);
app.use("/", torneioRouter);

// Testando a conexão antes de iniciar o servidor
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Iniciar o servidor aqui após a conexão ser bem-sucedida.
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}.`);
    });
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });
