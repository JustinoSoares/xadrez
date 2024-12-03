// src/controllers/torneioController.js

const Torneio = require('../../models/torneio'); // Ajuste o caminho conforme necessário

exports.createTorneio = async (req, res) => {
    try {
        const { name, pass, usuarioId } = req.body;
        const torneio = await Torneio.create({ name, pass, usuarioId });
        res.status(201).json(torneio);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
