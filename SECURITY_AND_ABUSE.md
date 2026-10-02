# ToolVerse — Security Architecture & Abuse Prevention Policy

ToolVerse is built with zero-trust security standards to protect users and preserve platform integrity.

---

## 🔒 1. Client Security & Privacy Standards

1. **Browser Isolation:** File processing occurs locally inside client browser memory using JavaScript, WebAssembly, and Web Crypto API.
2. **Sanitization:** HTML inputs, rendered text, and previews are sanitized using `DOMPurify` to prevent Cross-Site Scripting (XSS).
3. **HTTP Security Headers:** Strict transport security (`HSTS`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy` headers enabled on all responses.
4. **No Key Leakage:** Server environment keys are never rendered into frontend JavaScript.

---

## 🚫 2. Prohibited Tool & Service Policy

ToolVerse strictly prohibits the creation, hosting, or distribution of:
- Password crackers or hash reversal tools
- PDF password bypasses or DRM removal tools
- Account checkers or credential stuffing bots
- Fake engagement, fake views, fake followers, or bot traffic generators
- Unauthorized platform scraping tools
- Copyright bypasses or piracy downloaders
- Malware, phishing, or DDoS attack tools
- Identity document forgery or fake CNIC/passport generators

---

## 🛡️ 3. URL Shortener Abuse & Security Defenses

1. **Destination Protocol Validation:** Only valid `http://` and `https://` URLs are accepted.
2. **Prohibited Targets:** `localhost`, loopback IPs (`127.0.0.1`, `::1`), private IP ranges (`192.168.x.x`, `10.x.x.x`), data URIs (`data:`), and JavaScript strings (`javascript:`) are blocked.
3. **Reserved Aliases:** Dangerous or system paths (`/admin`, `/api`, `/login`, `/sitemap`) are protected from alias takeover.
4. **Cloudflare Turnstile:** Turnstile CAPTCHA verification protects link creation from bot spam.
5. **Rate Limiting:** Guest link creation is limited to 5 links per hour per IP.

---

## 🎓 4. Writing & Academic Integrity Security & Abuse Policy

1. **Zero AI Bypass Policy:** ToolVerse explicitly forbids tools marketed to bypass Turnitin, evade university detectors, or produce "undetectable AI" text.
2. **User Consent Enforcement:** Rephrasing endpoints enforce mandatory user consent confirming rights to edit submitted text and compliance with institutional honor codes.
3. **No Unverified Scores:** Institutional plagiarism scores are kept disabled by default unless a legally licensed academic corpus provider is integrated.
4. **Text Length & Rate Limits:** Backend writing endpoints enforce `MAX_TEXT_LENGTH` (50,000 chars) and daily per-IP request limits (`WRITING_TOOL_DAILY_LIMIT=100`) to prevent API abuse.
5. **No Data Storage:** User-submitted writing text is processed in memory and never logged or stored by default.
