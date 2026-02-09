import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidSession } from '@/lib/auth';
import { getSupabaseClient, getSupabaseAdmin } from '@/lib/supabase-client';

// GET - Fetch all quotes (public, but typically admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    
    const supabase = getSupabaseClient();
    let query = supabase.from('quotes').select('*');
    
    if (id) {
      query = query.eq('id', id).single();
    } else {
      if (status) {
        query = query.eq('status', status);
      }
      query = query.order('created_at', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('GET quotes error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET quotes exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// POST - Create new quote (protected)
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  
  if (!isValidSession(session)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();
    
    // Generate quote number using SQL function
    const { data: quoteNumberData, error: quoteNumberError } = await supabase
      .rpc('generate_quote_number');
    
    if (quoteNumberError) {
      console.error('Error generating quote number:', quoteNumberError);
      // Fallback: generate manually
      const year = new Date().getFullYear();
      const { data: lastQuote } = await supabase
        .from('quotes')
        .select('quote_number')
        .like('quote_number', `PRV-${year}-%`)
        .order('quote_number', { ascending: false })
        .limit(1)
        .single();
      
      let quoteNumber = `PRV-${year}-0001`;
      if (lastQuote?.quote_number) {
        const lastNum = parseInt(lastQuote.quote_number.split('-')[2]) || 0;
        quoteNumber = `PRV-${year}-${String(lastNum + 1).padStart(4, '0')}`;
      }
      
      const { data, error } = await (supabase
        .from('quotes') as any)
        .insert([{
          quote_number: quoteNumber,
          customer_name: body.customer_name,
          customer_email: body.customer_email || null,
          customer_phone: body.customer_phone || null,
          customer_address: body.customer_address || null,
          language: body.language || 'it',
          items: body.items || [],
          subtotal: parseFloat(body.subtotal) || 0,
          discount_percentage: parseInt(body.discount_percentage) || 0,
          discount_amount: parseFloat(body.discount_amount) || 0,
          total: parseFloat(body.total) || 0,
          notes: body.notes || null,
          payment_method: body.payment_method || null,
          payment_details: body.payment_details || null,
          validity_days: parseInt(body.validity_days) || 30,
          status: body.status || 'draft',
        }])
        .select()
        .single();
      
      if (error) {
        console.error('POST quotes error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json(data, { status: 201 });
    }
    
    const quoteNumber = quoteNumberData as string;
    
    const { data, error } = await (supabase
      .from('quotes') as any)
      .insert([{
        quote_number: quoteNumber,
        customer_name: body.customer_name,
        customer_email: body.customer_email || null,
        customer_phone: body.customer_phone || null,
        customer_address: body.customer_address || null,
        language: body.language || 'it',
        items: body.items || [],
        subtotal: parseFloat(body.subtotal) || 0,
        discount_percentage: parseInt(body.discount_percentage) || 0,
        discount_amount: parseFloat(body.discount_amount) || 0,
        total: parseFloat(body.total) || 0,
        notes: body.notes || null,
        validity_days: parseInt(body.validity_days) || 30,
        status: body.status || 'draft',
      }])
      .select()
      .single();
    
    if (error) {
      console.error('POST quotes error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST quotes exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// PUT - Update quote (protected)
export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  
  if (!isValidSession(session)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, created_at, updated_at, quote_number, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID richiesto' }, { status: 400 });
    }
    
    const supabase = getSupabaseAdmin();
    
    const updatePayload: any = {
      customer_name: updateData.customer_name,
      customer_email: updateData.customer_email,
      customer_phone: updateData.customer_phone,
      customer_address: updateData.customer_address,
      language: updateData.language,
      notes: updateData.notes,
      payment_method: updateData.payment_method,
      payment_details: updateData.payment_details,
      validity_days: updateData.validity_days,
      status: updateData.status,
    };
    
    if (updateData.items !== undefined) {
      updatePayload.items = updateData.items;
    }
    if (updateData.subtotal !== undefined) {
      updatePayload.subtotal = parseFloat(updateData.subtotal);
    }
    if (updateData.discount_percentage !== undefined) {
      updatePayload.discount_percentage = parseInt(updateData.discount_percentage);
    }
    if (updateData.discount_amount !== undefined) {
      updatePayload.discount_amount = parseFloat(updateData.discount_amount);
    }
    if (updateData.total !== undefined) {
      updatePayload.total = parseFloat(updateData.total);
    }
    
    const { data, error } = await (supabase
      .from('quotes') as any)
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('PUT quotes error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT quotes exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

// DELETE - Delete quote (protected)
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
      .from('quotes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('DELETE quotes error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE quotes exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
