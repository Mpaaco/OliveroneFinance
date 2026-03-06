const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apiController');

// Listar todas as transações cadastradas (Usada pelo FRONTEND)
router.get('/transacoes', ApiController.getTransactions);

module.exports = router;
