import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const subservice = await prisma.subservice.findUnique({
      where: { id: Number(id) }
    });
    if (!subservice) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(subservice);
  } catch {
    return NextResponse.json({ error: 'Error al obtener subservice' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body    = await req.json();
    const subservice = await prisma.subservice.update({
      where: { id: Number(id) },
      data:  body
    });
    return NextResponse.json(subservice);
  } catch {
    return NextResponse.json({ error: 'Error al actualizar subservice' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.subservice.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error al eliminar subservice' }, { status: 500 });
  }
}