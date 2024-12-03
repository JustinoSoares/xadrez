// models/usuario.js

const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Torneio, {
        foreignKey: "usuarioId",
        as: "torneios",
      });
      Usuario.hasMany(models.UsuarioTorneio, {
        foreignKey: "usuarioId",
        as: "participacoes",
      });
      Usuario.hasMany(models.Adversarios, {
        foreignKey: "jogador1Id", // Para jogador1
        as: "adversariosComoJogador1",
      });

      Usuario.hasMany(models.Adversarios, {
        foreignKey: "jogador2Id", // Para jogador2
        as: "adversariosComoJogador2",
      });
    }
  }

  Usuario.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Gera um UUID v4 automaticamente
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipo_usuario: {
        type: DataTypes.ENUM("admin", "normal"),
        allowNull: false,
      },
      pontos: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Usuario",
    }
  );

  return Usuario;
};
