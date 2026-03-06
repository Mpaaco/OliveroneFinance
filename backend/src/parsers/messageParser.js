class MessageParser {
    /**
     * Parseia uma string no formato: "TIPO: VALOR | DESCRIÇÃO | CATEGORIA"
     * 
     * @param {string} text - Mensagem do WhatsApp
     * @returns {Object|null} Objeto da transação ou null se inválido
     */
    static parse(text) {
        if (!text || typeof text !== 'string') return null;

        // Limpa espaços extras e quebras
        const cleanText = text.trim();

        // Regex para capturar: TIPO: VALOR e o resto opcional
        // TIPO: Mínimo 2 letras
        // VALOR: Números com ponto ou vírgula
        // Resto: Separado por pipe
        const regex = /^([a-zA-Z]+):\s*([\d.,]+)(?:\s*\|\s*(.*?))?$/;
        const match = cleanText.match(regex);

        if (!match) {
            console.log('[Parser] Match falhou para a string:', cleanText);
            return null;
        }

        const rawTipo = match[1].toUpperCase();
        const rawValor = match[2];
        const rawResto = match[3] || ''; // ex: "Almoço | Alimentação"

        // Validar Tipo
        const tiposPermitidos = ['SALARIO', 'RECEBIDO', 'DESPESA', 'INVESTIMENTO'];
        if (!tiposPermitidos.includes(rawTipo)) {
            console.log('[Parser] Tipo inválido:', rawTipo);
            return null;
        }

        // Parse Valor (Aceita 1.000,50 ou 1000.50)
        let valorStr = rawValor.replace(/\./g, '').replace(',', '.');
        const valorNumerico = parseFloat(valorStr);

        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            console.log('[Parser] Valor inválido:', rawValor);
            return null;
        }

        // Parse Resto (Descrição | Categoria)
        let descricao = 'Sem descrição';
        let categoria = 'Geral';

        if (rawResto) {
            const parts = rawResto.split('|').map(p => p.trim());
            descricao = parts[0] || 'Sem descrição';
            if (parts[1]) {
                categoria = parts[1];
            }
        }

        return {
            tipo: rawTipo,
            valor: valorNumerico,
            descricao: descricao,
            categoria: categoria
        };
    }
}

module.exports = MessageParser;
