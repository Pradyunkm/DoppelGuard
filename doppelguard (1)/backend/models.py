import datetime
import json
from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from database import Base

# ==========================================
# PYDANTIC SCHEMAS (Request / Response)
# ==========================================

class ProfileInput(BaseModel):
    username: str = Field(..., description="Social media handle e.g. @elonmusk_official")
    name: Optional[str] = Field("", description="Display name e.g. Elon Musk [Official]")
    bio: Optional[str] = Field("", description="Profile biography text")
    photo_url: Optional[str] = Field("", description="Avatar or photo URL")
    followers: Optional[int] = Field(0, description="Follower count")
    following: Optional[int] = Field(0, description="Following count")
    account_age_days: Optional[int] = Field(0, description="Account age in days")
    links: Optional[List[str]] = Field(default_factory=list, description="Array of profile URLs or external links")

    model_config = {
        "json_schema_extra": {
            "example": {
                "username": "vitalik_buterin_gift",
                "name": "Vitalik Buterin [ETH Support]",
                "bio": "Ethereum founder. Official 5000 ETH giveaway for community! DM to claim.",
                "photo_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
                "followers": 120,
                "following": 3500,
                "account_age_days": 4,
                "links": ["https://t.me/eth_giveaway_fast", "http://bit.ly/eth-claim-vip"]
            }
        }
    }

class SignalItem(BaseModel):
    name: str
    contribution: float = Field(..., description="Risk points contributed (0 to 100)")
    explanation: str

class FeatureImpactItem(BaseModel):
    feature_key: str
    label: str
    value: float
    importance_weight: float
    impact_score: float
    direction: str

class VisualDiagnostics(BaseModel):
    phash: Optional[str] = None
    dhash: Optional[str] = None
    ref_phash: Optional[str] = None
    hamming_distance: Optional[float] = None
    visual_similarity: Optional[float] = None
    is_visual_clone: bool = False
    is_ai_generated_suspect: bool = False

class MLDiagnostics(BaseModel):
    ml_risk_probability: float
    ml_confidence: float
    model_name: str
    top_features: List[FeatureImpactItem] = Field(default_factory=list)

class ProfileAnalysisResponse(BaseModel):
    risk_score: float = Field(..., description="Overall hybrid risk score between 0 and 100")
    risk_band: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    signals: List[SignalItem]
    likely_target: Optional[str] = Field(None, description="Likely target entity being impersonated")
    threat_type: Literal[
        "fake_bot",
        "impersonation",
        "recruitment_scam",
        "brand_impersonation",
        "suspicious",
        "none"
    ]
    recommended_action: str
    id: Optional[str] = None
    created_at: Optional[str] = None
    profile: Optional[ProfileInput] = None
    ml_diagnostics: Optional[MLDiagnostics] = None
    visual_diagnostics: Optional[VisualDiagnostics] = None
    ml_probability: Optional[float] = None

class CompareRequest(BaseModel):
    profileA: ProfileInput = Field(..., description="Reference / Authentic or Baseline Profile")
    profileB: ProfileInput = Field(..., description="Candidate / Suspect Profile")

class SimilarityBreakdown(BaseModel):
    username: float = Field(..., description="Similarity 0-100")
    name: float = Field(..., description="Similarity 0-100")
    bio: float = Field(..., description="Similarity 0-100")
    photo: float = Field(..., description="Similarity 0-100")

class EvidenceItem(BaseModel):
    name: str
    explanation: str

class CompareResponse(BaseModel):
    similarity: SimilarityBreakdown
    relationship: Literal["legitimate_dual_account", "impersonation", "ambiguous"]
    evidence: List[EvidenceItem]
    confidence: float = Field(..., description="Confidence percentage 0-100")
    visual_diagnostics: Optional[VisualDiagnostics] = None
    id: Optional[str] = None
    created_at: Optional[str] = None

class ScrapeUrlRequest(BaseModel):
    url: str = Field(..., description="Public profile URL (Twitter/X, Instagram, LinkedIn, GitHub, etc.)")

class ScrapeAndCheckResponse(BaseModel):
    scraped_profile: ProfileInput
    platform: str
    canonical_url: str
    analysis: ProfileAnalysisResponse

class CrossPlatformRequest(BaseModel):
    username: str = Field(..., description="Username handle to audit across platforms")

class PlatformDetailItem(BaseModel):
    platform: str
    handle: str
    status: str
    followers: int
    age_days: int
    avatar: str
    verified: bool
    alert: Optional[str] = None

class CrossPlatformResponse(BaseModel):
    username: str
    canonical_name: str
    consistency_score: float
    verdict: str
    summary: str
    max_age_divergence_days: int
    platforms_audited: int
    active_platforms_count: int
    high_risk_clones_count: int
    platform_details: List[PlatformDetailItem]

# ==========================================
# SQLALCHEMY ORM MODELS
# ==========================================

class ProfileAnalysisRecord(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(255), index=True, nullable=False)
    name = Column(String(255), default="")
    bio = Column(Text, default="")
    photo_url = Column(Text, default="")
    followers = Column(Integer, default=0)
    following = Column(Integer, default=0)
    account_age_days = Column(Integer, default=0)
    links_json = Column(Text, default="[]")
    
    risk_score = Column(Float, nullable=False)
    risk_band = Column(String(50), nullable=False)
    signals_json = Column(Text, nullable=False)
    likely_target = Column(String(255), nullable=True)
    threat_type = Column(String(100), nullable=False)
    recommended_action = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self) -> Dict[str, Any]:
        signals = []
        try:
            signals = json.loads(self.signals_json)
        except Exception:
            pass

        links = []
        try:
            links = json.loads(self.links_json)
        except Exception:
            pass

        return {
            "id": str(self.id),
            "risk_score": self.risk_score,
            "risk_band": self.risk_band,
            "signals": signals,
            "likely_target": self.likely_target,
            "threat_type": self.threat_type,
            "recommended_action": self.recommended_action,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "profile": {
                "username": self.username,
                "name": self.name,
                "bio": self.bio,
                "photo_url": self.photo_url,
                "followers": self.followers,
                "following": self.following,
                "account_age_days": self.account_age_days,
                "links": links,
            }
        }
