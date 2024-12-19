// migrations/XXXXXX-create-adversarios.js

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Adversarios", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      torneioId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Torneios", // Nome da tabela referenciada
          key: "id", // Chave primária na tabela referenciada
        },
        onDelete: "CASCADE", // O que acontece ao deletar um torneio
      },
      jogador1Id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Usuarios", // Nome da tabela referenciada
          key: "id", // Chave primária na tabela referenciada
        },
        onDelete: "CASCADE", // O que acontece ao deletar um usuário
      },
      jogador2Id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Usuarios", // Nome da tabela referenciada
          key: "id", // Chave primária na tabela referenciada
        },
        onDelete: "CASCADE", // O que acontece ao deletar um usuário
      },
      status: {
        type: Sequelize.ENUM("open", "closed"),
        defuktValue: "open",
        allowNull: false,
      },
      winner: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
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
    await queryInterface.dropTable("Adversarios");
  },
};
