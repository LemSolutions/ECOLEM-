-- ═══════════════════════════════════════════════════════════════════════════
-- Product SDS Documents — Schede di sicurezza per prodotti
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS product_sds_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  document_type VARCHAR(50) DEFAULT 'sds' CHECK (document_type IN ('sds', 'certificate_of_origin')),
  label VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_sds_product_id ON product_sds_documents(product_id);
CREATE INDEX IF NOT EXISTS idx_product_sds_display_order ON product_sds_documents(display_order);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_sds_updated_at
  BEFORE UPDATE ON product_sds_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE product_sds_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view product sds"
  ON product_sds_documents FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage product sds"
  ON product_sds_documents FOR ALL
  USING (true)
  WITH CHECK (true);

-- Bucket per documenti (PDF, ecc.) — creare manualmente su Supabase Storage:
-- Nome: documents, Public: sì, MIME: application/pdf, image/*
