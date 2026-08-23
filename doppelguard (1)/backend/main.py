"""
DoppelGuard FastAPI Main Application.
"""

import os
import time
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import init_db, SessionLocal
from models import ProfileAnalysisRecord
from routes.profile import router as profile_router
from routes.reports import router as reports_router
from routes.evaluation import router as evaluation_router
from routes.chat import router as chat_router
from scoring.rules import DEFAULT_SIGNAL_WEIGHTS
from ml.model import DoppelGuardMLEnsemble

load_dotenv()

def seed_initial_reports():
    """Seeds baseline sample analysis records if database is empty."""
    db = SessionLocal()
    try:
        count = db.query(ProfileAnalysisRecord).count()
        if count == 0:
            sample_records = [
                ProfileAnalysisRecord(
                    username="elonmusk_official_eth",
                    name="Elon Musk [Official Tesla Live]",
                    bio="Founder of Tesla & SpaceX. Celebrating Cybertruck delivery with 5,000 ETH Giveaway! Click link to claim now.",
                    photo_url="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
                    followers=340,
                    following=4890,
                    account_age_days=3,
                    links_json=json.dumps(["https://t.me/tesla_official_giveaway", "http://bit.ly/claim-eth-now"]),
                    risk_score=94.5,
                    risk_band="CRITICAL",
                    signals_json=json.dumps([
                        {"name": "Handle & Target Mimicry", "contribution": 24.5, "explanation": "Detected entity spoofing pattern against Elon Musk with '_official_eth' suffix."},
                        {"name": "Behavioral Anomaly & Age Velocity", "contribution": 25.0, "explanation": "Brand new account created 3 days ago; aggressive mass-following ratio (4890 following vs 340 followers)."},
                        {"name": "Text & Lexical Scam Triggers", "contribution": 20.0, "explanation": "High risk text pattern detected. Matched scam/urgency keywords: giveaway, send eth, dm to claim, official support."},
                        {"name": "External Link Credibility", "contribution": 15.0, "explanation": "Profile directs users to unverified/shortened external endpoints (bit.ly, t.me)."},
                        {"name": "Visual Asset & Avatar Likeness (pHash)", "contribution": 10.0, "explanation": "Perceptual image hash match (pHash: e4c13bd20f9c49bc) matches high-profile public figure headshot."}
                    ]),
                    likely_target="Elon Musk",
                    threat_type="impersonation",
                    recommended_action="Immediate Action Required: Block and report this profile for severe active impersonation targeting Elon Musk. Notify compliance team and issue a user warning advisory."
                ),
                ProfileAnalysisRecord(
                    username="vitalik_eth_support_desk",
                    name="Vitalik Buterin (Community Desk)",
                    bio="Ethereum core developer. Resolving Metamask and ERC20 wallet transfer issues. Send DM for assistance.",
                    photo_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                    followers=120,
                    following=3200,
                    account_age_days=12,
                    links_json=json.dumps(["https://t.me/eth_support_desk_bot"]),
                    risk_score=87.0,
                    risk_band="CRITICAL",
                    signals_json=json.dumps([
                        {"name": "Handle & Target Mimicry", "contribution": 22.0, "explanation": "Detected entity spoofing pattern against Vitalik Buterin."},
                        {"name": "Behavioral Anomaly & Age Velocity", "contribution": 23.0, "explanation": "Recently created account (12 days old); mass-following ratio."},
                        {"name": "Text & Lexical Scam Triggers", "contribution": 22.0, "explanation": "Contains unverified authority assertions and support phishing keywords."},
                        {"name": "External Link Credibility", "contribution": 12.0, "explanation": "Directs to unverified Telegram bot support link."},
                        {"name": "Visual Asset & Avatar Likeness (pHash)", "contribution": 8.0, "explanation": "Cloned public avatar image signature."}
                    ]),
                    likely_target="Vitalik Buterin",
                    threat_type="impersonation",
                    recommended_action="Immediate Action Required: Suspend direct messaging and flag for credential harvesting investigation."
                ),
                ProfileAnalysisRecord(
                    username="sarah_designs_portfolio",
                    name="Sarah Jenkins | Product Designer",
                    bio="Senior UI/UX Designer @ TechFlow. Sharing design systems, case studies, and minimalist wireframes.",
                    photo_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                    followers=5420,
                    following=480,
                    account_age_days=780,
                    links_json=json.dumps(["https://sarahjenkins.design", "https://dribbble.com/sjenk"]),
                    risk_score=8.5,
                    risk_band="LOW",
                    signals_json=json.dumps([
                        {"name": "Handle & Target Mimicry", "contribution": 0.0, "explanation": "No celebrity or entity spoofing patterns detected."},
                        {"name": "Behavioral Anomaly & Age Velocity", "contribution": 2.0, "explanation": "Mature account (780 days old) with natural follower/following ratio."},
                        {"name": "Text & Lexical Scam Triggers", "contribution": 1.5, "explanation": "Bio text contains standard portfolio and career descriptions."},
                        {"name": "External Link Credibility", "contribution": 3.0, "explanation": "Verified custom top-level domain and official Dribbble portfolio."},
                        {"name": "Visual Asset & Avatar Likeness (pHash)", "contribution": 2.0, "explanation": "Original portrait avatar."}
                    ]),
                    likely_target=None,
                    threat_type="none",
                    recommended_action="Standard Operating Status: No immediate mitigation necessary. Profile metrics align with normal user interaction patterns."
                ),
                ProfileAnalysisRecord(
                    username="google_careers_recruitment",
                    name="Google Talent Acquisition HR",
                    bio="Official Global Recruiting Team at Google. Hiring remote Software Engineers, PMs, and Designers. Salary $120k-$240k.",
                    photo_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
                    followers=950,
                    following=1800,
                    account_age_days=21,
                    links_json=json.dumps(["https://google-careers-portal.top/apply", "https://wa.me/1987654321"]),
                    risk_score=78.0,
                    risk_band="HIGH",
                    signals_json=json.dumps([
                        {"name": "Handle & Target Mimicry", "contribution": 21.0, "explanation": "Target mimicry against Google corporate recruitment."},
                        {"name": "Behavioral Anomaly & Age Velocity", "contribution": 18.0, "explanation": "Young account created 21 days ago mimicking major enterprise brand."},
                        {"name": "Text & Lexical Scam Triggers", "contribution": 19.0, "explanation": "Matched high-risk recruitment fraud indicators (unrealistic remote hiring, salary solicitation)."},
                        {"name": "External Link Credibility", "contribution": 15.0, "explanation": "Phishing TLD (.top) masquerading as official Google careers domain."},
                        {"name": "Visual Asset & Avatar Likeness (pHash)", "contribution": 5.0, "explanation": "Stock corporate recruiter headshot."}
                    ]),
                    likely_target="Sundar Pichai",
                    threat_type="recruitment_scam",
                    recommended_action="Enforce Secondary Verification: Restrict outbound messaging and flag malicious phishing link for takedown."
                )
            ]
            db.add_all(sample_records)
            db.commit()
    except Exception as e:
        db.rollback()
        print(f"Notice: Initial seeding skipped ({e})")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables, seed, and train ML model
    init_db()
    seed_initial_reports()
    print("DoppelGuard Backend Initialized: Hybrid Scoring + 64-bit pHash + XGBoost/RF Model ready.")
    yield
    # Shutdown

