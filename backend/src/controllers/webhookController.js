const MessageParser = require('../parsers/messageParser');
const TransactionService = require('../services/transactionService');

class WebhookController {

    // Verificação de segurança primária da Meta
    static verifyChallenge(req, res) {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (mode && token) {
            if (mode === 'subscribe' && token === process.env.WHATSAPP_TOKEN) {
                console.log('[Webhook] Verificação da Meta confirmada!');
                res.status(200).send(challenge);
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(400);
        }
    }

    // Receber as mensagens em si
    static async handleMessage(req, res) {
        // Importante retornar 200 rapidamente sempre para
        // a Meta não tentar re-enviar (retry)
        res.sendStatus(200);

        try {
            const data = req.body;

            // Validar se o payload se trata de uma mensagem real do zap
            if (data.object !== 'whatsapp_business_account' || !data.entry) return;

            const event = data.entry[0].changes[0].value;

            // Verificamos se há mensagens para processar
            if (event.messages && event.messages.length > 0) {
                const message = event.messages[0];
                const fromNumber = message.from; // Quem mandou

                // Validar Autorização (se veio do nosso número)
                const allowedNumber = process.env.ALLOWED_PHONE_NUMBER;
                if (allowedNumber && fromNumber !== allowedNumber) {
                    console.log(`[Webhook] Mensagem de número não autorizado: ${fromNumber}`);
                    return;
                }

                if (message.type === 'text') {
                    const text = message.text.body;
                    console.log(`[Webhook] Recebi a mensagem: ${text}`);

                    // Parsear a mensagem ("TIPO: VALOR | DESCRIÇÃO | CATEGORIA")
                    const parsedData = MessageParser.parse(text);

                    if (parsedData) {
                        try {
                            const transaction = await TransactionService.addTransaction(parsedData);
                            console.log(`[Finance] ✔️ Transação registrada com sucesso:`, transaction);
                        } catch (err) {
                            console.error(`[Finance] ❌ Erro ao salvar logica no JSON:`, err.message);
                        }
                    } else {
                        console.log(`[Parser] ❌ Formato Inválido Ignorado.`);
                    }
                }
            }
        } catch (error) {
            console.error('[Webhook Error]', error.message);
        }
    }
}

module.exports = WebhookController;
