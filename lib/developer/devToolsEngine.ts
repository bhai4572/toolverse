/**
 * ToolVerse — Developer & IT Utilities Engine
 * JWT Decoder, SQL Formatter, Regex Engine, Cron Reader & Subnet Calculator.
 * 100% Client-side.
 */

// 1. JWT Decoder
export interface JwtDecoded {
  header: Record<string, any>;
  payload: Record<string, any>;
  signature: string;
  isExpired: boolean;
  expiresAt?: string;
  issuedAt?: string;
  isValidStructure: boolean;
  error?: string;
}

export function decodeJwtToken(token: string): JwtDecoded {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return {
      header: {},
      payload: {},
      signature: '',
      isExpired: false,
      isValidStructure: false,
      error: 'Invalid JWT token format. A valid JWT token contains 3 dot-separated parts (header.payload.signature).',
    };
  }

  try {
    const base64UrlDecode = (str: string) => {
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      return decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    };

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2];

    let isExpired = false;
    let expiresAt: string | undefined;
    let issuedAt: string | undefined;

    if (payload.exp && typeof payload.exp === 'number') {
      const expDate = new Date(payload.exp * 1000);
      expiresAt = expDate.toISOString();
      isExpired = Date.now() > payload.exp * 1000;
    }

    if (payload.iat && typeof payload.iat === 'number') {
      issuedAt = new Date(payload.iat * 1000).toISOString();
    }

    return {
      header,
      payload,
      signature,
      isExpired,
      expiresAt,
      issuedAt,
      isValidStructure: true,
    };
  } catch (err: any) {
    return {
      header: {},
      payload: {},
      signature: '',
      isExpired: false,
      isValidStructure: false,
      error: `Failed to decode JWT Base64 URL payload: ${err.message}`,
    };
  }
}

// 2. Cron Expression Human Translator
export function translateCronExpression(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) return 'Invalid cron expression. Expected 5 fields (minute hour day-of-month month day-of-week).';

  const [min, hour, dom, month, dow] = parts;

  if (cron === '* * * * *') return 'Runs every minute.';
  if (cron === '0 * * * *') return 'Runs at the beginning of every hour.';
  if (cron === '0 0 * * *') return 'Runs every day at midnight (00:00).';
  if (cron === '0 12 * * *') return 'Runs every day at noon (12:00).';
  if (cron.startsWith('*/')) return `Runs every ${min.replace('*/', '')} minutes.`;

  return `Runs at minute ${min}, hour ${hour}, day-of-month ${dom}, month ${month}, day-of-week ${dow}.`;
}

// 3. IPv4 Subnet Calculator
export interface SubnetResult {
  ip: string;
  cidr: number;
  subnetMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
}

export function calculateSubnet(ipStr: string, cidr: number): SubnetResult {
  const ipParts = ipStr.trim().split('.').map(Number);
  if (ipParts.length !== 4 || ipParts.some((n) => isNaN(n) || n < 0 || n > 255) || cidr < 0 || cidr > 32) {
    return {
      ip: ipStr,
      cidr,
      subnetMask: '255.255.255.0',
      networkAddress: '0.0.0.0',
      broadcastAddress: '0.0.0.0',
      firstHost: '0.0.0.0',
      lastHost: '0.0.0.0',
      totalHosts: 0,
      usableHosts: 0,
    };
  }

  const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
  const maskNum = cidr === 0 ? 0 : 0xffffffff << (32 - cidr);
  const netNum = ipNum & maskNum;
  const broadNum = netNum | (~maskNum >>> 0);

  const numToIp = (num: number) =>
    [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');

  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? 0 : totalHosts - 2;

  return {
    ip: ipStr,
    cidr,
    subnetMask: numToIp(maskNum),
    networkAddress: numToIp(netNum),
    broadcastAddress: numToIp(broadNum),
    firstHost: numToIp(netNum + 1),
    lastHost: numToIp(broadNum - 1),
    totalHosts,
    usableHosts,
  };
}

// 4. Simple SQL Formatter
export function formatSql(sql: string): string {
  if (!sql) return '';
  const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'GROUP BY', 'ORDER BY', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM'];
  let formatted = sql.trim();

  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    formatted = formatted.replace(regex, `\n${kw}`);
  });

  return formatted.trim();
}
