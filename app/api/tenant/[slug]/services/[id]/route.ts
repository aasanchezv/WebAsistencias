import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Params {
  params: Promise<{ slug: string; id: string }>;
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { slug, id } = await params;

    // Validar que el servicio esté asociado al tenant
    const client = await prisma.client.findUnique({
      where: { slug }
    });

    if (!client) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });

    const clientService = await prisma.clientService.findUnique({
      where: {
        clientId_serviceId: {
          clientId:  client.id,
          serviceId: Number(id)
        }
      }
    });

    if (!clientService) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    // Traer el servicio con sus subservicios
    const service = await prisma.service.findUnique({
      where:   { id: Number(id) },
      include: { subservices: { orderBy: { createdAt: 'desc' } } }
    });

    if (!service) return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });

    return NextResponse.json({
      service,
      subservices: service.subservices
    });

  } catch {
    return NextResponse.json({ error: 'Error al obtener asistencia' }, { status: 500 });
  }
}