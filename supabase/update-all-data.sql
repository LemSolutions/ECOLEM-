-- ═══════════════════════════════════════════════════════════════════════════
-- LEM CERAMIC SYSTEM - SCRIPT AGGIORNAMENTO DATI COMPLETO
-- ═══════════════════════════════════════════════════════════════════════════
-- 
-- ISTRUZIONI:
-- 1. Vai su Supabase Dashboard → SQL Editor
-- 2. Copia e incolla questo file
-- 3. Clicca "Run"
--
-- NOTA: Questo script aggiorna i dati esistenti o li inserisce se non esistono
--       Non cancella i dati esistenti che non sono in questo script
--
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- SERVIZI
-- ═══════════════════════════════════════════════════════════════════════════

-- Aggiorna o inserisci servizi basandosi sul title
INSERT INTO services (title, description, icon, image_url, features, is_active, sort_order)
VALUES
('Sistema LEM CERAMIC', 
'Il LEM CERAMIC SYSTEM è una soluzione professionale integrata per ottenere la massima qualità nella fotoceramica. Nasce dall''unione di stampanti basate su tecnologia Canon professionale, appositamente modificate e ottimizzate, con toner ceramici, carte speciali, profili colore e know-how produttivo sviluppati internamente.', 
'🖨️', 
NULL,
ARRAY['Stampanti Canon modificate e ottimizzate', 'Toner ceramici sviluppati internamente', 'Carte speciali per fotoceramica', 'Profili colore calibrati', 'Know-how produttivo esclusivo', 'Qualità fotografica garantita'], 
true, 1),

('Qualità Fotografica', 
'Ogni componente del sistema LEM è progettato per lavorare in perfetta sinergia, garantendo qualità fotografica, stabilità cromatica dopo la cottura e ripetibilità assoluta del risultato. Risoluzione fino a 2400 × 2400 dpi, una delle più elevate disponibili sul mercato.', 
'📸', 
NULL,
ARRAY['Risoluzione fino a 2400 × 2400 dpi', 'Stabilità cromatica dopo cottura', 'Ripetibilità assoluta del risultato', 'Definizione immagine eccellente', 'Fusione perfetta su ceramica', 'Risultati professionali costanti'], 
true, 2),

('Assistenza & Supporto', 
'Supporto tecnico dedicato per l''installazione, configurazione e ottimizzazione del sistema LEM CERAMIC. Ti accompagniamo in ogni fase, dalla scelta della soluzione più adatta alle tue esigenze fino alla produzione di fotoceramiche di altissimo livello.', 
'🔧', 
NULL,
ARRAY['Installazione guidata', 'Configurazione sistema', 'Calibrazione colori', 'Formazione all''uso', 'Supporto tecnico continuo', 'Aggiornamenti e ottimizzazioni'], 
true, 3),

('Consulenza Tecnica', 
'Analisi delle tue esigenze produttive e consulenza specializzata per identificare la soluzione LEM CERAMIC più adatta. Con oltre 10 anni di esperienza nel settore, offriamo expertise unico nel campo della fotoceramica professionale.', 
'💡', 
NULL,
ARRAY['Analisi esigenze produttive', 'Consulenza personalizzata', 'Valutazione formati e volumi', 'Raccomandazioni tecniche', 'Ottimizzazione workflow', 'Oltre 10 anni di esperienza'], 
true, 4)

ON CONFLICT (title) DO UPDATE SET
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  image_url = COALESCE(EXCLUDED.image_url, services.image_url),
  features = EXCLUDED.features,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- Nota: Se title non è UNIQUE, usa questo approccio alternativo:
-- DELETE FROM services WHERE title IN ('Sistema LEM CERAMIC', 'Qualità Fotografica', 'Assistenza & Supporto', 'Consulenza Tecnica');
-- Poi esegui gli INSERT sopra senza ON CONFLICT

-- ═══════════════════════════════════════════════════════════════════════════
-- PRODOTTI - STAMPANTI
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO products (name, description, short_description, price, price_type, category, image_url, features, is_featured, is_active, sort_order)
VALUES
('LEM CERAMIC C265/270', 
'La LEM CERAMIC C265/270 è la soluzione di riferimento per la fotoceramica di alta gamma e per chi lavora anche su grandi formati. Basata su piattaforma Canon professionale e modificata da LEM SOLUTIONS, offre immagini estremamente definite e uniformi. Supporta formati speciali fino a 33 × 130 cm e raggiunge una risoluzione di stampa fino a 2400 × 2400 dpi. Garantisce un''elevata stabilità cromatica nel tempo ed è semplice da utilizzare anche senza l''uso del Fiery ColorPass, che rimane opzionale. La macchina è nuova, con 0 copie, imballata e pronta per l''installazione.',
'Alta gamma - Grandi formati - Nuova',
NULL, 
'on_request', 
'Stampanti',
NULL,
ARRAY['Formati speciali fino a 33 × 130 cm', 'Risoluzione 2400 × 2400 dpi', 'Piattaforma Canon professionale', 'Macchina nuova, 0 copie', 'Fiery ColorPass opzionale', 'Stabilità cromatica elevata', 'Immagini definite e uniformi', 'Pronta per installazione'], 
true, 
true, 1),

