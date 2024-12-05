// src/routes/torneioRoutes.js

const { Router } = require('express');
const torneioController = require('../controllers/torneio.controller');

const router = Router();

router.post('/torneios/create', torneioController.createTorneio);
router.get('/torneios/all', torneioController.getTorneios);

module.exports = router;
