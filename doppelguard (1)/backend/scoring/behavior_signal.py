"""
Behavioral & Structural Signal Feature Extraction Module.

Evaluates:
- Account age risk (< 7 days = critical, < 30 days = high).
- Asymmetrical Follower/Following ratio (mass following).
- Typo-squatting suffixes (_official, _support, _giveaway, _careers, trailing digits).
- Link shorteners and suspicious redirection domains (bit.ly, t.me, .xyz, wa.link).
"""

import re
from typing import Dict, Any, List
from scoring.rules import SUSPICIOUS_LINK_INDICATORS

def extract_behavior_signal(
    username: str,
    followers: int = 0,
    following: int = 0,
    account_age_days: int = 0,
    links: List[str] = None
) -> Dict[str, Any]:
    """
    Evaluates behavioral anomalies including account age, follower ratios,
    handle squatting patterns, and linked domain reputations.
    """
    if links is None:
        links = []

    flags: List[str] = []
    score = 0.0

    # 1. Account Age Inspection
    if account_age_days == 0:
        flags.append("Account age not provided — age-based risk assessment skipped")
    elif account_age_days <= 3:
        score += 38.0
        flags.append(f"Brand new account created only {account_age_days} days ago")
    elif account_age_days <= 14:
        score += 28.0
        flags.append(f"Recently created account ({account_age_days} days old)")
    elif account_age_days <= 45:
        score += 18.0
        flags.append(f"Young account ({account_age_days} days old)")

    # 2. Follower / Following Asymmetry
    safe_followers = max(followers, 0)
    safe_following = max(following, 0)

    if safe_followers == 0 and safe_following == 0:
        flags.append("No social activity detected (zero followers and zero following)")

    if safe_following > 400 and safe_followers < 100:
        ratio = safe_following / max(safe_followers, 1)
        score += 35.0
        flags.append(f"Aggressive mass-following ratio ({safe_following} following vs {safe_followers} followers, {ratio:.1f}x)")
    elif safe_following > 1500 and safe_followers < 2000 and account_age_days <= 60:
        score += 25.0
        flags.append(f"Skewed following-to-follower ratio ({safe_following} : {safe_followers}) on young account")
    elif safe_following > 2500 and safe_followers < 1000:
        score += 20.0
        flags.append(f"High following count ({safe_following}) with low organic reach")

    # 3. Handle Pattern Analysis (Typo-squatting & Mimicry suffixes)
    clean_username = username.lower().strip()
    
    # Check for impersonator affixes
    impersonator_suffixes = [
        "_official", "_support", "_help", "_verify", "_claims", "_giveaways",
        "_live", "_team", "_desk", "_ceo", "_recovery", "_careers", "_hiring",
        "_airdrop", "_bonus", "_gift", "_node", "_bot"
    ]
    for suffix in impersonator_suffixes:
        if clean_username.endswith(suffix) or f"{suffix}_" in clean_username or suffix in clean_username:
            score += 25.0
            flags.append(f"Handle uses classic impersonation affix: '{suffix}'")
            break

    # Check for trailing random numbers (e.g. user9847291847)
    digits_match = re.search(r'\d{4,}$', clean_username)
    if digits_match:
        score += 20.0
        flags.append("Handle ends with high-density automated digit suffix")

    # Check for double underscores / leetspeak substitutions
    if "__" in clean_username or "0ff" in clean_username or "1ll" in clean_username:
        score += 18.0
        flags.append("Obfuscated handle characters or multiple repeated underscores")

    # 4. External Links Verification
    suspicious_links_found = []
    for link in links:
        link_lower = str(link).lower()
        if any(ind in link_lower for ind in SUSPICIOUS_LINK_INDICATORS):
            suspicious_links_found.append(link)

    if suspicious_links_found:
        score += min(len(suspicious_links_found) * 18.0, 36.0)
        flags.append(f"Profile directs users to unverified/shortened external endpoints: {', '.join(suspicious_links_found[:3])}")

    final_score = min(score, 100.0)

    if flags:
        explanation = "; ".join(flags) + "."
    else:
        explanation = f"Account metrics are well-balanced (Age: {account_age_days}d, Followers: {safe_followers}, Following: {safe_following})."

    return {
        "raw_score": round(final_score, 2),
        "flags": flags,
        "explanation": explanation
    }
