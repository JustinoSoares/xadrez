// src/routes/torneioRoutes.js

const { Router } = require('express');
const torneioController = require('../controllers/torneio.controller');
const validateTorneio = require('../validator/torneio.validate');
const authorization = require('../middleware/authorization');
const allvsallController = require('../controllers/allvsall.controllers');
const { route } = require('./user.router');

const router = Router();

//criar torneios
router.post('/torneios/create', authorization, validateTorneio.create, torneioController.createTorneio);

//pegar cada torneio
router.get('/torneios/each/:torneioId', torneioController.getTorneioById);
//mostar todos os torneios
router.get('/torneios/all', authorization, torneioController.getTorneios);

//Se inscrever em um torneio
router.post('/torneios/subscribe/:torneioId', authorization, torneioController.subcribeTorneio);

//Jogar todos contra todos
router.post('/torneios/AllvsAll/:torneioId', authorization, allvsallController.AllvsAll);
// Jogar eliminatória
router.post('/torneios/eliminatoria/:torneioId', authorization, torneioController.eliminatoria);

// ver as partidas de um torneio
router.get('/torneios/partida/:torneioId', torneioController.partida);

// ver todos os usuários inscritos em um torneio
router.get('/torneios/subscribed/:torneioId', torneioController.subscribed);
//seleciona o  vencedor de um torneio
router.post('/torneios/select_winner/:torneioId/:vsId/:usuarioId', torneioController.select_winner);

//ver o vencedor de um torneio
router.get('/torneios/top/:torneioId', torneioController.topTorneio);

//fechar um torneio
router.post("/torneios/close_torneio/:torneioId", authorization, torneioController.close_torneio);

// desabilitar um usuário de um torneio
router.delete("/torneios/disable_user/:torneioId/:userId", authorization, torneioController.describeUser);

// sair de um torneio
router.delete("/torneios/out_torneio/:torneioId", authorization, torneioController.outTorneio);

//ver o ranking de um usuários nos torneios
router.get("/torneios/ranking_owner/:usuarioId", torneioController.rankings); 
// ver o ranking de um torneio
router.get("/torneios/ranking_partida/:torneioId", torneioController.rank_partida);

router.get("/torneios/owner_torneios/:usuarioId", torneioController.torneiosUsuario);


router.delete("/torneios/delete/:torneioId", authorization, torneioController.deleteTorneio);
router.put("/torneios/update/:torneioId", authorization, torneioController.updateTorneio);


module.exports = router;
