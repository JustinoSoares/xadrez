const { body } = require("express-validator");

const create = [
  body("name").notEmpty().withMessage("O name é Obrigatório."),
  body("pass").notEmpty().withMessage("A pass é obrigatória."),
  body("date_start")
    .notEmpty()
    .withMessage("A data de início é obrigatória.")
    .isISO8601()
    .withMessage("O campo datetime deve estar no formato correto.")
    .custom((value) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error("Data e hora inválidas.");
      }
      return true;
    }),
];

module.exports = { create };
