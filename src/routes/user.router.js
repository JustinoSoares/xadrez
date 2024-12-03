// src/routes/usuarioRoutes.js

const { Router } = require('express');
const usuarioController = require('../controllers/users.controller');

const router = Router();

router.post('/usuarios', usuarioController.createUsuario);
router.get('/usuarios', usuarioController.getUsuarios);

module.exports = router;
