const { body } = require("express-validator");

const create = [
  body("username")
    .notEmpty()
    .withMessage("O nome de usuário é obrigatório.")
    .isLength({ min: 4 , max: 20 })
    .withMessage("O nome de usuário deve ter entre 4 e 20 caracteres.")
    .custom((value) => {
      if (value.includes(" ")) {
        throw new Error("O nome de usuário não pode conter espaços.");
      }
      return true;
    })
    .exists()
    .withMessage("O nome de usuário é obrigatório."),
  body("email")
    .notEmpty()
    .withMessage("O email é obrigatório.")
    .isEmail()
    .withMessage("O email deve ser válido."),
  body("password")
    .notEmpty()
    .withMessage("A senha é obrigatória.")
    .isLength({ min: 4 })
    .withMessage("A senha deve ter pelo menos 4 caracteres."),
  body("country").notEmpty().withMessage("O país é obrigatório."),
];

module.exports = { create };
