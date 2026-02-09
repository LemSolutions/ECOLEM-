# 📋 PROMPT - Sezione Preventivi Dashboard

## Obiettivo
Creare una sezione **Preventivi** nella Dashboard UNIKA per generare preventivi veloci, modulari e multilingua, esportabili in PDF o immagine.

---

## 🎯 Requisiti Principali

### 1. Semplicità
- Interfaccia pulita e intuitiva
- Pochi click per generare un preventivo
- Nessuna complessità inutile

### 2. Modularità
- Pacchetti preconfigurati modificabili
- Possibilità di aggiungere/rimuovere voci singole
- Listino prezzi interno facilmente aggiornabile

### 3. Multilingua
- Selezione lingua (IT, EN, ES, CN, RS)
- Traduzione automatica di tutte le voci
- Export nella lingua selezionata

---

## 📦 Struttura Dati

### Tabella `quote_products` (Prodotti Interni per Preventivi)
```sql
- id: UUID
- name_it: TEXT (nome italiano)
- name_en: TEXT (nome inglese)
- name_es: TEXT (nome spagnolo)
- name_cn: TEXT (nome cinese)
- name_rs: TEXT (nome russo)
- description_it: TEXT
- description_en: TEXT
- description_es: TEXT
- description_cn: TEXT
- description_rs: TEXT
- category: TEXT (es: 'ceramica', 'accessorio', 'servizio')
- base_price: DECIMAL
- unit: TEXT (es: 'pz', 'set', 'ora')
- is_active: BOOLEAN
- display_order: INTEGER
- created_at, updated_at
```

### Tabella `quote_packages` (Pacchetti Preconfigurati)
```sql
- id: UUID
- name_it, name_en, name_es, name_cn, name_rs: TEXT
- description_it, description_en, description_es, description_cn, description_rs: TEXT
- items: JSONB (array di {product_id, quantity, price_override})
- total_price: DECIMAL
- discount_percentage: INTEGER (sconto pacchetto)
- is_active: BOOLEAN
- display_order: INTEGER
- created_at, updated_at
```

### Tabella `quotes` (Preventivi Generati)
```sql
- id: UUID
- quote_number: TEXT (es: PRV-2026-0001)
- customer_name: TEXT
- customer_email: TEXT
- customer_phone: TEXT
- customer_address: TEXT
- language: TEXT (it, en, es, cn, rs)
- items: JSONB (array di voci del preventivo)
- subtotal: DECIMAL
- discount_percentage: INTEGER
- discount_amount: DECIMAL
- total: DECIMAL
- notes: TEXT
- validity_days: INTEGER (validità preventivo, default 30)
- status: TEXT (draft, sent, accepted, rejected, expired)
- created_at, updated_at
```

---

## 🖥️ Interfaccia Dashboard

### Pagina `/dashboard/preventivi`

#### Sezione 1: Listino Prodotti
```
┌─────────────────────────────────────────────────────────┐
│ 📋 Listino Prodotti Interni                    [+ Aggiungi] │
├─────────────────────────────────────────────────────────┤
│ Nome (IT)        │ Categoria  │ Prezzo  │ Unità │ Azioni │
│ Ceramica Ovale   │ ceramica   │ €45.00  │ pz    │ ✏️ 🗑️  │
│ Ceramica Quadra  │ ceramica   │ €50.00  │ pz    │ ✏️ 🗑️  │
│ Cornice Legno    │ accessorio │ €25.00  │ pz    │ ✏️ 🗑️  │
│ Montaggio        │ servizio   │ €15.00  │ ora   │ ✏️ 🗑️  │
└─────────────────────────────────────────────────────────┘
```

