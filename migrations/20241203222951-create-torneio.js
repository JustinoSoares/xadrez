'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Torneios', {
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
      pass: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date_start: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      usuarioId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Usuarios', // Tabela de usuários
          key: 'id', // Chave primária da tabela de usuários
        },
      },
      status: {
        type: Sequelize.ENUM('open', 'closed', 'current', "cancelled"),
        defaultValue: 'open',
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('allvsall', 'eliminatoria'),
        defaultValue: 'allvsall',
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
    await queryInterface.dropTable('Torneios');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Torneios_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Torneios_tipo";');
  },
};
