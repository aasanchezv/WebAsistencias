import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Params {
    params: Promise<{ slug: string }>;
}

export async function GET(_: NextRequest, { params }: Params) {
    try {
        const { slug } = await params;
        const page = await prisma.page.findUnique({ where: { slug } });
        return NextResponse.json(page ?? { slug, title: '', content: '' });
    } catch {
        return NextResponse.json({ error: 'Error al obtener página' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const { slug } = await params;
        const { title, content } = await req.json();
        const page = await prisma.page.upsert({
            where: { slug },
            update: { title, content },
            create: { slug, title, content },
        });
        return NextResponse.json(page);
    } catch (err) {
        return NextResponse.json({ error: 'Error al guardar página '+err }, { status: 500 });
    }
}