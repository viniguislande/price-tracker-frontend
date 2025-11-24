# Price Tracker - Front-End

## 📋 Descrição

Interface web desenvolvida com React e Vite para o sistema de rastreamento de preços. Permite buscar produtos, gerenciar favoritos, visualizar histórico de preços em gráficos e configurar alertas.

## 🎨 Funcionalidades

- 🔍 Busca de produtos na FakeStore API
- ❤️ Gerenciamento de favoritos
- 📊 Visualização de histórico de preços em gráficos
- 🔔 Configuração de alertas de preço
- 📈 Dashboard com estatísticas
- 🎯 Filtros e ordenação avançados
- 📱 Design responsivo

## 🚀 Tecnologias

- **React** 18.2.0 - Biblioteca JavaScript
- **Vite** 5.0.8 - Build tool
- **React Router** 6.20.0 - Roteamento
- **Tailwind CSS** 3.3.6 - Estilização
- **Chart.js** 4.4.0 - Gráficos
- **Axios** 1.6.2 - Cliente HTTP
- **React Hot Toast** 2.4.1 - Notificações
- **Lucide React** 0.294.0 - Ícones

## ⚙️ Instalação Local

```bash
# Clone o repositório
git clone <repository-url>
cd price-tracker-frontend

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

A aplicação estará disponível em: `http://localhost:3000`

## 🐳 Docker

```bash
# Build da imagem
docker build -t price-tracker-frontend .

# Executar container
docker run -p 3000:80 price-tracker-frontend
```

## 📁 Estrutura de Pastas

```
src/
├── components/      # Componentes reutilizáveis
│   ├── Navbar.jsx
│   ├── SearchBar.jsx
│   ├── ProductCard.jsx
│   ├── ProductList.jsx
│   ├── PriceChart.jsx
│   ├── AlertForm.jsx
│   └── Loading.jsx
├── pages/           # Páginas da aplicação
│   ├── Home.jsx
│   ├── Favorites.jsx
│   ├── ProductDetail.jsx
│   ├── Dashboard.jsx
│   └── NotFound.jsx
├── services/        # Serviços de API
│   └── api.js
├── utils/           # Funções auxiliares
│   └── helpers.js
├── App.jsx          # Componente principal
└── main.jsx         # Entry point
```

## 🔗 Integração com Back-End

A aplicação se comunica com o backend através de requisições HTTP para:

- **Base URL**: `http://localhost:8000/api`

Todas as requisições são feitas através do serviço `api.js` que utiliza Axios.

## 🎯 Funcionalidades Principais

### Home
- Busca de produtos na FakeStore API
- Filtro por categoria
- Adicionar produtos aos favoritos

### Favoritos
- Lista de produtos favoritos
- Filtros: categoria, faixa de preço
- Ordenação: preço, nome, data
- Paginação
- Badges de variação de preço

### Detalhes do Produto
- Informações completas
- Gráfico de histórico de preços
- Gerenciamento de alertas

### Dashboard
- Estatísticas gerais
- Produtos com maior alta/baixa
- Produtos mais caros/baratos
- Alertas ativos

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção

## 🔧 Configuração

O arquivo `vite.config.js` contém as configurações do Vite, incluindo a porta do servidor de desenvolvimento (3000).

O arquivo `tailwind.config.js` configura o Tailwind CSS para processar arquivos JSX/TSX.

## 📄 Licença

Este projeto é parte de um trabalho acadêmico.

