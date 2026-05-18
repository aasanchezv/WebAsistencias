import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SignJWT } from 'jose';

export async function POST(req: Request) {

    try {

        const { email, password } = await req.json();

        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if (!admin) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        const valid = await bcrypt.compare(password, admin.password);

        if (!valid) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

        const token = await new SignJWT({ adminId: admin.id, role: 'admin' })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(secret);

        const res = NextResponse.json({ ok: true });

        res.cookies.set('admin_token', '', {
            path: '/',
            maxAge: 0,
        });

        // ✅ set nueva
        res.cookies.set('admin_token', token, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: false,
        });

        return res;

    } catch (error: any) {

        return NextResponse.json(
            {
                error: 'Error interno del servidor',
            },
            { status: 500 }
        );
    }
}