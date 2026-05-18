import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { client: { select: { id: true, name: true } } }
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body     = await req.json();
    body.password  = await bcrypt.hash(body.password, 10);
    const user     = await prisma.user.create({ data: body });
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}