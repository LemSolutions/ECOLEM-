import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, generateSessionToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!validateCredentials(username, password)) {
      return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
    }

    const token = generateSessionToken();
    
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Errore server' }, { status: 500 });
  }
}
