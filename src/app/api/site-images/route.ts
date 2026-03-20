import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase-client';

/** GET — Elenco di tutte le immagini del sito (servizi, prodotti, about, blog) */
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const images: string[] = [];

    const [services, products, about, blog] = await Promise.all([
      supabase.from('services').select('image_url').eq('is_active', true),
      supabase.from('products').select('image_url').eq('is_active', true),
      supabase.from('about_sections').select('image_url').eq('is_active', true),
      supabase.from('blog_posts').select('image_url').eq('is_published', true),
    ]);

    const addValid = (url: string | null) => {
      if (url && (url.startsWith('http') || url.startsWith('/'))) images.push(url);
    };

    type Row = { image_url: string | null };
    ((services.data || []) as Row[]).forEach((s) => addValid(s.image_url));
    ((products.data || []) as Row[]).forEach((p) => addValid(p.image_url));
    ((about.data || []) as Row[]).forEach((a) => addValid(a.image_url));
    ((blog.data || []) as Row[]).forEach((b) => addValid(b.image_url));

    return NextResponse.json(images);
  } catch (error) {
    console.error('site-images error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
