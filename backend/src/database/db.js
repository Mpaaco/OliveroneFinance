const fs = require('fs/promises');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'data.json');

class Database {
    static async _ensureFileExists() {
        try {
            await fs.access(DB_PATH);
        } catch (error) {
            // Se o arquivo não existe, cria com a estrutura base
            await fs.writeFile(DB_PATH, JSON.stringify({ transacoes: [] }, null, 2));
        }
    }

    static async read() {
        await this._ensureFileExists();
        try {
            const data = await fs.readFile(DB_PATH, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('[DB Read Error]', error);
            // Fallback se corromper
            return { transacoes: [] };
        }
    }

    static async write(data) {
        await this._ensureFileExists();
        try {
            await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error('[DB Write Error]', error);
            return false;
        }
    }
}

module.exports = Database;
