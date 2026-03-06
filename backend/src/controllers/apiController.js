const TransactionService = require('../services/transactionService');

class ApiController {
    static async getTransactions(req, res) {
        try {
            const transactions = await TransactionService.getTransactions();
            return res.json({
                success: true,
                count: transactions.length,
                data: transactions
            });
        } catch (error) {
            console.error('[API GET Error]', error);
            return res.status(500).json({ error: 'Erro ao buscar transações' });
        }
    }
}

module.exports = ApiController;
