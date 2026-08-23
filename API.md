# DoppelGuard REST API Specification (v2.0)

## Base URL
- **Local Server:** `http://localhost:8000`
- **Swagger Interactive Docs:** `http://localhost:8000/docs`

---

## 1. Authentication & Access Control

### `POST /auth/login`
Authenticates credentials and returns JWT access token.

**Request Body:**
```json
{
  "username_or_email": "admin@doppelguard.sec",
  "password": "AdminPass123!"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1Ni...",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "id": "usr-admin-101",
    "username": "admin",
    "email": "admin@doppelguard.sec",
    "role": "ADMIN",
    "created_at": "2026-08-23T20:38:50"
  }
}
```

### `GET /auth/me`
*Requires Bearer Token*

**Header:** `Authorization: Bearer <token>`

---

## 2. Profile Analysis & Forensics

### `POST /profile/check`
Analyzes a single social media profile for impersonation risk.

**Request Body:**
```json
{
  "username": "elonmusk_official_eth",
  "name": "Elon Musk [Official Tesla Live]",
  "bio": "5,000 ETH Giveaway! Click link to claim now.",
  "photo_url": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
  "followers": 340,
  "following": 4890,
  "account_age_days": 3,
  "links": ["https://t.me/tesla_official_giveaway"]
}
```

**Response (200 OK):**
```json
{
  "risk_score": 94.5,
  "risk_band": "CRITICAL",
  "threat_type": "impersonation",
  "likely_target": "Elon Musk",
  "recommended_action": "Immediate Action Required: Block and report this profile for severe active impersonation targeting Elon Musk.",
  "signals": [
    {
      "name": "Handle & Target Mimicry",
      "contribution": 24.5,
      "explanation": "Detected entity spoofing pattern against Elon Musk."
    }
  ],
  "visual_diagnostics": {
    "phash": "e4c13bd20f9c49bc",
    "dhash": "a1b2c3d4e5f60718",
    "is_visual_clone": true
  }
}
```

### `POST /profile/compare`
Compares an authentic reference profile against a suspect candidate using perceptual pHash Hamming distance.

### `POST /profile/scrape-and-check`
SSRF-protected live URL scraper & forensic auditing endpoint.

### `POST /profile/cross-platform-check`
Correlates handle footprints across Twitter, Instagram, LinkedIn, GitHub, YouTube, and Telegram.

---

## 3. Evaluation & Benchmarks

### `GET /evaluation/benchmark?threshold=45`
Executes the empirical 50-case ground-truth dataset evaluation suite and returns confusion matrix, ROC-AUC, precision, recall, and latency metrics.

---

## 4. AI Security Copilot Gateway

### `POST /chat/assistant`
Server-side AI Gateway endpoint for natural language forensic analysis.
