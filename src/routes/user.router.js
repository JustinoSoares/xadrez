// src/routes/usuarioRoutes.js

const { Router } = require('express');
const usuarioController = require('../controllers/users.controller');
const validate = require('../validator/user.validator');

const router = Router();

router.post('/usuarios/create', validate.create, usuarioController.createUsuario);
router.get('/usuarios/all', usuarioController.getUsuarios);

module.exports = router;
