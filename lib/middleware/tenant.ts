import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function handleTenant(req: NextRequest) {
  const secret    = process.env.JWT_SECRET;
  if (!secret) return NextResponse.redirect(new URL('/', req.url));

  const slug      = req.nextUrl.pathname.split('/')[1];
  const cleanPath = req.nextUrl.pathname;
  const isLogin   = cleanPath === `/${slug}/login`;
  const token     = req.cookies.get(`token_${slug}`)?.value;

  async function verify(token: string): Promise<boolean> {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
      // Verifica que el token sea de este slug
      return payload.slug === slug;
    } catch {
      return false;
    }
  }

  if (isLogin) {
    if (token && await verify(token)) {
      return NextResponse.redirect(new URL(`/${slug}/dashboard`, req.url));
    }
    return NextResponse.next();
  }

  // Rutas privadas del cliente
  if (!token || !(await verify(token))) {
    return NextResponse.redirect(new URL(`/${slug}/login`, req.url));
  }

  return NextResponse.next();
}