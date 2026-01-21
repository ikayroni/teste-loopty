# Guia de Instalação - Task Manager

## 🚀 Instalação Rápida

### Pré-requisitos

Certifique-se de ter instalado:
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- **Git** ([Download](https://git-scm.com/))

### Passo a Passo

#### 1. Clone o Repositório

```bash
git clone <url-do-seu-repositorio>
cd testeTecnico_lopt
```

#### 2. Inicie a Infraestrutura

```bash
# Iniciar PostgreSQL, Redis e RabbitMQ com Docker
docker-compose up -d

# Verificar se os containers estão rodando
docker-compose ps
```

Você deve ver 3 containers ativos:
- `task-manager-postgres` (porta 5432)
- `task-manager-redis` (porta 6379)
- `task-manager-rabbitmq` (portas 5672, 15672)

#### 3. Configure o Backend

```bash
cd backend

# Copiar arquivo de variáveis de ambiente
copy .env.example .env
# No Linux/Mac: cp .env.example .env

# Instalar dependências
npm install

# Aguardar alguns segundos para o PostgreSQL inicializar completamente
# Então criar as tabelas do banco
npm run build
```

**Nota:** O TypeORM está configurado com `synchronize: true` em desenvolvimento, então as tabelas serão criadas automaticamente na primeira execução.

#### 4. Inicie o Backend

```bash
# No diretório backend/
npm run start:dev
```

Você deve ver:
```
🚀 Application is running on: http://localhost:3001
📚 Swagger docs available at: http://localhost:3001/api/docs
```

#### 5. Configure o Frontend (Nova Janela de Terminal)

```bash
cd frontend

# Copiar arquivo de variáveis de ambiente
copy .env.example .env
# No Linux/Mac: cp .env.example .env

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Você deve ver:
```
▲ Next.js 14.2.0
- Local: http://localhost:3000
```

#### 6. Acesse a Aplicação

Abra seu navegador e acesse:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **Documentação Swagger:** http://localhost:3001/api/docs
- **RabbitMQ Management:** http://localhost:15672 (admin/admin)

## 🧪 Executando os Testes

### Backend

```bash
cd backend

# Testes unitários
npm test

# Testes E2E
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

### Frontend

```bash
cd frontend

# Testes de componentes
npm test

# Modo watch
npm run test:watch
```

## 🐛 Troubleshooting

### Problema: Backend não conecta ao PostgreSQL

**Solução:**
```bash
# Verificar se o container está rodando
docker-compose ps

# Ver logs do PostgreSQL
docker-compose logs postgres

# Reiniciar o container
docker-compose restart postgres
```

### Problema: Porta 3000 ou 3001 já está em uso

**Solução:**
```bash
# Windows - Encontrar processo na porta
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac - Encontrar e matar processo
lsof -ti:3000 | xargs kill -9
```

Ou altere a porta no arquivo `.env`:
```env
# Backend
PORT=3002

# Frontend (next.config.js ou package.json)
```

### Problema: Redis ou RabbitMQ não conectam

**Solução:**
```bash
# Parar todos os containers
docker-compose down

# Remover volumes (CUIDADO: apaga dados)
docker-compose down -v

# Iniciar novamente
docker-compose up -d

# Aguardar containers iniciarem (30-60 segundos)
docker-compose logs -f
```

### Problema: Erro de módulos não encontrados

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📝 Variáveis de Ambiente

### Backend (.env)

```env
NODE_ENV=development
PORT=3001

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=taskmanager

JWT_SECRET=seu-secret-super-seguro
JWT_EXPIRATION=7d

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_TTL=300

RABBITMQ_URL=amqp://admin:admin@localhost:5672
RABBITMQ_QUEUE=high-priority-tasks

API_PREFIX=api
SWAGGER_ENABLED=true
```

### Frontend (.env)

```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🚢 Deploy em Produção

### Backend

1. Configure variáveis de ambiente de produção
2. Build da aplicação:
```bash
npm run build
```

3. Inicie em produção:
```bash
npm run start:prod
```

### Frontend

1. Build da aplicação:
```bash
npm run build
```

2. Inicie em produção:
```bash
npm start
```

## 💡 Dicas

1. **Desenvolvimento Paralelo:** Use 3 terminais - um para backend, um para frontend e um para logs do Docker
2. **Hot Reload:** Ambos backend e frontend têm hot reload ativo
3. **Swagger:** Use http://localhost:3001/api/docs para testar a API visualmente
4. **RabbitMQ UI:** Acesse http://localhost:15672 para monitorar as filas

## 📞 Suporte

Se encontrar problemas não listados aqui, verifique:
1. Logs do Docker: `docker-compose logs`
2. Logs do Backend: Terminal onde rodou `npm run start:dev`
3. Logs do Frontend: Terminal onde rodou `npm run dev`
4. Issues no GitHub do projeto
