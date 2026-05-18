import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { slug }             = await params;
    const { email, password }  = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son obligatorios.' }, { status: 400 });
    }

    // Busca el cliente por slug
    const client = await prisma.client.findUnique({ where: { slug } });
    if (!client) {
      return NextResponse.json({ error: 'Cliente no encontrado.' }, { status: 404 });
    }

    // Busca el usuario dentro de ese cliente
    const user = await prisma.user.findUnique({
      where: { email_clientId: { email, clientId: client.id } }
    });

    if (!user) {
      return NextResponse.json({ error: 'Credenciales incorrectas.' }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: 'Credenciales incorrectas.' }, { status: 401 });
    }

    // Genera el token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token  = await new SignJWT({
      userId:   user.id,
      clientId: client.id,
      slug:     client.slug,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    const res = NextResponse.json({ ok: true });
    res.cookies.set(`token_${slug}`, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7,
      path:     `/${slug}`,  // ← cookie solo disponible en esa ruta
    });

    return res;

  } catch {
    return NextResponse.json({ error: 'Error al iniciar sesión.' }, { status: 500 });
  }
}