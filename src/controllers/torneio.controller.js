// src/controllers/torneioController.js

const Torneio = require("../../models/torneio"); // Ajuste o caminho conforme necessário
const bcrypt = require("bcrypt");
exports.createTorneio = async (req, res) => {
  try {
    const { name, pass, usuarioId } = req.body;
    if (!name || !pass || !usuarioId) {
      return res.status(400).json({
        status: false,
        msg: "Preencha todos os campos",
      });
    }
    const torneio = await Torneio.create({
      name,
      pass : bcrypt.hashSync(pass, 10),
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
