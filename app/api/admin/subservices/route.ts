import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const subservices = await prisma.subservice.findMany({
      orderBy: { createdAt: 'desc' },
      include: { service: { select: { id: true, name: true } } }
    });
    return NextResponse.json(subservices);
  } catch {
    return NextResponse.json({ error: 'Error al obtener subservices' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const subservice = await prisma.subservice.create({ data: body });
    return NextResponse.json(subservice, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear subservice' }, { status: 500 });
  }
}