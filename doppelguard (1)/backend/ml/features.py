"""
Feature Extraction Pipeline for DoppelGuard Impersonation Risk ML Models.

Extracts an 18-dimensional numerical feature vector from raw social media profile metadata
for Random Forest and XGBoost ensemble classification.
"""

import math
import re
from typing import Dict, Any, List
from scoring.rules import KNOWN_TARGET_PATTERNS, HIGH_RISK_BIO_KEYWORDS, SUSPICIOUS_LINK_INDICATORS

FEATURE_NAMES = [
    "handle_length",
    "handle_digit_ratio",
    "handle_underscore_count",
    "handle_entropy",
    "handle_mimicry_score",
    "handle_affix_flag",
    "display_name_length",
    "display_name_mimicry",
    "bio_length",
    "bio_scam_density",
    "bio_urgency_density",
    "bio_financial_density",
    "log_followers",
    "log_following",
    "follower_following_ratio",
    "log_account_age",
    "links_count",
    "suspicious_link_score",
]

def calculate_shannon_entropy(text: str) -> float:
    """Calculates Shannon entropy of string character frequencies."""
    if not text:
        return 0.0
    freq: Dict[str, int] = {}
    for char in text:
        freq[char] = freq.get(char, 0) + 1
    entropy = 0.0
    total = len(text)
    for count in freq.values():
        p = count / total
        entropy -= p * math.log2(p)
    return round(entropy, 3)

def compute_string_similarity(s1: str, s2: str) -> float:
    """Levenshtein ratio proxy."""
    s1, s2 = (s1 or "").lower().strip(), (s2 or "").lower().strip()
    if s1 == s2:
        return 1.0
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
    dist = matrix[len1][len2]
    return 1.0 - (dist / max(len1, len2))

def extract_feature_vector(profile_data: Dict[str, Any]) -> List[float]:
    """
    Transforms profile metadata dictionary into an 18-dimensional normalized float vector.
    """
    username = str(profile_data.get("username") or "").lower().strip()
    name = str(profile_data.get("name") or "").lower().strip()
    bio = str(profile_data.get("bio") or "").lower().strip()
    followers = max(int(profile_data.get("followers") or 0), 0)
    following = max(int(profile_data.get("following") or 0), 0)
    account_age_days = max(int(profile_data.get("account_age_days") or 0), 0)
    links = profile_data.get("links") or []

    # 1. Handle features
    handle_len = len(username)
    digits_count = sum(1 for c in username if c.isdigit())
    handle_digit_ratio = (digits_count / handle_len) if handle_len > 0 else 0.0
    handle_underscores = username.count("_")
    handle_entropy = calculate_shannon_entropy(username)

    # Handle Target Mimicry vs known entities
    highest_mimicry = 0.0
    for target_key, patterns in KNOWN_TARGET_PATTERNS.items():
        clean_key = target_key.replace("_", "")
        sim = compute_string_similarity(username.replace("_", ""), clean_key)
        if sim > highest_mimicry:
            highest_mimicry = sim
        for pat in patterns:
            if pat in username:
                highest_mimicry = max(highest_mimicry, 0.90)

    # Impersonator affix check
    impersonator_affixes = ["_official", "_support", "_help", "_verify", "_claims", "_giveaways", "_live", "_team", "_desk", "giveaway", "claim", "free", "airdrop"]
    has_affix = 1.0 if any(aff in username for aff in impersonator_affixes) else 0.0

    # 2. Display Name features
    name_len = len(name)
    highest_name_mimicry = 0.0
    for target_key in KNOWN_TARGET_PATTERNS.keys():
        target_name = target_key.replace("_", " ")
        sim = compute_string_similarity(name, target_name)
        if sim > highest_name_mimicry:
            highest_name_mimicry = sim

    # 3. Bio Lexical & Scam triggers
    bio_words = bio.split()
    total_words = max(len(bio_words), 1)
    
    scam_matches = sum(1 for kw in HIGH_RISK_BIO_KEYWORDS if kw in bio)
    scam_density = min(scam_matches / 3.0, 1.0)

    urgency_words = ["urgent", "hurry", "limited", "now", "today only", "dm immediately", "fast", "instant", "last chance"]
    urgency_matches = sum(1 for uw in urgency_words if uw in bio)
    urgency_density = min(urgency_matches / 2.0, 1.0)

    financial_words = ["eth", "btc", "crypto", "giveaway", "lakh", "crore", "guaranteed returns", "sebi", "upi", "airdrop", "sol", "usdt", "wallet"]
    fin_matches = sum(1 for fw in financial_words if fw in bio)
    financial_density = min(fin_matches / 2.0, 1.0)

    # 4. Behavioral & Ratio metrics
    log_foll = math.log10(followers + 1)
    log_fing = math.log10(following + 1)
    foll_fing_ratio = following / (followers + 1.0)
    # Cap ratio to avoid outlier skew in linear models
    foll_fing_ratio_clamped = min(foll_fing_ratio, 50.0) / 50.0
    log_age = math.log10(account_age_days + 1)

    # 5. Link Suspicion
    link_count = len(links)
    susp_link_count = sum(1 for l in links if any(ind in str(l).lower() for ind in SUSPICIOUS_LINK_INDICATORS))
    if "t.me/" in bio or "wa.me/" in bio or "bit.ly/" in bio:
        susp_link_count += 1
    susp_link_score = min(susp_link_count * 0.5, 1.0)

    return [
        float(handle_len),
        round(handle_digit_ratio, 3),
        float(handle_underscores),
        round(handle_entropy, 3),
        round(highest_mimicry, 3),
        float(has_affix),
        float(name_len),
        round(highest_name_mimicry, 3),
        float(len(bio)),
        round(scam_density, 3),
        round(urgency_density, 3),
        round(financial_density, 3),
        round(log_foll, 3),
        round(log_fing, 3),
        round(foll_fing_ratio_clamped, 3),
        round(log_age, 3),
        float(link_count),
        round(susp_link_score, 3)
    ]
