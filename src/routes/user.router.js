// src/routes/usuarioRoutes.js

const { Router } = require('express');
const usuarioController = require('../controllers/users.controller');
const usuarioAuth = require('../controllers/auth.controller');
const validate = require('../validator/user.validator');
const validateAuth = require('../validator/auth.validator');

const router = Router();

router.post('/usuarios/create', validate.create, usuarioController.createUsuario);
router.post('/usuarios/login', validateAuth.auth, usuarioAuth.login);
router.get('/usuarios/verify/:token', usuarioAuth.verifyToken);

router.get('/usuarios/all', usuarioController.getUsuarios);

router.get('/usuarios/each/:id', usuarioController.getUsuarioById);
router.put('/usuarios/update/:id', usuarioController.updateUsuario);
router.delete('/usuarios/delete/:id', usuarioController.deleteUsuario);

module.exports = router;
