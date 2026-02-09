import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidSession } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/supabase-client';

// POST - Generate PDF from quote
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  
  if (!isValidSession(session)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const quoteId = body.quote_id;
    
    if (!quoteId) {
      return NextResponse.json({ error: 'quote_id richiesto' }, { status: 400 });
    }
    
    const supabase = getSupabaseClient();
    const { data: quote, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single();
    
    if (error || !quote) {
      return NextResponse.json({ error: 'Preventivo non trovato' }, { status: 404 });
    }
    
    // For now, return JSON with quote data
    // PDF generation will be implemented with jsPDF library
    return NextResponse.json({ 
      message: 'PDF generation - da implementare con jsPDF',
      quote 
    });
  } catch (error) {
    console.error('POST export/pdf exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
