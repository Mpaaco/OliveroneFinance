// Oliverone Finance — App Core (orquestra Storage + Finance)
class OliveroneFinance {
    constructor() {
        this.data = Storage.load();
        this.currentScreen = 'home';
        this.loadingStartTime = Date.now();
        this.minimumLoadingDuration = 3000;

        this._dataLoaded = false;
        this._dashReady = false;
        this._timerDone = false;

        this.init();
    }

    init() {
        this._showLoading();
        this._setupEventListeners();
        this._populateYearFilter();

        setTimeout(() => {
            this._timerDone = true;
            this._checkReady();
        }, this.minimumLoadingDuration);

        Promise.resolve().then(() => {
            this._dataLoaded = true;
            this._checkReady();
        });

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this._updateDashboard();
                this._dashReady = true;
                this._checkReady();
            });
        } else {
            this._updateDashboard();
            this._dashReady = true;
            this._checkReady();
        }
    }

    // ─── Loading ────────────────────────────────────────────────────

    _showLoading() {
        const el = document.getElementById('loading-screen');
        if (el) { el.classList.add('active'); el.style.display = 'flex'; }
        const header = document.getElementById('main-header');
        if (header) header.style.display = 'none';
    }

    _checkReady() {
        if (this._dataLoaded && this._dashReady && this._timerDone) {
            setTimeout(() => this._hideLoading(), 200);
        }
    }

    _hideLoading() {
        const el = document.getElementById('loading-screen');
        if (el) { el.classList.remove('active'); el.style.display = 'none'; }
        this.showScreen('home');
        const header = document.getElementById('main-header');
        if (header) header.style.display = 'flex';
    }

    // ─── Telas ──────────────────────────────────────────────────────

    showScreen(name) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(`${name}-screen`);
        if (target) { target.classList.add('active'); this.currentScreen = name; }
        this._updatePageTitle(name);
        this._updateActiveNav(name);
        this._closeSidebar();
        this._onScreenEnter(name);
    }

    _updatePageTitle(name) {
        const titles = {
            home: 'Oliverone Finance',
            'monthly-register': 'Registro Mensal',
            'new-expense': 'Novo Gasto',
            'new-income': 'Novo Recebimento',
            'financial-report': 'Relatório Financeiro'
        };
        const el = document.getElementById('page-title');
        if (el && titles[name]) el.textContent = titles[name];
        const header = document.getElementById('main-header');
        if (header && name !== 'loading') header.style.display = 'flex';
    }

    _updateActiveNav(name) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.screen === name);
        });
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.screen === name);
        });
    }

    _onScreenEnter(name) {
        switch (name) {
            case 'home': this._updateDashboard(); break;
            case 'monthly-register': this._loadMonthlyData(); break;
            case 'new-expense': this._resetExpenseForm(); break;
            case 'new-income': this._resetIncomeForm(); break;
            case 'financial-report': this._updateReport(); break;
        }
    }

    // ─── Sidebar ────────────────────────────────────────────────────

    _openSidebar() {
        document.getElementById('sidebar')?.classList.add('active');
        document.getElementById('sidebar-overlay')?.classList.add('active');
    }

    _closeSidebar() {
        document.getElementById('sidebar')?.classList.remove('active');
        document.getElementById('sidebar-overlay')?.classList.remove('active');
    }

    // ─── Dashboard ──────────────────────────────────────────────────

    _updateDashboard() {
        const balance = Finance.calculateBalance(this.data);
        const expenses = Finance.calculateTotalExpenses(this.data);
        const debt = Finance.calculateDebt(this.data);

        this._setText('current-balance', Finance.formatCurrency(balance));
        this._setText('total-expenses', Finance.formatCurrency(expenses));
        this._setText('debt-amount', Finance.formatCurrency(debt));

        const balEl = document.getElementById('current-balance');
        if (balEl) balEl.className = `amount ${balance >= 0 ? 'positive' : 'negative'}`;

        this._renderRecentExpenses();
    }

    _renderRecentExpenses() {
        const list = document.getElementById('recent-expenses-list');
        if (!list) return;

        const recent = [...this.data.expenses]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        if (recent.length === 0) {
            list.innerHTML = `<div class="empty-state">
                <i class="fas fa-receipt"></i>
                <p>Nenhum gasto registrado ainda</p>
            </div>`;
            return;
        }

        list.innerHTML = recent.map(e => {
            const meta = Finance.getCategoryMeta(e.category);
            return `<div class="transaction-item">
                <div class="tx-icon" style="background:${meta.color}22; color:${meta.color}">
                    <i class="fas ${meta.icon}"></i>
                </div>
                <div class="transaction-info">
                    <div class="transaction-description">${this._escape(e.description)}</div>
                    <div class="transaction-date">${Finance.formatDate(e.date)}</div>
                </div>
                <div class="transaction-amount expense">-${Finance.formatCurrency(e.amount)}</div>
            </div>`;
        }).join('');
    }

    // ─── Registro Mensal ────────────────────────────────────────────

    _loadMonthlyData() {
        const el = document.getElementById('monthly-income');
        if (el) el.value = this.data.monthlyIncome || '';
        this._renderFixedExpenses();
    }

    _renderFixedExpenses() {
        const container = document.getElementById('fixed-expenses-container');
        if (!container) return;

        const items = this.data.fixedExpenses.length > 0
            ? this.data.fixedExpenses
            : [{ description: '', amount: '' }];

        container.innerHTML = items.map((e, i) => `
            <div class="fixed-expense-item ${e.paid ? 'is-paid' : ''}" data-index="${i}">
                <div class="paid-toggle-wrap">
                    <span class="paid-label-tag ${e.paid ? 'paid' : 'pending'}">${e.paid ? 'Pago' : 'Pendente'}</span>
                    <label class="paid-toggle" title="Marcar como pago">
                        <input type="checkbox" class="expense-paid" ${e.paid ? 'checked' : ''}>
                        <span class="paid-icon"><i class="fas fa-check"></i></span>
                    </label>
                </div>
                <input type="text" placeholder="Descrição (ex: Aluguel)" class="expense-description" value="${this._escape(e.description)}">
                <div class="input-group">
                    <span class="input-prefix">R$</span>
                    <input type="number" placeholder="0,00" step="0.01" class="expense-amount" value="${e.amount || ''}">
                </div>
                <button type="button" class="remove-expense-btn" title="Remover">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        container.querySelectorAll('.expense-paid').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const item = e.target.closest('.fixed-expense-item');
                const tag = item.querySelector('.paid-label-tag');
                item.classList.toggle('is-paid', e.target.checked);
                if (tag) {
                    tag.textContent = e.target.checked ? 'Pago' : 'Pendente';
                    tag.className = `paid-label-tag ${e.target.checked ? 'paid' : 'pending'}`;
                }
            });
        });

        container.querySelectorAll('.remove-expense-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.fixed-expense-item');
                const idx = item.dataset.index;
                if (this.data.fixedExpenses[idx] !== undefined) {
                    if (!confirm(`Remover "${this.data.fixedExpenses[idx].description || 'este gasto fixo'}"?`)) return;
                    this.data.fixedExpenses.splice(+idx, 1);
                } else {
                    item.remove();
                    return;
                }
                this._renderFixedExpenses();
            });
        });
    }

    _addFixedExpense() {
        const container = document.getElementById('fixed-expenses-container');
        if (!container) return;
        const div = document.createElement('div');
        div.className = 'fixed-expense-item';
        div.innerHTML = `
            <div class="paid-toggle-wrap">
                <span class="paid-label-tag pending">Pendente</span>
                <label class="paid-toggle" title="Marcar como pago">
                    <input type="checkbox" class="expense-paid">
                    <span class="paid-icon"><i class="fas fa-check"></i></span>
                </label>
            </div>
            <input type="text" placeholder="Descrição (ex: Aluguel)" class="expense-description">
            <div class="input-group">
                <span class="input-prefix">R$</span>
                <input type="number" placeholder="0,00" step="0.01" class="expense-amount">
            </div>
            <button type="button" class="remove-expense-btn" title="Remover">
                <i class="fas fa-trash"></i>
            </button>
        `;
        div.querySelector('.expense-paid').addEventListener('change', (e) => {
            const tag = div.querySelector('.paid-label-tag');
            div.classList.toggle('is-paid', e.target.checked);
            if (tag) {
                tag.textContent = e.target.checked ? 'Pago' : 'Pendente';
                tag.className = `paid-label-tag ${e.target.checked ? 'paid' : 'pending'}`;
            }
        });
        div.querySelector('.remove-expense-btn').addEventListener('click', () => div.remove());
        container.appendChild(div);
        div.querySelector('.expense-description').focus();
    }

    _saveMonthlyData() {
        const incomeEl = document.getElementById('monthly-income');
        this.data.monthlyIncome = incomeEl ? parseFloat(incomeEl.value) || 0 : 0;
        this.data.fixedExpenses = [];

        document.querySelectorAll('.fixed-expense-item').forEach(item => {
            const description = item.querySelector('.expense-description')?.value.trim();
            const amount = parseFloat(item.querySelector('.expense-amount')?.value) || 0;
            const paid = item.querySelector('.expense-paid')?.checked || false;
            if (description && amount > 0) {
                this.data.fixedExpenses.push({ description, amount, paid });
            }
        });

        this._save();
        this._updateDashboard();
    }

    // ─── Novo Gasto ─────────────────────────────────────────────────

    _resetExpenseForm() {
        this._setVal('expense-description', '');
        this._setVal('expense-amount', '');
        this._setVal('expense-date', Finance.getCurrentDate());
        this._setVal('expense-category', '');
    }

    _saveExpense() {
        const description = this._getVal('expense-description').trim();
        const amount = parseFloat(this._getVal('expense-amount'));
        const date = this._getVal('expense-date');
        const category = this._getVal('expense-category');

        if (!description || !amount || amount <= 0 || !date) {
            this.showToast('Preencha todos os campos obrigatórios', 'error');
            return;
        }

        this.data.expenses.push({
            id: Date.now(),
            description,
            amount,
            date,
            category: category || 'outros',
            timestamp: new Date().toISOString()
        });

        this._save();
        this._resetExpenseForm();
        this.showToast('Gasto registrado com sucesso!', 'success');
    }

    // ─── Novo Recebimento ───────────────────────────────────────────

    _resetIncomeForm() {
        this._setVal('income-description', '');
        this._setVal('income-amount', '');
        this._setVal('income-date', Finance.getCurrentDate());
    }

    _saveIncome() {
        const description = this._getVal('income-description').trim();
        const amount = parseFloat(this._getVal('income-amount'));
        const date = this._getVal('income-date');

        if (!description || !amount || amount <= 0 || !date) {
            this.showToast('Preencha todos os campos obrigatórios', 'error');
            return;
        }

        this.data.incomes.push({
            id: Date.now(),
            description,
            amount,
            date,
            timestamp: new Date().toISOString()
        });

        this._save();
        this._resetIncomeForm();
        this.showToast('Recebimento registrado com sucesso!', 'success');
    }

    // ─── Relatório ──────────────────────────────────────────────────

    _populateYearFilter() {
        const sel = document.getElementById('report-year');
        if (!sel) return;
        const years = Finance.getUniqueYears(this.data);
        sel.innerHTML = '<option value="">Todos os anos</option>' +
            years.map(y => `<option value="${y}">${y}</option>`).join('');
    }

    _updateReport() {
        const month = document.getElementById('report-month')?.value || '';
        const year = document.getElementById('report-year')?.value || '';
        const search = document.getElementById('report-search')?.value.toLowerCase() || '';

        const filtered = Finance.filterTransactions(this.data, month, year);

        const totalIncome = filtered.incomes.reduce((s, i) => s + i.amount, 0) +
            (Finance.shouldIncludeMonthly(month, year) ? this.data.monthlyIncome : 0);

        const fixedSum = Finance.shouldIncludeMonthly(month, year)
            ? this.data.fixedExpenses.filter(e => e.paid).reduce((s, e) => s + e.amount, 0)
            : 0;
        const totalExpenses = filtered.expenses.reduce((s, e) => s + e.amount, 0) + fixedSum;
        const finalBalance = totalIncome - totalExpenses;

        this._setText('report-total-income', Finance.formatCurrency(totalIncome));
        this._setText('report-total-expenses', Finance.formatCurrency(totalExpenses));

        const balEl = document.getElementById('report-final-balance');
        if (balEl) {
            balEl.textContent = Finance.formatCurrency(finalBalance);
            balEl.className = `amount ${finalBalance >= 0 ? 'positive' : 'negative'}`;
        }

        this._renderTransactionHistory(filtered, search);
    }

    _renderTransactionHistory(filtered, search = '') {
        const list = document.getElementById('transactions-history-list');
        if (!list) return;

        let all = [
            ...filtered.expenses.map(e => ({ ...e, type: 'expense' })),
            ...filtered.incomes.map(i => ({ ...i, type: 'income' }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        if (search) {
            all = all.filter(t => t.description.toLowerCase().includes(search));
        }

        if (all.length === 0) {
            list.innerHTML = `<div class="empty-state">
                <i class="fas fa-history"></i>
                <p>${search ? 'Nenhuma transação encontrada para a busca' : 'Nenhuma transação para o período'}</p>
            </div>`;
            return;
        }

        list.innerHTML = all.map(t => {
            const meta = t.type === 'expense' ? Finance.getCategoryMeta(t.category) : null;
            const icon = meta ? meta.icon : 'fa-arrow-up';
            const iconColor = meta ? meta.color : 'var(--success)';
            return `<div class="transaction-item ${t.type}">
                <div class="tx-icon" style="background:${iconColor}22; color:${iconColor}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="transaction-info">
                    <div class="transaction-description">${this._escape(t.description)}</div>
                    <div class="transaction-date">${Finance.formatDate(t.date)}</div>
                </div>
                <div class="transaction-amount ${t.type}">
                    ${t.type === 'income' ? '+' : '-'}${Finance.formatCurrency(t.amount)}
                </div>
            </div>`;
        }).join('');
    }

    // ─── Toast ──────────────────────────────────────────────────────

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        const icon = toast.querySelector('.toast-icon');
        const msg = toast.querySelector('.toast-message');

        toast.className = `toast ${type}`;
        if (icon) icon.className = `toast-icon fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`;
        if (msg) msg.textContent = message;

        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // ─── Theme ──────────────────────────────────────────────────────

    _toggleTheme() {
        const html = document.documentElement;
        const current = html.dataset.theme || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        html.dataset.theme = next;
        this.data.settings = this.data.settings || {};
        this.data.settings.theme = next;
        Storage.save(this.data);
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.querySelector('i').className = `fas ${next === 'dark' ? 'fa-sun' : 'fa-moon'}`;
    }

    _applyTheme() {
        const theme = this.data.settings?.theme || 'dark';
        document.documentElement.dataset.theme = theme;
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.querySelector('i').className = `fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
    }

    // ─── Export / Import ────────────────────────────────────────────

    _exportData() {
        Storage.exportJSON(this.data);
        this.showToast('Backup exportado com sucesso!', 'success');
    }

    _importData(file) {
        if (!file) return;
        Storage.importJSON(file)
            .then(data => {
                this.data = data;
                Storage.save(this.data);
                this._updateDashboard();
                this._populateYearFilter();
                this.showToast('Dados importados com sucesso!', 'success');
            })
            .catch(() => this.showToast('Erro ao importar arquivo. Verifique o formato.', 'error'));
    }

    // ─── Persistência ───────────────────────────────────────────────

    _save() {
        const ok = Storage.save(this.data);
        if (ok) this.showToast('Dados salvos!', 'success');
        else this.showToast('Erro ao salvar dados', 'error');
    }

    // ─── Event Listeners ────────────────────────────────────────────

    _setupEventListeners() {
        // Menu
        document.getElementById('menu-toggle')?.addEventListener('click', () => this._openSidebar());
        document.getElementById('close-sidebar')?.addEventListener('click', () => this._closeSidebar());
        document.getElementById('sidebar-overlay')?.addEventListener('click', () => this._closeSidebar());

        // Nav items (sidebar + bottom)
        document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.showScreen(item.dataset.screen);
            });
        });

        // Refresh
        document.getElementById('refresh-btn')?.addEventListener('click', () => {
            this._updateDashboard();
            this.showToast('Atualizado!', 'success');
        });

        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => this._toggleTheme());

        // Monthly register
        document.getElementById('add-fixed-expense')?.addEventListener('click', () => this._addFixedExpense());
        document.getElementById('save-monthly-data')?.addEventListener('click', () => this._saveMonthlyData());

        // Expense
        document.getElementById('save-expense')?.addEventListener('click', () => this._saveExpense());

        // Income
        document.getElementById('save-income')?.addEventListener('click', () => this._saveIncome());

        // Report filters — BUG #5 CORRIGIDO: 'click' → 'change'
        document.getElementById('report-month')?.addEventListener('change', () => this._updateReport());
        document.getElementById('report-year')?.addEventListener('change', () => this._updateReport());

        // Report search
        document.getElementById('report-search')?.addEventListener('input', () => this._updateReport());

        // Export / Import
        document.getElementById('export-btn')?.addEventListener('click', () => this._exportData());
        document.getElementById('import-btn')?.addEventListener('click', () => {
            document.getElementById('import-file')?.click();
        });
        document.getElementById('import-file')?.addEventListener('change', (e) => {
            this._importData(e.target.files[0]);
            e.target.value = '';
        });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this._closeSidebar();
        });

        // Apply saved theme on load
        this._applyTheme();
    }

    // ─── Helpers ────────────────────────────────────────────────────

    _setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    _setVal(id, val) {
        const el = document.getElementById(id);
        if (el) el.value = val;
    }

    _getVal(id) {
        return document.getElementById(id)?.value || '';
    }

    _escape(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new OliveroneFinance();
});
