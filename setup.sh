#!/bin/bash

echo "🚀 Iniciando Task Manager - Full Stack Application"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Passo 1: Iniciando infraestrutura com Docker...${NC}"
docker-compose up -d

echo ""
echo -e "${YELLOW}⏳ Aguardando serviços iniciarem (30 segundos)...${NC}"
sleep 30

echo ""
echo -e "${GREEN}✅ Infraestrutura iniciada!${NC}"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo "  - RabbitMQ: localhost:5672"
echo "  - RabbitMQ UI: http://localhost:15672 (admin/admin)"

echo ""
echo -e "${YELLOW}📦 Passo 2: Instalando dependências do backend...${NC}"
cd backend
npm install

echo ""
echo -e "${YELLOW}🔧 Passo 3: Configurando backend...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Arquivo .env criado"
fi

echo ""
echo -e "${YELLOW}📦 Passo 4: Instalando dependências do frontend...${NC}"
cd ../frontend
npm install

echo ""
echo -e "${YELLOW}🔧 Passo 5: Configurando frontend...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Arquivo .env criado"
fi

cd ..

echo ""
echo -e "${GREEN}✅ Instalação completa!${NC}"
echo ""
echo "Para iniciar a aplicação:"
echo ""
echo "  Terminal 1 - Backend:"
echo -e "  ${GREEN}cd backend && npm run start:dev${NC}"
echo ""
echo "  Terminal 2 - Frontend:"
echo -e "  ${GREEN}cd frontend && npm run dev${NC}"
echo ""
echo "Após iniciar, acesse:"
echo "  - Frontend: http://localhost:3000"
echo "  - API: http://localhost:3001/api"
echo "  - Swagger: http://localhost:3001/api/docs"
echo ""
