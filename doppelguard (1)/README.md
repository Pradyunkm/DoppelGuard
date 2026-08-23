# DoppelGuard — AI-Powered Impersonation Risk Analysis Dashboard

DoppelGuard is an AI-powered impersonation risk analysis system and forensic dashboard. It receives social-media profile metadata (via manual input, raw JSON payload, or REST API calls) and computes an explainable **0–100 Risk Score**, **Risk Band** (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), **Threat Taxonomy** (`impersonation`, `brand_impersonation`, `recruitment_scam`, `fake_bot`, `suspicious`, `none`), **Likely Target Entity**, and **Actionable Mitigation Directives**.

It also features a **Dual Profile Comparator** to differentiate between **Legitimate Dual Accounts**, **Malicious Impersonation**, and **Ambiguous Overlap**.

---

## 1. How DoppelGuard Differs from DoppelGram

| Feature | **DoppelGuard** (This System) | **DoppelGram** (Demo App) |
|---|---|---|
| **Purpose** | Standalone Security Forensics & Risk Engine | Social-media mockup sandbox |
| **Input** | Accepts arbitrary profile JSON or API payloads | Internal simulated feeds |
| **Logic** | Modular feature extraction + scoring engine | Hardcoded mock visual feeds |
| **Output** | 0-100 score, evidence breakdown, threat classification | Social media feed rendering |

---

## 2. Project Architecture & File Tree

```
doppelguard/
├── backend/
│   ├── main.py                  # FastAPI entry point, CORS, lifespan & health probe
│   ├── database.py              # SQLAlchemy engine (SQLite fallback / PostgreSQL support)
│   ├── models.py                # Pydantic schemas (Request/Response) & SQLAlchemy ORM models
│   ├── routes/
│   │   ├── profile.py           # POST /profile/check and POST /profile/compare
│   │   └── reports.py           # GET /reports and DELETE /reports/{id}
│   ├── scoring/                 # ISOLATED SCORING & FEATURE EXTRACTION PIPELINE
│   │   ├── rules.py             # Configurable rule weights, target patterns, band thresholds
│   │   ├── text_signal.py       # Bio lexical triggers, intent keywords & cosine similarity proxy
│   │   ├── image_signal.py      # Avatar presence, image similarity & visual clone indicators
│   │   ├── behavior_signal.py   # Account age, following/follower ratios, typo-squatting, links
│   │   └── engine.py            # Central correlation engine combining weighted signals
│   ├── requirements.txt         # Python dependencies (fastapi, uvicorn, pydantic, sqlalchemy)
│   └── .env.example             # Backend environment variable template
├── frontend/ (src/)
│   ├── components/
│   │   ├── Header.tsx           # Global navbar, live server status indicator, quick actions
│   │   ├── RiskGauge.tsx        # Animated SVG circular risk gauge & band badges
│   │   ├── SignalAccordion.tsx  # Expandable evidence accordion with contribution meters
│   │   ├── ProfileCard.tsx      # Social profile preview card with stats & link chips
│   │   └── JsonViewer.tsx       # Formatted JSON viewer with copy & download functionality
│   ├── pages/
│   │   ├── DashboardPage.tsx    # SOC overview, KPI metrics, trend charts, recent scan list
│   │   ├── CheckProfilePage.tsx # 3 input methods (Form, Raw JSON, Presets) + live scanner
│   │   ├── AnalysisResultPage.tsx # In-depth forensic result with copyable audit summary
│   │   ├── CompareProfilesPage.tsx # Side-by-side comparator, similarity matrix & verdict
│   │   ├── ReportsPage.tsx      # Filterable/searchable audit database with CSV export
│   │   └── SettingsPage.tsx     # API base URL configurator & live weight tuner
│   ├── services/
│   │   └── doppelguardApi.ts    # Frontend HTTP API client with dynamic base URL
│   ├── types/
│   │   └── index.ts             # Complete TypeScript interfaces and types
│   └── data/
│       └── sampleProfiles.ts    # 6 Realistic test profiles (Crypto scam, CEO mimic, etc.)
├── server.ts                    # Full-stack Node.js/Express server (integrated runner)
├── package.json                 # Node dependencies and scripts
└── README.md                    # System documentation
```

---

## 3. How to Run Backend and Frontend

### Option A: Running with Standalone Python Backend + React Vite

#### Step 1: Start the Python FastAPI Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*Backend runs at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.*

#### Step 2: Start the React Frontend
```bash
npm install
npm run dev
```
*Frontend runs at `http://localhost:3000` (or `http://localhost:5173`).*

---

## 4. Swappable Scoring Architecture & ML Upgrade Roadmap

All detection logic is isolated inside `backend/scoring/`:

### 1. `backend/scoring/rules.py`
Contains the default weights dictionary:
```python
DEFAULT_SIGNAL_WEIGHTS = {
    "handle_mimicry": 0.25,        # Suffix squatting, homoglyphs, entity matching
    "text_similarity": 0.20,       # Lexical scam triggers, urgency tokens
    "behavioral_anomaly": 0.25,    # Account age velocity vs follower ratio
    "image_similarity": 0.15,      # Avatar likeness & asset hosting domain
    "link_suspicion": 0.15         # Suspicious TLDs and redirection endpoints
}
```
*Modify this file directly to retune signal weights or add high-profile celebrity target patterns without touching route or frontend code.*

