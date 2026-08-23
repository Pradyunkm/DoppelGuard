"""
Central Hybrid Scoring & Correlation Engine for DoppelGuard.

Integrates multimodal signal extractors (Text, Perceptual Image pHash, Behavior, Handle Mimicry)
with a trained Random Forest / XGBoost ensemble classifier to generate explainable 0-100 risk scores.
"""

import math
from typing import Dict, Any, List, Optional, Tuple
from scoring.rules import (
    DEFAULT_SIGNAL_WEIGHTS,
    KNOWN_TARGET_PATTERNS,
    get_risk_band
)
from scoring.text_signal import extract_text_signal
from scoring.image_signal import extract_image_signal
from scoring.behavior_signal import extract_behavior_signal
from ml.model import predict_profile_ml_risk

def levenshtein_similarity(s1: str, s2: str) -> float:
    """Calculates Levenshtein-based similarity percentage (0.0 to 100.0) between two strings."""
    s1, s2 = (s1 or "").lower().strip(), (s2 or "").lower().strip()
    if s1 == s2:
        return 100.0
    if not s1 or not s2:
        return 0.0

    len1, len2 = len(s1), len(s2)
    matrix = [[0] * (len2 + 1) for _ in range(len1 + 1)]

    for i in range(len1 + 1):
        matrix[i][0] = i
    for j in range(len2 + 1):
        matrix[0][j] = j

    for i in range(1, len1 + 1):
        for j in range(1, len2 + 1):
            cost = 0 if s1[i - 1] == s2[j - 1] else 1
            matrix[i][j] = min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            )

    distance = matrix[len1][len2]
    max_len = max(len1, len2)
    similarity = (1.0 - (distance / max_len)) * 100.0
    return max(0.0, min(100.0, round(similarity, 2)))

def detect_likely_target(username: str, name: str, bio: str) -> Tuple[Optional[str], float]:
    """Scans for known high-profile entity patterns and returns target name if identified."""
    corpus = f"{username} {name} {bio}".lower()
    best_target = None
    highest_matches = 0

    for target_key, patterns in KNOWN_TARGET_PATTERNS.items():
        matches = sum(1 for pattern in patterns if pattern in corpus)
        if matches > highest_matches:
            highest_matches = matches
            best_target = target_key.replace("_", " ").title()

    if highest_matches >= 1:
        return best_target, min(highest_matches * 30.0, 95.0)
    return None, 0.0

def determine_threat_type(
    risk_score: float,
    likely_target: Optional[str],
    bio_text: str,
    behavior_flags: List[str],
    followers: int,
    following: int
) -> str:
    """Categorizes the threat type based on risk patterns and entity heuristics."""
    bio_lower = (bio_text or "").lower()
    
    if risk_score < 35.0:
        return "none"

    if likely_target and any(w in likely_target.lower() for w in ["apple", "google", "meta", "binance", "netflix", "paypal", "support"]):
        return "brand_impersonation"

    if likely_target:
        return "impersonation"

    if "hiring" in bio_lower or "recruiter" in bio_lower or "interview" in bio_lower or "salary" in bio_lower or "freshers" in bio_lower:
        return "recruitment_scam"

    if any("mass-following" in f for f in behavior_flags) or (following > 1000 and followers < 50):
        return "fake_bot"

    if risk_score >= 60.0:
        return "impersonation"

    return "suspicious"

def generate_recommended_action(threat_type: str, risk_band: str, likely_target: Optional[str]) -> str:
    """Generates an actionable next step for security moderators or end users."""
    if risk_band == "CRITICAL":
        target_info = f" targeting {likely_target}" if likely_target else ""
        return f"Immediate Action Required: Block and report this profile for severe active impersonation{target_info}. Notify compliance team and issue a user warning advisory."
    elif risk_band == "HIGH":
        return f"Enforce Secondary Verification: Restrict outbound direct messaging privileges and request government ID or official domain email verification."
    elif risk_band == "MEDIUM":
        return "Flag for Manual Queue: Add profile to human moderator review watchlist; monitor follower acquisition velocity and link click-throughs."
    else:
        return "Standard Operating Status: No immediate mitigation necessary. Profile metrics align with normal user interaction patterns."

