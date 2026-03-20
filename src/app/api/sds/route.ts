import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidSession } from '@/lib/auth';
import { getSupabaseClient, getSupabaseAdmin } from '@/lib/supabase-client';
import type { Product, ProductSdsDocument, ProductSdsDocumentInsert } from '@/types/database';

/** GET — Prodotti con schede SDS (pubblico, per pagina /sds) */
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product');

    if (productId) {
      const { data, error } = await supabase
        .from('product_sds_documents')
        .select('*')
        .eq('product_id', productId)
        .order('display_order', { ascending: true });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json(data || []);
    }

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, category, short_description')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (productsError) {
      return NextResponse.json({ error: productsError.message }, { status: 500 });
    }

    const { data: docs, error: docsError } = await supabase
      .from('product_sds_documents')
      .select('*')
      .order('display_order', { ascending: true });

    if (docsError) {
      return NextResponse.json({ error: docsError.message }, { status: 500 });
    }

    const docsList = (docs || []) as ProductSdsDocument[];
    const docsByProduct = docsList.reduce<Record<string, ProductSdsDocument[]>>((acc, d) => {
      if (!acc[d.product_id]) acc[d.product_id] = [];
      acc[d.product_id].push(d);
      return acc;
    }, {});

    const productsList = (products || []) as Pick<Product, 'id' | 'name' | 'category' | 'short_description'>[];
    const result = productsList.map((p) => ({
      ...p,
      sds_documents: docsByProduct[p.id] || [],
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('GET sds error:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

/** POST — Crea documento SDS (admin) */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get('admin_session')?.value)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { product_id, document_type, label, file_url, file_name, display_order } = body;

    if (!product_id || !label || !file_url) {
      return NextResponse.json(
        { error: 'product_id, label e file_url sono obbligatori' },
        { status: 400 }
      );
    }

    const type = document_type === 'certificate_of_origin' ? 'certificate_of_origin' : 'sds';

    const supabase = getSupabaseAdmin();
    const insertData: ProductSdsDocumentInsert = {
      product_id,
      document_type: type,
      label,
      file_url,
      file_name: file_name || null,
      display_order: display_order ?? 0,
    };

    const { data, error } = await (supabase
      .from('product_sds_documents') as any)
      .insert([insertData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST sds error:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

/** PUT — Aggiorna documento SDS (admin) */
export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get('admin_session')?.value)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, document_type, label, file_url, file_name, display_order } = body;

    if (!id) {
      return NextResponse.json({ error: 'id obbligatorio' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const updateData: Record<string, unknown> = {};
    if (document_type !== undefined) updateData.document_type = document_type === 'certificate_of_origin' ? 'certificate_of_origin' : 'sds';
    if (label !== undefined) updateData.label = label;
    if (file_url !== undefined) updateData.file_url = file_url;
    if (file_name !== undefined) updateData.file_name = file_name;
    if (display_order !== undefined) updateData.display_order = display_order;

    const { data, error } = await (supabase
      .from('product_sds_documents') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT sds error:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

/** DELETE — Elimina documento SDS (admin) */
export async function DELETE(request: NextRequest) {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get('admin_session')?.value)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id obbligatorio' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await (supabase.from('product_sds_documents') as any)
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE sds error:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
