-- ═══════════════════════════════════════════════════════════════════════════
-- Aggiunge document_type a product_sds_documents (SDS + Certificato di origine)
-- Esegui su Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE product_sds_documents
  ADD COLUMN IF NOT EXISTS document_type VARCHAR(50) DEFAULT 'sds'
  CHECK (document_type IN ('sds', 'certificate_of_origin'));

-- Aggiorna i record esistenti
UPDATE product_sds_documents SET document_type = 'sds' WHERE document_type IS NULL;
