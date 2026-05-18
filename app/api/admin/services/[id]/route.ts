import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Params {
  params: Promise<{ id: string }>; // ← Promise
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params; // ← await aquí
    const service = await prisma.service.findUnique({
      where: { id: Number(id) }
    });
    if (!service) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(service);
  } catch(err) {
    return NextResponse.json({ error: 'Error al obtener service '+err }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
      const { id } = await params;
      const body = await req.json();
      const service = await prisma.service.update({
        where: { id: Number(id) },
        data: body
      });
      return NextResponse.json(service);
  } catch {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.service.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}