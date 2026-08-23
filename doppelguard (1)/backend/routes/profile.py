"""
Profile analysis, live scraping & dual comparator endpoints.
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import (
    ProfileInput,
    ProfileAnalysisResponse,
    CompareRequest,
    CompareResponse,
    ProfileAnalysisRecord,
    ScrapeUrlRequest,
    ScrapeAndCheckResponse,
    CrossPlatformRequest,
    CrossPlatformResponse
)
from scoring.engine import analyze_profile_engine, compare_profiles_engine
from scraper.profile_scraper import scrape_social_profile_url
from scraper.cross_platform import audit_cross_platform_identity

router = APIRouter(prefix="/profile", tags=["Profile Analysis"])

@router.post("/check", response_model=ProfileAnalysisResponse)
def check_profile(payload: ProfileInput, db: Session = Depends(get_db)):
    """
    Analyzes a single social media profile for impersonation risk, returns score (0-100),
    risk band, breakdown signals, ML confidence, visual pHash, likely target, and recommended action.
    Persists analysis in database.
    """
    profile_dict = payload.model_dump()
    result = analyze_profile_engine(profile_dict)

    # Persist record into SQLAlchemy DB
    try:
        record = ProfileAnalysisRecord(
            username=payload.username,
            name=payload.name or "",
            bio=payload.bio or "",
            photo_url=payload.photo_url or "",
            followers=payload.followers or 0,
            following=payload.following or 0,
            account_age_days=payload.account_age_days or 0,
            links_json=json.dumps(payload.links or []),
            risk_score=result["risk_score"],
            risk_band=result["risk_band"],
            signals_json=json.dumps(result["signals"]),
            likely_target=result["likely_target"],
            threat_type=result["threat_type"],
            recommended_action=result["recommended_action"]
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        
        result["id"] = str(record.id)
        result["created_at"] = record.created_at.isoformat() if record.created_at else None
    except Exception:
        db.rollback()
        result["id"] = "temp-" + str(abs(hash(payload.username)))

    result["profile"] = payload
    return result

@router.post("/compare", response_model=CompareResponse)
def compare_profiles(payload: CompareRequest, db: Session = Depends(get_db)):
    """
    Compares two profiles (profileA = Authentic reference, profileB = Suspect candidate)
    and computes similarity across dimensions including real 64-bit pHash Hamming distance,
    classifying the relationship as legitimate dual account, impersonation, or ambiguous.
    """
    prof_a = payload.profileA.model_dump()
    prof_b = payload.profileB.model_dump()
    
    result = compare_profiles_engine(prof_a, prof_b)
    return result

@router.post("/scrape-and-check", response_model=ScrapeAndCheckResponse)
def scrape_and_check(payload: ScrapeUrlRequest, db: Session = Depends(get_db)):
    """
    One-click live profile scanner: accepts any public social media URL (Twitter/X, Instagram, LinkedIn, GitHub, etc.),
    scrapes OpenGraph tags and metadata in real time, and immediately runs complete impersonation risk forensics.
    """
    scraped_data = scrape_social_profile_url(payload.url)
    
    profile_input = ProfileInput(
        username=scraped_data.get("username", ""),
        name=scraped_data.get("name", ""),
        bio=scraped_data.get("bio", ""),
        photo_url=scraped_data.get("photo_url", ""),
        followers=scraped_data.get("followers", 0),
        following=scraped_data.get("following", 0),
        account_age_days=scraped_data.get("account_age_days", 0),
        links=scraped_data.get("links", [])
    )

    analysis_result = check_profile(profile_input, db)

    return {
        "scraped_profile": profile_input,
        "platform": scraped_data.get("platform", "Social Profile"),
        "canonical_url": scraped_data.get("canonical_url", payload.url),
        "analysis": analysis_result
    }

@router.post("/cross-platform-check", response_model=CrossPlatformResponse)
def check_cross_platform(payload: CrossPlatformRequest):
    """
    Scans a username across Twitter, Instagram, LinkedIn, GitHub, YouTube, and Telegram,
    calculating identity consistency, age divergence, and asymmetric spoofing clusters.
    """
    return audit_cross_platform_identity(payload.username)
