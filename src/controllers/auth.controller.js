const db = require("../../models");
const Usuario = db.Usuario;
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        errors: errors.array(),
      });
    }
    const secret = process.env.JWT_SECRET_KEY;
    const { username, password } = req.body;
    const usuario = await Usuario.findOne({
      where: {
        [Op.or]: {
          email: username,
          username,
        },
      },
    });

    if (!usuario) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            msg: "Usuário ou  senha inválida",
            param: "username",
            location: "body",
          },
        ],
      });
    }

    const senhaValida = await bcrypt.compare(password, usuario.password);

    if (!senhaValida) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            msg: "Usuário ou  senha inválida",
            param: "username",
            location: "body",
          },
        ],
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      status: true,
      msg: "Login efetuado com sucesso",
      id: usuario.id,
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      errors: [
        {
          msg: "Erro ao efetuar o login",
          param: "username",
          location: "body",
        },
      ],
    });
  }
};
