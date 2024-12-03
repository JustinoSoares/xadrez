// migrations/XXXXXX-create-usuario-torneio.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UsuarioTorneios', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      torneioId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Torneios', // Nome da tabela referenciada
          key: 'id', // Chave primária na tabela referenciada
        },
        onDelete: 'CASCADE', // O que acontece ao deletar um torneio
      },
      status: {
        type: Sequelize.ENUM('on', 'off'),
        allowNull: false,
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
    await queryInterface.dropTable('UsuarioTorneios');
  }
};
