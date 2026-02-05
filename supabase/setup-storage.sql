-- ═══════════════════════════════════════════════════════════════════════════
-- SUPABASE STORAGE SETUP
-- ═══════════════════════════════════════════════════════════════════════════
-- 
-- ISTRUZIONI:
-- 1. Vai su Supabase Dashboard → Storage
-- 2. Clicca "New bucket"
-- 3. Nome: "images"
-- 4. Public: Sì (per rendere le immagini accessibili pubblicamente)
-- 5. Clicca "Create bucket"
--
-- OPPURE esegui questo script SQL:
--
-- ═══════════════════════════════════════════════════════════════════════════

-- Crea il bucket "images" se non esiste già
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Policy per permettere upload autenticati (service_role)
CREATE POLICY "Service role can upload images"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'images');

-- Policy per permettere lettura pubblica
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Policy per permettere eliminazione (service_role)
CREATE POLICY "Service role can delete images"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'images');

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICA
-- ═══════════════════════════════════════════════════════════════════════════

SELECT 'Storage configurato con successo!' AS status;
SELECT * FROM storage.buckets WHERE id = 'images';

-- ═══════════════════════════════════════════════════════════════════════════
-- NOTA IMPORTANTE
-- ═══════════════════════════════════════════════════════════════════════════
-- 
-- Se preferisci configurare manualmente:
-- 1. Vai su Supabase Dashboard → Storage
-- 2. Clicca "New bucket"
-- 3. Nome: "images"
-- 4. Public: Sì
-- 5. File size limit: 5MB
-- 6. Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
-- 7. Clicca "Create bucket"
--
-- ═══════════════════════════════════════════════════════════════════════════
