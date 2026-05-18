// /app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth/login';
import { getUserByEmail } from '@/lib/db/users';

export async function POST(req: Request) {
  const { email, password, tenantId } = await req.json();

  const user = await getUserByEmail(email);

  if (!user || user.tenant_id !== tenantId) {
    return NextResponse.json(
      { message: 'Credenciales inválidas' },
      { status: 401 }
    );
  }

  const valid = await verifyPassword(password, user.password);

  if (!valid) {
    return NextResponse.json(
      { message: 'Credenciales inválidas' },
      { status: 401 }
    );
  }

  // aquí puedes usar JWT o cookies
  const token = 'JWT_AQUI';

  const response = NextResponse.json({
    success: true,
    tenantSlug: user.tenant_slug
  });

  response.cookies.set('token', token, {
    httpOnly: true
  });

  return response;
}