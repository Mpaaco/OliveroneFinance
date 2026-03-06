// Storage Module — Oliverone Finance
const Storage = (() => {
    const KEY = 'oliveroneFinanceData';

    const defaultData = {
        monthlyIncome: 0,
        fixedExpenses: [],
        expenses: [],
        incomes: [],
        settings: { theme: 'dark' }
    };

    function load() {
        try {
            const raw = localStorage.getItem(KEY);
            return raw ? { ...defaultData, ...JSON.parse(raw) } : { ...defaultData };
        } catch (e) {
            console.error('Erro ao carregar dados:', e);
            return { ...defaultData };
        }
    }

    function save(data) {
        try {
            localStorage.setItem(KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Erro ao salvar dados:', e);
            return false;
        }
    }

    function exportJSON(data) {
        const date = new Date().toISOString().split('T')[0];
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `oliverone_backup_${date}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsed = JSON.parse(e.target.result);
                    if (typeof parsed !== 'object' || Array.isArray(parsed)) {
                        reject(new Error('Formato inválido'));
                        return;
                    }
                    resolve({ ...defaultData, ...parsed });
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            reader.readAsText(file);
        });
    }

    return { load, save, exportJSON, importJSON };
})();
