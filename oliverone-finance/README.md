# Oliverone Finance

Um aplicativo web moderno para gerenciamento financeiro pessoal, desenvolvido com HTML, CSS e JavaScript puro.

## 📱 Funcionalidades

### Tela de Carregamento
- Apresentação da marca com animação de loading
- Transição automática para a página inicial após 3 segundos

### Página Inicial (Dashboard)
- **Saldo Atual**: Exibe o saldo total (recebimentos - gastos)
- **Valor Devedor**: Mostra valores em débito
- **Gastos Totais**: Soma de todos os gastos registrados
- **Últimos Gastos**: Lista dos gastos mais recentes com data e valor

### Menu de Navegação
- Menu hambúrguer lateral com acesso a todas as funcionalidades
- Navegação fluida entre as telas
- Indicação visual da tela ativa

### Registro Mensal
- Cadastro de renda mensal fixa
- Gerenciamento de gastos fixos mensais (aluguel, contas, etc.)
- Adição e remoção dinâmica de gastos fixos

### Novo Gasto
- Registro de gastos variáveis
- Campos: descrição, valor, data e categoria
- Categorias predefinidas: Alimentação, Transporte, Lazer, Educação, Saúde, Casa, Outros
- Validação de campos obrigatórios

### Novo Recebimento
- Registro de rendas extras ou recebimentos não fixos
- Campos: descrição, valor e data
- Validação de campos obrigatórios

### Relatório Financeiro
- Resumo completo de recebimentos e gastos
- Filtros por mês e ano
- Histórico detalhado de todas as transações
- Cálculo automático do saldo final

## 🎨 Design e Interface

### Características Visuais
- **Design Responsivo**: Funciona perfeitamente em desktop e dispositivos móveis
- **Tema Moderno**: Cores profissionais com gradientes e sombras suaves
- **Animações**: Transições fluidas e micro-interações
- **Ícones**: Font Awesome para uma interface rica e intuitiva

### Paleta de Cores
- **Primária**: Azul (#2563eb)
- **Sucesso**: Verde (#10b981)
- **Perigo**: Vermelho (#ef4444)
- **Aviso**: Amarelo (#f59e0b)
- **Fundo**: Cinza claro (#f8fafc)

## 💾 Persistência de Dados

- **LocalStorage**: Todos os dados são salvos localmente no navegador
- **Backup Automático**: Dados são salvos automaticamente a cada operação
- **Recuperação**: Dados são carregados automaticamente ao abrir o aplicativo

## 🚀 Como Usar

### Instalação
1. Baixe todos os arquivos do projeto
2. Mantenha a estrutura de pastas:
   ```
   oliverone-finance/
   ├── index.html
   ├── css/
   │   └── styles.css
   ├── js/
   │   └── app.js
   └── README.md
   ```

### Execução
1. Abra o arquivo `index.html` em qualquer navegador moderno
2. O aplicativo carregará automaticamente
3. Aguarde a tela de loading (3 segundos) ou clique para pular

### Primeiro Uso
1. **Configure sua renda mensal**: Vá em "Registro Mensal" e defina sua renda e gastos fixos
2. **Registre gastos**: Use "Novo Gasto" para adicionar despesas do dia a dia
3. **Adicione recebimentos extras**: Use "Novo Recebimento" para rendas adicionais
4. **Acompanhe relatórios**: Visualize seu histórico em "Relatório Financeiro"

## 📊 Funcionalidades Técnicas

### Cálculos Automáticos
- **Saldo Atual**: (Renda Mensal + Recebimentos Extras) - (Gastos Fixos + Gastos Variáveis)
- **Valor Devedor**: Valor absoluto do saldo quando negativo
- **Gastos Totais**: Soma de todos os gastos fixos e variáveis

### Validações
- Campos obrigatórios são verificados antes do salvamento
- Valores numéricos são validados
- Datas são formatadas automaticamente

### Notificações
- Toast de sucesso ao salvar dados
- Toast de erro para validações
- Feedback visual para todas as ações

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilos modernos com Flexbox e Grid
- **JavaScript ES6+**: Lógica de aplicação com classes e módulos
- **Font Awesome**: Biblioteca de ícones
- **LocalStorage API**: Persistência de dados local

## 📱 Compatibilidade

### Navegadores Suportados
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Dispositivos
- Desktop (Windows, macOS, Linux)
- Tablets (iOS, Android)
- Smartphones (iOS, Android)

## 🔒 Privacidade e Segurança

- **Dados Locais**: Todas as informações ficam armazenadas apenas no seu dispositivo
- **Sem Servidor**: Não há envio de dados para servidores externos
- **Privacidade Total**: Suas informações financeiras permanecem privadas

## 🆘 Suporte

### Problemas Comuns
1. **Dados não salvam**: Verifique se o navegador permite localStorage
2. **Layout quebrado**: Atualize o navegador ou limpe o cache
3. **Funcionalidades não respondem**: Recarregue a página (F5)

### Backup Manual
Para fazer backup dos seus dados:
1. Abra as Ferramentas do Desenvolvedor (F12)
2. Vá na aba "Application" ou "Aplicação"
3. Encontre "Local Storage" e copie o conteúdo de "oliveroneFinanceData"

## 📈 Futuras Melhorias

- Gráficos e visualizações de dados
- Exportação de relatórios em PDF
- Categorias personalizáveis
- Metas de gastos e economia
- Sincronização em nuvem (opcional)
- Modo escuro
- Múltiplas moedas

## 📄 Licença

Este projeto foi desenvolvido como uma solução personalizada para gerenciamento financeiro pessoal.

---

**Desenvolvido com ❤️ para ajudar no controle financeiro pessoal**

