# 🚀 Guida al Deployment

## Flusso: GitHub → Vercel → Supabase

### 1️⃣ Setup GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USER/REPO.git
git push -u origin main
```

### 2️⃣ Setup Supabase
1. Crea progetto su supabase.com
2. SQL Editor → esegui `supabase/schema.sql`
3. Copia le chiavi API

### 3️⃣ Setup Vercel
1. vercel.com/new → Import repository
2. Aggiungi env variables
3. Deploy

### 4️⃣ Dominio
1. Vercel > Domains > Aggiungi dominio
2. Configura DNS
3. Attendi propagazione

## Deploy Automatico
```
Push GitHub → Vercel Build → Deploy
```

| Branch | Ambiente |
|--------|----------|
| main | Production |
| develop | Preview |
