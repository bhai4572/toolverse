import QRCode from 'qrcode';

export function formatJson(jsonString: string, indent: number = 2): { formatted?: string; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    return { formatted: JSON.stringify(parsed, null, indent) };
  } catch (err: any) {
    return { error: err.message || 'Invalid JSON format' };
  }
}

export function minifyJson(jsonString: string): { minified?: string; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    return { minified: JSON.stringify(parsed) };
  } catch (err: any) {
    return { error: err.message || 'Invalid JSON format' };
  }
}

export function convertJsonToCsv(jsonInput: string): { csv?: string; error?: string } {
  try {
    let data = JSON.parse(jsonInput);
    if (!Array.isArray(data)) {
      if (typeof data === 'object' && data !== null) {
        data = [data];
      } else {
        return { error: 'JSON must be an array of objects or a single object.' };
      }
    }

    if (data.length === 0) return { csv: '' };

    const headers = Array.from(
      new Set(data.flatMap((obj: any) => (typeof obj === 'object' && obj !== null ? Object.keys(obj) : [])))
    ) as string[];

    const csvRows: string[] = [];
    csvRows.push(headers.map((h) => JSON.stringify(h)).join(','));

    for (const row of data) {
      const values = headers.map((header) => {
        const val = row[header];
        if (val === undefined || val === null) return '""';
        if (typeof val === 'object') return JSON.stringify(JSON.stringify(val));
        return JSON.stringify(val);
      });
      csvRows.push(values.join(','));
    }

    return { csv: csvRows.join('\n') };
  } catch (err: any) {
    return { error: err.message || 'Failed to parse JSON for CSV conversion.' };
  }
}

export async function generateQrCodeDataUrl(
  text: string,
  options: { width?: number; darkColor?: string; lightColor?: string } = {}
): Promise<string> {
  const { width = 300, darkColor = '#000000', lightColor = '#ffffff' } = options;
  return await QRCode.toDataURL(text, {
    width,
    margin: 2,
    color: {
      dark: darkColor,
      light: lightColor,
    },
  });
}

export async function generateQrCodeSvg(
  text: string,
  options: { darkColor?: string; lightColor?: string } = {}
): Promise<string> {
  const { darkColor = '#000000', lightColor = '#ffffff' } = options;
  return await QRCode.toString(text, {
    type: 'svg',
    margin: 2,
    color: {
      dark: darkColor,
      light: lightColor,
    },
  });
}

export function generateSecurePassword(
  length: number = 16,
  options: { uppercase?: boolean; lowercase?: boolean; numbers?: boolean; symbols?: boolean } = {}
): string {
  const { uppercase = true, lowercase = true, numbers = true, symbols = true } = options;

  let charset = '';
  if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) charset += '0123456789';
  if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }

  return password;
}

export function generateUuidV4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback Web Crypto algorithm
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  buf[6] = (buf[6] & 0x0f) | 0x40; // Version 4
  buf[8] = (buf[8] & 0x3f) | 0x80; // Variant 10xx

  const hex = Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function generateBulkUuids(count: number = 10): string[] {
  const result: string[] = [];
  const qty = Math.min(Math.max(count, 1), 500);
  for (let i = 0; i < qty; i++) {
    result.push(generateUuidV4());
  }
  return result;
}

export function encodeBase64(text: string): string {
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch (e) {
    throw new Error('Base64 encoding failed.');
  }
}

export function decodeBase64(base64Text: string): string {
  try {
    return decodeURIComponent(escape(atob(base64Text.trim())));
  } catch (e) {
    throw new Error('Invalid Base64 string.');
  }
}

export async function computeHash(text: string, algorithm: 'SHA-256' | 'SHA-512' | 'SHA-1'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
