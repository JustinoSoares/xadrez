// migrations/XXXXXX-create-torneio.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Torneios', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pass: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      usuarioId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Usuarios', // Nome da tabela referenciada
          key: 'id', // Chave primária na tabela referenciada
        },
        onDelete: 'CASCADE', // O que acontece ao deletar um usuário
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Torneios');
  }
};
