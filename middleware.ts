// middleware.ts
import { handleAdmin }  from '@/lib/middleware/admin';
import { handleTenant } from '@/lib/middleware/tenant';
import { NextRequest }  from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    return handleAdmin(req);
  }

  return handleTenant(req);
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|icons|img|api).*/:path+)',
  ]
};