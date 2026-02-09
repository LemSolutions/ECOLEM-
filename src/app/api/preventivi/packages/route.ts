import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidSession } from '@/lib/auth';
import { getSupabaseClient, getSupabaseAdmin } from '@/lib/supabase-client';

// GET - Fetch all quote packages (public)
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('quote_packages')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('GET quote_packages error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET quote_packages exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// POST - Create new quote package (protected)
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
      .from('quote_packages') as any)
      .insert([{
        name: body.name,
        description: body.description || null,
        items: body.items || [],
        total_price: parseFloat(body.total_price) || 0,
        discount_percentage: parseInt(body.discount_percentage) || 0,
        is_active: body.is_active ?? true,
        display_order: body.display_order || 0,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('POST quote_packages error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST quote_packages exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// PUT - Update quote package (protected)
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
    
    const updatePayload: any = {
      name: updateData.name,
      description: updateData.description,
      is_active: updateData.is_active,
      display_order: updateData.display_order,
    };
    
    if (updateData.items !== undefined) {
      updatePayload.items = updateData.items;
    }
    if (updateData.total_price !== undefined) {
      updatePayload.total_price = parseFloat(updateData.total_price);
    }
    if (updateData.discount_percentage !== undefined) {
      updatePayload.discount_percentage = parseInt(updateData.discount_percentage);
    }
    
    const { data, error } = await (supabase
      .from('quote_packages') as any)
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('PUT quote_packages error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT quote_packages exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// DELETE - Delete quote package (protected)
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
      .from('quote_packages')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('DELETE quote_packages error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE quote_packages exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
