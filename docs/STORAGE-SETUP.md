# ═══════════════════════════════════════════════════════════════════════════
# SETUP SUPABASE STORAGE PER UPLOAD IMMAGINI
# ═══════════════════════════════════════════════════════════════════════════

## 🎯 Cosa fa questa funzionalità

Ora puoi caricare immagini direttamente dal tuo computer nella dashboard admin, invece di dover inserire URL esterni. Le immagini vengono caricate su Supabase Storage e trasformate automaticamente in URL pubblici.

## 📋 Setup - Metodo 1: Dashboard Supabase (Consigliato)

1. **Vai su Supabase Dashboard**
   - Accedi a https://supabase.com/dashboard
   - Seleziona il tuo progetto

2. **Crea il bucket Storage**
   - Vai su **Storage** nel menu laterale
   - Clicca **"New bucket"**
   - Nome bucket: `images`
   - ✅ **Public bucket**: Sì (importante per rendere le immagini accessibili)
   - File size limit: `5242880` (5MB)
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`
   - Clicca **"Create bucket"**

3. **Configura le Policies (opzionale ma consigliato)**
   - Vai su **Storage** → **Policies**
   - Seleziona il bucket `images`
   - Le policies dovrebbero essere già configurate automaticamente per bucket pubblici

## 📋 Setup - Metodo 2: SQL Script

Se preferisci usare SQL:

1. Vai su **SQL Editor** nel menu laterale
2. Apri il file `supabase/setup-storage.sql`
3. Copia e incolla il contenuto
4. Clicca **"Run"**

## ✅ Verifica Setup

Dopo aver creato il bucket, verifica che:

- Il bucket `images` esiste in Storage
- Il bucket è marcato come **Public**
- Puoi vedere il bucket nella lista

## 🚀 Come Usare

1. **Nella Dashboard Admin**
   - Vai su qualsiasi sezione (Blog, Prodotti, Servizi, About)
   - Clicca su "Nuovo" o modifica un elemento esistente
   - Nel campo "Immagine" vedrai:
     - Un'area di drag & drop
     - Un campo per inserire URL (alternativa)
     - Anteprima dell'immagine

2. **Carica un'immagine**
   - **Opzione A**: Trascina un'immagine nell'area di upload
   - **Opzione B**: Clicca sull'area e seleziona un file dal tuo computer
   - **Opzione C**: Incolla un URL immagine nel campo testo

3. **L'immagine viene caricata**
   - Vedrai un'anteprima immediata
   - L'URL viene salvato automaticamente nel database
   - L'immagine sarà visibile sul sito

## 📝 Note Importanti

- **Limite dimensione**: 5MB per immagine
- **Formati supportati**: JPEG, PNG, WEBP, GIF
- **Storage gratuito**: Supabase offre 1GB di storage gratuito
- **URL pubblici**: Le immagini sono accessibili pubblicamente tramite URL Supabase

## 🔧 Risoluzione Problemi

### Errore: "Bucket non trovato"
- Verifica che il bucket `images` esista in Storage
- Verifica che il bucket sia pubblico

### Errore: "Non autorizzato"
- Verifica di essere loggato nella dashboard admin
- Verifica che le policies siano configurate correttamente

### Immagine non si carica
- Verifica la dimensione del file (< 5MB)
- Verifica il formato (JPEG, PNG, WEBP, GIF)
- Controlla la console del browser per errori

## 📚 Documentazione

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)
