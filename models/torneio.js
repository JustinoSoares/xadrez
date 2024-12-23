// models/torneio.js

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Torneio extends Model {
    static associate(models) {
      // Define a associação com o modelo Usuario
      Torneio.belongsTo(models.Usuario, {
        foreignKey: "usuarioId", // Chave estrangeira
        as: "usuario", // Nome da associação
      });
      Torneio.hasMany(models.UsuarioTorneio, {
        foreignKey: "torneioId",
        as: "participantes",
      });
      Torneio.hasMany(models.Adversarios, {
        foreignKey: "torneioId",
        as: "adversarios",
      });
    }
  }

  Torneio.init(
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
      pass: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date_start: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      usuarioId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Usuarios", // Nome da tabela referenciada
          key: "id", // Chave primária na tabela referenciada
        },
      },
      status: {
        type: DataTypes.ENUM('open', 'closed', "current"),
        defaultValue: 'open',
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('allvsall', 'eliminatoria'),
        defaultValue: 'allvsall',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Torneio",
    }
  );

  return Torneio;
};
