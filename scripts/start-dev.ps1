# ─────────────────────────────────────────────────────────────────────────────
# Sua Morada — Script de arranque de desenvolvimento
# Uso: clique direito → "Executar com PowerShell"
#      ou: powershell -ExecutionPolicy Bypass -File scripts\start-dev.ps1
# ─────────────────────────────────────────────────────────────────────────────

$projectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $projectRoot

Write-Host ""
Write-Host "  Sua Morada — Dev Setup" -ForegroundColor Cyan
Write-Host "  ─────────────────────────" -ForegroundColor DarkGray
Write-Host ""

# 1. Verificar Docker
Write-Host "1. Verificar Docker..." -ForegroundColor Yellow
$docker = Get-Command docker -ErrorAction SilentlyContinue
if (-not $docker) {
  Write-Host "   ERRO: Docker nao encontrado." -ForegroundColor Red
  Write-Host "   Instalar em: https://www.docker.com/products/docker-desktop/" -ForegroundColor Red
  Write-Host ""
  Read-Host "Prima ENTER para sair"
  exit 1
}
Write-Host "   OK: Docker encontrado" -ForegroundColor Green

# 2. Levantar BD
Write-Host "2. Levantar PostgreSQL + Redis..." -ForegroundColor Yellow
docker compose up -d
if ($LASTEXITCODE -ne 0) {
  Write-Host "   ERRO: Falha ao iniciar containers. Verificar Docker Desktop." -ForegroundColor Red
  exit 1
}
Write-Host "   OK: Containers a correr" -ForegroundColor Green

# 3. Aguardar BD estar pronta
Write-Host "3. Aguardar base de dados..." -ForegroundColor Yellow
$retries = 0
do {
  Start-Sleep -Seconds 2
  $ready = docker exec suamorada_postgres pg_isready -U suamorada -d suamorada 2>$null
  $retries++
} while ($LASTEXITCODE -ne 0 -and $retries -lt 15)

if ($LASTEXITCODE -ne 0) {
  Write-Host "   AVISO: BD demorou a arrancar — continuar na mesma" -ForegroundColor Yellow
} else {
  Write-Host "   OK: PostgreSQL pronto" -ForegroundColor Green
}

# 4. Verificar .env.local
Write-Host "4. Verificar .env.local..." -ForegroundColor Yellow
if (-not (Test-Path ".env.local")) {
  Write-Host "   Criando .env.local a partir do exemplo..." -ForegroundColor Yellow
  Copy-Item ".env.local.example" ".env.local"
  Write-Host "   OK: .env.local criado (editar para adicionar tokens)" -ForegroundColor Green
} else {
  Write-Host "   OK: .env.local existe" -ForegroundColor Green
}

# 5. Instalar dependências
Write-Host "5. Verificar dependencias npm..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
  Write-Host "   Instalando (pode demorar 1-2 min)..." -ForegroundColor Yellow
  npm install --silent
  Write-Host "   OK: dependencias instaladas" -ForegroundColor Green
} else {
  Write-Host "   OK: node_modules existe" -ForegroundColor Green
}

# 6. Aplicar schema
Write-Host "6. Aplicar schema na BD..." -ForegroundColor Yellow
npm run db:push 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
  Write-Host "   OK: Schema aplicado" -ForegroundColor Green
} else {
  Write-Host "   AVISO: Erro no db:push — BD pode ja ter o schema" -ForegroundColor Yellow
}

# 7. Seed (apenas se a tabela estiver vazia)
Write-Host "7. Verificar dados de teste..." -ForegroundColor Yellow
$count = docker exec suamorada_postgres psql -U suamorada -d suamorada -tAc "SELECT COUNT(*) FROM properties" 2>$null
if ($count -eq "0" -or $null -eq $count) {
  Write-Host "   Inserindo dados de teste..." -ForegroundColor Yellow
  npm run db:seed 2>&1 | Out-Null
  Write-Host "   OK: 10 imoveis de teste inseridos" -ForegroundColor Green
} else {
  Write-Host "   OK: BD ja tem $count imoveis" -ForegroundColor Green
}

# 8. Iniciar app
Write-Host ""
Write-Host "  Tudo pronto!" -ForegroundColor Green
Write-Host "  Abrindo http://localhost:3001 ..." -ForegroundColor Cyan
Write-Host ""

# Abrir browser
Start-Process "http://localhost:3001"

# Iniciar servidor Next.js
npm run dev