('LEM CERAMIC C7000', 
'La LEM CERAMIC C7000 è una stampante professionale progettata per produzioni costanti e affidabili nella fotoceramica su formati medi. La configurazione LEM SOLUTIONS rende la macchina stabile, precisa e perfettamente compatibile con il processo ceramico. Il formato massimo di stampa è 32 × 63 cm, con una risoluzione fino a 2400 × 2400 dpi. Le immagini risultano nitide, uniformi e perfettamente idonee alla cottura. La stampante è ricondizionata e rigenerata da showroom, completamente verificata in ogni componente e garantita.',
'Formati medi - Ricondizionata showroom',
NULL, 
'on_request', 
'Stampanti',
NULL,
ARRAY['Formato massimo 32 × 63 cm', 'Risoluzione 2400 × 2400 dpi', 'Produzioni costanti e affidabili', 'Ricondizionata da showroom', 'Verificata in ogni componente', 'Immagini nitide e uniformi', 'Perfetta per processo ceramico', 'Garantita'], 
false, 
true, 2),

('LEM CERAMIC 165', 
'La LEM CERAMIC 165 è una soluzione compatta e versatile per la fotoceramica professionale. Basata su piattaforma Canon ImagePRESS e ottimizzata da LEM SOLUTIONS, garantisce una qualità fotografica elevata e una resa cromatica stabile. La risoluzione di stampa raggiunge 2400 × 2400 dpi ed è ideale per lavorazioni A3+ e formati compatibili con la configurazione LEM. È la scelta ideale per chi desidera entrare nel mondo della fotoceramica con un investimento contenuto, senza rinunciare alla qualità. La macchina è usata, ricondizionata da showroom, testata, verificata e garantita.',
'Compatta - Ideale per iniziare',
NULL, 
'on_request', 
'Stampanti',
NULL,
ARRAY['Formato A3+ e compatibili LEM', 'Risoluzione 2400 × 2400 dpi', 'Canon ImagePRESS ottimizzata', 'Investimento contenuto', 'Qualità fotografica elevata', 'Resa cromatica stabile', 'Usata ricondizionata showroom', 'Testata, verificata e garantita'], 
false, 
true, 3)

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  category = EXCLUDED.category,
  image_url = COALESCE(EXCLUDED.image_url, products.image_url),
  features = EXCLUDED.features,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- ═══════════════════════════════════════════════════════════════════════════
-- PRODOTTI - CONSUMABILI
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO products (name, description, short_description, price, price_type, category, image_url, features, is_featured, is_active, sort_order)
VALUES
('LEM CERAMIC Toner', 
'I LEM CERAMIC Toner Y-B-C-R sono sviluppati specificamente per la fotoceramica e rappresentano uno degli elementi fondamentali del sistema. Garantiscono massima definizione dell''immagine, stabilità cromatica dopo la cottura, fusione perfetta del toner sulla ceramica e risultati professionali costanti nel tempo. Il LEM CERAMIC Starter include un set completo di toner già calibrati e testati, pronti per offrire prestazioni ottimali fin dal primo utilizzo.',
'Toner ceramici professionali Y-B-C-R',
NULL, 
'on_request', 
'Consumabili',
NULL,
ARRAY['Set completo Y-B-C-R', 'Sviluppati per fotoceramica', 'Massima definizione immagine', 'Stabilità cromatica dopo cottura', 'Fusione perfetta su ceramica', 'Risultati costanti nel tempo', 'Calibrati e testati', 'Prestazioni ottimali immediate'], 
false, 
true, 4),

('LEM CERAMIC Pronto Decal', 
'La LEM CERAMIC PRONTO DECAL è una carta speciale prelaccata per fotoceramica su ceramica, sviluppata esclusivamente per il sistema LEM CERAMIC. Cuoce tra 870 e 950 gradi ed è il risultato di oltre 10 anni di test ed esperienza, maturati nello stesso laboratorio in cui vengono prodotti i pigmenti e il toner ceramico LEM. Si stampa direttamente con le stampanti laser LEM CERAMIC, garantendo sempre un risultato perfetto: nessuna formazione di bolle, nessun alone, nessun difetto. Problemi comuni riscontrabili con altre carte prelaccate semplicemente non esistono.',
'Carta prelaccata - Risultato perfetto',
NULL, 
'on_request', 
'Consumabili',
NULL,
ARRAY['Carta prelaccata esclusiva', 'Cottura 870-950 gradi', 'Oltre 10 anni di R&D', 'Nessuna formazione di bolle', 'Nessun alone o difetto', 'Stampa diretta con LEM CERAMIC', 'Prodotta nel laboratorio LEM', 'Risultato sempre perfetto'], 
false, 
true, 5),

