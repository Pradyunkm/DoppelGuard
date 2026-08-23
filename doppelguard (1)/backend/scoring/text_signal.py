"""
Text Signal Feature Extraction Module.

Uses lexical pattern matching, scam token density analysis,
financial urgency keyword scoring, and Jaccard/Levenshtein overlap for bio comparison.
"""

from typing import Dict, Any, List, Optional
from scoring.rules import HIGH_RISK_BIO_KEYWORDS

def extract_text_signal(bio: str, name: str, reference_bio: Optional[str] = None) -> Dict[str, Any]:
    """
    Extracts text-based risk signals from profile bio and display name.
    """
    combined_text = f"{name} {bio}".lower().strip()
    matched_keywords: List[str] = []
    
    if not combined_text:
        return {
            "raw_score": 0.0,
            "matched_keywords": [],
            "explanation": "No bio or name text provided for lexical analysis."
        }

    # If comparing with a reference bio:
    if reference_bio is not None:
        ref_text = reference_bio.lower().strip()
        words_target = set(combined_text.split())
        words_ref = set(ref_text.split())
        if not words_ref or not words_target:
            sim_score = 0.0
        else:
            intersection = words_target.intersection(words_ref)
            union = words_target.union(words_ref)
            sim_score = (len(intersection) / len(union)) * 100.0
            
        return {
            "raw_score": round(sim_score, 2),
            "matched_keywords": list(intersection),
            "explanation": f"Text similarity calculated at {round(sim_score, 1)}% via token overlap."
        }

    # Standalone risk inspection:
    points = 0.0
    for keyword in HIGH_RISK_BIO_KEYWORDS:
        if keyword in combined_text:
            matched_keywords.append(keyword)
            points += 24.0

    # Indian financial scam & recruitment fraud pattern detection
    indian_scam_patterns = [
        "lakh", "crore", "guaranteed returns", "sebi registered", "jackpot calls", "rs 500", "rs 1500", "ctc"
    ]
    for pattern in indian_scam_patterns:
        if pattern in combined_text and pattern not in matched_keywords:
            matched_keywords.append(f"financial pattern: '{pattern}'")
            points += 22.0

    # Phishing & authority impersonation signals
    phish_cues = ["click link", "dm for assistance", "connect wallet", "registration fee", "free trial", "bonus", "gift"]
    for cue in phish_cues:
        if cue in combined_text and cue not in matched_keywords:
            matched_keywords.append(cue)
            points += 18.0

    # Direct messaging & wallet handlers
    if "0x" in combined_text or "t.me/" in combined_text or "wa.me/" in combined_text or "wa.link" in combined_text:
        points += 20.0
        if "direct messaging / wallet address" not in matched_keywords:
            matched_keywords.append("direct messaging / wallet redirect")

    if "official" in combined_text and ("verify" in combined_text or "support" in combined_text or "giveaway" in combined_text or "live" in combined_text):
        points += 26.0
        if "unverified authority assertion" not in matched_keywords:
            matched_keywords.append("unverified authority assertion")

    final_score = min(points, 100.0)

    if final_score > 60:
        explanation = f"High risk text pattern detected. Matched scam/urgency keywords: {', '.join(matched_keywords[:4])}."
    elif final_score > 25:
        explanation = f"Moderate suspicion in bio text. Trigger keywords found: {', '.join(matched_keywords[:3])}."
    else:
        explanation = "Bio text contains standard conversational phrases with no critical scam triggers."

    return {
        "raw_score": round(final_score, 2),
        "matched_keywords": matched_keywords,
        "explanation": explanation
    }
