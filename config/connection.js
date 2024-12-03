const { Sequelize } = require('sequelize');

// Carregando as configurações do banco de dados
const config = require('./config/config.json')['development']; // ou 'test', 'production' conforme necessário

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

// Testando a conexão
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });
