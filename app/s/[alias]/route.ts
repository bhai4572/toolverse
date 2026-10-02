import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { alias: string } }) {
  const alias = params.alias;

  if (!alias) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Fallback to home if link not found in transient memory
  return NextResponse.redirect(new URL('/tools/url-shortener', req.url));
}
