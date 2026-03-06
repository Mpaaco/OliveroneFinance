// Aplicativo Oliverone Finance
class OliveroneFinance {
    constructor() {
        this.currentScreen = 'loading';
        this.data = {
            monthlyIncome: 0,
            fixedExpenses: [],
            expenses: [],
            incomes: [],
            settings: {}
        };
        
        this.isDataLoaded = false;
        this.isDashboardReady = false;
        this.minimumLoadingTimeReached = false;
        this.loadingStartTime = Date.now();
        this.minimumLoadingDuration = 3000; // 15 segundos em milissegundos
        
        this.init();
    }

    init() {
        this.showLoadingScreen();
        this.setupEventListeners();
        this.populateYearFilter();
        
        // Iniciar timer para tempo mínimo de loading
        setTimeout(() => {
            this.minimumLoadingTimeReached = true;
            this.checkIfReadyToHideLoading();
        }, this.minimumLoadingDuration);
        
        // Carregar dados e aguardar conclusão
        this.loadDataAsync().then(() => {
            this.isDataLoaded = true;
            this.checkIfReadyToHideLoading();
        });
        
        // Preparar dashboard e aguardar conclusão
        this.prepareDashboard().then(() => {
            this.isDashboardReady = true;
            this.checkIfReadyToHideLoading();
        });
    }

    // Método assíncrono para carregar dados
    async loadDataAsync() {
        return new Promise((resolve) => {
            try {
                const savedData = localStorage.getItem('oliveroneFinanceData');
                if (savedData) {
                    this.data = { ...this.data, ...JSON.parse(savedData) };
                }
                
                // Simular tempo de processamento se necessário
                setTimeout(() => {
                    resolve();
                }, 100);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                resolve(); // Resolve mesmo com erro para não travar
            }
        });
    }