#### Sezione 2: Pacchetti Preconfigurati
```
┌─────────────────────────────────────────────────────────┐
│ 📦 Pacchetti                                   [+ Aggiungi] │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│ │ 🎁 Base      │ │ 🎁 Standard  │ │ 🎁 Premium   │      │
│ │ €89.00      │ │ €149.00     │ │ €249.00     │      │
│ │ 3 prodotti  │ │ 5 prodotti  │ │ 8 prodotti  │      │
│ │ [Modifica]  │ │ [Modifica]  │ │ [Modifica]  │      │
│ └──────────────┘ └──────────────┘ └──────────────┘      │
└─────────────────────────────────────────────────────────┘
```

#### Sezione 3: Crea Preventivo
```
┌─────────────────────────────────────────────────────────┐
│ ➕ Nuovo Preventivo                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🌐 Lingua: [IT ▼]  [EN]  [ES]  [CN]  [RS]              │
│                                                         │
│ 👤 Cliente                                              │
│ ┌─────────────────┐ ┌─────────────────┐                │
│ │ Nome            │ │ Email           │                │
│ └─────────────────┘ └─────────────────┘                │
│ ┌─────────────────┐ ┌─────────────────┐                │
│ │ Telefono        │ │ Indirizzo       │                │
│ └─────────────────┘ └─────────────────┘                │
│                                                         │
│ 📦 Seleziona Pacchetto (opzionale)                     │
│ [Nessuno ▼] [Base €89] [Standard €149] [Premium €249]  │
│                                                         │
│ ─── OPPURE ───                                         │
│                                                         │
│ 📋 Aggiungi Prodotti Singoli                           │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Prodotto           │ Qtà │ Prezzo  │ Totale │  ❌  │ │
│ │ Ceramica Ovale     │  2  │ €45.00  │ €90.00 │  ❌  │ │
│ │ Cornice Legno      │  2  │ €25.00  │ €50.00 │  ❌  │ │
│ │ [+ Aggiungi Prodotto]                              │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ 💰 Riepilogo                                           │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Subtotale:                              €140.00    │ │
│ │ Sconto: [10]% (-)                       €14.00     │ │
│ │ ─────────────────────────────────────────────────  │ │
│ │ TOTALE:                                 €126.00    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ 📝 Note (opzionale)                                    │
│ ┌────────────────────────────────────────────────────┐ │
│ │                                                    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ⏰ Validità: [30] giorni                               │
│                                                         │
│ [💾 Salva Bozza]  [📄 Esporta PDF]  [🖼️ Esporta Immagine] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Sezione 4: Storico Preventivi
```
┌─────────────────────────────────────────────────────────┐
│ 📁 Storico Preventivi                         [🔍 Cerca] │
├─────────────────────────────────────────────────────────┤
│ N° Preventivo │ Cliente      │ Totale  │ Stato    │ Data│
│ PRV-2026-0012│ Mario Rossi  │ €249.00 │ ✅ Accett│ 05/02│
│ PRV-2026-0011│ Anna Verdi   │ €126.00 │ ⏳ Inviato│ 04/02│
│ PRV-2026-0010│ Luigi Bianchi│ €89.00  │ 📝 Bozza │ 03/02│
│                                                         │
│ [Visualizza] [Duplica] [Esporta] [Elimina]             │
└─────────────────────────────────────────────────────────┘
```

---

## 📄 Template Preventivo (PDF/Immagine)

```
┌─────────────────────────────────────────────────────────┐
│                        UNIKA                            │
│               Ceramiche Artistiche                      │
│                                                         │
│  ════════════════════════════════════════════════════  │
│                      PREVENTIVO                         │
│                    N° PRV-2026-0012                     │
│  ════════════════════════════════════════════════════  │
│                                                         │
│  Data: 06/02/2026              Validità: 30 giorni     │
│                                                         │
│  Cliente:                                               │
│  Mario Rossi                                           │
│  mario.rossi@email.com | +39 333 1234567               │
│  Via Roma 123, 20100 Milano                            │
│                                                         │
│  ────────────────────────────────────────────────────  │
│                                                         │
│  DESCRIZIONE              QTÀ    PREZZO      TOTALE   │
│  ────────────────────────────────────────────────────  │
│  Ceramica Ovale 13x18       2    €45.00      €90.00   │
│  Cornice Legno Noce         2    €25.00      €50.00   │
│  Montaggio Professionale    1    €15.00      €15.00   │
│  ────────────────────────────────────────────────────  │
│                                                         │
│                           Subtotale:        €155.00   │
│                           Sconto 10%:       -€15.50   │
│                           ─────────────────────────   │
│                           TOTALE:           €139.50   │
│                                                         │
│  ────────────────────────────────────────────────────  │
│                                                         │
│  Note:                                                 │
│  Consegna prevista entro 15 giorni lavorativi.        │
│                                                         │
│  ────────────────────────────────────────────────────  │
│                                                         │
│  UNIKA - Via Example 1, Città                          │
│  P.IVA: 12345678901 | info@unika.com | www.unika.com  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Funzionalità Tecniche

