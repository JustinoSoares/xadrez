const { Body } = require("express-validator");

const create = [
    Body("nome").exists().withMessage("O nome do torneio é obrigatório."),
    Body("pass").exists().withMessage("Digite a pass."),
];