import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteggi le routes admin (eccetto login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = request.cookies.get('admin_session')?.value;

    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verifica base sessione (token format check)
    try {
      const decoded = Buffer.from(session, 'base64').toString();
      const [timestamp] = decoded.split('-');
      const sessionAge = Date.now() - parseInt(timestamp);
      
      // Sessione valida per 24 ore
      if (sessionAge > 24 * 60 * 60 * 1000) {
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('admin_session');
        return response;
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
