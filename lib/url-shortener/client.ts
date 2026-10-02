export interface ShortLinkRecord {
  id: string;
  alias: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
}

export const RESERVED_ALIASES = new Set([
  'admin',
  'api',
  'app',
  'login',
  'logout',
  'signup',
  'tools',
  'legal',
  'privacy',
  'terms',
  'about',
  'contact',
  'sitemap',
  'robots',
  'dashboard',
]);

export function validateDestinationUrl(url: string): { isValid: boolean; error?: string } {
  const trimmed = url.trim();
  if (!trimmed) {
    return { isValid: false, error: 'URL cannot be empty.' };
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'Only http:// and https:// URLs are allowed.' };
    }

    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.')
    ) {
      return { isValid: false, error: 'Private and localhost IPs are not permitted.' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format. Please include http:// or https://' };
  }
}

export function isAliasReserved(alias: string): boolean {
  return RESERVED_ALIASES.has(alias.trim().toLowerCase());
}

export function generateRandomAlias(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// LocalStorage persistence helper for guest user link history
export function saveLocalShortLink(link: ShortLinkRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalShortLinks();
    const updated = [link, ...existing.filter((l) => l.alias !== link.alias)];
    localStorage.setItem('toolverse_short_links', JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.warn('Failed to save link to localStorage:', e);
  }
}

export function getLocalShortLinks(): ShortLinkRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('toolverse_short_links');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
