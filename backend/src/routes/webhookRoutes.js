const express = require('express');
const router = express.Router();
const WebhookController = require('../controllers/webhookController');
const verifySignature = require('../middlewares/verifySignature');

// Rota GET: O WhatsApp Cloud API manda um GET para cá no setup para verificar o token
router.get('/', WebhookController.verifyChallenge);

// Rota POST: Aqui é onde o ZAP manda as mensagens (Payload real)
// O middleware VerifySignature checa se a quem enviou foi mesmo a meta 
router.post('/', verifySignature, WebhookController.handleMessage);

module.exports = router;
