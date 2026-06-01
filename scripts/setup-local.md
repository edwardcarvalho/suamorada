# Setup Local — Sua Morada

Guia completo para ter a app a correr localmente com base de dados.

---

## Pré-requisitos

### 1. Instalar Docker Desktop
É a forma mais simples de ter PostgreSQL + Redis sem instalar nada no sistema.

**Download:** https://www.docker.com/products/docker-desktop/
- Instalar e abrir o Docker Desktop
- Confirmar que está a correr (ícone na barra de tarefas)

---

## Setup (1ª vez)

### 2. Levantar a base de dados

```bash
# Na pasta do projecto
cd C:\Users\Edward\source\repos\V1\suamorada

# Levantar PostgreSQL + Redis em background
docker compose up -d

# Confirmar que estão a correr
docker compose ps
```

Deverá ver:
```
NAME                   STATUS
suamorada_postgres     running (healthy)
suamorada_redis        running (healthy)
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Aplicar o schema na BD

```bash
# Cria todas as tabelas (properties, users, agencies, etc.)
npm run db:push
```

### 5. Popular com dados de teste

```bash
# Insere 10 imóveis fictícios em Lisboa, Porto, Braga, Faro, etc.
npm run db:seed
```

### 6. Configurar variáveis de ambiente

O ficheiro `.env.local` já está criado com as credenciais do Docker.
A única variável opcional mas recomendada é o Mapbox (para ver o mapa):

1. Criar conta gratuita em https://mapbox.com
2. Ir a **Account → Access tokens → Create a token**
3. Copiar o token (começa com `pk.eyJ1...`)
4. Abrir `.env.local` e preencher:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
   ```

### 7. Iniciar a app

```bash
npm run dev
```

Abrir: **http://localhost:3001**

---

## Uso diário

```bash
# Levantar BD (se Docker Desktop estiver fechado)
docker compose up -d

# Iniciar app
npm run dev

# Parar BD quando não usar
docker compose stop
```

---

## Ferramentas úteis

### Drizzle Studio (GUI da base de dados)
```bash
npm run db:studio
# Abre em http://local.drizzle.studio
# Permite ver/editar os dados directamente no browser
```

### Ver logs da BD
```bash
docker compose logs postgres -f
docker compose logs redis -f
```

### Reset completo da BD
```bash
# ATENÇÃO: apaga todos os dados
docker compose down -v
docker compose up -d
npm run db:push
npm run db:seed
```

### Conectar ao PostgreSQL directamente
```bash
docker exec -it suamorada_postgres psql -U suamorada -d suamorada
```

---

## Resolver problemas comuns

### "Cannot connect to database"
```bash
# Verificar se o Docker está a correr
docker compose ps

# Reiniciar se necessário
docker compose restart postgres
```

### "relation does not exist" (tabela não existe)
```bash
npm run db:push
```

### "Extension postgis does not exist"
```bash
# A imagem postgis/postgis já inclui a extensão
# Se necessário, criar manualmente:
docker exec -it suamorada_postgres psql -U suamorada -d suamorada -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

### Mapa não aparece
- Verificar que NEXT_PUBLIC_MAPBOX_TOKEN está preenchido no `.env.local`
- Reiniciar o servidor: Ctrl+C e `npm run dev` novamente

### Fotos não fazem upload
- Normal em dev — o upload usa um fallback local quando R2 não está configurado
- As fotos aparecem em preview mas não são persistidas entre sessões

---

## Estrutura das credenciais locais

```
PostgreSQL:
  Host:     localhost
  Port:     5432
  Database: suamorada
  User:     suamorada
  Password: suamorada_dev
  URL:      postgresql://suamorada:suamorada_dev@localhost:5432/suamorada

Redis:
  Host:     localhost
  Port:     6379
  URL:      redis://localhost:6379
```

---

## O que funciona sem configuração extra

| Feature                    | Funciona | Notas                          |
|----------------------------|----------|--------------------------------|
| Homepage + pesquisa        | ✅       | Com dados do seed              |
| Listagem de imóveis        | ✅       | Com dados do seed              |
| Detalhe do imóvel          | ✅       | Com dados mock (slug qualquer) |
| Formulário de publicação   | ✅       | Submit guarda na DB            |
| Dashboard                  | ✅       | Com dados mock                 |
| Login (magic link)         | ✅*      | *Email não envia sem Resend    |
| Mapa                       | ✅*      | *Precisa de MAPBOX_TOKEN       |
| Upload de fotos            | ✅*      | *Usa object URLs locais sem R2 |
| Email de contacto          | ❌       | Precisa de RESEND_API_KEY      |
| Login Google               | ❌       | Precisa de GOOGLE_CLIENT_*     |

---

*Criado em 2026-05-31 | Sua Morada*
