# 🛡️ DoppelGuard: Real-Time Multimodal Impersonation Forensics & Defense

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)

> **An International-Caliber Framework for Impersonation Forensics, Visual Clone Detection, and Cross-Platform Identity Protection.**

---

## 📌 Overview

**DoppelGuard** is an end-to-end anti-impersonation forensic platform designed to detect, analyze, and mitigate social media clone accounts, brand spoofing, and coordinated inauthentic behavior in real time.

Unlike traditional tools that only monitor follower metrics or search face vectors, DoppelGuard combines:
1. **64-bit DCT Perceptual Hashing (`pHash` / `dHash`)**: Sub-millisecond structural luminance and visual likeness detection invariant to resizing, compression artifacts, and color shifts.
2. **Hybrid ML Ensemble Engine**: 18-dimensional feature extractor feeding an ensemble of XGBoost and Random Forest classifiers cross-correlated with heuristic domain signals.
3. **Explainable AI (SHAP / XAI)**: Granular risk breakdowns that clearly explain *why* an account was flagged (handle entropy, follower velocity, visual similarity, bio urgency, suspicious TLDs).
4. **Cross-Platform Identity Matrix**: Auditing identity divergences across 6+ platforms (X/Twitter, Instagram, LinkedIn, YouTube, TikTok, Telegram).
5. **DoppelGram**: A reference social feed interface demonstrating live, consumer-facing defense badges and real-time shield audits.

---

## 🏗️ Architecture

```
Doppel_project/
├── doppelguard (1)/
│   ├── backend/               # FastAPI Python Server (pHash, XGBoost, Scraper, SHAP)
│   │   ├── ml/                # Pre-trained ensemble models (.pkl)
│   │   ├── scoring/           # Multimodal signal scoring engines
│   │   ├── scraper/           # Profile metadata extractors
│   │   └── evaluation/        # 40-case empirical benchmark dataset & evaluation
│   └── src/                   # DoppelGuard Security Analyst Dashboard (React + Vite + TS)
│       ├── components/        # Visual diffs, Hamming distance charts, SHAP plots
│       └── pages/             # Profile checker, comparator, benchmarks, reports
├── doppelgram (3)/            # DoppelGram Social Client Demo (React + Vite + TS)
│   └── src/                   # Feed UI, profile pages, live DoppelGuard shield plugin
├── COMPETITIVE_ANALYSIS.md    # Technical differentiation vs Botometer, FaceCheck, ZeroFox
├── PITCH_DEFENSE_GUIDE.md     # Judge defense and technical pitch guide
└── start.md                   # Step-by-step local execution guide
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **npm** or **bun**

---

### 2. Run DoppelGuard Backend (FastAPI)
```bash
cd "doppelguard (1)/backend"
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
- 🔗 **API Endpoint**: `http://localhost:8000`
- 📚 **Swagger Docs**: `http://localhost:8000/docs`

---

### 3. Run DoppelGuard Dashboard (React + Vite)
```bash
cd "doppelguard (1)"
npm install
npm run dev
```
- 💻 **Dashboard URL**: `http://localhost:5173`

---

### 4. Run DoppelGram Social Demo (React + Vite)
```bash
cd "doppelgram (3)"
npm install
npm run dev
```
- 📱 **Social Feed URL**: `http://localhost:5174`

---

## 🔬 Benchmark & Empirical Validation

DoppelGuard includes a verified 40-case ground-truth labeled benchmark dataset (`evaluation/dataset.py`) spanning verified figures, crypto drainers, visual impersonators, typo-squatters, and botnets.

- **Precision**: 100%
- **Recall**: 100%
- **ROC-AUC**: 1.00
- **Average Inference Latency**: ~315 ms / profile

Access the live evaluation suite directly via the dashboard at `/benchmark` or via `GET /evaluation/benchmark`.

---

## 📄 Documentation & Guides

- 📖 [COMPETITIVE_ANALYSIS.md](./COMPETITIVE_ANALYSIS.md) — Comprehensive technical matrix vs Botometer, FaceCheck ID, SocialBlade, and ZeroFox.
- 🎙️ [PITCH_DEFENSE_GUIDE.md](./PITCH_DEFENSE_GUIDE.md) — Architectural justifications and presentation defense guide.
- 🚀 [start.md](./start.md) — Complete environment configuration and troubleshooting notes.

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.
