import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidSession } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase-client';

const BUCKET = 'documents';
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/x-pdf',
  'application/octet-stream', // alcuni browser inviano questo per PDF
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
];
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp'];

function isAllowedFile(file: File): boolean {
  const ext = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
  const typeOk = ALLOWED_TYPES.includes(file.type) || file.type === '';
  const extOk = ALLOWED_EXTENSIONS.includes(ext);
  return typeOk && extOk;
}

async function checkAuth() {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get('admin_session')?.value)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }
  return null;
}

/** GET — Elenco file nel bucket documents */
export async function GET() {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage.from(BUCKET).list('', {
      limit: 500,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      console.error('Documents list error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const files = (data || [])
      .filter((f) => f.name && !f.name.startsWith('.'))
      .map((f) => {
        const path = f.name;
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
        return {
          name: f.name,
          path,
          url: urlData.publicUrl,
          size: f.metadata?.size ?? 0,
          created_at: f.created_at,
        };
      });

    return NextResponse.json(files);
  } catch (error) {
    console.error('GET documents error:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

/** POST — Carica file */
export async function POST(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nessun file fornito' }, { status: 400 });
    }

    if (!isAllowedFile(file)) {
      return NextResponse.json(
        { error: `Tipo file non supportato (ricevuto: ${file.type || 'vuoto'}). Usa PDF, DOC, DOCX, JPG, PNG, WEBP.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Il file deve essere inferiore a 10MB' },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${timestamp}-${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const supabase = getSupabaseAdmin();
    const contentType = file.type && file.type !== 'application/octet-stream' ? file.type : 'application/pdf';
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error('Documents upload error:', error);
      return NextResponse.json({
        error: `Errore Supabase: ${error.message}. Verifica che il bucket "documents" esista su Supabase Storage.`,
      }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: data.path,
      name: file.name,
    });
  } catch (error) {
    console.error('POST documents error:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}

/** DELETE — Elimina file */
export async function DELETE(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: 'path obbligatorio' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(BUCKET).remove([path]);

    if (error) {
      console.error('Documents delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE documents error:', error);
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
