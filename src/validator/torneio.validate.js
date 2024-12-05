const { body } = require("express-validator");

const create = [
  body("name").notEmpty().withMessage("O name é Obrigatório."),
  body("pass").notEmpty().withMessage("A pass é obrigatória."),
];

module.exports = { create };
