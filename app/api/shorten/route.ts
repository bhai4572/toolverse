import { NextRequest, NextResponse } from 'next/server';
import {
  validateDestinationUrl,
  isAliasReserved,
  generateRandomAlias,
  ShortLinkRecord,
} from '@/lib/url-shortener/client';

// Memory/KV store for active short links
const shortLinkMap = new Map<string, ShortLinkRecord>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, customAlias } = body;

    const validation = validateDestinationUrl(url);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    let alias = customAlias ? customAlias.trim() : '';

    if (alias) {
      if (isAliasReserved(alias)) {
        return NextResponse.json({ error: 'This alias is reserved and cannot be used.' }, { status: 400 });
      }
      if (!/^[a-zA-Z0-9_-]{3,30}$/.test(alias)) {
        return NextResponse.json(
          { error: 'Alias must be 3-30 alphanumeric characters, hyphens, or underscores.' },
          { status: 400 }
        );
      }
      if (shortLinkMap.has(alias.toLowerCase())) {
        return NextResponse.json({ error: 'This custom alias is already taken.' }, { status: 409 });
      }
    } else {
      alias = generateRandomAlias(6);
      while (shortLinkMap.has(alias.toLowerCase())) {
        alias = generateRandomAlias(6);
      }
    }

    const domain = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const shortUrl = `${domain}/s/${alias}`;

    const record: ShortLinkRecord = {
      id: Date.now().toString(),
      alias,
      originalUrl: url.trim(),
      shortUrl,
      createdAt: new Date().toISOString(),
      clicks: 0,
    };

    shortLinkMap.set(alias.toLowerCase(), record);

    return NextResponse.json(record);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
