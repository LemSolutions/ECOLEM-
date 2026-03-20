-- ═══════════════════════════════════════════════════════════════════════════
-- Bucket "documents" per PDF, schede di sicurezza, certificati, ecc.
-- Esegui su Supabase SQL Editor se il bucket non esiste
-- ═══════════════════════════════════════════════════════════════════════════

-- Crea bucket "documents" (pubblico per URL diretti)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: chiunque può leggere (bucket pubblico)
CREATE POLICY "Public can view documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

-- Policy: solo admin può caricare (usiamo service role lato server)
-- Per upload da client autenticato, aggiungere policy con auth.role()
CREATE POLICY "Authenticated can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authenticated can delete documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'documents');
