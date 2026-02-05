import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidSession } from '@/lib/auth';
import { getSupabaseClient, getSupabaseAdmin } from '@/lib/supabase-client';
import type { AboutSectionInsert, AboutSectionUpdate } from '@/types/database';

// GET - Fetch all about sections (public)
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('about_sections')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('GET about_sections error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET about_sections exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// POST - Create new about section (protected - uses admin client)
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
    
    const payload: AboutSectionInsert = {
      title: body.title,
      subtitle: body.subtitle || null,
      content: body.content,
      image_url: body.image_url || null,
      image_position: body.image_position || 'left',
      is_active: body.is_active ?? true,
      sort_order: body.sort_order || 0,
    };
    
    const { data, error } = await supabase
      .from('about_sections')
      .insert([payload as AboutSectionInsert])
      .select()
      .single();
    
    if (error) {
      console.error('POST about_sections error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST about_sections exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// PUT - Update about section (protected - uses admin client)
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
    
    const updatePayload: AboutSectionUpdate = {
      title: updateData.title,
      subtitle: updateData.subtitle,
      content: updateData.content,
      image_url: updateData.image_url,
      image_position: updateData.image_position,
      is_active: updateData.is_active,
      sort_order: updateData.sort_order,
    };
    
    const { data, error } = await supabase
      .from('about_sections')
      .update(updatePayload as AboutSectionUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('PUT about_sections error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT about_sections exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// DELETE - Delete about section (protected - uses admin client)
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
      .from('about_sections')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('DELETE about_sections error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE about_sections exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
