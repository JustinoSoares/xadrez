// src/routes/usuarioRoutes.js

const { Router, query } = require('express');
const usuarioController = require('../controllers/users.controller');
const usuarioAuth = require('../controllers/auth.controller');
const validate = require('../validator/user.validator');
const validateAuth = require('../validator/auth.validator');
const authorization = require('../middleware/authorization');
const express = require("express");
const app = express();
const router = Router();

router.post('/usuarios/create', validate.create, usuarioController.createUsuario);
router.post('/usuarios/login', validateAuth.auth, usuarioAuth.login);
router.get('/usuarios/verify/:token', usuarioAuth.verifyToken);

router.get('/usuarios/all', usuarioController.getUsuarios);

router.get('/usuarios/each/:id', usuarioController.getUsuarioById);
router.put('/usuarios/update/:id',authorization , usuarioController.updateUsuario);
router.delete('/usuarios/delete/:id', authorization, usuarioController.deleteUsuario);


 router.get("/googleAuth", async (req, res, next) => {
     token = req.query.token;
     const response = await fetch("http://localhost:3000/torneios/all", {
         method: "GET",
         headers: {
             "Authorization": `Bearer ${token}`, // Envia o token no cabeçalho
             "Content-Type": "application/json",
         },
     });

     const data = await response.json();
     res.json(data); // Retorna a resposta da nova rota
 })
module.exports = router;