def analyze_profile_engine(profile_data: Dict[str, Any], custom_weights: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
    """
    Main evaluation pipeline: processes a single profile and returns complete hybrid analysis
    incorporating pHash visual diagnostics, ML ensemble probability, and explainable feature contributions.
    """
    weights = custom_weights or DEFAULT_SIGNAL_WEIGHTS

    username = profile_data.get("username", "")
    name = profile_data.get("name", "")
    bio = profile_data.get("bio", "")
    photo_url = profile_data.get("photo_url", "")
    followers = int(profile_data.get("followers", 0) or 0)
    following = int(profile_data.get("following", 0) or 0)
    account_age_days = int(profile_data.get("account_age_days", 0) or 0)
    links = profile_data.get("links", []) or []

    # 1. Extract Multimodal Signals
    text_res = extract_text_signal(bio=bio, name=name)
    image_res = extract_image_signal(photo_url=photo_url)
    behavior_res = extract_behavior_signal(
        username=username,
        followers=followers,
        following=following,
        account_age_days=account_age_days,
        links=links
    )

    # 2. Handle Mimicry & Target Detection
    likely_target, target_score = detect_likely_target(username, name, bio)
    
    handle_score = 0.0
    if likely_target:
        handle_score += target_score * 0.7
    if any(s in username.lower() for s in ["_off", "support", "help", "giveaway", "claim", "bot", "desk"]):
        handle_score += 35.0
    handle_score = min(handle_score, 100.0)

    # 3. Link Suspicion Signal
    link_score = 0.0
    if links:
        from scoring.rules import SUSPICIOUS_LINK_INDICATORS
        susp_count = sum(1 for link in links if any(ind in str(link).lower() for ind in SUSPICIOUS_LINK_INDICATORS))
        link_score = min(susp_count * 45.0, 100.0)
    elif "t.me/" in bio or "wa.me/" in bio or "bit.ly/" in bio:
        link_score = 40.0

    # 4. Rule-Based Weighted Score
    w_handle = weights.get("handle_mimicry", 0.25)
    w_text = weights.get("text_similarity", 0.20)
    w_behav = weights.get("behavioral_anomaly", 0.25)
    w_img = weights.get("image_similarity", 0.15)
    w_link = weights.get("link_suspicion", 0.15)
    total_w = w_handle + w_text + w_behav + w_img + w_link or 1.0

    rule_weighted_score = (
        (handle_score * w_handle) +
        (text_res["raw_score"] * w_text) +
        (behavior_res["raw_score"] * w_behav) +
        (image_res["raw_score"] * w_img) +
        (link_score * w_link)
    ) / total_w

    # 5. Hybrid Machine Learning Ensemble Inference
    ml_output = predict_profile_ml_risk(profile_data)
    ml_prob = ml_output["ml_risk_probability"]

    # Hybrid blending: 70% rule-based domain heuristics + 30% statistical ML ensemble
    final_score = round(min(max((rule_weighted_score * 0.70) + (ml_prob * 0.30), 0.0), 100.0), 1)
    risk_band = get_risk_band(final_score)
    threat_type = determine_threat_type(
        final_score, likely_target, bio, behavior_res["flags"], followers, following
    )
    action = generate_recommended_action(threat_type, risk_band, likely_target)

    # Breakdown signals list
    signals_list = [
        {
            "name": "Handle & Target Mimicry",
            "contribution": round(handle_score * w_handle, 1),
            "explanation": f"Score: {handle_score:.0f}/100. " + (f"Detected entity spoofing pattern against {likely_target}." if likely_target else "No explicit celebrity or brand pattern in username.")
        },
        {
            "name": "Behavioral Anomaly & Age Velocity",
            "contribution": round(behavior_res["raw_score"] * w_behav, 1),
            "explanation": behavior_res["explanation"]
        },
        {
            "name": "Text & Lexical Scam Triggers",
            "contribution": round(text_res["raw_score"] * w_text, 1),
            "explanation": text_res["explanation"]
        },
        {
            "name": "External Link Credibility",
            "contribution": round(link_score * w_link, 1),
            "explanation": f"Evaluated {len(links)} destination links. " + ("Detected high-risk redirect or shortener URLs." if link_score > 30 else "Links appear clean or absent.")
        },
        {
            "name": "Visual Asset & Avatar Likeness (pHash)",
            "contribution": round(image_res["raw_score"] * w_img, 1),
            "explanation": image_res["explanation"]
        }
    ]

    return {
        "risk_score": final_score,
        "risk_band": risk_band,
        "signals": signals_list,
        "likely_target": likely_target,
        "threat_type": threat_type,
        "recommended_action": action,
        "ml_probability": ml_prob,
        "ml_diagnostics": ml_output,
        "visual_diagnostics": {
            "phash": image_res.get("phash"),
            "dhash": image_res.get("dhash"),
            "hamming_distance": image_res.get("hamming_distance"),
            "visual_similarity": image_res.get("visual_similarity"),
            "is_visual_clone": image_res.get("is_visual_clone", False),
            "is_ai_generated_suspect": image_res.get("is_ai_generated_suspect", False)
        }
    }

def compare_profiles_engine(profile_a: Dict[str, Any], profile_b: Dict[str, Any]) -> Dict[str, Any]:
    """
    Compares two profiles (Profile A = Reference, Profile B = Suspect / Candidate)
    and computes similarity breakdown, real perceptual pHash Hamming distance,
    evidence signals, relationship classification, and confidence.
    """
    user_a = profile_a.get("username", "")
    user_b = profile_b.get("username", "")
    name_a = profile_a.get("name", "")
    name_b = profile_b.get("name", "")
    bio_a = profile_a.get("bio", "")
    bio_b = profile_b.get("bio", "")
    photo_a = profile_a.get("photo_url", "")
    photo_b = profile_b.get("photo_url", "")
    
    age_a = int(profile_a.get("account_age_days", 0) or 0)
    age_b = int(profile_b.get("account_age_days", 0) or 0)
    foll_a = int(profile_a.get("followers", 0) or 0)
    foll_b = int(profile_b.get("followers", 0) or 0)

    # 1. Similarity metrics across lexical, semantic, and perceptual visual dimensions
    sim_user = levenshtein_similarity(user_a, user_b)
    sim_name = levenshtein_similarity(name_a, name_b)
    
    text_comp = extract_text_signal(bio=bio_b, name=name_b, reference_bio=bio_a)
    sim_bio = text_comp["raw_score"]

    # Real Perceptual Image Hash comparison
    img_comp = extract_image_signal(photo_url=photo_b, reference_photo_url=photo_a)
    sim_photo = img_comp["raw_score"]

    similarity = {
        "username": sim_user,
        "name": sim_name,
        "bio": sim_bio,
        "photo": sim_photo
    }

    # 2. Forensic Evidence Generation
    evidence: List[Dict[str, str]] = []
    
    if sim_name >= 85.0:
        evidence.append({
            "name": "High Display Name Collision",
            "explanation": f"Display names '{name_a}' and '{name_b}' share a {sim_name:.1f}% lexical match."
        })

    if sim_user >= 75.0:
        evidence.append({
            "name": "Handle Typo-Squatting / Suffix Mutation",
            "explanation": f"Suspect handle '@{user_b}' is a direct mutation ({sim_user:.1f}% match) of '@{user_a}'."
        })
    elif sim_user < 40.0 and sim_name > 80.0:
        evidence.append({
            "name": "Disparate Handle with Cloned Display Name",
            "explanation": f"Handle '@{user_b}' differs significantly while cloning the identity name '{name_a}'."
        })

    if img_comp.get("is_visual_clone") or sim_photo >= 85.0:
        evidence.append({
            "name": "Perceptual Image Hash Match (pHash)",
            "explanation": f"Avatar visual asset match is {sim_photo:.0f}% (Hamming distance: {img_comp.get('hamming_distance')}). Strong evidence of cloned visual media."
        })
    elif sim_photo >= 60.0:
        evidence.append({
            "name": "Structural Image Likeness",
            "explanation": f"Avatar shares {sim_photo:.0f}% structural color/gradient similarity (Hamming: {img_comp.get('hamming_distance')})."
        })

    age_diff = age_a - age_b
    if age_diff > 180 and foll_a > (foll_b * 5):
        evidence.append({
            "name": "Severe Age & Follower Asymmetry",
            "explanation": f"Profile A was created {age_diff} days earlier and possesses {foll_a} followers vs {foll_b} on Profile B."
        })

    # Check for legitimate secondary account indicators (e.g. mutual links, explicit alt disclosure)
    links_a = profile_a.get("links", []) or []
    links_b = profile_b.get("links", []) or []
    bio_b_lower = bio_b.lower()
    
    claims_dual = "backup" in bio_b_lower or "2nd account" in bio_b_lower or "alt account" in bio_b_lower or "portfolio" in bio_b_lower or "sandbox" in bio_b_lower
    has_mutual_backlink = any(user_a.lower() in str(l).lower() for l in links_b) or any(user_b.lower() in str(l).lower() for l in links_a)

    # 3. Relationship Verdict
    overall_sim = (sim_user * 0.3) + (sim_name * 0.3) + (sim_bio * 0.2) + (sim_photo * 0.2)
    
    if has_mutual_backlink or (claims_dual and sim_user < 85 and age_b > 60):
        relationship = "legitimate_dual_account"
        confidence = 91.0
        evidence.append({
            "name": "Authentic Cross-Referencing",
            "explanation": "Profile B explicitly references or cross-links legitimate ownership without deceptive call-to-actions."
        })
    elif overall_sim >= 55.0 and (age_diff > 30 or foll_a > (foll_b * 3) or img_comp.get("is_visual_clone")):
        relationship = "impersonation"
        confidence = min(98.0, 55.0 + (overall_sim * 0.45))
    elif overall_sim < 35.0:
        relationship = "ambiguous"
        confidence = 74.0
        evidence.append({
            "name": "Low Overall Similarity",
            "explanation": "Profiles share negligible visual, textural, or behavioral characteristics."
        })
    else:
        relationship = "ambiguous"
        confidence = 68.0
        evidence.append({
            "name": "Inconclusive Heuristics",
            "explanation": "Signals show partial overlap without definitive impersonation intent or proven authorization."
        })

    return {
        "similarity": similarity,
        "relationship": relationship,
        "evidence": evidence,
        "confidence": round(confidence, 1),
        "visual_diagnostics": {
            "phash": img_comp.get("phash"),
            "ref_phash": img_comp.get("ref_phash"),
            "dhash": img_comp.get("dhash"),
            "hamming_distance": img_comp.get("hamming_distance"),
            "visual_similarity": sim_photo,
            "is_visual_clone": img_comp.get("is_visual_clone", False),
            "is_ai_generated_suspect": img_comp.get("is_ai_generated_suspect", False)
        }
    }
