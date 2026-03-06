const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middlewares Globais
app.use(helmet());
app.use(cors());

// O Webhook da Meta envia os dados em formato JSON, precisamos parsear
// Importante para checar o X-Hub-Signature: Precisamos do raw body da req.
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

// Rotas Base
app.get('/', (req, res) => {
    res.json({ message: 'Oliverone Finance API is running!' });
});

// Importando as próximas rotas
const webhookRoutes = require('./src/routes/webhookRoutes');
const apiRoutes = require('./src/routes/apiRoutes');

app.use('/webhook', webhookRoutes);
app.use('/api', apiRoutes);

// Error Handler Centralizado
app.use((err, req, res, next) => {
    console.error('[Error]', err.stack);
    res.status(500).json({ error: 'Erro interno no servidor' });
});

module.exports = app;
