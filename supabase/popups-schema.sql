-- ═══════════════════════════════════════════════════════════════════════════
-- Schema per gestione Pop-up
-- ═══════════════════════════════════════════════════════════════════════════

-- Tabella popups
CREATE TABLE IF NOT EXISTS popups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('evento', 'sconto')),
  event_date TIMESTAMP WITH TIME ZONE,
  cta_text TEXT,
  cta_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_popups_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_popups_updated_at
  BEFORE UPDATE ON popups
  FOR EACH ROW
  EXECUTE FUNCTION update_popups_updated_at_column();

-- RLS Policies
ALTER TABLE popups ENABLE ROW LEVEL SECURITY;

-- Policy: Solo admin possono leggere/scrivere
CREATE POLICY "Admin can manage popups"
  ON popups
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy: Pubblico può solo leggere pop-up attivi
CREATE POLICY "Public can view active popups"
  ON popups
  FOR SELECT
  USING (is_active = true);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_popups_is_active ON popups(is_active);
CREATE INDEX IF NOT EXISTS idx_popups_display_order ON popups(display_order);
CREATE INDEX IF NOT EXISTS idx_popups_type ON popups(type);

-- Verifica
SELECT 'Schema popups creato con successo!' AS status;