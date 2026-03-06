import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-client';
import type { PopupInsert, PopupUpdate } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const activeOnly = searchParams.get('active') === 'true';

    let query = (supabase.from('popups') as any).select('*');

    if (id) {
      const result = await (query as any).eq('id', id).single();
      if (result.error) {
        return NextResponse.json({ error: result.error.message }, { status: 400 });
      }
      return NextResponse.json(result.data);
    }

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const result = await (query as any).order('display_order', { ascending: true }).order('created_at', { ascending: false });
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.json(result.data || []);
  } catch (error) {
    console.error('Error fetching popups:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();

    const { title, description, image_url, type, event_date, cta_text, cta_url, is_active, display_order } = body;

    if (!title || !type) {
      return NextResponse.json({ error: 'Titolo e tipo sono obbligatori' }, { status: 400 });
    }

    if (type !== 'evento' && type !== 'sconto') {
      return NextResponse.json({ error: 'Tipo deve essere "evento" o "sconto"' }, { status: 400 });
    }

    const insertData: PopupInsert = {
      title,
      description: description || null,
      image_url: image_url || null,
      type: type as 'evento' | 'sconto',
      event_date: event_date || null,
      cta_text: cta_text || null,
      cta_url: cta_url || null,
      is_active: is_active !== undefined ? is_active : true,
      display_order: display_order || 0,
    };

    const result = await (supabase
      .from('popups') as any)
      .insert([insertData])
      .select()
      .single();

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error creating popup:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();

    const { id, title, description, image_url, type, event_date, cta_text, cta_url, is_active, display_order } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID è obbligatorio' }, { status: 400 });
    }

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description || null;
    if (image_url !== undefined) updateData.image_url = image_url || null;
    if (type !== undefined) {
      if (type !== 'evento' && type !== 'sconto') {
        return NextResponse.json({ error: 'Tipo deve essere "evento" o "sconto"' }, { status: 400 });
      }
      updateData.type = type;
    }
    if (event_date !== undefined) updateData.event_date = event_date || null;
    if (cta_text !== undefined) updateData.cta_text = cta_text || null;
    if (cta_url !== undefined) updateData.cta_url = cta_url || null;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (display_order !== undefined) updateData.display_order = display_order;

    const updatePayload: PopupUpdate = updateData;
    const result = await (supabase
      .from('popups') as any)
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error updating popup:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID è obbligatorio' }, { status: 400 });
    }

    const result = await (supabase.from('popups') as any).delete().eq('id', id);

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting popup:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
