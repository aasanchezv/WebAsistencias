import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET — listar todos
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'desc' }
    });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: 'Error al obtener services' }, { status: 500 });
  }
}

// POST — crear
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const service = await prisma.service.create({ data: body });
    return NextResponse.json(service, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear service' }, { status: 500 });
  }
}