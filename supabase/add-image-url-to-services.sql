-- ═══════════════════════════════════════════════════════════════════════════
-- AGGIORNAMENTO TABELLA SERVICES
-- Aggiunge il campo image_url alla tabella services
-- ═══════════════════════════════════════════════════════════════════════════

-- Aggiungi il campo image_url se non esiste già
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'services' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE services ADD COLUMN image_url TEXT;
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- FINE SCRIPT
-- ═══════════════════════════════════════════════════════════════════════════
