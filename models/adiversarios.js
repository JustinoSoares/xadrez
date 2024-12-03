// models/Adversarios.js

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Adversarios extends Model {
    static associate(models) {
      Adversarios.belongsTo(models.Torneio, {
        foreignKey: 'torneioId',
        as: 'torneio',
      });
      Adversarios.belongsTo(models.Usuario, {
        foreignKey: 'jogador1Id',
        as: 'jogador1',
      });
      Adversarios.belongsTo(models.Usuario, {
        foreignKey: 'jogador2Id',
        as: 'jogador2',
      });
    }
  }

  Adversarios.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    torneioId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Torneios',
        key: 'id',
      },
    },
    jogador1Id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
    },
    jogador2Id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Adversarios',
  });

  return Adversarios;
};