### 2. `backend/scoring/text_signal.py`
- **Current Behavior**: Lexical pattern matcher, urgency token density, and Jaccard token overlap for profile comparisons.
- **ML Upgrade**:
  ```python
  from sentence_transformers import SentenceTransformer, util
  model = SentenceTransformer('all-MiniLM-L6-v2')
  emb_target = model.encode(bio)
  emb_ref = model.encode(reference_bio)
  cosine_sim = util.cos_sim(emb_target, emb_ref).item() * 100.0
  ```

### 3. `backend/scoring/image_signal.py`
- **Current Behavior**: Asset URL inspection, placeholder detection, and filename signature comparison.
- **ML Upgrade**:
  ```python
  import torch, clip
  from PIL import Image
  # Compute CLIP or FaceNet image embeddings between avatar URLs
  ```

### 4. `backend/scoring/behavior_signal.py`
- **Current Behavior**: Evaluates account age, mass-following ratios, typo-squatting affixes (`_official`, `_support`), trailing automated digits, and suspicious link shorteners (`bit.ly`, `t.me`).
- **ML Upgrade**: Temporal posting velocity models and Graph Neural Network (GNN) botnet cluster detection.

---

## 5. API Reference & Example cURL Commands

### 1. Single Profile Check (`POST /profile/check`)

#### Request:
```bash
curl -X POST "http://localhost:8000/profile/check" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "elonmusk_official_eth",
    "name": "Elon Musk [Official Tesla Live]",
    "bio": "Founder of Tesla & SpaceX. Celebrating Cybertruck delivery with 5,000 ETH Giveaway! Click link to claim now.",
    "photo_url": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
    "followers": 340,
    "following": 4890,
    "account_age_days": 3,
    "links": ["https://t.me/tesla_official_giveaway", "http://bit.ly/claim-eth-now"]
  }'
```

#### Response:
```json
{
  "risk_score": 94.5,
  "risk_band": "CRITICAL",
  "signals": [
    {
      "name": "Handle & Target Mimicry",
      "contribution": 24.5,
      "explanation": "Detected entity spoofing pattern against Elon Musk with '_official_eth' suffix."
    },
    {
      "name": "Behavioral Anomaly & Age Velocity",
      "contribution": 25.0,
      "explanation": "Brand new account created 3 days ago; aggressive mass-following ratio (4890 following vs 340 followers)."
    },
    {
      "name": "Text & Lexical Scam Triggers",
      "contribution": 20.0,
      "explanation": "High risk text pattern detected. Matched scam/urgency keywords: giveaway, send eth, dm to claim, official support."
    },
    {
      "name": "External Link Credibility",
      "contribution": 15.0,
      "explanation": "Profile directs users to unverified/shortened external endpoints: bit.ly, t.me."
    },
    {
      "name": "Visual Asset & Avatar Likeness",
      "contribution": 10.0,
      "explanation": "Custom avatar URL matches high-profile public figure headshot."
    }
  ],
  "likely_target": "Elon Musk",
  "threat_type": "impersonation",
  "recommended_action": "Immediate Action Required: Block and report this profile for severe active impersonation targeting Elon Musk. Notify compliance team and issue a user warning advisory.",
  "id": "1",
  "created_at": "2026-08-21T10:35:00.000Z"
}
```

---

### 2. Dual Profile Comparison (`POST /profile/compare`)

#### Request:
```bash
curl -X POST "http://localhost:8000/profile/compare" \
  -H "Content-Type: application/json" \
  -d '{
    "profileA": {
      "username": "elonmusk",
      "name": "Elon Musk",
      "bio": "Mars & Cars, Chips & Starlink",
      "photo_url": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
      "followers": 180000000,
      "following": 750,
      "account_age_days": 5200
    },
    "profileB": {
      "username": "elonmusk_official_eth",
      "name": "Elon Musk [Official Tesla Live]",
      "bio": "5,000 ETH Giveaway!",
      "photo_url": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
      "followers": 340,
      "following": 4890,
      "account_age_days": 3
    }
  }'
```

#### Response:
```json
{
  "similarity": {
    "username": 38.1,
    "name": 81.5,
    "bio": 18.2,
    "photo": 100.0
  },
  "relationship": "impersonation",
  "evidence": [
    {
      "name": "High Display Name Collision",
      "explanation": "Display names share an 81.5% lexical match."
    },
    {
      "name": "Identical Profile Picture",
      "explanation": "Avatar asset match is 100%, strongly indicating cloned profile visuals."
    },
    {
      "name": "Severe Age & Follower Asymmetry",
      "explanation": "Profile A was created 5197 days earlier and possesses 180000000 followers vs 340 on Profile B."
    }
  ],
  "confidence": 92.4
}
```

---

## 6. Switching from SQLite to PostgreSQL

By default, DoppelGuard uses SQLite (`sqlite:///./doppelguard.db`) so it operates immediately with zero external dependencies.

To connect to PostgreSQL:
1. In `backend/.env`:
   ```env
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/doppelguard
   ```
2. Install `psycopg2-binary` or `asyncpg`:
   ```bash
   pip install psycopg2-binary
   ```
3. Restart the FastAPI backend — tables will automatically initialize on startup.
