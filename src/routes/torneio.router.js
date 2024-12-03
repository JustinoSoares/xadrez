// src/routes/torneioRoutes.js

const { Router } = require('express');
const torneioController = require('../controllers/torneio.controller');

const router = Router();

router.post('/torneios', torneioController.createTorneio);
router.get('/torneios', torneioController.getTorneios);

module.exports = router;
