// src/routes/torneioRoutes.js

const { Router } = require('express');
const torneioController = require('../controllers/torneio.controller');
const validateTorneio = require('../validator/torneio.validate');

const router = Router();

router.post('/torneios/create', validateTorneio.create, torneioController.createTorneio);
router.get('/torneios/all', torneioController.getTorneios);

router.post('/torneios/subscribe/:torneioId/:usuarioId', torneioController.subcribeTorneio);
router.post('/torneios/subscribe/:torneioId/:usuarioId', torneioController.subcribeTorneio);

router.post('/torneios/AllvsAll/:torneioId', torneioController.AllvsAll);
router.get('/torneios/partida/:torneioId', torneioController.partida);

module.exports = router;
