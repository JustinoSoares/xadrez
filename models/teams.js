// models/Team.js

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Team extends Model {
    static associate(models) {
      // Define a associação com o modelo Usuario
      Team.belongsTo(models.Usuario, {
        foreignKey: "usuarioId", // Chave estrangeira
        as: "usuario", // Nome da associação
      });
      Team.belongsTo(models.Torneio, {
        foreignKey: "TorneioId", // Chave estrangeira
        as: "torneio", // Nome da associação
      });
    }
  }

  Team.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      usuarioId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Usuarios", // Nome da tabela referenciada
          key: "id", // Chave primária na tabela referenciada
        },
      },
      torneioId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Torneio", // Nome da tabela referenciada
          key: "id", // Chave primária na tabela referenciada
        },
      },
      status: {
        type: DataTypes.ENUM('on', 'off'),
        defaultValue: 'open',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Team",
    }
  );
  return Team;
};
