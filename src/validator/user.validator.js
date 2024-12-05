const { body } = require("express-validator");

const create = [
    body("username").exists().withMessage("O nome de usuário é obrigatório."),
    body("email").isEmail().withMessage("O email deve ser válido."),
    body("password")
      .isLength({ min: 4 })
      .withMessage("A senha deve ter pelo menos 4 caracteres."),
];

module.exports = {create};