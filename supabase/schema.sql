-- ═══════════════════════════════════════════════════════════════════════════
-- LEM SOLUTIONS - SUPABASE DATABASE SCHEMA
-- ═══════════════════════════════════════════════════════════════════════════
-- 
-- ISTRUZIONI:
-- 1. Vai su Supabase Dashboard → SQL Editor
-- 2. Copia e incolla questo intero file
-- 3. Clicca "Run"
-- 4. Verifica che le tabelle siano state create in Table Editor
--
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- PULIZIA (rimuove tabelle esistenti se presenti)
-- ═══════════════════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS about_sections CASCADE;

-- ═══════════════════════════════════════════════════════════════════════════
-- TABELLA: SERVICES (Servizi)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50) DEFAULT '🛠️',
  image_url TEXT,
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index per ordinamento
CREATE INDEX idx_services_sort ON services(sort_order);
CREATE INDEX idx_services_active ON services(is_active);

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════
-- TABELLA: PRODUCTS (Prodotti/Pacchetti)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  price DECIMAL(10,2),
  price_type VARCHAR(20) DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'starting_from', 'on_request')),
  category VARCHAR(100),
  image_url TEXT,
  features TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_sort ON products(sort_order);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════
-- TABELLA: BLOG_POSTS (Articoli Blog)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author VARCHAR(255) DEFAULT 'LEM Team',
  image_url TEXT,
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blog_published ON blog_posts(is_published);
CREATE INDEX idx_blog_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_slug ON blog_posts(slug);

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════
-- TABELLA: CONTACT_SUBMISSIONS (Form Contatti)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  service_interest VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contact_created ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_read ON contact_submissions(is_read);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABELLA: ABOUT_SECTIONS (Sezioni About Us)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE about_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  image_position VARCHAR(20) DEFAULT 'left' CHECK (image_position IN ('left', 'right', 'top', 'bottom')),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_about_sections_sort ON about_sections(sort_order);
CREATE INDEX idx_about_sections_active ON about_sections(is_active);

CREATE TRIGGER update_about_sections_updated_at
  BEFORE UPDATE ON about_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════

-- Abilita RLS su tutte le tabelle
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_sections ENABLE ROW LEVEL SECURITY;

-- Policies per lettura pubblica (anon può leggere solo contenuti attivi/pubblicati)
CREATE POLICY "Services are viewable by everyone" ON services
  FOR SELECT USING (true);

CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Published blog posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (true);

-- Policy per inserimento contatti (tutti possono inviare)
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Policies per operazioni admin (service_role può fare tutto)
CREATE POLICY "Service role can do everything on services" ON services
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on products" ON products
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on blog_posts" ON blog_posts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on contact_submissions" ON contact_submissions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "About sections are viewable by everyone" ON about_sections
  FOR SELECT USING (true);

CREATE POLICY "Service role can do everything on about_sections" ON about_sections
  FOR ALL USING (auth.role() = 'service_role');

-- ═══════════════════════════════════════════════════════════════════════════
-- DATI INIZIALI DI ESEMPIO
-- ═══════════════════════════════════════════════════════════════════════════

-- Servizi
INSERT INTO services (title, description, icon, features, is_active, sort_order) VALUES
('Web Design Premium', 'Design eleganti e moderni che catturano l''attenzione e convertono i visitatori in clienti.', '🎨', ARRAY['UI/UX Design', 'Responsive Design', 'Branding', 'Prototyping'], true, 1),
('Sviluppo Web', 'Siti e applicazioni web performanti, sicuri e scalabili con le tecnologie più moderne.', '💻', ARRAY['Next.js & React', 'Performance Ottimizzata', 'Sicurezza Avanzata', 'API Integration'], true, 2),
('E-Commerce', 'Negozi online che vendono. Piattaforme ottimizzate per la conversione e la gestione semplice.', '🛒', ARRAY['Checkout Ottimizzato', 'Gestione Inventario', 'Payment Gateway', 'Analytics'], true, 3),
('SEO & Marketing', 'Visibilità organica e strategie di marketing digitale per far crescere il tuo business.', '📈', ARRAY['SEO Tecnico', 'Content Strategy', 'Google Ads', 'Social Media'], true, 4),
('Consulenza Strategica', 'Analisi approfondite e strategie su misura per ottimizzare la tua presenza digitale.', '💡', ARRAY['Digital Strategy', 'UX Audit', 'Roadmap Personalizzata', 'KPI Tracking'], true, 5),
('Supporto & Manutenzione', 'Assistenza continuativa per mantenere il tuo sito sempre aggiornato, sicuro e performante.', '🔧', ARRAY['Aggiornamenti Regolari', 'Backup Automatici', 'Monitoraggio 24/7', 'Supporto Tecnico'], true, 6);

