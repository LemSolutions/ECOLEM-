import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidSession } from '@/lib/auth';
import { getSupabaseClient, getSupabaseAdmin } from '@/lib/supabase-client';

// GET - Fetch all services (public)
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('GET services error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET services exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// POST - Create new service (protected - uses admin client)
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  
  if (!isValidSession(session)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Use admin client for write operations
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('services')
      .insert([{
        title: body.title,
        description: body.description,
        icon: body.icon || '🛠️',
        features: body.features || [],
        is_active: body.is_active ?? true,
        sort_order: body.sort_order || 0,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('POST services error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST services exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// PUT - Update service (protected - uses admin client)
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
    
    // Use admin client for write operations
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('services')
      .update({
        title: updateData.title,
        description: updateData.description,
        icon: updateData.icon,
        features: updateData.features,
        is_active: updateData.is_active,
        sort_order: updateData.sort_order,
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('PUT services error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT services exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// DELETE - Delete service (protected - uses admin client)
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

    // Use admin client for write operations
    const supabase = getSupabaseAdmin();
    
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('DELETE services error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE services exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