('LEM CERAMIC Paper Film', 
'La LEM CERAMIC Paper Film è studiata per lavorazioni specifiche nella fotoceramica, in abbinamento alla laminatrice a caldo. In questo processo lo smalto ceramico rimane sopra la stampa, per cui la stampa deve essere eseguita direttamente sulla Paper Film. Il trasferimento avviene successivamente tramite laminazione, mantenendo precisione, uniformità dell''immagine e stabilità dopo la cottura. L''utilizzo combinato di Paper Film, Pronto Decal e toner LEM CERAMIC consente di ampliare le possibilità produttive nella fotoceramica.',
'Per laminazione a caldo',
NULL, 
'on_request', 
'Consumabili',
NULL,
ARRAY['Per laminatrice a caldo', 'Smalto sopra la stampa', 'Trasferimento preciso', 'Uniformità immagine', 'Stabilità dopo cottura', 'Amplia possibilità produttive', 'Combinabile con Pronto Decal', 'Controllo totale del risultato'], 
false, 
true, 6)

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  price = EXCLUDED.price,
  price_type = EXCLUDED.price_type,
  category = EXCLUDED.category,
  image_url = COALESCE(EXCLUDED.image_url, products.image_url),
  features = EXCLUDED.features,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- ═══════════════════════════════════════════════════════════════════════════
-- BLOG POSTS
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO blog_posts (title, slug, excerpt, content, author, image_url, category, tags, is_published, published_at)
VALUES
('Introduzione al Sistema LEM CERAMIC: La Rivoluzione della Fotoceramica', 
'introduzione-sistema-lem-ceramic', 
'Scopri come il LEM CERAMIC SYSTEM sta rivoluzionando il mondo della fotoceramica professionale con tecnologia Canon modificata, toner ceramici esclusivi e risultati impeccabili.',
'## Il Sistema Completo per la Fotoceramica Professionale

Il LEM CERAMIC SYSTEM rappresenta la soluzione più avanzata per chi opera nel settore della fotoceramica. Nato dalla combinazione di tecnologia Canon professionale accuratamente modificata e ottimizzata, con consumabili sviluppati internamente, questo sistema garantisce risultati che prima erano semplicemente irraggiungibili.

## Perché Scegliere LEM CERAMIC

A differenza di altre soluzioni presenti sul mercato, il sistema LEM CERAMIC è stato progettato fin dall''inizio per la fotoceramica. Ogni componente lavora in perfetta sinergia:

- **Stampanti modificate**: basate su piattaforma Canon, ottimizzate per il toner ceramico
- **Toner specifici**: sviluppati per garantire stabilità cromatica dopo cottura
- **Carte speciali**: Pronto Decal e Paper Film per ogni esigenza produttiva
- **Profili colore**: calibrazioni precise per risultati ripetibili

## Qualità Senza Compromessi

Con risoluzioni fino a 2400 × 2400 dpi e formati che arrivano fino a 33 × 130 cm, il sistema LEM CERAMIC si adatta a qualsiasi esigenza produttiva, dalla piccola bottega artigiana al grande laboratorio industriale.

## Conclusione

Investire nel sistema LEM CERAMIC significa scegliere qualità, affidabilità e supporto tecnico di alto livello. Contattaci per scoprire la soluzione più adatta alle tue esigenze.',
'LEM Team',
NULL,
'Tecnologia', 
ARRAY['fotoceramica', 'lem-ceramic', 'stampanti', 'tecnologia'], 
true, 
NOW() - INTERVAL '3 days'),