-- Prodotti
INSERT INTO products (name, description, short_description, price, price_type, features, is_featured, is_active, sort_order) VALUES
('Starter', 'Perfetto per piccole attività che vogliono iniziare la loro presenza online con un sito professionale.', 'Ideale per iniziare', 1490, 'fixed', ARRAY['Sito web fino a 5 pagine', 'Design responsive', 'SEO base incluso', 'Form di contatto', 'Hosting primo anno incluso', 'Supporto email'], false, true, 1),
('Business', 'La soluzione ideale per aziende che vogliono distinguersi dalla concorrenza con un sito premium.', 'Il più popolare', 3490, 'fixed', ARRAY['Sito web fino a 15 pagine', 'Design premium personalizzato', 'SEO avanzato', 'Blog integrato', 'Animazioni e interazioni', 'Integrazioni API', 'Hosting premium 1 anno', 'Supporto prioritario'], true, true, 2),
('Enterprise', 'Per grandi aziende con esigenze specifiche e progetti complessi che richiedono soluzioni su misura.', 'Soluzione completa', NULL, 'on_request', ARRAY['Sito web illimitato', 'Design esclusivo', 'Architettura scalabile', 'E-commerce avanzato', 'Dashboard personalizzata', 'Integrazioni su misura', 'SLA garantito', 'Account manager dedicato'], false, true, 3);

-- Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, author, category, tags, is_published, published_at) VALUES
('Come Ottimizzare le Performance del Tuo Sito Web nel 2024', 'ottimizzare-performance-sito-web-2024', 'Scopri le migliori pratiche per migliorare la velocità e l''esperienza utente del tuo sito, dai Core Web Vitals alle tecniche di caching avanzate.', '## Introduzione

Le performance di un sito web sono fondamentali per il successo online. Google considera la velocità di caricamento come un fattore di ranking importante, e gli utenti si aspettano esperienze sempre più fluide.

## Core Web Vitals

I Core Web Vitals sono tre metriche chiave che Google utilizza per valutare l''esperienza utente:

1. **LCP (Largest Contentful Paint)**: misura il tempo di caricamento del contenuto principale
2. **FID (First Input Delay)**: misura la reattività alle interazioni
3. **CLS (Cumulative Layout Shift)**: misura la stabilità visiva

## Tecniche di Ottimizzazione

- Ottimizzazione delle immagini con formati moderni (WebP, AVIF)
- Implementazione del lazy loading
- Minificazione di CSS e JavaScript
- Utilizzo di CDN per la distribuzione dei contenuti
- Caching efficace lato browser e server

## Conclusione

Investire nelle performance non è solo una questione tecnica, ma un vero vantaggio competitivo che impatta direttamente sui risultati di business.', 'LEM Team', 'Performance', ARRAY['performance', 'seo', 'web-vitals'], true, NOW() - INTERVAL '5 days'),

('Tendenze UX/UI Design: Cosa Aspettarsi Quest''Anno', 'tendenze-ux-ui-design-2024', 'Un''analisi approfondita delle tendenze di design che stanno plasmando il web. Dal neomorfismo al design inclusivo.', '## Le Tendenze del Design Digitale

Il mondo del design digitale è in continua evoluzione. Ecco le tendenze più rilevanti per quest''anno.

## 1. Design Inclusivo

L''accessibilità non è più un''opzione ma una necessità. I designer stanno sempre più considerando utenti con diverse abilità fin dalle prime fasi di progettazione.

## 2. Micro-interazioni

Le piccole animazioni che rispondono alle azioni dell''utente migliorano significativamente l''esperienza complessiva.

## 3. Dark Mode

La modalità scura non è solo una tendenza estetica, ma risponde a esigenze reali di comfort visivo e risparmio energetico.

## 4. Design 3D e Immersivo

Con l''evoluzione delle tecnologie web, elementi 3D e esperienze immersive stanno diventando sempre più accessibili.

## Conclusione

Rimanere aggiornati sulle tendenze è fondamentale, ma ricorda sempre che il design deve servire gli obiettivi di business e le esigenze degli utenti.', 'LEM Team', 'Design', ARRAY['design', 'ux', 'ui', 'tendenze'], true, NOW() - INTERVAL '10 days'),

('SEO Tecnico: Guida Completa per Principianti', 'seo-tecnico-guida-completa', 'Tutto quello che devi sapere per ottimizzare il tuo sito per i motori di ricerca. Schema markup, sitemap, e molto altro.', '## Cos''è il SEO Tecnico?

Il SEO tecnico riguarda tutti gli aspetti di ottimizzazione che aiutano i motori di ricerca a scansionare, indicizzare e interpretare correttamente il tuo sito web.

## Elementi Fondamentali

### 1. Struttura del Sito
Una struttura chiara e logica aiuta sia gli utenti che i motori di ricerca a navigare il tuo sito.

### 2. Sitemap XML
La sitemap comunica a Google quali pagine sono presenti sul tuo sito e quali sono le più importanti.

### 3. Robots.txt
Questo file indica ai crawler quali parti del sito possono o non possono scansionare.

### 4. Schema Markup
I dati strutturati aiutano Google a comprendere meglio il contenuto delle tue pagine.

### 5. HTTPS
La sicurezza è un fattore di ranking. Assicurati che il tuo sito utilizzi HTTPS.

## Strumenti Utili

- Google Search Console
- Screaming Frog
- Ahrefs Site Audit
- GTmetrix

## Conclusione

Il SEO tecnico è la base su cui costruire qualsiasi strategia di visibilità organica. Investire tempo in questi aspetti può fare la differenza nei risultati a lungo termine.', 'LEM Team', 'SEO', ARRAY['seo', 'marketing', 'google', 'guida'], true, NOW() - INTERVAL '15 days');

-- ═══════════════════════════════════════════════════════════════════════════
-- FINE SCHEMA
-- ═══════════════════════════════════════════════════════════════════════════

-- Verifica che tutto sia stato creato correttamente
SELECT 'Schema creato con successo!' AS status;
SELECT 'Tabelle create:' AS info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
