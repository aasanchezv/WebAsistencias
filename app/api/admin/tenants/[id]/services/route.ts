import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Params {
  params: Promise<{ id: string }>;
}

// GET — servicios asignados al cliente
export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const clientServices = await prisma.clientService.findMany({
      where:   { clientId: Number(id) },
      include: { service: true }
    });
    return NextResponse.json(clientServices.map(cs => cs.service));
  } catch {
    return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 });
  }
}

// POST — asignar servicio al cliente
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id }      = await params;
    const { serviceId } = await req.json();
    const clientService = await prisma.clientService.create({
      data: { clientId: Number(id), serviceId: Number(serviceId) }
    });
    return NextResponse.json(clientService, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al asignar servicio' }, { status: 500 });
  }
}

// DELETE — quitar servicio del cliente
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id }      = await params;
    const { serviceId } = await req.json();
    await prisma.clientService.delete({
      where: { clientId_serviceId: { clientId: Number(id), serviceId: Number(serviceId) } }
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error al quitar servicio' }, { status: 500 });
  }
}