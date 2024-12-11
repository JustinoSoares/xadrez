// src/controllers/torneioController.js

const db  = require("../../models"); // Ajuste o caminho conforme necessário
const Torneio = db.Torneio; // Ajuste o caminho conforme necessário
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
exports.createTorneio = async (req, res) => {
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { name, pass, usuarioId } = req.body;

    const torneio = await Torneio.create({
      name,
      pass: bcrypt.hashSync(pass, 10),
      usuarioId,
    });
    res.status(201).json({
      status: true,
      msg: "Torneio criado com sucesso",
      data: torneio,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: "Erro ao criar torneio",
      error: error.message,
    });
  }
};

exports.getTorneios = async (req, res) => {
  try {
    const torneios = await Torneio.findAll();
    res.status(200).json(torneios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
