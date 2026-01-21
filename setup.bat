@echo off
echo 🚀 Iniciando Task Manager - Full Stack Application
echo.

echo 📦 Passo 1: Iniciando infraestrutura com Docker...
docker-compose up -d

echo.
echo ⏳ Aguardando serviços iniciarem (30 segundos)...
timeout /t 30 /nobreak > nul

echo.
echo ✅ Infraestrutura iniciada!
echo   - PostgreSQL: localhost:5432
echo   - Redis: localhost:6379
echo   - RabbitMQ: localhost:5672
echo   - RabbitMQ UI: http://localhost:15672 (admin/admin)

echo.
echo 📦 Passo 2: Instalando dependências do backend...
cd backend
call npm install

echo.
echo 🔧 Passo 3: Configurando backend...
if not exist .env (
    copy .env.example .env
    echo Arquivo .env criado
)

echo.
echo 📦 Passo 4: Instalando dependências do frontend...
cd ..\frontend
call npm install

echo.
echo 🔧 Passo 5: Configurando frontend...
if not exist .env (
    copy .env.example .env
    echo Arquivo .env criado
)

cd ..

echo.
echo ✅ Instalação completa!
echo.
echo Para iniciar a aplicação:
echo.
echo   Terminal 1 - Backend:
echo   cd backend ^&^& npm run start:dev
echo.
echo   Terminal 2 - Frontend:
echo   cd frontend ^&^& npm run dev
echo.
echo Após iniciar, acesse:
echo   - Frontend: http://localhost:3000
echo   - API: http://localhost:3001/api
echo   - Swagger: http://localhost:3001/api/docs
echo.
pause
