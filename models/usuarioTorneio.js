// models/UsuarioTorneio.js

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UsuarioTorneio extends Model {
    static associate(models) {
      UsuarioTorneio.belongsTo(models.Usuario, {
        foreignKey: 'usuarioId',
        as: 'usuario',
      });
      UsuarioTorneio.belongsTo(models.Torneio, {
        foreignKey: 'torneioId',
        as: 'torneio',
      });
    }
  }

  UsuarioTorneio.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
    },
    torneioId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Torneios',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('on', 'off'),
      allowNull: false,
    },
    pontos: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'UsuarioTorneio',
  });

  return UsuarioTorneio;
};
