# Task Management System - Full Stack Application

## 📋 Descrição do Projeto

Sistema completo de gerenciamento de tarefas com autenticação, analytics, notificações em tempo real e dashboard de produtividade.

## 🏗️ Arquitetura

```
testeTecnico_lopt/
├── backend/          # API REST NestJS
├── frontend/         # Aplicação Next.js
├── shared/          # Código compartilhado (tipos, validações)
├── docker-compose.yml
└── README.md
```

## 🚀 Tecnologias Utilizadas

### Backend
- **NestJS** + TypeScript
- **PostgreSQL** (TypeORM)
- **Redis** (cache de listagens)
- **RabbitMQ** (mensageria)
- **Socket.io** (WebSocket tempo real)
- **JWT** (autenticação)
- **Swagger** (documentação)
- **Jest** (testes)

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** (com Dark Mode)
- **Zustand** (estado global + persist)
- **React Query** (data fetching + cache)
- **Socket.io Client** (WebSocket tempo real)
- **Recharts** (gráficos responsivos)
- **Axios** (HTTP client)

## 📦 Pré-requisitos

- Node.js >= 18
- Docker e Docker Compose
- npm ou yarn

## 🔧 Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd testeTecnico_lopt
```

### 2. Configure as variáveis de ambiente

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Inicie a infraestrutura (PostgreSQL, Redis, RabbitMQ)

#### Desenvolvimento (apenas infra):
```bash
# Sobe apenas PostgreSQL, Redis e RabbitMQ
docker-compose up -d postgres redis rabbitmq
```

#### Produção (aplicação completa):
```bash
# Sobe toda a stack (infra + backend + frontend)
docker-compose up -d --build
```

**Nota:** No desenvolvimento, rode backend e frontend localmente para hot-reload. Em produção, use Docker Compose completo.

### 4. Instale as dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Shared (opcional)
cd ../shared
npm install
```

### 5. Execute as migrações do banco de dados

#### Desenvolvimento (local):
```bash
cd backend
npm run migration:run
```

#### Produção (Docker):
```bash
# Após o build dos containers
docker exec -it task-manager-backend node run-migrations.js
```

**Nota:** As migrations criam automaticamente as tabelas `users` e `tasks` com todos os relacionamentos, índices e constraints necessários.

### 6. Inicie os serviços

```bash
# Backend (em um terminal)
cd backend
npm run start:dev

# Frontend (em outro terminal)
cd frontend
npm run dev
```

### 7. Acesse a aplicação

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger Docs: http://localhost:3001/api/docs

## 🧪 Como Rodar os Testes

### Backend

```bash
cd backend
npm run test        # Testes unitários
npm run test:e2e    # Testes E2E
npm run test:cov    # Cobertura
```

### Frontend

```bash
cd frontend
npm run test        # Testes
npm run test:watch  # Modo watch
```

## 📐 Decisões Técnicas e Arquitetura

### Estrutura do Backend

```
backend/
├── src/
│   ├── auth/          # Módulo de autenticação (JWT)
│   ├── tasks/         # CRUD de tarefas
│   ├── analytics/     # Métricas e analytics
│   ├── notifications/ # Worker RabbitMQ
│   ├── cache/         # Serviço de cache Redis
│   ├── database/      # Configuração TypeORM
│   └── common/        # Guards, decorators, utils
```

**Decisões:**
- **TypeORM** para facilitar migrações e queries complexas
- **Class Validator** para validação robusta de DTOs
- **Guards e Decorators** customizados para autenticação e autorização
- **Redis** com TTL de 5 minutos apenas para cache de listagens (analytics em tempo real)
- **RabbitMQ** para processamento assíncrono de notificações de alta prioridade
- **Socket.io** para notificações em tempo real via WebSocket
- **Swagger** para documentação automática da API

### Estrutura do Frontend

```
frontend/
├── app/              # App Router (Next.js 14)
│   ├── (auth)/      # Rotas públicas (login, registro)
│   ├── (dashboard)/ # Rotas protegidas (tarefas, analytics)
│   └── layout.tsx
├── components/      # Componentes reutilizáveis
├── lib/            # Utilidades, API client, hooks
└── store/          # Zustand stores
```

