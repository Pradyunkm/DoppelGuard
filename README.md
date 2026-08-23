# 🛡️ DoppelGuard: Enterprise Multimodal Impersonation Forensics & Defense Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![Security: JWT + RBAC](https://img.shields.io/badge/Security-JWT%20%2B%20RBAC-red.svg)](SECURITY.md)
[![SSRF Defense](https://img.shields.io/badge/Scraper-SSRF%20Hardened-green.svg)](architecture.md)

> **An Enterprise-Grade Framework for Multimodal Impersonation Forensics, Visual Clone Detection, SSRF-Hardened Scraping, and Cross-Platform Identity Protection.**

---

## 📌 Executive Summary

**DoppelGuard** is an enterprise-grade anti-impersonation forensic platform designed to detect, analyze, and mitigate social media clone accounts, brand spoofing, and coordinated inauthentic behavior in real time.

### Core Capabilities & Hardened Security Architecture
1. **JWT & Role-Based Access Control (RBAC):** Token authentication with PBKDF2-HMAC-SHA256 password hashing and role enforcement (`ADMIN`, `ANALYST`, `USER`).
2. **SSRF-Hardened Scraper:** Strict DNS IP range filtering blocking loopback (`127.0.0.1`), private subnets (`10.x`, `192.168.x`), and cloud metadata endpoints (`169.254.169.254`) with a 3.5s timeout and 2MB body cap.
3. **64-bit DCT Perceptual Image Hashing (`pHash` / `dHash`):** Sub-millisecond structural luminance and visual likeness detection invariant to resizing, compression artifacts, and color shifts.
4. **Hybrid ML Ensemble Engine:** Feature extractor feeding an ensemble of XGBoost and Random Forest classifiers cross-correlated with heuristic domain signals.
5. **50-Case Empirical Benchmark Suite:** Includes 20 synthetic malicious cases, 20 benign creator profiles, and 10 real-world stress test edge cases (fan accounts, genuine recruiters, alt profiles, multilingual scams).
6. **Server-Side AI Gateway:** Gemini AI API key isolation on FastAPI backend with query rate limiting and prompt sanitization.
7. **Production RDBMS Compatibility:** Seamless switching between SQLite (local dev) and PostgreSQL (production clusters) via `DATABASE_URL` with SQLAlchemy connection pooling.

---

## 📁 Repository Structure & Documentation

```
Doppel_project/
├── architecture.md             # Enterprise C4 Architecture, Threat Model & Judge Defense Guide
├── SECURITY.md                 # Security Policy, SSRF Filters, RBAC Matrix & Hashing Specs
├── API.md                      # Comprehensive OpenAPI & REST Endpoint Documentation
├── doppelguard (1)/            # Main DoppelGuard Security Suite
│   ├── backend/                # FastAPI Server (JWT Auth, SSRF Scraper, pHash, ML, AI Gateway)
│   │   ├── auth.py             # JWT issuance, PBKDF2 hashing & RBAC role checkers
│   │   ├── scraper/security.py # SSRF protection & DNS IP range validator
│   │   ├── evaluation/         # 50-case ground truth dataset & stress test evaluation harness
│   │   └── routes/             # Auth, Profile, Reports, Benchmark & AI Chat routes
│   └── src/                    # DoppelGuard Security Analyst Dashboard (React + Vite + TS)
└── doppelgram (3)/             # DoppelGram Consumer Social Feed Plugin (React + Vite + TS)
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+**

### 2. Run DoppelGuard Backend (FastAPI)
```bash
cd "doppelguard (1)/backend"
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
- 🔗 **API Server:** `http://localhost:8000`
- 📚 **Swagger Docs:** `http://localhost:8000/docs`

### 3. Pre-Seeded Default Test Credentials
- **Admin Role:** `admin@doppelguard.sec` / `AdminPass123!`
- **Analyst Role:** `analyst@doppelguard.sec` / `AnalystPass123!`
- **User Role:** `demo@doppelguard.sec` / `UserPass123!`

### 4. Run DoppelGuard Dashboard (React + Vite)
```bash
cd "doppelguard (1)"
npm install
npm run dev
```
- 💻 **Dashboard:** `http://localhost:5173`

### 5. Run DoppelGram Social Demo (React + Vite)
```bash
cd "doppelgram (3)"
npm install
npm run dev
```
- 📱 **Social Feed:** `http://localhost:5174`

---

## 🛡️ Judge Q&A & Technical Credibility

For full details on our defense strategy against potential judge challenges regarding SSRF, authentication, ML generalization, and database scaling, see [architecture.md](architecture.md#4-judge-qa-defense-guide).
