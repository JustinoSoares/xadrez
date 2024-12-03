// src/controllers/usuarioController.js

const Usuario = require('../../models/users'); // Ajuste o caminho conforme necessário

exports.createUsuario = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const usuario = await Usuario.create({ username, email, password });
        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        if (usuarios.length === 0) {
            return res.status(404).json({ message: 'Nenhum usuário encontrado.' });
        }
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