### API Routes
```
/api/preventivi/products     - CRUD prodotti interni
/api/preventivi/packages     - CRUD pacchetti
/api/preventivi/quotes       - CRUD preventivi
/api/preventivi/export/pdf   - Genera PDF
/api/preventivi/export/image - Genera immagine
```

### Librerie Necessarie
- **PDF**: `@react-pdf/renderer` o `jspdf`
- **Immagine**: `html2canvas` per screenshot del preventivo
- **Traduzioni**: Usare i file esistenti in `/messages/`

### Traduzioni da Aggiungere
Aggiungere a ogni file lingua (`messages/it.json`, ecc.):
```json
{
  "quotes": {
    "title": "Preventivo",
    "quoteNumber": "N° Preventivo",
    "date": "Data",
    "validity": "Validità",
    "days": "giorni",
    "customer": "Cliente",
    "description": "Descrizione",
    "quantity": "Qtà",
    "price": "Prezzo",
    "total": "Totale",
    "subtotal": "Subtotale",
    "discount": "Sconto",
    "grandTotal": "Totale",
    "notes": "Note",
    "validUntil": "Valido fino al",
    "thankYou": "Grazie per la fiducia"
  }
}
```

---

## 📱 Responsive
- Desktop: Layout completo con sidebar
- Tablet: Layout adattato
- Mobile: Stack verticale, bottoni grandi

---

## ✅ Checklist Implementazione

- [ ] Creare schema SQL `supabase/quotes_schema.sql`
- [ ] API `/api/preventivi/products` (CRUD)
- [ ] API `/api/preventivi/packages` (CRUD)
- [ ] API `/api/preventivi/quotes` (CRUD)
- [ ] API `/api/preventivi/export/pdf`
- [ ] API `/api/preventivi/export/image`
- [ ] Pagina `/dashboard/preventivi`
- [ ] Componente ListinoProdotti
- [ ] Componente PacchettiPreconfigurati
- [ ] Componente CreaPreventivo
- [ ] Componente StoricoPreventivi
- [ ] Componente TemplatePreventivo (per export)
- [ ] Aggiungere traduzioni a tutti i file lingua
- [ ] Aggiungere link nel DashboardLayout
- [ ] Test export PDF
- [ ] Test export Immagine
- [ ] Test multilingua

---

## 🎨 Note UI/UX

- Colori coerenti con il resto della Dashboard
- Icone intuitive per ogni azione
- Feedback visivo per salvataggio/export
- Preview del preventivo prima dell'export
- Copia rapida del preventivo precedente (duplica)

---

## 📝 Da Definire (INPUT NECESSARI)

1. **Lista prodotti iniziali** - Quali prodotti inserire nel listino?
2. **Pacchetti** - Quali sono gli 8 pacchetti e cosa contengono?
3. **Logo/Branding** - Logo da usare nel PDF?
4. **Dati azienda** - Indirizzo, P.IVA, contatti per il footer?
5. **Validità default** - 30 giorni ok?

---

**Rivedi questo prompt, aggiungi/modifica quello che serve, e poi iniziamo lo sviluppo! 🚀**
