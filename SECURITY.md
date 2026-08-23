# DoppelGuard Security Policy & Vulnerability Disclosure

## 1. Security Overview
DoppelGuard is designed following defense-in-depth security principles to protect forensic intelligence data, prevent Server-Side Request Forgery (SSRF), enforce Role-Based Access Control (RBAC), and isolate sensitive API keys.

---

## 2. Authentication & Authorization Specs

### Password Hashing
- **Algorithm:** PBKDF2-HMAC-SHA256
- **Iterations:** 100,000 rounds
- **Salt:** 16-byte cryptographically secure random salt (`secrets.token_hex(16)`)

### JWT Bearer Tokens
- **Algorithm:** HS256
- **Expiration:** 24 Hours (`ACCESS_TOKEN_EXPIRE_MINUTES = 1440`)
- **Payload Claims:** `sub` (User ID), `username`, `role`, `iat`, `exp`

### Default Pre-Seeded Test Credentials
> **Note:** For evaluation and demo purposes, pre-seeded accounts are initialized:
- **Administrator Role:** `admin@doppelguard.sec` / `AdminPass123!`
- **Analyst Role:** `analyst@doppelguard.sec` / `AnalystPass123!`
- **User Role:** `demo@doppelguard.sec` / `UserPass123!`

---

## 3. SSRF & Network Hardening

Outbound HTTP scraper requests are filtered through `validate_ssrf_safe_url`:
- **Allowed Schemes:** `http://`, `https://`
- **Blocked IP Ranges:**
  - Loopback: `127.0.0.0/8`, `::1`
  - Private RFC 1918: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
  - Cloud Metadata / Link-Local: `169.254.0.0/16`, `fe80::/10`
  - Reserved & Multicast
- **Timeout & Payload Cap:** Max response size 2MB; socket timeout 3.5 seconds.

---

## 4. HTTP Security Headers

All API responses include standard enterprise security headers enforced via FastAPI middleware:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Server: DoppelGuard-Security-Gateway`
