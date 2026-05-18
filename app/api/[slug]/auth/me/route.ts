import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const secret   = process.env.JWT_SECRET;
    if (!secret) return NextResponse.json({ authenticated: false });

    const token = req.cookies.get(`token_${slug}`)?.value;
    if (!token)  return NextResponse.json({ authenticated: false });

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

    if (payload.slug !== slug) return NextResponse.json({ authenticated: false });

    return NextResponse.json({ authenticated: true, userId: payload.userId });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}