// src/routes/torneioRoutes.js

const { Router } = require('express');
const torneioController = require('../controllers/torneio.controller');
const validateTorneio = require('../validator/torneio.validate');
const authorization = require('../middleware/authorization');

const router = Router();

router.post('/torneios/create', authorization, validateTorneio.create, torneioController.createTorneio);
router.get('/torneios/all', torneioController.getTorneios);

router.post('/torneios/subscribe/:torneioId', authorization, torneioController.subcribeTorneio);

router.post('/torneios/AllvsAll/:torneioId', authorization, torneioController.AllvsAll);
router.get('/torneios/partida/:torneioId', torneioController.partida);

router.get('/torneios/subscribed/:torneioId', torneioController.subscribed);
router.post('/torneios/select_winner/:torneioId/:username', torneioController.select_winner);

router.get('/torneios/top/:torneioId', torneioController.topTorneio);

module.exports = router;
