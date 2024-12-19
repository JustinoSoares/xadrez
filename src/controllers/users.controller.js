// src/controllers/users.controller.js

const { Op } = require("sequelize");
const db = require("../../models"); // Importa todos os modelos
const Usuario = db.Usuario; // Acessa o modelo Usuario
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.createUsuario = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { username, email, password, country } = req.body;
    const usuarioExistente = await Usuario.findOne({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(400).json({
        status: false,
        msg: "Usuário já existe, tenta mudar o username ou email",
      });
    }

    const usuario = await Usuario.create({
      username,
      email,
      password: bcrypt.hashSync(password, 10),
      country: country || "Angola",
    });

    const {
      id: idRes,
      username: usernameRes,
      email: emailRes,
      pontos,
    } = usuario;

    res.status(201).json({
      status: true,
      msg: "Usuário criado com sucesso",
      data: {
        id: idRes,
        username: usernameRes,
        email: emailRes,
        country : country || "Angola",
        pontos,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message,
    });
  }
};

exports.getUsuarios = async (req, res) => {
  try {
    const maxLen = req.query.maxLen || 3;
    const order = req.query.order || "ASC";
    const offset = req.query.offset || 0;
    const search = req.query.search || "";
    const attribute = req.query.attribute || 'id'; 

    const usuarios = await Usuario.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "pontos",
        "country",
        "createdAt",
        "updatedAt",
      ],
      where: {
        username: {
          [Op.like]: `%${search}%`,
        },
      },
      order: [[attribute, order]],
      limit: maxLen,
      offset: offset,
      where: {
        tipo_usuario: "normal",
      },
    });

    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({
        status: false,
        msg: "Nenhum usuário encontrado",
      });
    }

    return res.status(200).json({
      status: true,
      msg: "Usuários encontrados",
      data: usuarios,
    });
  } catch (error) {
    res.status(500).json({
      status : false, 
      error: error.message 
    });
  }
};
