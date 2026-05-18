import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET — listar todos
export async function GET() {
  try {
    const tenants = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(tenants);
  } catch {
    return NextResponse.json({ error: 'Error al obtener tenants' }, { status: 500 });
  }
}

// POST — crear
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenant = await prisma.client.create({ data: body });
    return NextResponse.json(tenant, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear tenant' }, { status: 500 });
  }
}