import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidSession } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase-client';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  
  if (!isValidSession(session)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nessun file fornito' }, { status: 400 });
    }

    // Validazione tipo file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Il file deve essere un\'immagine' }, { status: 400 });
    }

    // Validazione dimensione (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Il file deve essere inferiore a 5MB' }, { status: 400 });
    }

    // Genera nome file univoco
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExt}`;
    const filePath = `images/${fileName}`;

    // Converti File in ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload su Supabase Storage
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage error:', error);
      return NextResponse.json({ error: 'Errore durante il caricamento su Supabase' }, { status: 500 });
    }

    // Ottieni URL pubblico
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return NextResponse.json({ 
      url: urlData.publicUrl,
      path: filePath 
    });

  } catch (error) {
    console.error('Upload exception:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
