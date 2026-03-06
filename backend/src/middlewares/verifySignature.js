const crypto = require('crypto');

function verifySignature(req, res, next) {
    const signature = req.headers['x-hub-signature-256'];

    if (!signature) {
        console.warn('[Webhook] Assinatura ausente');
        return res.status(403).send('Forbidden: No signature');
    }

    const elements = signature.split('=');
    const signatureHash = elements[1];

    if (!req.rawBody) {
        console.warn('[Webhook] req.rawBody ausente');
        return res.status(400).send('Bad Request: Raw body missing');
    }

    const expectedHash = crypto
        .createHmac('sha256', process.env.WHATSAPP_APP_SECRET || '')
        .update(req.rawBody)
        .digest('hex');

    // Validação correta segura contra timing attacks
    const isValid = crypto.timingSafeEqual(
        Buffer.from(expectedHash),
        Buffer.from(signatureHash)
    );

    if (!isValid) {
        console.error('[Webhook] Assinatura Inválida!');
        return res.status(403).send('Forbidden: Invalid signature');
    }

    next();
}

module.exports = verifySignature;
