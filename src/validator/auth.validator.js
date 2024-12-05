const { body } = require("express-validator");

const auth = [
  body("username").notEmpty().withMessage("O username é obrigatório."),
  body("password").notEmpty().withMessage("A senha é obrigatória."),
];

module.exports = { auth };