**Decisões:**
- **App Router** do Next.js 14 para melhor performance e DX
- **Zustand com persist** para estado global e persistência de autenticação
- **React Query** com staleTime:0 para dados sempre frescos
- **Socket.io Client** para atualizações em tempo real sem polling
- **TailwindCSS** com dark mode (class strategy) e tema personalizável
- **Route Groups** para organizar rotas públicas vs protegidas
- **Recharts** para visualizações de dados responsivas e acessíveis
- **ThemeContext** para gerenciamento de tema com localStorage

### Modelo de Dados - Tarefa

```typescript
{
  id: uuid,
  title: string,
  description?: string,
  status: 'pending' | 'in_progress' | 'completed',
  priority: 'low' | 'medium' | 'high',
  dueDate?: Date,
  createdAt: Date,
  updatedAt: Date,
  userId: uuid
}
```

## 🎯 Endpoints da API

Documentação completa disponível em: `http://localhost:3001/api/docs`

### Autenticação
- `POST /auth/register` - Criar novo usuário
- `POST /auth/login` - Login e obter JWT
- `GET /auth/profile` - Obter perfil do usuário (protegido)

### Tarefas
- `GET /tasks` - Listar tarefas (paginação, filtros, ordenação)
- `GET /tasks/:id` - Buscar tarefa específica
- `POST /tasks` - Criar tarefa
- `PATCH /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Deletar tarefa

### Analytics
- `GET /analytics/overview` - Métricas gerais (tempo real)
- `GET /analytics/productivity` - Dados de produtividade (tempo real)
- `GET /analytics/trends` - Tendências temporais (tempo real)

### WebSocket (Socket.io)
- **Porta:** 3001
- **Eventos:**
  - `tasks:updated` - Emitido ao criar/editar/deletar task
  - `analytics:updated` - Emitido quando analytics mudam
- **Comportamento:** Frontend recebe evento → invalida cache → refaz requisição HTTP

## ✨ Diferenciais Implementados

1. **WebSocket em tempo real** - Atualizações instantâneas via Socket.io sem polling
2. **Dark Mode completo** - Tema escuro persistente com ThemeContext
3. **Cache inteligente** - Redis para listagens + invalidação automática
4. **Notificações assíncronas** - Worker dedicado para RabbitMQ
5. **Dashboard rico** - Múltiplos gráficos e KPIs de produtividade em tempo real
6. **View Kanban + Lista** - Dois modos de visualização de tarefas
7. **Filtros avançados** - Status, prioridade, ordenação e paginação
8. **Zustand Persist** - Autenticação persistente com hidratação
9. **Docker Compose** - Infraestrutura completa em um comando
10. **TypeScript strict mode** - Máxima type safety em todo o projeto
11. **Testes abrangentes** - Cobertura de testes unitários e E2E
12. **Tratamento de erros global** - Error boundaries e interceptors

## 🤖 Como IA foi Usada no Desenvolvimento

- **Planejamento inicial** - Estruturação da arquitetura
- **Geração de boilerplate** - Código base de módulos
- **Testes** - Geração de casos de teste
- **Documentação** - README e comentários
- **Troubleshooting** - Resolução de problemas técnicos

## 📝 Trade-offs e Melhorias Futuras

### Trade-offs
- **TypeORM vs Prisma**: Escolhi TypeORM pela familiaridade com decorators do NestJS
- **App Router vs Pages Router**: App Router é mais moderno mas tem menor adoção
- **Monorepo vs Repos separados**: Monorepo facilita compartilhamento mas aumenta complexidade

### Melhorias Futuras
- [ ] Adicionar suporte a anexos nas tarefas (upload de arquivos)
- [ ] Adicionar internacionalização (i18n) para múltiplos idiomas
- [ ] Implementar SSO (Google, GitHub) para login social
- [ ] Adicionar testes E2E com Playwright para fluxos completos
- [ ] Configurar CI/CD com GitHub Actions para deploy automático
- [ ] Adicionar rate limiting para proteção de API
- [ ] Implementar audit logs para rastreabilidade
- [ ] Adicionar notificações por email para tarefas urgentes
- [ ] Implementar colaboração em tempo real (múltiplos usuários)
- [ ] Adicionar tags customizáveis para categorização de tarefas

## 📄 Licença

MIT

## 👨‍💻 Autor

Desenvolvido como parte do desafio técnico Full Stack Pleno - LOOPT
