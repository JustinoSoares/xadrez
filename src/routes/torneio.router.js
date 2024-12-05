// src/routes/torneioRoutes.js

const { Router } = require('express');
const torneioController = require('../controllers/torneio.controller');
const validateTorneio = require('../validator/torneio.validate');

const router = Router();

router.post('/torneios/create', validateTorneio.create, torneioController.createTorneio);
router.get('/torneios/all', torneioController.getTorneios);

module.exports = router;
