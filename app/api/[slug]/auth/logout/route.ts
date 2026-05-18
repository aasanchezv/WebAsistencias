import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function POST(_: NextRequest, { params }: Params) {
  const { slug } = await params;
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(`token_${slug}`);
  return res;
}