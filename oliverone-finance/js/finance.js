// Finance Module — Oliverone Finance
const Finance = (() => {
    const CATEGORY_ICONS = {
        alimentacao: { icon: 'fa-utensils', color: '#f59e0b' },
        transporte: { icon: 'fa-car', color: '#3b82f6' },
        lazer: { icon: 'fa-gamepad', color: '#8b5cf6' },
        educacao: { icon: 'fa-book', color: '#06b6d4' },
        saude: { icon: 'fa-heart', color: '#ef4444' },
        casa: { icon: 'fa-home', color: '#10b981' },
        outros: { icon: 'fa-tag', color: '#6b7280' }
    };

    function calculateTotalExpenses(data) {
        // Fixed expenses: only count those marked as paid
        const fixed = data.fixedExpenses
            .filter(e => e.paid)
            .reduce((sum, e) => sum + e.amount, 0);
        const variable = data.expenses.reduce((sum, e) => sum + e.amount, 0);
        return fixed + variable;
    }

    function calculateBalance(data) {
        const totalIncome = data.monthlyIncome +
            data.incomes.reduce((sum, i) => sum + i.amount, 0);
        return totalIncome - calculateTotalExpenses(data);
    }

    function calculateDebt(data) {
        const balance = calculateBalance(data);
        return balance < 0 ? Math.abs(balance) : 0;
    }

    function filterTransactions(data, month, year) {
        const filterByPeriod = (list) => list.filter((item) => {
            const d = new Date(item.date + 'T00:00:00');
            const itemMonth = String(d.getMonth() + 1).padStart(2, '0');
            const itemYear = String(d.getFullYear());
            return (!month || itemMonth === month) && (!year || itemYear === year);
        });

        return {
            expenses: filterByPeriod(data.expenses),
            incomes: filterByPeriod(data.incomes)
        };
    }

    function shouldIncludeMonthly(month, year) {
        if (!month && !year) return true;
        const now = new Date();
        const curMonth = String(now.getMonth() + 1).padStart(2, '0');
        const curYear = String(now.getFullYear());
        return (!month || month === curMonth) && (!year || year === curYear);
    }

    function getUniqueYears(data) {
        const years = new Set();
        [...data.expenses, ...data.incomes].forEach((item) => {
            years.add(new Date(item.date + 'T00:00:00').getFullYear());
        });
        years.add(new Date().getFullYear());
        return [...years].sort((a, b) => b - a);
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    }

    function formatDate(dateString) {
        const d = new Date(dateString + 'T00:00:00');
        return d.toLocaleDateString('pt-BR');
    }

    function getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    }

    function getCategoryMeta(category) {
        return CATEGORY_ICONS[category] || CATEGORY_ICONS['outros'];
    }

    return {
        calculateTotalExpenses,
        calculateBalance,
        calculateDebt,
        filterTransactions,
        shouldIncludeMonthly,
        getUniqueYears,
        formatCurrency,
        formatDate,
        getCurrentDate,
        getCategoryMeta
    };
})();
