const Database = require('../database/db');
const { v4: uuidv4 } = require('uuid');

class TransactionService {
    static async addTransaction(parsedData) {
        const db = await Database.read();

        const novaTransacao = {
            id: uuidv4(),
            tipo: parsedData.tipo,
            valor: parsedData.valor,
            descricao: parsedData.descricao,
            categoria: parsedData.categoria,
            data: new Date().toISOString()
        };

        db.transacoes.push(novaTransacao);

        const ok = await Database.write(db);
        if (!ok) throw new Error('Não foi possível salvar a transação no JSON');

        return novaTransacao;
    }

    static async getTransactions() {
        const db = await Database.read();
        // Ordena por data decrescente (mais recentes primeiro)
        return db.transacoes.sort((a, b) => new Date(b.data) - new Date(a.data));
    }
}

module.exports = TransactionService;
