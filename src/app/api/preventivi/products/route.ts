import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidSession } from '@/lib/auth';
import { getSupabaseClient, getSupabaseAdmin } from '@/lib/supabase-client';

// GET - Fetch all quote products (public)
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('quote_products')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('GET quote_products error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET quote_products exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// POST - Create new quote product (protected)
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  
  if (!isValidSession(session)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await (supabase
      .from('quote_products') as any)
      .insert([{
        name: body.name,
        description: body.description || null,
        category: body.category || 'ceramica',
        base_price: parseFloat(body.base_price) || 0,
        unit: body.unit || 'pz',
        is_active: body.is_active ?? true,
        display_order: body.display_order || 0,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('POST quote_products error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST quote_products exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// PUT - Update quote product (protected)
export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  
  if (!isValidSession(session)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, created_at, updated_at, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID richiesto' }, { status: 400 });
    }
    
    const supabase = getSupabaseAdmin();
    
    const updatePayload = {
      name: updateData.name,
      description: updateData.description,
      category: updateData.category,
      base_price: updateData.base_price ? parseFloat(updateData.base_price) : undefined,
      unit: updateData.unit,
      is_active: updateData.is_active,
      display_order: updateData.display_order,
    };
    
    const { data, error } = await (supabase
      .from('quote_products') as any)
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('PUT quote_products error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT quote_products exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// DELETE - Delete quote product (protected)
export async function DELETE(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  
  if (!isValidSession(session)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID richiesto' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    
    const { error } = await supabase
      .from('quote_products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('DELETE quote_products error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE quote_products exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
