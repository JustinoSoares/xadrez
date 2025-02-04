'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Teams', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      usuarioId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Usuarios', // Tabela de usuários
          key: 'id', // Chave primária da tabela de usuários
        },
      },
      torneioId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Torneios', // Tabela de torneios
          key: 'id', // Chave primária da tabela de torneios
        },
      },
      status: {
        type: Sequelize.ENUM('on', 'off'),
        defaultValue: 'on',
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

  async down(queryInterface, Sequelize) {
    // Remover a tabela e os tipos ENUM
    await queryInterface.dropTable('Teams');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Teams_status";');
  },
};
