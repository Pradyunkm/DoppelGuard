# How to Run DoppelGuard + DoppelGram Locally

> **Note:** The project folders contain spaces in their names (`doppelguard (1)` and `doppelgram (3)`). All `cd` commands below use **quoted paths** — copy them exactly.

---

## Prerequisites

- **Python 3.10+** — for the FastAPI backend with pHash & XGBoost/Random Forest ensemble
- **Node.js 18+** — for both React frontends
- **pip** — Python package manager

---

## Terminal 1 — DoppelGuard Backend (FastAPI + pHash + ML Ensemble)

```bash
cd "doppelguard (1)/backend"
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

✅ Backend runs at: **http://localhost:8000**
✅ API docs (Swagger): **http://localhost:8000/docs**

Verify it's working:
```bash
curl http://localhost:8000/health
```

---

## Terminal 2 — DoppelGuard Frontend (React + Vite)

```bash
cd "doppelguard (1)"
npm install
npm run dev
```

✅ DoppelGuard Dashboard runs at: **http://localhost:5173**

---

## Terminal 3 — DoppelGram (React + Vite)

```bash
cd "doppelgram (3)"
npm install
npm run dev
```

✅ DoppelGram Social Feed runs at: **http://localhost:5174**

---

## Environment Setup (One-time)

### DoppelGram `.env.local`

The file has been created at `doppelgram (3)/.env.local`. Edit it and replace `your_key_here`:

```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
VITE_DOPPELGUARD_API_URL=http://localhost:8000
```

Get a Gemini API key at: https://aistudio.google.com/app/apikey

---

## All Available API Routes (v2.0)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Backend status & capabilities checklist |
| `POST` | `/profile/check` | Analyze a profile (Hybrid ML + 64-bit pHash + SHAP XAI) |
| `POST` | `/profile/compare` | Compare two profiles with real pHash Hamming distance |
| `POST` | `/profile/scrape-and-check` | One-click live social media URL scraper & audit |
| `POST` | `/profile/cross-platform-check` | Multi-network identity consistency matrix (Twitter, IG, LinkedIn, etc.) |
| `GET` | `/evaluation/benchmark` | Run 40-case empirical benchmark (Confusion Matrix, Precision, Recall, ROC-AUC) |
| `GET` | `/evaluation/dataset` | Retrieve 40-case ground-truth labeled benchmark dataset |
| `GET` | `/evaluation/competitive-matrix` | Fetch competitive breakdown vs Botometer, FaceCheck, ZeroFox |
| `GET` | `/reports` | Fetch all historical reports |
| `DELETE` | `/reports/{id}` | Delete a report by ID |

---

## Hackathon Pitch Artifacts

- 📖 **Competitive Analysis Matrix:** [COMPETITIVE_ANALYSIS.md](./COMPETITIVE_ANALYSIS.md)
- 🎙️ **Judge Defense & Pitch Guide:** [PITCH_DEFENSE_GUIDE.md](./PITCH_DEFENSE_GUIDE.md)

---

## Troubleshooting

| Problem | Fix |
|---|---|
| DoppelGuard frontend can't connect to backend | Make sure Terminal 1 is running on port 8000 |
| "DoppelGuard backend not reachable" toast | Start `uvicorn main:app --reload --port 8000` |
| Port 5173 already in use | Kill the process: `npx kill-port 5173` |
| Port 5174 already in use | Kill the process: `npx kill-port 5174` |
| npm install fails | Run `npm install --legacy-peer-deps` |
| SQLite DB not created | It auto-creates on first run at `doppelguard (1)/backend/doppelguard.db` |
