-- ═══════════════════════════════════════════════════════════════════════════
-- FIX POLICIES - Esegui questo in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- Rimuovi le vecchie policies
DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
DROP POLICY IF EXISTS "Service role can do everything on services" ON services;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Service role can do everything on products" ON products;
DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON blog_posts;
DROP POLICY IF EXISTS "Service role can do everything on blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
DROP POLICY IF EXISTS "Service role can do everything on contact_submissions" ON contact_submissions;

-- Disabilita temporaneamente RLS per permettere tutte le operazioni
-- (per sviluppo/admin - in produzione dovresti usare auth)
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- Oppure, se vuoi mantenere RLS con policies permissive:
-- ALTER TABLE services ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all operations on services" ON services FOR ALL USING (true) WITH CHECK (true);

-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true) WITH CHECK (true);

-- ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all operations on blog_posts" ON blog_posts FOR ALL USING (true) WITH CHECK (true);

-- ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all operations on contact_submissions" ON contact_submissions FOR ALL USING (true) WITH CHECK (true);

SELECT 'Policies fixed! RLS disabled for development.' AS status;
