import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const subservices = await prisma.subservice.findMany({
      where:   { serviceId: Number(id) },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(subservices);
  } catch {
    return NextResponse.json({ error: 'Error al obtener subservices' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body    = await req.json();
    const subservice = await prisma.subservice.create({
      data: { ...body, serviceId: Number(id) }
    });
    return NextResponse.json(subservice, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear subservice' }, { status: 500 });
  }
}