    // Método assíncrono para preparar dashboard
    async prepareDashboard() {
        return new Promise((resolve) => {
            // Aguardar que o DOM esteja completamente pronto
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.updateDashboard();
                    resolve();
                });
            } else {
                this.updateDashboard();
                resolve();
            }
        });
    }

    // Verificar se está pronto para esconder o loading
    checkIfReadyToHideLoading() {
        // Só esconde o loading se TODAS as condições forem atendidas:
        // 1. Dados carregados
        // 2. Dashboard preparado
        // 3. Tempo mínimo de 15 segundos atingido
        if (this.isDataLoaded && this.isDashboardReady && this.minimumLoadingTimeReached) {
            // Pequeno delay para garantir que tudo foi renderizado
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 200);
        }
    }

    // Método para esconder a tela de loading
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('active');
            loadingScreen.style.display = 'none';
        }
        
        this.showScreen('home');
        document.getElementById('main-header').style.display = 'flex';
        
        // Log para debug (pode ser removido em produção)
        const totalLoadingTime = Date.now() - this.loadingStartTime;
        console.log(`Tela de loading exibida por ${totalLoadingTime}ms (${(totalLoadingTime/1000).toFixed(1)}s)`);
    }

    // Gerenciamento de dados
    loadData() {
        // Método mantido para compatibilidade, mas agora usa loadDataAsync
        try {
            const savedData = localStorage.getItem('oliveroneFinanceData');
            if (savedData) {
                this.data = { ...this.data, ...JSON.parse(savedData) };
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    saveData() {
        try {
            localStorage.setItem('oliveroneFinanceData', JSON.stringify(this.data));
            this.showToast('Dados salvos com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            this.showToast('Erro ao salvar dados', 'error');
        }
    }

    // Gerenciamento de telas
    showScreen(screenName) {
        // Esconder todas as telas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Mostrar tela específica
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }

        // Atualizar título da página
        this.updatePageTitle(screenName);

        // Atualizar navegação ativa
        this.updateActiveNavigation(screenName);

        // Fechar sidebar se estiver aberta
        this.closeSidebar();

        // Atualizar dados específicos da tela
        this.updateScreenData(screenName);
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('active');
            loadingScreen.style.display = 'flex';
        }
        document.getElementById('main-header').style.display = 'none';
    }

    updatePageTitle(screenName) {
        const titles = {
            'home': 'Oliverone Finance',
            'monthly-register': 'Registro Mensal',
            'new-expense': 'Novo Gasto',
            'new-income': 'Novo Recebimento',
            'financial-report': 'Relatório Financeiro'
        };

        const pageTitle = document.getElementById('page-title');
        if (pageTitle && titles[screenName]) {
            pageTitle.textContent = titles[screenName];
        }

        // Mostrar header se não estiver na tela de carregamento
        if (screenName !== 'loading') {
            document.getElementById('main-header').style.display = 'flex';
        }
    }

    updateActiveNavigation(screenName) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeItem = document.querySelector(`[data-screen="${screenName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    updateScreenData(screenName) {
        switch (screenName) {
            case 'home':
                this.updateDashboard();
                break;
            case 'monthly-register':
                this.loadMonthlyRegisterData();
                break;
            case 'new-expense':
                this.resetExpenseForm();
                break;
            case 'new-income':
                this.resetIncomeForm();
                break;
            case 'financial-report':
                this.updateFinancialReport();
                break;
        }
    }

    // Sidebar
    openSidebar() {
        document.getElementById('sidebar').classList.add('active');
        document.getElementById('sidebar-overlay').classList.add('active');
    }

    closeSidebar() {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('sidebar-overlay').classList.remove('active');
    }

    // Dashboard (Página Inicial)
    updateDashboard() {
        const currentBalance = this.calculateCurrentBalance();
        const totalExpenses = this.calculateTotalExpenses();
        const debtAmount = this.calculateDebtAmount();

        const currentBalanceEl = document.getElementById('current-balance');
        const totalExpensesEl = document.getElementById('total-expenses');
        const debtAmountEl = document.getElementById('debt-amount');

        if (currentBalanceEl) currentBalanceEl.textContent = this.formatCurrency(currentBalance);
        if (totalExpensesEl) totalExpensesEl.textContent = this.formatCurrency(totalExpenses);
        if (debtAmountEl) debtAmountEl.textContent = this.formatCurrency(debtAmount);

        // Atualizar cor do saldo
        const balanceElement = document.getElementById('current-balance');
        if (balanceElement) {
            balanceElement.className = currentBalance >= 0 ? 'amount positive' : 'amount negative';
        }

        this.updateRecentExpenses();
    }

    calculateCurrentBalance() {
        const totalIncome = this.data.monthlyIncome + this.data.incomes.reduce((sum, income) => sum + income.amount, 0);
        const totalExpenses = this.calculateTotalExpenses();
        return totalIncome - totalExpenses;
    }

    calculateTotalExpenses() {
        const fixedExpenses = this.data.fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const variableExpenses = this.data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        return fixedExpenses + variableExpenses;
    }

    calculateDebtAmount() {
        // Por simplicidade, consideramos débito como gastos que excedem a renda
        const balance = this.calculateCurrentBalance();
        return balance < 0 ? Math.abs(balance) : 0;
    }

    updateRecentExpenses() {
        const recentExpensesList = document.getElementById('recent-expenses-list');
        if (!recentExpensesList) return;

        const recentExpenses = this.data.expenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        if (recentExpenses.length === 0) {
            recentExpensesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <p>Nenhum gasto registrado ainda</p>
                </div>
            `;
            return;
        }

        recentExpensesList.innerHTML = recentExpenses.map(expense => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-description">${expense.description}</div>
                    <div class="transaction-date">${this.formatDate(expense.date)}</div>
                </div>
                <div class="transaction-amount">${this.formatCurrency(expense.amount)}</div>
            </div>
        `).join('');
    }

    // Registro Mensal
    loadMonthlyRegisterData() {
        const monthlyIncomeEl = document.getElementById('monthly-income');
        if (monthlyIncomeEl) {
            monthlyIncomeEl.value = this.data.monthlyIncome || '';
        }
        this.renderFixedExpenses();
    }

    renderFixedExpenses() {
        const container = document.getElementById('fixed-expenses-container');
        if (!container) return;
        
        if (this.data.fixedExpenses.length === 0) {
            container.innerHTML = `
                <div class="fixed-expense-item">
                    <input type="text" placeholder="Descrição (ex: Aluguel)" class="expense-description">
                    <div class="input-group">
                        <span class="input-prefix">R$</span>
                        <input type="number" placeholder="0,00" step="0.01" class="expense-amount">
                    </div>
                    <button type="button" class="remove-expense-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = this.data.fixedExpenses.map((expense, index) => `
                <div class="fixed-expense-item" data-index="${index}">
                    <input type="text" placeholder="Descrição (ex: Aluguel)" class="expense-description" value="${expense.description}">
                    <div class="input-group">
                        <span class="input-prefix">R$</span>
                        <input type="number" placeholder="0,00" step="0.01" class="expense-amount" value="${expense.amount}">
                    </div>
                    <button type="button" class="remove-expense-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }

        this.setupFixedExpenseListeners();
    }

    setupFixedExpenseListeners() {
        document.querySelectorAll('.remove-expense-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.fixed-expense-item');
                const index = item.dataset.index;
                
                if (index !== undefined) {
                    this.data.fixedExpenses.splice(index, 1);
                } else {
                    item.remove();
                }
                
                this.renderFixedExpenses();
            });
        });
    }

    addFixedExpense() {
        const container = document.getElementById('fixed-expenses-container');
        if (!container) return;

        const newExpenseHTML = `
            <div class="fixed-expense-item">
                <input type="text" placeholder="Descrição (ex: Aluguel)" class="expense-description">
                <div class="input-group">
                    <span class="input-prefix">R$</span>
                    <input type="number" placeholder="0,00" step="0.01" class="expense-amount">
                </div>
                <button type="button" class="remove-expense-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', newExpenseHTML);
        this.setupFixedExpenseListeners();
    }

    saveMonthlyData() {
        const monthlyIncomeEl = document.getElementById('monthly-income');
        const monthlyIncome = monthlyIncomeEl ? parseFloat(monthlyIncomeEl.value) || 0 : 0;
        const fixedExpenseItems = document.querySelectorAll('.fixed-expense-item');
        
        this.data.monthlyIncome = monthlyIncome;
        this.data.fixedExpenses = [];

        fixedExpenseItems.forEach(item => {
            const description = item.querySelector('.expense-description').value.trim();
            const amount = parseFloat(item.querySelector('.expense-amount').value) || 0;
            
            if (description && amount > 0) {
                this.data.fixedExpenses.push({ description, amount });
            }
        });

        this.saveData();
        this.updateDashboard();
    }

    // Novo Gasto
    resetExpenseForm() {
        const descriptionEl = document.getElementById('expense-description');
        const amountEl = document.getElementById('expense-amount');
        const dateEl = document.getElementById('expense-date');
        const categoryEl = document.getElementById('expense-category');

        if (descriptionEl) descriptionEl.value = '';
        if (amountEl) amountEl.value = '';
        if (dateEl) dateEl.value = this.getCurrentDate();
        if (categoryEl) categoryEl.value = '';
    }

    saveExpense() {
        const descriptionEl = document.getElementById('expense-description');
        const amountEl = document.getElementById('expense-amount');
        const dateEl = document.getElementById('expense-date');
        const categoryEl = document.getElementById('expense-category');

        const description = descriptionEl ? descriptionEl.value.trim() : '';
        const amount = amountEl ? parseFloat(amountEl.value) : 0;
        const date = dateEl ? dateEl.value : '';
        const category = categoryEl ? categoryEl.value : '';

        if (!description || !amount || amount <= 0 || !date) {
            this.showToast('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }

        const expense = {
            id: Date.now(),
            description,
            amount,
            date,
            category: category || 'outros',
            timestamp: new Date().toISOString()
        };

        this.data.expenses.push(expense);
        this.saveData();
        this.resetExpenseForm();
        this.showToast('Gasto registrado com sucesso!', 'success');
    }

    // Novo Recebimento
    resetIncomeForm() {
        const descriptionEl = document.getElementById('income-description');
        const amountEl = document.getElementById('income-amount');
        const dateEl = document.getElementById('income-date');

        if (descriptionEl) descriptionEl.value = '';
        if (amountEl) amountEl.value = '';
        if (dateEl) dateEl.value = this.getCurrentDate();
    }

    saveIncome() {
        const descriptionEl = document.getElementById('income-description');
        const amountEl = document.getElementById('income-amount');
        const dateEl = document.getElementById('income-date');

        const description = descriptionEl ? descriptionEl.value.trim() : '';
        const amount = amountEl ? parseFloat(amountEl.value) : 0;
        const date = dateEl ? dateEl.value : '';

        if (!description || !amount || amount <= 0 || !date) {
            this.showToast('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }

        const income = {
            id: Date.now(),
            description,
            amount,
            date,
            timestamp: new Date().toISOString()
        };

        this.data.incomes.push(income);
        this.saveData();
        this.resetIncomeForm();
        this.showToast('Recebimento registrado com sucesso!', 'success');
    }

    // Relatório Financeiro
    populateYearFilter() {
        const yearSelect = document.getElementById('report-year');
        if (!yearSelect) return;

        const currentYear = new Date().getFullYear();
        const years = [];
        
        // Adicionar anos baseados nos dados existentes
        this.data.expenses.forEach(expense => {
            const year = new Date(expense.date).getFullYear();
            if (!years.includes(year)) years.push(year);
        });
        
        this.data.incomes.forEach(income => {
            const year = new Date(income.date).getFullYear();
            if (!years.includes(year)) years.push(year);
        });
        
        // Garantir que o ano atual esteja incluído
        if (!years.includes(currentYear)) years.push(currentYear);
        
        years.sort((a, b) => b - a);
        
        yearSelect.innerHTML = '<option value="">Todos os anos</option>' +
            years.map(year => `<option value="${year}">${year}</option>`).join('');
    }

    updateFinancialReport() {
        const monthEl = document.getElementById('report-month');
        const yearEl = document.getElementById('report-year');
        
        const selectedMonth = monthEl ? monthEl.value : '';
        const selectedYear = yearEl ? yearEl.value : '';

        const filteredData = this.getFilteredTransactions(selectedMonth, selectedYear);
        
        const totalIncome = filteredData.incomes.reduce((sum, income) => sum + income.amount, 0) + 
                           (this.shouldIncludeMonthlyIncome(selectedMonth, selectedYear) ? this.data.monthlyIncome : 0);
        
        const totalExpenses = filteredData.expenses.reduce((sum, expense) => sum + expense.amount, 0) +
                             (this.shouldIncludeFixedExpenses(selectedMonth, selectedYear) ? 
                              this.data.fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0) : 0);
        
        const finalBalance = totalIncome - totalExpenses;

        const totalIncomeEl = document.getElementById('report-total-income');
        const totalExpensesEl = document.getElementById('report-total-expenses');
        const finalBalanceEl = document.getElementById('report-final-balance');

        if (totalIncomeEl) totalIncomeEl.textContent = this.formatCurrency(totalIncome);
        if (totalExpensesEl) totalExpensesEl.textContent = this.formatCurrency(totalExpenses);
        
        if (finalBalanceEl) {
            finalBalanceEl.textContent = this.formatCurrency(finalBalance);
            finalBalanceEl.className = finalBalance >= 0 ? 'amount positive' : 'amount negative';
        }

        this.updateTransactionsHistory(filteredData);
    }

    getFilteredTransactions(month, year) {
        let filteredExpenses = [...this.data.expenses];
        let filteredIncomes = [...this.data.incomes];

        if (month) {
            filteredExpenses = filteredExpenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return (expenseDate.getMonth() + 1).toString().padStart(2, '0') === month;
            });
            
            filteredIncomes = filteredIncomes.filter(income => {
                const incomeDate = new Date(income.date);
                return (incomeDate.getMonth() + 1).toString().padStart(2, '0') === month;
            });
        }

        if (year) {
            filteredExpenses = filteredExpenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getFullYear().toString() === year;
            });
            
            filteredIncomes = filteredIncomes.filter(income => {
                const incomeDate = new Date(income.date);
                return incomeDate.getFullYear().toString() === year;
            });
        }

        return { expenses: filteredExpenses, incomes: filteredIncomes };
    }

    shouldIncludeMonthlyIncome(month, year) {
        if (!month && !year) return true;
        const currentDate = new Date();
        const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const currentYear = currentDate.getFullYear().toString();
        
        return (!month || month === currentMonth) && (!year || year === currentYear);
    }

    shouldIncludeFixedExpenses(month, year) {
        return this.shouldIncludeMonthlyIncome(month, year);
    }

    updateTransactionsHistory(filteredData) {
        const historyList = document.getElementById('transactions-history-list');
        if (!historyList) return;

        const allTransactions = [
            ...filteredData.expenses.map(expense => ({ ...expense, type: 'expense' })),
            ...filteredData.incomes.map(income => ({ ...income, type: 'income' }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        if (allTransactions.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>Nenhuma transação encontrada para o período selecionado</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = allTransactions.map(transaction => `
            <div class="transaction-item ${transaction.type}">
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-date">${this.formatDate(transaction.date)}</div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                </div>
            </div>
        `).join('');
    }

    // Utilitários
    formatCurrency(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    getCurrentDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');

        toast.className = `toast ${type}`;
        if (toastIcon) {
            toastIcon.className = `toast-icon fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`;
        }
        if (toastMessage) {
            toastMessage.textContent = message;
        }

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Event Listeners
    setupEventListeners() {
        // Menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                this.openSidebar();
            });
        }

        // Close sidebar
        const closeSidebar = document.getElementById('close-sidebar');
        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

        const sidebarOverlay = document.getElementById('sidebar-overlay');
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const screen = item.dataset.screen;
                this.showScreen(screen);
            });
        });

        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.updateDashboard();
                this.showToast('Dados atualizados!', 'success');
            });
        }

        // Monthly register
        const addFixedExpense = document.getElementById('add-fixed-expense');
        if (addFixedExpense) {
            addFixedExpense.addEventListener('click', () => {
                this.addFixedExpense();
            });
        }

        const saveMonthlyData = document.getElementById('save-monthly-data');
        if (saveMonthlyData) {
            saveMonthlyData.addEventListener('click', () => {
                this.saveMonthlyData();
            });
        }

        // New expense
        const saveExpense = document.getElementById('save-expense');
        if (saveExpense) {
            saveExpense.addEventListener('click', () => {
                this.saveExpense();
            });
        }

        // New income
        const saveIncome = document.getElementById('save-income');
        if (saveIncome) {
            saveIncome.addEventListener('click', () => {
                this.saveIncome();
            });
        }

        // Financial report filters
        const reportMonth = document.getElementById('report-month');
        if (reportMonth) {
            reportMonth.addEventListener('change', () => {
                this.updateFinancialReport();
            });
        }

        const reportYear = document.getElementById('report-year');
        if (reportYear) {
            reportYear.addEventListener('click', () => {
                this.updateFinancialReport();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSidebar();
            }
        });
    }
}

// Inicializar aplicativo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.oliveroneFinance = new OliveroneFinance();
});

