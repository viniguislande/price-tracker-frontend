#!/bin/bash

echo "🚀 Iniciando Price Tracker Frontend..."

# Verificar se Node está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 18+"
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale npm"
    exit 1
fi

# Instalar dependências se node_modules não existir
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências..."
    npm install
fi

# Iniciar servidor de desenvolvimento
echo "✅ Iniciando servidor na porta 3000..."
echo "🌐 Aplicação disponível em: http://localhost:3000"
npm run dev

