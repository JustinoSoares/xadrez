// src/routes/torneioRoutes.js

const { Router } = require('express');
const torneioController = require('../controllers/torneio.controller');
const validateTorneio = require('../validator/torneio.validate');
const authorization = require('../middleware/authorization');

const router = Router();

//criar torneios
router.post('/torneios/create', authorization, validateTorneio.create, torneioController.createTorneio);
//mostar todos os torneios
router.get('/torneios/all', torneioController.getTorneios);

//Se inscrever em um torneio
router.post('/torneios/subscribe/:torneioId', authorization, torneioController.subcribeTorneio);

//Jogar todos contra todos
router.post('/torneios/AllvsAll/:torneioId', authorization, torneioController.AllvsAll);
// Jogar eliminatória
router.post('/torneios/eliminatoria/:torneioId', authorization, torneioController.eliminatoria);

// ver as partidas de um torneio
router.get('/torneios/partida/:torneioId', torneioController.partida);

// ver todos os usuários inscritos em um torneio
router.get('/torneios/subscribed/:torneioId', torneioController.subscribed);
//seleciona o  vencedor de um torneio
router.post('/torneios/select_winner/:torneioId/:username', torneioController.select_winner);

//ver o vencedor de um torneio
router.get('/torneios/top/:torneioId', torneioController.topTorneio);

//fechar um torneio
router.post("/torneios/close_torneio/:torneioId", authorization, torneioController.close_torneio);


module.exports = router;
