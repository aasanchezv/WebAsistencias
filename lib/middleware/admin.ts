import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
}

// handleAdmin también debe ser async
export async function handleAdmin(req: NextRequest) {
  const secret = process.env.JWT_SECRET;
  if (!secret) return NextResponse.redirect(new URL('/admin', req.url));

  const cleanPath = req.nextUrl.pathname.replace(/\/$/, '');
  const token = req.cookies.get('admin_token')?.value;

  const isLoginPage = cleanPath === '/admin';
  const isPrivateRoute = !isLoginPage && cleanPath.startsWith('/admin');

  if (isLoginPage) {
    if (token && await verifyToken(token, secret)) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  if (isPrivateRoute) {
    if (!token || !(await verifyToken(token, secret))) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}