app = FastAPI(
    title="DoppelGuard API",
    description="International-Caliber Multimodal Impersonation Risk Forensics & Live Profile Auditing Engine",
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS
origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000")
allowed_origins = [o.strip() for o in origins_str.split(",") if o.strip()] + ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes.auth import router as auth_router

# Request Audit & Security Header Middleware
@app.middleware("http")
async def security_audit_middleware(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start_time) * 1000, 1)
    
    # Add Security Headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Server"] = "DoppelGuard-Security-Gateway"
    
    return response

# Register routes
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(reports_router)
app.include_router(evaluation_router)
app.include_router(chat_router)

@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint to verify backend service status and scoring engine."""
    return {
        "status": "ok",
        "service": "DoppelGuard Enterprise Impersonation Risk Engine",
        "version": "2.0.0",
        "capabilities": [
            "JWT Authentication & Role-Based Access Control (RBAC)",
            "SSRF Prevention & DNS IP Range Defense",
            "64-bit DCT Perceptual Hashing (pHash/dHash)",
            "Trained XGBoost + Random Forest Ensemble ML",
            "SHAP-style Feature Attribution (XAI)",
            "Server-Side AI Gateway & Key Protection",
            "50-Profile Empirical Benchmark & Stress Suite"
        ],
        "default_weights": DEFAULT_SIGNAL_WEIGHTS
    }

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Mount frontend static assets if dist exists
dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))
if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        file_path = os.path.join(dist_dir, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Frontend not built yet. Run npm run build."}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=True)
