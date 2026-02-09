-- ═══════════════════════════════════════════════════════════════════════════
-- LEM SOLUTIONS - QUOTES SCHEMA COMPLETE
-- Schema completo per la gestione dei preventivi
-- Elimina e ricrea tutte le tabelle da zero
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
-- PULIZIA: Elimina tabelle esistenti (se presenti)
-- ═══════════════════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS quote_packages CASCADE;
DROP TABLE IF EXISTS quote_products CASCADE;

-- ═══════════════════════════════════════════════════════════════════════════
-- FUNZIONE: Aggiorna updated_at automaticamente
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_quotes_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════════
-- FUNZIONE: Genera numero preventivo automatico
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  last_number INTEGER;
  new_number TEXT;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM '[0-9]+$') AS INTEGER)), 0)
  INTO last_number
  FROM quotes
  WHERE quote_number LIKE 'PRV-' || year_part || '-%';
  
  new_number := 'PRV-' || year_part || '-' || LPAD((last_number + 1)::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════════
-- TABELLA: QUOTE_PRODUCTS (Prodotti Interni per Preventivi)
-- Solo nome e descrizione in italiano - traduzione automatica
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE quote_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'ceramica',
  base_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'pz',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index per ordinamento e ricerca
CREATE INDEX idx_quote_products_category ON quote_products(category);
CREATE INDEX idx_quote_products_active ON quote_products(is_active);
CREATE INDEX idx_quote_products_display_order ON quote_products(display_order);

-- Trigger per updated_at
CREATE TRIGGER update_quote_products_updated_at
  BEFORE UPDATE ON quote_products
  FOR EACH ROW
  EXECUTE FUNCTION update_quotes_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════
-- TABELLA: QUOTE_PACKAGES (Pacchetti Preconfigurati)
-- Solo nome e descrizione in italiano - traduzione automatica
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE quote_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount_percentage INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index per ordinamento
CREATE INDEX idx_quote_packages_active ON quote_packages(is_active);
CREATE INDEX idx_quote_packages_display_order ON quote_packages(display_order);

-- Trigger per updated_at
CREATE TRIGGER update_quote_packages_updated_at
  BEFORE UPDATE ON quote_packages
  FOR EACH ROW
  EXECUTE FUNCTION update_quotes_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════
-- TABELLA: QUOTES (Preventivi Generati)
-- Supporta lingue: it, en, es, fr, pt, cn, rs
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  language TEXT NOT NULL DEFAULT 'it' CHECK (language IN ('it', 'en', 'es', 'fr', 'pt', 'cn', 'rs')),
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount_percentage INTEGER DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  payment_method TEXT CHECK (payment_method IN ('iban', 'banca', 'bonifico', 'altro')),
  payment_details TEXT,
  validity_days INTEGER DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index per ricerca e ordinamento
CREATE INDEX idx_quotes_quote_number ON quotes(quote_number);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_customer_email ON quotes(customer_email);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX idx_quotes_language ON quotes(language);

-- Trigger per updated_at
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_quotes_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════

-- Abilita RLS
ALTER TABLE quote_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Policy per quote_products: lettura pubblica, scrittura solo per service_role
CREATE POLICY "Anyone can read quote_products" ON quote_products
  FOR SELECT USING (true);

CREATE POLICY "Service role can do everything on quote_products" ON quote_products
  FOR ALL USING (auth.role() = 'service_role');

-- Policy per quote_packages: lettura pubblica, scrittura solo per service_role
CREATE POLICY "Anyone can read quote_packages" ON quote_packages
  FOR SELECT USING (true);

CREATE POLICY "Service role can do everything on quote_packages" ON quote_packages
  FOR ALL USING (auth.role() = 'service_role');

-- Policy per quotes: lettura pubblica, scrittura solo per service_role
CREATE POLICY "Anyone can read quotes" ON quotes
  FOR SELECT USING (true);

CREATE POLICY "Service role can do everything on quotes" ON quotes
  FOR ALL USING (auth.role() = 'service_role');

-- ═══════════════════════════════════════════════════════════════════════════
-- DATI INIZIALI DI ESEMPIO
-- ═══════════════════════════════════════════════════════════════════════════

-- Prodotti esempio
INSERT INTO quote_products (name, description, category, base_price, unit, display_order) VALUES
('Ceramica Ovale 13x18', 'Ceramica fotografica di alta qualità formato ovale 13x18 cm', 'ceramica', 45.00, 'pz', 1),
('Ceramica Quadra 20x20', 'Ceramica fotografica di alta qualità formato quadrato 20x20 cm', 'ceramica', 50.00, 'pz', 2),
('Ceramica Rettangolare 30x40', 'Ceramica fotografica di alta qualità formato rettangolare 30x40 cm', 'ceramica', 75.00, 'pz', 3),
('Cornice Legno Noce', 'Cornice in legno noce per ceramiche', 'accessorio', 25.00, 'pz', 4),
('Cornice Legno Rovere', 'Cornice in legno rovere per ceramiche', 'accessorio', 30.00, 'pz', 5),
('Montaggio Professionale', 'Servizio di montaggio professionale su supporto', 'servizio', 15.00, 'ora', 6),
('Consegna Express', 'Consegna express entro 24-48 ore', 'servizio', 10.00, 'ordine', 7);

-- ═══════════════════════════════════════════════════════════════════════════
-- FINE SCHEMA
-- ═══════════════════════════════════════════════════════════════════════════

-- Verifica che tutto sia stato creato correttamente
SELECT 'Schema preventivi creato con successo!' AS status;
SELECT 'Tabelle create:' AS info;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('quote_products', 'quote_packages', 'quotes')
ORDER BY table_name;

-- Mostra struttura tabelle
SELECT 
  'quote_products' AS table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'quote_products'
ORDER BY ordinal_position;

SELECT 
  'quote_packages' AS table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'quote_packages'
ORDER BY ordinal_position;

SELECT 
  'quotes' AS table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'quotes'
ORDER BY ordinal_position;
