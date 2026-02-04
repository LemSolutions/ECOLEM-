# 🔐 Configurazione Variabili d'Ambiente

## Variabili Necessarie

### Supabase (Obbligatorie)
| Variabile | Tipo | Descrizione |
|-----------|------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Pubblica | URL del progetto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pubblica | Chiave anonima per client |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ Privata | Chiave admin per server |

## Setup Locale

Crea `.env.local` nella root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Setup Vercel

1. Project Settings > Environment Variables
2. Aggiungi ogni variabile per Production e Preview

## Regole di Sicurezza

- **NEXT_PUBLIC_*** = visibili nel browser, sicure
- **Senza NEXT_PUBLIC_** = solo server, MAI esporre

## Dove Trovare le Chiavi

1. [Supabase Dashboard](https://supabase.com/dashboard)
2. Settings > API
3. Copia: Project URL, anon key, service_role key
