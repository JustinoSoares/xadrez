const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'postgresql://xadrez_user:HGzkWbfUw887rCT8PoJkNVVosdWjs93T@dpg-ct8no7d2ng1s739o4l1g-a.frankfurt-postgres.render.com/xadrez', 
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Necessário para Render PostgreSQL
      },
    },
    logging: console.log, // Exibir logs de SQL no console
  }
);

// Testar conexão
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com PostgreSQL via Sequelize bem-sucedida!');
  })
  .catch(err => {
    console.error('Erro ao conectar ao PostgreSQL via Sequelize:', err);
  });