('Come Scegliere la Stampante LEM CERAMIC Giusta per Te', 
'come-scegliere-stampante-lem-ceramic', 
'Guida completa per orientarsi tra i modelli LEM CERAMIC C265/270, C7000 e 165. Formati, volumi produttivi e investimento a confronto.',
'## Quale Stampante LEM CERAMIC Fa per Te?

La scelta della stampante giusta dipende da diversi fattori: i formati che lavori più frequentemente, i volumi produttivi e il budget disponibile. Ecco una guida per orientarti.

## LEM CERAMIC C265/270: L''Eccellenza per Grandi Formati

Se lavori con grandi formati o cerchi il massimo della qualità, la C265/270 è la scelta ideale:
- Formati fino a **33 × 130 cm**
- Risoluzione **2400 × 2400 dpi**
- Macchina **nuova**, pronta per l''installazione
- Ideale per produzioni di alta gamma

## LEM CERAMIC C7000: Affidabilità per Formati Medi

Per produzioni costanti su formati standard, la C7000 offre il miglior rapporto qualità/prezzo:
- Formato massimo **32 × 63 cm**
- Risoluzione **2400 × 2400 dpi**
- Ricondizionata da **showroom**
- Perfetta per volumi medi

## LEM CERAMIC 165: Entrare nel Mondo della Fotoceramica

Per chi inizia o ha esigenze più contenute, la 165 è l''entry point ideale:
- Formato **A3+**
- Risoluzione **2400 × 2400 dpi**
- Investimento **contenuto**
- Qualità professionale garantita

## Conclusione

Ogni modello offre la stessa qualità LEM CERAMIC - la differenza sta nei formati e nell''investimento. Contattaci per una consulenza personalizzata.',
'LEM Team',
NULL,
'Guide', 
ARRAY['stampanti', 'guida', 'scelta', 'confronto'], 
true, 
NOW() - INTERVAL '7 days'),

('La Pronto Decal LEM: Perché Fa la Differenza', 
'pronto-decal-lem-differenza', 
'Scopri perché la carta Pronto Decal LEM CERAMIC elimina i problemi tipici delle altre carte prelaccate: bolle, aloni e difetti.',
'## La Carta che Risolve Tutti i Problemi

Se hai mai lavorato con carte prelaccate per fotoceramica, conosci bene i problemi tipici: bolle, aloni, difetti di vario tipo. La LEM CERAMIC PRONTO DECAL è stata sviluppata specificamente per eliminare questi problemi.

## Oltre 10 Anni di Ricerca

La Pronto Decal nasce nello stesso laboratorio dove vengono prodotti i pigmenti e il toner ceramico LEM. Questo significa che ogni componente è stato testato e ottimizzato per lavorare insieme:
- **Cottura ottimizzata**: 870-950 gradi
- **Nessuna bolla**: mai
- **Nessun alone**: mai
- **Nessun difetto**: mai

## Come Funziona

La carta è prelaccata con uno speciale coating compatibile al 100% con il toner LEM CERAMIC. Si stampa direttamente con la stampante laser e si procede alla cottura. Il risultato è sempre perfetto, ripetibile e professionale.

## Garanzia LEM

LEM SOLUTIONS garantisce risultati eccellenti **solo** utilizzando pigmenti e toner LEM. Questo non è marketing: è la conseguenza del fatto che ogni componente è progettato per lavorare in sinergia.

## Conclusione

La Pronto Decal rappresenta un investimento nella qualità del tuo lavoro. Niente più scarti, niente più prove, niente più frustrazioni.',
'LEM Team',
NULL,
'Consumabili', 
ARRAY['pronto-decal', 'carta', 'qualità', 'fotoceramica'], 
true, 
NOW() - INTERVAL '12 days')

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  author = EXCLUDED.author,
  image_url = COALESCE(EXCLUDED.image_url, blog_posts.image_url),
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  is_published = EXCLUDED.is_published,
  published_at = EXCLUDED.published_at,
  updated_at = NOW();

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICA
-- ═══════════════════════════════════════════════════════════════════════════

SELECT 'Dati aggiornati con successo!' AS status;
SELECT 'Servizi:' AS tipo, COUNT(*) AS totale FROM services;
SELECT 'Prodotti:' AS tipo, COUNT(*) AS totale FROM products;
SELECT 'Blog Posts:' AS tipo, COUNT(*) AS totale FROM blog_posts;

-- ═══════════════════════════════════════════════════════════════════════════
-- NOTA IMPORTANTE
-- ═══════════════════════════════════════════════════════════════════════════
-- 
-- Se le colonne 'title' (per services) o 'name' (per products) non sono UNIQUE,
-- questo script potrebbe generare errori. In tal caso:
--
-- 1. Aggiungi un vincolo UNIQUE:
--    ALTER TABLE services ADD CONSTRAINT services_title_unique UNIQUE (title);
--    ALTER TABLE products ADD CONSTRAINT products_name_unique UNIQUE (name);
--
-- 2. Oppure usa questo approccio alternativo (sostituisci gli INSERT con):
--    DELETE FROM services WHERE title IN ('Sistema LEM CERAMIC', ...);
--    DELETE FROM products WHERE name IN ('LEM CERAMIC C265/270', ...);
--    DELETE FROM blog_posts WHERE slug IN ('introduzione-sistema-lem-ceramic', ...);
--    Poi esegui gli INSERT senza ON CONFLICT
--
-- ═══════════════════════════════════════════════════════════════════════════
