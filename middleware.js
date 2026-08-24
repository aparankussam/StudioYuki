import { NextResponse } from 'next/server';

const REALM = 'Studio Yuki Admin';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only gate /admin and admin API routes
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  const expectedUser = process.env.ADMIN_USER || 'yuki';
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (!expectedPass) {
    return new NextResponse(
      'Admin password not configured. Set ADMIN_PASSWORD in environment variables.',
      { status: 500 }
    );
  }

  const auth = request.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');

  if (scheme === 'Basic' && encoded) {
    try {
      // atob is available in the Edge runtime
      const decoded = atob(encoded);
      const idx = decoded.indexOf(':');
      const user = decoded.slice(0, idx);
      const pass = decoded.slice(idx + 1);
      if (user === expectedUser && pass === expectedPass) {
        return NextResponse.next();
      }
    } catch (_) {
      // fall through to challenge
    }
  }

  return new NextResponse('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Cache-Control': 'no-store',
    },
  });
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
