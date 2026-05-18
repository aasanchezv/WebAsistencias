import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;

    const client = await prisma.client.findUnique({
      where: { slug },
      include: {
        services: {
          include: { service: true }
        }
      }
    });

    if (!client) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });

    const services = client.services
        .map(cs => cs.service)
        .filter(s => s.active);

    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 });
  }
}