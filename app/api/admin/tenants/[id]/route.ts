import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const client = await prisma.client.findUnique({
      where: { id: Number(id) }
    });
    if (!client) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(client);
  } catch {
    return NextResponse.json({ error: 'Error al obtener cliente' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body   = await req.json();
    const client = await prisma.client.update({
      where: { id: Number(id) },
      data:  body
    });
    return NextResponse.json(client);
  } catch {
    return NextResponse.json({ error: 'Error al actualizar cliente' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.client.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error al eliminar cliente' }, { status: 500 });
  }
}